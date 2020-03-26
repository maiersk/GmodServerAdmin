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
            // 使用用户id对服务端相应玩家执行ban情况
            let steamid32
            if (ban.userid) {
                user = await userSer.findByid(ban.userid);                
                steamid32 = await user.getSteamID32();
            }
            const server = await serverSer.findByid(ban.serverid)

            const rcon = new Rcon({
                host : server.ip,
                port : server.port,
                password : server.rconpass
            })                

            await rcon.connect();
            await rcon.auth();

            // 使用玩家名ban，需要先发送命令到服务端接收玩家id
            let playersteamid;
            if (ban.playername) {
                playersteamid = await rcon.command(`steamidbynick ${ban.playername}`, true);
                ban.userid = playersteamid.substr(0, playersteamid.length - 1);     // 截掉返回来的\n
            
                if (typeof (ban.userid * 1) != 'number') { throw 'rcon callback a invalid steamid'; }

                // 检查用户是否存在，不存在创建玩家用户
                const user = await userSer.createPly(ban.userid, ban.playername);

                steamid32 = await user.getSteamID32();
            }

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
