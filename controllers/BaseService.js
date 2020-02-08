const logger = new (require('../lib/Logger'))('', false, 'BaseService.js');

class BaseService {
    constructor(obj, dao, obj_idkey) {
        this.obj = obj;
        this.dao = dao;

        // 特殊对象id键名不同
        this.obj_idkey = obj_idkey || 'id';
    }

    create(json) {
        return new Promise((resolve, reject) => {
            let obj = this.obj.from(json);

            this.dao.insert(obj).then((data) => {
                resolve(data);

            }).catch((err) => reject(err));
        });
    }
    
    editByid(objid, json) {
        return new Promise((resolve, reject) => {
            this.findBy(this.obj_idkey, objid).then((obj) => {
                // 重新组合对象属性，已有的不变
                const srcobj = obj.toJson();
                // const tempobj = Object.assign(srcobj, json);
                const tempobj = this._combineJson(srcobj, json);
                logger.debug(srcobj, json, tempobj);

                this.dao.update(tempobj).then((data) => {
                    resolve(data);
                }).catch((err) => reject(err));
                
            }).catch((err) => reject(err));
        })
    }

    removeByid(objid) {
        return new Promise((resolve, reject) => {
            this.findBy(this.obj_idkey, objid).then((obj) => {
                try {
                    this.dao.delete(obj).then((data) => {
                        resolve(data);
                    }).catch((err) => reject(err));
                } catch (err) {
                    reject(err);
                }

                
            }).catch((err) => reject(err));
        }); 
    }

    findByid(objid) {
        return new Promise((resolve, reject) => {
            this.dao.findBy(this.obj_idkey, objid).then((data) => {
                let tempobj = this.obj.from(data[0]);
                resolve(tempobj);

            }).catch((err) => reject(err));
        })
    }

    findBy(key, value) {
        return new Promise((resolve, reject) => {
            this.dao.findBy(key, value).then((data) => {
                let tempobj = this.obj.from(data[0]);
                resolve(tempobj);

            }).catch((err) => reject(err));
        });
    }

    findAll() {
        return new Promise((resolve, reject) => {
            this.dao.findAll().then((data) => {
                let tempobj, objlist = [];
                for (let i = 0; i < data.length; i++) {
                    tempobj = this.obj.from(data[i]);
                    objlist.push(tempobj.toJson());
                }

                resolve(objlist);
            });
        });
    }    
    
    /**
     * 组合对象需要更新的属性值
     * @param {Object || json} srcobj 
     * @param {json} json 
     */
    _combineJson(srcobj, json) {
        let resjson = {};
        for (const key in srcobj) {
            // 不组合对象id, 将会更新对象id
            // logger.debug(key, this.obj_idkey);
            if (key === this.obj_idkey) {
                resjson[key] = srcobj[key];
            } else {
                resjson[key] = json[key] || srcobj[key];
            } 
        }
        return resjson;
    }
}

module.exports = BaseService;