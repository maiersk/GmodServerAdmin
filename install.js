const path = require('path');
const fs = require('fs');
const util = require('util');
const write = util.promisify(fs.writeFile); //处理承诺工具。可将需callback的方法转为承诺

const Group = require('./models/Group');
const Power = require('./models/Power'); 

// 需处理的参数从第二位开始
const args = process.argv.slice(2);

const getConfig = (port, host, user, password, database, screenshotpath, steamapikey) => {
    const template = 
    "module.exports = { \n" +
    "    port : " + port + ", \n" +
    "    session : { \n" +
    "        secret : 'serveradmin', \n" +
    "        key : 'serveradmin', \n" + 
    "        maxAge : 2592000000 \n" +
    "    }, \n" +
    "    mysql : { \n" + 
    "        host : '" + host + "', \n" + 
    "        user : '" + user + "', \n" + 
    "        password : '" + password + "', \n" + 
    "        database : '" + database + "', \n" + 
    "    }, \n" + 
    "    screenshotpath : '" + screenshotpath + "', \n" + 
    "    STEAM_APIKEY : '" + steamapikey + "', \n" + 
    "} ";
    return template;
}

// 主方法，判断输入参数。设置配置或创建数据库情况
const main = async (args) => {
    // console.log(args);
    if (args[0] === 'cfg') {
        try {
            await write(path.join(__dirname, './config/defeult.js'), getConfig(
                args[1] || 80,
                args[2] || "localhost",
                args[3] || "root",
                args[4] || "",
                args[5] || "server_admin",
                args[6] || "/screenshot/",
                args[7]
            ));            
        } catch (error) {
            console.log(error);
            process.exit(0);  
        }
    } else if (args[0] === 'setup') {
        const mysql = require('mysql');
        const conf = require('./config/defeult').mysql;

        const connection = mysql.createConnection({
            host : conf.host,
            user : conf.user,
            password : conf.password
        });

        connection.connect(async (err) => {
            if (!err) {
                console.log('MySQL Connection succeed');
            }
        
            if (err) {
                if (err.code === 'ECONNREFUSED') {
                    console.log('MySQL Connection failed.');
        
                    process.exit(0);
                }
                if (err.code === 'ER_ACCESS_DENIED_ERROR') {
                    console.log(err.message);
                    
                    process.exit(0);
                }

                console.log(err);
                process.exit(0);
            }

            try {
                await installFunction(connection, conf);  
            } catch (error) {
                console.log(error);  
                process.exit(0); 
            }
        });

    }
}

main(args);

// 创建数据库和插入组权限
const installFunction = async (connection, conf) => {
    await connection.query('CREATE DATABASE IF NOT EXISTS ' + conf.database + ';', (err, results) => {
        console.log(results);
        console.error(err ? err : '') ;
    });

    await connection.query(
        'CREATE TABLE IF NOT EXISTS ' + conf.database + '.groups' +
        '(id TINYINT PRIMARY KEY AUTO_INCREMENT, name CHAR(25) UNIQUE, powers TEXT);', async (err, results) => {
            console.log(results);
            console.error(err ? err : '');

            const root = {
                id : 'auto',
                name : Group.ROOT,
                powers : Power.filter(['*_*'])
            };
            
            const superadmin = {
                id : 'auto',
                name : Group.SUPERADMIN,
                powers : Power.filter([Power.USER_CHANGEGROUP, Power.USER_CHECKIMAGE, Power.USER_DELIMAGE, Power.USER_UPLOADIMAGE, 'server_*', 'player_*', 'rule_*', Power.GROUP_DISPLAY])
            };
        
            const admin = {
                id : 'auto',
                name : Group.ADMIN,
                powers : Power.filter([Power.USER_CHANGEGROUP, Power.USER_CHECKIMAGE, Power.USER_DELIMAGE, Power.USER_UPLOADIMAGE, 'player_*', Power.GROUP_DISPLAY])
            };
        
            const player = {
                id : 'auto',
                name : Group.PLAYER,
                powers : Power.filter([Power.USER_UPLOADIMAGE])
            };
        
            const groupSer = await require('./controllers/GroupService');
        
            await groupSer.create(root).then((group) => {
                console.log(group);
            });
        
            await groupSer.create(superadmin).then((group) => {
                console.log(group);
            });
        
            await groupSer.create(admin).then((group) => {
                console.log(group);
            });
        
            await groupSer.create(player).then((group) => {
                console.log(group);
            });
        
            await groupSer.findAll().then((grouplist) => {
                console.log(grouplist);
            });

        }
    )

    await connection.query(
        'CREATE TABLE IF NOT EXISTS ' + conf.database + '.users' +
        '(id CHAR(20) PRIMARY KEY, groupid TINYINT, steamobj TEXT);', async (err, results) => {
            console.log(results);
            console.error(err ? err : '');

            const root = {
                id : '76561198098000000',
                groupid : 1,
                steamobj : '{"personaname":"root"}'
            }

            const superadmin = {
                id : '76561198098000001',
                groupid : 2,
                steamobj : '{"personaname":"superadmin"}'
            }

            const admin = {
                id : '76561198098000002',
                groupid : 3,
                steamobj : '{"personaname":"admin"}'
            }

            const player = {
                id : '76561198098000003',
                groupid : 4,
                steamobj : '{"personaname":"player"}'
            }

            const userSer = await require('./controllers/UserService');

            await userSer.create(root).then((user) => {
                console.log(user);
            });

            await userSer.create(superadmin).then((user) => {
                console.log(user);
            });

            await userSer.create(admin).then((user) => {
                console.log(user);
            });

            await userSer.create(player).then((user) => {
                console.log(user);
            });
        
            await userSer.findAll().then((userlist) => {
                console.log(userlist);
            });
        }
    )

    await connection.query(
        'CREATE TABLE IF NOT EXISTS ' + conf.database + '.screenshots' +
        '(id CHAR(20) PRIMARY KEY, userid CHAR(20), description VARCHAR(100), pv TINYINT, audit TINYINT, image VARCHAR(100));', (err, results) => {
            console.log(results);   
            console.error(err ? err : '');
        }
    )

    await connection.query(
        'CREATE TABLE IF NOT EXISTS ' + conf.database + '.servers' + 
        '(id CHAR(20) PRIMARY KEY, userid CHAR(20), name CHAR(25), ip CHAR(25), port CHAR(10), rconpass CHAR(20));', (err, results) => {
            console.log(results);
            console.error(err ? err : '');
        }
    )

    await connection.query(
        'CREATE TABLE IF NOT EXISTS ' + conf.database + '.rules' + 
        '(serverid CHAR(20) PRIMARY KEY, content TEXT, time bigint(30));', (err, results) => {
            console.log(results);
            console.error(err ? err : '');
        }
    )
    
    await connection.query(
        'CREATE TABLE IF NOT EXISTS ' + conf.database + '.bans' + 
        '(userid CHAR(30) PRIMARY KEY, operid CHAR(30), serverid CHAR(30), unban bigint(30), time bigint(30), reason VARCHAR(100));', (err, results) => {
            console.log(results);
            console.error(err ? err : '');

            connection.destroy();
            process.exit(0);
        }
    )
}