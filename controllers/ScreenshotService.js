const fs = require('fs');
const path = require('path');
const screenshotpath = require('../config/defeult').screenshotpath;
const imagepath = path.join(__dirname, '../public/' + screenshotpath);  // 删除screenshots对象图片时使用

const logger = new (require('../lib/Logger'))('screenhost', false, 'ScreenshotService.js');

const conn = require('../lib/mysql');
const Dao = require('../controllers/dataDao');
const screenshotdao = new Dao(Dao.SCREENSHOTS, conn);

const Power = require('../models/Power');
const BaseService = require('../controllers/BaseService');
const Screenshot = require('../models/Screenshot');

const userSer = require('../controllers/UserService');

class ScreenshotService extends BaseService {
    constructor(obj, dao) {
        super(obj, dao)
    }

    create(json) {
        return new Promise((resolve, reject) => {
            if (!json.image) {
                reject('accept a null image');
            }
            super.create(json).then((data) => {
                resolve('upload succeed');
                logger.debug(data);
            }).catch((err) => {
                fs.unlink(imagepath + json.image, (err) => {
                    if (err) {
                        reject('删除图片出错 ' + err);
                    }
                })
                reject(err);
            })
        })
    }

    editByid(screenshotid, json) {
        return new Promise((resolve, reject) => {
            super.findByid(screenshotid).then((screenshot) => {
                // 如果玩家id不一不能编辑
                if (json.userid != screenshot.userid) {
                    return reject('userid different, operation failure.');
                }
                // 对对象进行修改。不使用直接传json更新，避免tojson返回图片地址存在路径问题
                screenshot.description = json.description;

                super.editByid(screenshot.id, screenshot).then((data) => {
                    resolve(data);
                }).catch((err) => {
                    reject(err);
                });

            }).catch((err) => reject(err));
        })
    }

    async remove(json) {
        try {
            console.log(userSer);
            logger.debug('remove', json.userid);
            // 检查用户是否有高级权限直接删除
            const hasPower = await userSer.checkUserPowerByid(json.userid, Power.USER_DELIMAGE);
            logger.debug(hasPower);
            const screenhost = await super.findByid(json.id);

            logger.debug(hasPower);
            // user没有权 和 userid不同不能删除
            if (json.userid != screenhost.userid && !hasPower) {
                return Promise.reject('userid different and no power, operation failure.');
            }

            await fs.unlink(imagepath + screenhost.image, (err) => {
                if (err) {
                    return Promise.reject('删除图片错误 ' + err);
                }
            })

            await super.removeByid(screenhost.id);

        } catch (err) {
            return Promise.reject(err);
        }
    }

    async addPv(id) {
        try {
            const screenshot = await super.findByid(id);
            screenshot.pv = screenshot.pv + 1;

            await super.editByid(id, screenshot);

            return screenshot;

        } catch(err) {
            return Promise.reject(err);
        }
    }

    async checkImage(id) {
        try {
            const screenhost = await super.findByid(id);
            if (screenhost.audit == 1) { return Promise.reject('image audited') };
            screenhost.audit = 1;

            await super.editByid(id, screenhost);

            return screenhost;

        } catch (err) {
            return Promise.reject(err);
        }
    }
}

module.exports = new ScreenshotService(Screenshot, screenshotdao);