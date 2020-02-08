class Rule {
    /**
     * Server Rule
     * @param {string} serverid 
     * @param {string} content 
     * @param {number} time
     */
    constructor(serverid, content, time) {
        this.serverid = serverid;
        this.content = content;
        this.time = time;
    }

    toJson() {
        let json = {};
        json.serverid = this.serverid;
        json.content = this.content;
        json.time = this.time;
        return json;
    }

    static from(json) {
        return new Rule(
            json.serverid,
            json.content,
            json.time
        );
    }
}

module.exports = Rule;