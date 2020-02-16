const conn = require('../lib/mysql');
const Dao = require('../controllers/dataDao');
const userdao = new Dao(Dao.USERS, conn);

const logger = new (require('../lib/Logger'))('UserService', false, 'UserService.js');

const BaseService = require('../controllers/BaseService');
const User = require('../models/User');

const groupSer = require('../controllers/GroupService');

class UserService extends BaseService {
    constructor(obj, dao) {
        super(obj, dao);
    }

    signin(steamobj, session) {
        return new Promise((resolve, reject) => {
            super.findByid(steamobj.steamid).then((user) => {
                session.user = user;
                const userdata = user.getData();

                // 获取现在unix时间戳
                const unixtimestamp = Math.round(new Date().getTime()/1000);
                logger.debug(unixtimestamp - userdata.getLastlogoff());
                
                // 如果玩家最后登陆时间大于一周，需要更新steamobj数据                
                if ((unixtimestamp - userdata.getLastlogoff()) >= 604800) {
                    user.steamobj = JSON.stringify(steamobj); 

                    super.editByid(user.id, user).then((data) => {
                        logger.log(`${userdata.getName()} updata steamobj`);
                    }).catch((err) => reject(err));
                }

                logger.log(`${userdata.getName()} signin`);

                resolve('welcome back');
            }).catch((err) => {
                // 如果找不到用户新建一个
                // 判断输入的steamid是否存在
                if (steamobj.steamid === undefined) {
                    return reject('attempt receive undefind id');
                }

                // 判断报错信息是否是找不到的情况，才创建新用户
                if (err && err.substr(-4) === 'null') {
                    const userjson = {
                        id : steamobj.steamid,
                        groupid : 4,
                        steamobj : JSON.stringify(steamobj),
                    }

                    super.create(userjson).then((data) => {
                        logger.log(`create new user and signin: ${steamobj.personaname}`);
                    }).catch((err) => {
                        return reject(err);
                    });
                    
                    session.user = userjson;

                    resolve('welcome');                    
                }

                reject(err);
            });
        });
    }

    signout(session) {
        return new Promise((resolve, reject) => {
            const userid = session.user.id;

            super.findByid(userid).then((user) => {
                const userdata = user.getData();
                logger.log(`${userdata.getName()} signout`);

                session.user = null;   
                resolve('signout succeed');                 
            }).catch((err) => reject(err));
        });
    }

    editGroupid(userid, groupid) {
        return new Promise((resolve, reject) => {
            const user = {
                groupid : groupid
            };

            super.editByid(userid, user).then((data) => {
                resolve(data);
            }).catch((err) => reject(err));
        });
    }

    async checkUserPowerByid(userid, power) {
        try {
            const user = await super.findByid(userid);

            // 返回执行后的值。
            const bool = await groupSer.checkPower(user, power);
            return bool;
            
        } catch (err) {
            return Promise.reject(err);
        }

        // const user = await super.findByid(userid);

        // // 返回执行后的值。
        // return await groupSer.checkPower(user, power).then((bool) => {
        //     return bool;
        // }).catch((bool) => {
        //     // 需处理checkPower 的 finByid异常。
        //     if (typeof bool === 'boolean') {
        //         return bool;
        //     }
        //     throw bool;
        // });        
    }

}

module.exports = new UserService(User, userdao);