const conn = require('../lib/mysql');
const Dao = require('../controllers/dataDao');
const groupdao = new Dao(Dao.GROUPS, conn);

const logger = new (require('../lib/Logger'))('GroupService', false, 'GroupService.js');

const BaseService = require('../controllers/BaseService');
const Group = require('../models/Group');

class GroupService extends BaseService {
    constructor(obj, dao) {
        super(obj, dao);
        this.findDefaultGroups();
    }

    // 查找默认权限组，得到存有数据库id，组名的json。
    async findDefaultGroups() {
        try {
            const groups = await super.findAll();
            let result = {};

            await groups.forEach(group => {
                for (const key in Group) {
                    if (group.name === Group[key]) {
                        result[group.id] = group.name;
                    }
                }
                logger.debug(group.name);
            });

            this.defaultgroup = result;
        } catch (err) {
            return Promise.reject(err);   
        }
    }

    checkPower(user, power) {
        return new Promise((resolve, resject) => {
            super.findByid(user.groupid).then((group) => {
                let powers = group.getPowers();
                for (let i = 0; i < powers.length; i++) {
                    logger.debug(powers[i], power);
                    
                    if (powers[i] === power) {
                        resolve(true);
                        break;
                    }
                }
                resject(false)
            }).catch((err) => resject(err))
        })
    }

    async removeByid(groupid) {
        try {
            // 判断是否默认权限组
            const isdefaultgroup = () => {
                for (const key in this.defaultgroup) {
                    if (groupid === key) {
                        throw('Can\'t remove default group');
                    }
                }                
            }

            await isdefaultgroup();

            return await super.removeByid(groupid);
        } catch (err) {
            return Promise.reject(err);
        }
    }
}

module.exports = new GroupService(Group, groupdao);