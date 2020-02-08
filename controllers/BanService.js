const conn = require('../lib/mysql');
const Dao = require('./dataDao');
const bandao = new Dao(Dao.BANS, conn);

const Rcon = require('../lib/Rcon');
const BaseService = require('./BaseService');
const Ban = require('../models/Ban');

const userSer = require('./UserService');
const serverSer = require('./ServerService');

class BanService extends BaseService {
    constructor(obj, dao) {
        super(obj, dao, 'userid');
    }

    async create(ban) {
        try {
            const user = await userSer.findByid(ban.userid);
            const server = await serverSer.findByid(ban.serverid)
            const steamid32 = await user.getSteamID32();

            const rcon = new Rcon({
                host : server.ip,
                port : server.port,
                password : server.rconpass
            })                

            await rcon.connect();
            await rcon.auth();

            await super.create(ban);

            const data = await rcon.command(`ulx banid "${steamid32}" `+ ban.unban);
            
            return data;

        } catch(err) {
            return Promise.reject(err);
        }
    }

    // 编辑ban有需要再做

    async removeByid(userid) {
        try {
            const ban = await super.findByid(userid);
            const user = await userSer.findByid(ban.userid);
            const server = await serverSer.findByid(ban.serverid);
            const steamid32 = await user.getSteamID32();

            const rcon = new Rcon({
                host : server.ip,
                port : server.port,
                password : server.rconpass
            })

            await rcon.connect();
            await rcon.auth();

            await super.removeByid(ban.userid);

            const data = await rcon.command(`ulx unban "${steamid32}"`);

            return data;

        } catch (err) {
            return Promise.reject(err);
        }
    }

    serverBans(serverid) {
        return new Promise((resolve, reject) => {
            serverSer.findByid(serverid).then((server) => {
                const rcon = new Rcon({
                    host : server.ip,
                    port : server.port,
                    password : server.rconpass
                })
        
                rcon.connect().then(() => {
                    rcon.auth().then(() => {
                        rcon.command('querydata bans').then((data) => {
                            const resdata = JSON.parse(data);
                            resolve(resdata);
                        }).catch((err) => reject(err));
                    }).catch((err) => reject(err));
                }).catch((err) => reject(err));

            }).catch((err) => reject(err));
        });
    }

}

module.exports = new BanService(Ban, bandao);
