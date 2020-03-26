const conf = require('../config/defeult');

class Screenshot {
    /**
     * user upload img
     * @param {number|string} id 
     * @param {number|string} userid 
     * @param {string} description 
     * @param {number} pv 
     * @param {number} audit
     * @param {string} image 
     */
    constructor(id, userid, description, pv, audit, image) {
        this.id = id;
        this.userid = userid;
        this.description = description;
        this.pv = pv;
        this.audit = audit;
        this.image = image;
    }

    toJson() {
        let json = {};
        json.id = this.id;
        json.userid = this.userid;
        json.description = this.description;
        json.pv = this.pv;
        json.audit = this.audit;
        json.image = conf.screenshotpath + this.image;
        return json;
    }

    // 封装可变让修改类只影响一个文件。静态新建类
    static from(json) {
        return new Screenshot(
            json.id,
            json.userid,
            json.description,
            json.pv || 0, 
            json.audit || 0,
            json.image
        );
    }
}

module.exports = Screenshot;