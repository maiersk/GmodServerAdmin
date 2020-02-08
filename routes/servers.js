const express = require('express');
const router = express.Router();

const resjson = require('../middlewares/resjson');
const check = require('../middlewares/check').check;

const Power = require('../models/Power');
const createat = require('../util/createat');

const serverSer = require('../controllers/ServerService');

router.get('/', check({Login:true}), (req, res) => {
    serverSer.findAll().then((serverlist) => {
        res.json({succeed : true, data : serverlist});
    });
})

router.post('/create', check({Login:true, Power:Power.SERVER_ADD}), (req, res) => {
    const userid = req.session.user.id;
    const name = req.body.name;
    const ip = req.body.ip;
    const port = req.body.port;
    const rconpass = req.body.rconpass;

    let server = {
        id : createat.timeid(),
        userid : userid,
        name : name,
        ip : ip,
        port : port,
        rconpass : rconpass,
    }

    serverSer.create(server).then((data) => {
        res.json(resjson.msg(data));
    }).catch((err) => {
        res.json(resjson.err(err));
    })
})

router.get('/:id', check({Login:true}), (req, res) => {
    const serverid = req.params.id;

    serverSer.findByid(serverid).then((server) => {
        res.json(resjson.data(server.toJson()));
    }).catch((err) => {
        res.json(resjson.err(err));
    });
})

router.post('/:id/edit',check({Login:true, Power:Power.SERVER_EDIT}), (req, res) => {
    const serverid = req.params.id;
    const reqjson = req.body;

    serverSer.editByid(serverid, reqjson).then((data) => {
        res.json(resjson.msg(data));
    }).catch((err) => {
        res.json(resjson.err(err));
    });
})

router.get('/:id/remove', check({Login:true, Power:Power.SERVER_DEL}), (req, res) => {
    const serverid = req.params.id;

    serverSer.removeByid(serverid).then((data) => {
        res.json(resjson.msg(data));
    }).catch((err) => {
        res.json(resjson.err(err));
    });
})

router.get('/:id/status', check({Login:true}), (req, res) => {
    const serverid = req.params.id;

    serverSer.status(serverid).then((status) => {
        res.json(resjson.data(status));
    }).catch((err) => {
        res.json(resjson.err(err));
    });
})

router.post('/:id/command', check({Login:true, Power:Power.SERVER_COMMAND}), (req, res) => {
    const serverid = req.params.id;
    const command = req.body.command;

    serverSer.command(serverid, command).then((data) => {
        res.json(resjson.data(data));
    }).catch((err) => {
        res.json(resjson.err(err));
    });
})

module.exports = router;