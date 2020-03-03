const mysql = require('mysql');
const conf = require('../config/defeult').mysql;

const logger = new (require('../lib/Logger'))('MySQL', true, 'mysql.js');

const connection = mysql.createConnection({
    host : conf.host,
    user : conf.user,
    password : conf.password,
    database : conf.database,
});

connection.connect((err) => {
    if (!err) {
        logger.log('MySQL Connection succeed');
    }

    if (err) {
        if (err.code === 'ECONNREFUSED') {
            logger.log('MySQL Connection failed.');

            process.exit(0);
        }
        if (err.code === 'ER_ACCESS_DENIED_ERROR') {
            logger.log(err.message);
            
            process.exit(0);
        }
    }

    // 查询数据库是否存在。否则自动创建数据库和表
    connection.query('USE ' + conf.database, (err, result) => {
        if (err) {
            logger.log('Can\'t find database ' + conf.database + '. please run install');
        }
    });
});

module.exports = connection;