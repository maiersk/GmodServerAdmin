const express = require('express');
const router = express.Router();

const resjson = require('../middlewares/resjson');
const check = require('../middlewares/check').check;

const Power = require('../models/Power');

const banSer = require('../controllers/BanService');

// 只显示网站全部ban列表
router.get('/', check({Login:true}), (req, res) => {
    banSer.findAll().then((banlist) => {
        res.json(resjson.data(banlist));
    })
});

router.post('/banplayer', check({Login:true, Power:Power.PLAYER_BAN}), (req, res) => {
    const operid = req.session.user.id;

    const banjson = {
        userid : req.body.userid,
        operid : operid,
        serverid : req.body.serverid,
        unban : req.body.unban || '',
        time : new Date().getTime(),
        reason : req.body.reason
    }
    
    banSer.create(banjson).then((data) => {
        res.json(resjson.msg(data));
    }).catch((err) => {
        res.json(resjson.err(err));
    })
});

// 只显示网站玩家ban信息
router.get('/:userid', check({Login:true}), (req, res) => {
    const userid = req.params.userid;

    banSer.findByid(userid).then((ban) => {
        res.json(resjson.data(ban.toJson()));
    }).catch((err) => {
        res.json(resjson.err(err));
    })
});

// 显示服务器ban列表
router.get('/servers/:serverid', check({Login:true, Power:Power.PLAYER_SERVERBANS}), (req, res) => {
    const serverid = req.params.serverid;

    banSer.serverBans(serverid).then((data) => {
        res.json(resjson.data(data));
    }).catch((err) => {
        res.json(resjson.err(err));
    })
});

// router.post('/:userid/edit', (req, res) => {

// });

router.get('/:userid/unban', check({Login:true, Power:Power.PLAYER_UNBAN}), (req, res) => {
    const userid = req.params.userid;

    banSer.removeByid(userid).then((data) => {
        res.json(resjson.msg(data));
    }).catch((err) => {
        res.json(resjson.err(err));
    })
});

module.exports = router;