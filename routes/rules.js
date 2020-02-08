const express = require('express');
const router = express.Router();

const resjson = require('../middlewares/resjson');
const check = require('../middlewares/check').check;
const Power = require('../models/Power');

const ruleSer = require('../controllers/RuleService');

router.get('/', check({Login:true}), (req, res) => {
    ruleSer.findAll().then((rulelist) => {
        res.json(resjson.data(rulelist));
    });
});

router.post('/create', check({Login:true, Power:Power.RULE_ADD}), (req, res) => {
    const serverid = req.body.serverid;
    const content = req.body.content;

    let rule = {
        serverid : serverid,
        content : content,
        time : new Date().getTime()
    }

    ruleSer.create(rule).then((data) => {
        res.json(resjson.msg(data));
    }).catch((err) => {
        res.json(resjson.err(err))
    });
});

router.get('/:serverid', check({Login:true}), (req, res) => {
    const serverid = req.params.serverid;

    ruleSer.findByid(serverid).then((rule) => {
        res.json(resjson.data(rule.toJson()));
    }).catch((err) => {
        res.json(resjson.err(err));
    });
});

router.post('/:serverid/edit', check({Login:true, Power:Power.RULE_EDIT}), (req, res) => {
    const serverid = req.params.serverid;
    req.body.time = req.body.time || new Date().getTime();

    ruleSer.editByid(serverid, req.body).then((data) => {
        res.json(resjson.msg(data));
    }).catch((err) => {
        res.json(resjson.err(err));
    });
});

router.get('/:serverid/remove', check({Login:true, Power:Power.RULE_DEL}), (req, res) => {
    const serverid = req.params.serverid;

    ruleSer.removeByid(serverid).then((data) => {
        res.json(resjson.msg(data));
    }).catch((err) => {
        res.json(resjson.err(err));
    });
});

module.exports = router;