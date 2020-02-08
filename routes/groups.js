const express = require('express');
const router = express.Router();

const resjson = require('../middlewares/resjson');
const check = require('../middlewares/check').check;

const Power = require('../models/Power');

const groupservice = require('../controllers/GroupService');

router.get('/', check({Login:true, Power:Power.GROUP_DISPLAY}), (req, res) => {
    groupservice.findAll().then((grouplist) => {
        res.json(resjson.data(grouplist));
    });
});

router.post('/create', check({Login:true, Power:Power.GROUP_ADD}), (req, res) => {
    let name = req.body.name;
    let powers = req.body.powers;

    let obj = {
        id : 'auto',
        name : name,
        powers : JSON.stringify(powers),
    };

    groupservice.create(obj).then((data) => {
        res.json(resjson.msg(data));
    }).catch((err) => {
        res.json(resjson.err(err));
    });
});

router.get('/:id', check({Login:true, Power:Power.GROUP_DISPLAY}), (req, res) => {
    let groupid = req.params.id;

    groupservice.findByid(groupid).then((group) => {
        res.json(resjson.data(group.toJson()));
    }).catch((err) => {
        res.json(resjson.err(err));
    });
});

router.post('/:id/edit', check({Login:true, Power:Power.GROUP_EDIT}), (req, res) => {
    const groupid = req.params.id
    // 需要编辑powers时将数组转为字符串。
    req.body.powers = req.body.powers ? JSON.stringify(req.body.powers) : null;

    groupservice.editByid(groupid, req.body).then((data) => {
        res.json(resjson.msg(data));
    }).catch((err) => {
        res.json(resjson.err(err));
    })
});

router.get('/:id/remove', check({Login:true, Power:Power.GROUP_DEL}), (req, res) => {
    const groupid = req.params.id;

    groupservice.removeByid(groupid).then((data) => {
        res.json(resjson.msg(data));
    }).catch((err) => {
        res.json(resjson.err(err)) 
    });
});

module.exports = router;