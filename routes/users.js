const express = require('express');
const router = express.Router();

const resjson = require('../middlewares/resjson');
const check = require('../middlewares/check').check;

const Power = require('../models/Power');

const userservice = require('../controllers/UserService');

//得到所有用户信息
router.get('/', check({Login:true}), (req, res) => {
    userservice.findAll().then((userlist) => {
        res.json(resjson.data(userlist));
    });
});

//得到用户信息
router.get('/:id', check({Login:true}), (req, res) => {
    let userid = req.params.id;
    
    userservice.findByid(userid).then((user) => {
        res.json(resjson.data(user.toJson()));
    }).catch((err) => {
        res.json(resjson.err(err));
    });
});

router.post('/:id/editgroupid', check({Login:true, Power:Power.USER_CHANGEGROUP}), (req, res) => {
    let userid = req.params.id;
    let groupid = req.body.groupid;

    userservice.editGroupid(userid, groupid).then((data) => {
        res.json(resjson.msg(data));
    }).catch((err) => {
        res.json(resjson.err(err));
    });
});

router.get('/:id/remove', check({Login:true, Power:Power.USER_DEL}), (req, res) => {
    const userid = req.params.id;

    userservice.removeByid(userid).then((data) => {
        res.json(resjson.msg(data));
    }).catch((err) => {
        res.json(resjson.err(err));
    });
});

module.exports = router;