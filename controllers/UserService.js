const conn = require('../lib/mysql');
const Dao = require('../controllers/dataDao');
const userdao = new Dao(Dao.USERS, conn);

const logger = new (require('../lib/Logger'))('UserService', true, 'UserService.js');

const BaseService = require('../controllers/BaseService');
const User = require('../models/User');

const groupSer = require('../controllers/GroupService');

class UserService extends BaseService {
    constructor(obj, dao) {
        super(obj, dao);
    }

    // 创建被操作过的玩家用户账号
    // 用于记录ban等
    async createPly(steamid, name) {
        try {
            return await super.findByid(steamid);

        } catch (err) {
            if (err && err.substr(-4) === 'null') {
                const userjson = {
                    id : steamid,
                    groupid : 4,
                    steamobj : JSON.stringify({
                        personaname : name
                    }),
                }
    
                await super.create(userjson);
                logger.log(`for player create a new user: ${name}`);
    
                return await super.findByid(steamid);
            }

            return Promise.reject(err);
        }
    }

    signin(steamobj, session) {
        return new Promise((resolve, reject) => {
            super.findByid(steamobj.steamid).then((user) => {
                session.user = user;
                const userdata = user.getData();

                // 获取现在unix时间戳
                const unixtimestamp = Math.round(new Date().getTime()/1000);
                logger.debug(unixtimestamp - userdata.getLastlogoff());
                
                // 如果玩家最后登陆时间大于一周，或者用户没有最后登录时间，需要更新steamobj数据。   
                if ((unixtimestamp - userdata.getLastlogoff()) >= 604800 || !userdata.getLastlogoff()) {
                    user = new User(user.id, user.groupid, JSON.stringify(steamobj));   // 重新创建用户类，过滤steamobj不需要的值
                    logger.debug(user);

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

            // 返回执行后的值。由于checkPower写法接受flase使用reject方法，需要另外铺抓返回。
            return await groupSer.checkPower(user, power).catch((err) => {
                logger.debug(err);
                if (typeof err === 'boolean') {
                    return err;
                }
                throw err;
            });
            
        } catch (err) {
            return Promise.reject(err);
        }       
    }

    async removeByid(id) {
        const removeUserData = async (service, userid) => {
            try {
                const alldata = await service.findAll();
                await alldata.forEach((item) => {
                    logger.debug(item.userid == userid, item.userid);
                    if (item.userid == userid) {
                        service.removeByid(item.id);
                    }
                });
            } catch (err) {
                return Promise.reject(err);
            }
        }

        try {
            // 在此调用，避免进入循环调用陷阱
            const serverSer = require('../controllers/ServerService');
            const screenshotSer = require('../controllers/ScreenshotService');

            await removeUserData(serverSer, id);
            await removeUserData(screenshotSer, id);
            await super.removeByid(id);

            return 'remove user and associated data succeed';
        } catch (err) {
            return Promise.reject(err);
        }
    }
}

module.exports = new UserService(User, userdao);