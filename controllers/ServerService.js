const conn = require('../lib/mysql');
const Dao = require('./dataDao');
const serverdao = new Dao(Dao.SERVERS, conn);

const logger = new (require('../lib/Logger'))('ServerService', false, 'ServerService.js');

const Rcon = require('../lib/Rcon');
const ServerQuery = require('../lib/ServerQuery');

const BaseService = require('../controllers/BaseService');
const Server = require('../models/Server');

const ruleSer = require('../controllers/RuleService');

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

    async removeByid(id) {
        const removeServerData = async (service, serverid) => {
            try {
                const alldata = await service.findAll();
                await alldata.forEach((item) => {
                    logger.debug(item.serverid == serverid, item.serverid);
                    if (item.serverid == serverid) {
                        service.removeByid(item.serverid);
                    }
                });

            } catch (err) {
                return Promise.reject(err);
            }
        }
        try {
            await removeServerData(ruleSer, id);
            await super.removeByid(id);

            return 'remove server and associated data succeed';
        } catch (err) {
            return Promise.reject(err);
        }
    }
}

module.exports = new ServerService(Server, serverdao);