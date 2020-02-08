const conn = require('../lib/mysql');
const Dao = require('../controllers/dataDao');
const groupdao = new Dao(Dao.GROUPS, conn);

const logger = new (require('../lib/Logger'))('GroupService', false, 'GroupService.js');

const BaseService = require('../controllers/BaseService');
const Group = require('../models/Group');

class GroupService extends BaseService {
    constructor(obj, dao) {
        super(obj, dao);
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

}

module.exports = new GroupService(Group, groupdao);