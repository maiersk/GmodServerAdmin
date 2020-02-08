const resjson = require('../middlewares/resjson');

const logger = new (require('../lib/Logger'))('PowerOper', true, 'check.js');

const userSer = require('../controllers/UserService');
const groupSer = require('../controllers/GroupService');

module.exports = {
    checkLogin : (req, res, next) => {
        if (!req.session.user) {
            return res.json(resjson.err('no user login'));
        }
        next();
    },
    
    checkLogined : (req, res, next) => {
        if (req.session.user) {
            return res.json(resjson.err('You are logged in'))
        }
        next();
    },

    check : (operation) => {
        return (req, res, next) => {
            if (operation.Login) {
                if (!req.session.user) {
                    return res.json(resjson.err('You are no logged in'));
                }
            }
            if (operation.Logined) {
                if (req.session.user) {
                    return res.json(resjson.err('You are logged in'))
                }
            }
            if (operation.Power) {
                let user = req.session.user;
                groupSer.checkPower(user, operation.Power).then(() => {
                    userSer.findByid(user.id).then((user) => {
                        const userdata = user.getData();
                        logger.log(`${userdata.getName()} exec ${operation.Power} operation`)
                    });
                    next();
                }).catch(() => {
                    return res.json(resjson.err('Your permission cannot perform this operation'));
                })
            } else {
                next();
            }                
        }
    },

    checkPower : (power) => {
        return (req, res, next) => {
            let user = req.session.user;
            // console.log(power, user.groupid)
            groupSer.checkPower(user, power).then(() => {
                next();
            }).catch(() => {
                return res.json(resjson.err('Your permission cannot perform this operation'));
            })
        }
    },

}