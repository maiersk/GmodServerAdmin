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
const main = async(args) => {
    // console.log(args);
    if (args[0] === 'cfg') {
        await write('./config/defeult.js', getConfig(
            args[1] || 80,
            args[2] || "localhost",
            args[3] || "root",
            args[4] || "",
            args[5] || "server_admin",
            args[6] || "/public/screenshot/",
            args[7]
        ));

    } else if (args[0] === 'setup') {
        const mysql = require('mysql');
        const conf = require('./config/defeult').mysql;

        const connection = mysql.createConnection({
            host : conf.host,
            user : conf.user,
            password : conf.password
        });

        connection.connect(async (err) => {
            await installFunction(connection, conf);
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
        'CREATE TABLE IF NOT EXISTS ' + conf.database + '.users' +
        '(id CHAR(20) PRIMARY KEY, groupid TINYINT, steamobj TEXT);', (err, results) => {
            console.log(results);
            console.error(err ? err : '');
        }
    )

    await connection.query(
        'CREATE TABLE IF NOT EXISTS ' + conf.database + '.groups' +
        '(id TINYINT PRIMARY KEY AUTO_INCREMENT, name CHAR(25) UNIQUE, powers TEXT);', (err, results) => {
            console.log(results);
            console.error(err ? err : '');

            const root = {
                name : Group.ROOT,
                powers : Power.filter(['*_*'])
            };
        
            const superadmin = {
                name : Group.SUPERADMIN,
                powers : Power.filter(['user_*', 'server_*', 'player_*', 'rule_*'])
            };
        
            const admin = {
                name : Group.ADMIN,
                powers : Power.filter(['user_*', 'player_*', Power.RULE_EDIT])
            };
        
            const player = {
                name : Group.PLAYER,
                powers : Power.filter([Power.USER_UPLOADIMAGE])
            };
        
            const groupSer = require('./controllers/GroupService');
        
            groupSer.create(root).then((group) => {
                console.log(group);
            });
        
            groupSer.create(superadmin).then((group) => {
                console.log(group);
            });
        
            groupSer.create(admin).then((group) => {
                console.log(group);
            });
        
            groupSer.create(player).then((group) => {
                console.log(group);
            });
        
            groupSer.findAll().then((grouplist) => {
                console.log(grouplist);
            });

        }
    )

    await connection.query(
        'CREATE TABLE IF NOT EXISTS ' + conf.database + '.screenshots' +
        '(id CHAR(20) PRIMARY KEY, userid CHAR(20), description VARCHAR(100), pv TINYINT, lk TINYINT, image VARCHAR(100));', (err, results) => {
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