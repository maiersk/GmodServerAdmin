class Ban {
    /**
     * Server Ban Player
     * @param {string} userid 
     * @param {string} operid 
     * @param {string} serverid
     * @param {number} unban 
     * @param {number} time 
     * @param {string} reason
     */
    constructor(userid, operid, serverid, unban, time, reason) {
        this.userid = userid;
        this.operid = operid;
        this.serverid = serverid;
        this.unban = unban;
        this.time = time;
        this.reason = reason;
    }

    toJson() {
        let json = {};
        json.userid = this.userid;
        json.operid = this.operid;
        json.serverid = this.serverid;
        json.unban = this.unban;
        json.time = this.time;
        json.reason = this.reason;
        return json;
    }

    static from(json) {
        return new Ban(
            json.userid,
            json.operid,
            json.serverid,
            json.unban,
            json.time,
            json.reason,
        )
    }
}

module.exports = Ban;