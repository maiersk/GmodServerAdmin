const logger = new (require('../lib/Logger'))('[MySQL Dao]', false, 'dataDao.js');

class dataDao {

    constructor(table, conn) {
        this.table = table;
        this.conn = conn;
    }

    //遍历对象属性将其insert，注意类属性名和顺序与数据库一致;
    insert(obj) {
        return new Promise((resolve, reject) => {
            let keys = [], values = [];

            for (let key in obj) {
                if (typeof obj[key] !== 'object' && obj[key] !== 'auto') {
                    // console.log(obj[key]);
                    keys.push(key);
                    values.push('\'' + obj[key] + '\'');
                }
            }

            // logger.debug(this.table, keys.join(', '), values.join(', '));
            const sql = 'INSERT INTO ' + this.table +
                        ' ( ' + keys + ' ) VALUES' +
                        ' ( ' + values + ' );'

            logger.debug('SQL command :', sql);

            this.conn.query(sql, (err, results) => {
                    // console.log(results, err);
                    if (err) {
                        reject('Can\'t insert ' + err)
                    }     
                    resolve(results);
                }
            )
        })
    }

    // 将对象实例属性值修改后使用
    update(obj) {
        return new Promise((resolve, reject) => {
            let idk, idv, sets = [];

            //对象id必须在对象属性第一位
            for (let key in obj) {
                idk = key;
                idv = obj[key];
                break;
            }

            // logger.debug(idk, idv);

            for (let key in obj) {
                if (typeof obj[key] !== 'object' && key !== 'id') {
                    sets.push(key + ' = \'' + obj[key] + '\'');
                }
            }

            // logger.debug(sets.join(', '));
            const sql = 'UPDATE ' + this.table +
                        ' SET ' + sets.join(', ') +
                        ' WHERE ' + idk + ' = \'' + idv + '\';'

            logger.debug('SQL command :', sql);

            this.conn.query(sql, (err, results) => {
                    if (err) {
                        reject('Can\'t update ' + err)
                        return;
                    }     
                    resolve(results);
                }
            )
        })
    }

    delete(obj) {
        return new Promise((resolve, reject) => {
            let idk, idv;
    
            logger.debug('obj', obj);

            //对象id必须在对象属性第一位
            for (let key in obj) {
                idk = key;
                idv = obj[key];
                break;
            }

            logger.debug('objkey', idk, idv);

            const sql = 'DELETE FROM ' + this.table +
                        ' WHERE ' + idk + ' = \'' + idv + '\';'

            logger.debug('SQL command :', sql);

            this.conn.query(sql, (err, results) => {
                    if (err) {
                        reject(idk + ' = ' + idv + ' Can\'t delete ' + err)
                        return;
                    }     
                    resolve(results);
                }
            )
        })
    }

    // 注意对象'name'需与表'name'一样！
    findBy(key, value) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM ' + this.table + 
                        ' WHERE ' + key + ' = \'' + value + '\';'

            logger.debug('SQL command :', sql);

            this.conn.query(sql, (err, results) => {
                    if (err === 0 || (results && results.length === 0)) {
                        reject(key + ' = ' + value + ' Can\'t find ' + err)
                        return;
                    }
                    resolve(results);
                }
            )
        })
    }
    
    findAll() {
        return new Promise((resolve, resject) => {
            this.conn.query(
                'SELECT * FROM ' + this.table + ';',
                (err, results) => {
                    // console.log(results); 
                    resolve(results);
                }
            )
        })
    }
}

dataDao.USERS = 'users';
dataDao.GROUPS = 'groups';
dataDao.SCREENSHOTS = 'screenshots';
dataDao.SERVERS = 'servers';
dataDao.RULES = 'rules';
dataDao.BANS = 'bans';

module.exports = dataDao;

// const conn = require('../lib/mysql');
// const User = require('../models/user');
// const UserService = require('../controllers/UserService');

// let test = new dataDao(dataDao.USERS, conn)
// let user = new User(456, 123, {});
// let userser = new UserService(test);

// userser.findByid('76561198098162297')
//     .then((user) => {
//         console.log(user);
//     });
// userser.findAll()
//     .then((userlist) => {
//         console.log(userlist);
//     });
// test.insert(user);

// user.setGroupid(789);
// test.update(user);

// test.findByid('76561198098162297').then((resolve) => {
//     console.log(resolve);
// });
// test.findAll();