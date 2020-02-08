const conn = require('../lib/mysql');
const Dao = require('./dataDao');
const serverdao = new Dao(Dao.SERVERS, conn);

const Rcon = require('../lib/Rcon');
const ServerQuery = require('../lib/ServerQuery');

const BaseService = require('../controllers/BaseService');
const Server = require('../models/Server');

class ServerService extends BaseService {
    constructor(obj, dao) {
        super(obj, dao);
    }

    status(serverid) {
        return new Promise((resolve, reject) => {
            super.findByid(serverid).then((server) => {
                const serverquery = new ServerQuery({
                    host : server.ip,
                    port : server.port,
                })
                serverquery.state().then((status) => {
                    resolve(status);
                }).catch((err) => reject('query failure Reason: ' + err));
            }).catch((err) => reject(err));            
        });
    }

    command(serverid, command) {
        return new Promise((resolve, reject) => {
            super.findByid(serverid).then((server) => {
                const rcon = new Rcon({
                    host : server.ip,
                    port : server.port,
                    password : server.rconpass
                })

                rcon.connect().then(() => {
                    rcon.auth().then(() => {
                        rcon.command(command).then((data) => {
                            resolve(data);
                        }).catch((err) => reject(err));
                    }).catch((err) => reject(err));
                }).catch((err) => reject(err));

            }).catch((err) => reject(err));            
        });
    }
}

module.exports = new ServerService(Server, serverdao);