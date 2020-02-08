const fs = require('fs');
const path = require('path');
const screenshotpath = require('../config/defeult').screenshotpath;
const imagepath = path.join(__dirname, '..' + screenshotpath);  // 删除screenshots对象图片时使用

const logger = new (require('../lib/Logger'))('', false, 'ScreenshotService.js');

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
            super.create(json).then((data) => {
                resolve(data);
            }).catch((err) => {
                fs.unlink(json.image.path, (err) => {
                    if (err) {
                        reject(err);
                        throw new Error('删除图片出错 ' + e);
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

                if (json.image) {
                    logger.debug(imagepath + screenshot.image);

                    // 更新时删除对象原图片。
                    fs.unlink(imagepath + screenshot.image, (err) => {
                        if (err) {
                            reject(err);
                            throw new Error('更新时删除原图片失败');                            
                        }
                    })

                    json.image = json.image.path.split(path.sep).pop();
                }

                super.editByid(screenshot.id, json).then((data) => {
                    resolve(data);
                }).catch((err) => {
                    if (json.image) {
                        fs.unlink(json.image.path, (err) => {
                            if (err) {                            
                                reject(err);
                                throw new Error('删除图片出错 ' + e);
                            }
                        }) 
                    }
                    reject(err);
                });

            }).catch((err) => reject(err));
        })
    }

    async remove(json) {
        // 检查用户是否有高级权限直接删除
        const hasPower = await userSer.checkUserPowerByid(json.userid, Power.USER_DELIMAGE);

        return await new Promise((resolve, reject) => {
            super.findByid(json.id).then((screenshot) => {

                logger.debug('hasPower : ' + hasPower);
                // user没有权 和 userid不同不能删除
                if (json.userid != screenshot.userid && !hasPower) {
                    return reject('userid different and no power, operation failure.');
                }
                
                fs.unlink(imagepath + screenshot.image, (err) => {
                    if (err) {
                        reject(err);
                        throw new Error('删除图片错误 ' + err);  
                    } 
                });
                
                super.removeByid(screenshot.id).then((data) => {
                    resolve(data);
                }).catch((data) => reject(data));

            }).catch((err) => reject(err));            
        })
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
}

module.exports = new ScreenshotService(Screenshot, screenshotdao);