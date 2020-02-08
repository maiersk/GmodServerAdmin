class Server {
    /**
     * server side class
     * @param {string} id 
     * @param {number|string} userid 
     * @param {string} name 
     * @param {string} ip 
     * @param {number} port 
     * @param {string} rconpass 
     */
    constructor(id, userid, name, ip, port, rconpass) {
        this.id = id;
        this.userid = userid;
        this.name = name;
        this.ip = ip;
        this.port = port;
        this.rconpass = rconpass;
    }

    toJson() {
        let json = {};
        json.id = this.id;
        json.userid = this.userid;
        json.name = this.name;
        json.ip = this.ip;
        json.port = this.port;
        json.rconpass = this.rconpass;
        return json;
    }

    static from(json) {
        return new Server(
            json.id,
            json.userid,
            json.name,
            json.ip,
            json.port,
            json.rconpass,
        )
    }
}

module.exports = Server;