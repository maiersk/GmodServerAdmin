const express = require('express');
const request = require('request');
const conf = require('../config/defeult');

const build_url = require('../util/build_url');
const resjson = require('../middlewares/resjson');
const check = require('../middlewares/check').check;

const router = express.Router();

const userservice = require('../controllers/UserService');

// 生成登录url接口
router.get('/buildurl', (req, res) => {
    let realm = 'http://127.0.0.1';
    let return_path = realm + '/sign/in';

    let url = build_url({
        'openid.ns' : 'http://specs.openid.net/auth/2.0',
        'openid.mode' : 'checkid_setup',
        'openid.return_to' : return_path,
        'openid.realm' : realm,
        'openid.identity' : 'http://specs.openid.net/auth/2.0/identifier_select',
        'openid.claimed_id' : 'http://specs.openid.net/auth/2.0/identifier_select'
    });

    res.send({ url : 'https://steamcommunity.com/openid/login?' + url});
})

//回调数据并登录api
router.get('/in', (req, res) => {
    if (req.session.user) {
        res.send(resjson.data(req.session.user.id));
        return; 
    }

    // console.log(req);
    //读取访问完steam登录页的请求
    //直接找请求内的身份地址，使用URL类拿出最后的路径地址
    if (!req.query['openid.identity']) { 
        res.json(resjson.err('no user sign'));
        return; 
    }
    let url = new URL(req.query['openid.identity']);
    let pathname = url.pathname;
    let steamid64 = pathname.split('/')[3];
    //分割地址'/'取最后一项
    //得到玩家steamid64位id
    // console.log(steamid64);
    
    //请求GetPlayerSummaries api得到用户信息。将所有信息放到User类中操作
    request({
        url : 'http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=' + conf.STEAM_APIKEY + '&steamids=' + steamid64,
        method: 'GET',
        json: true,
        headers: {
            'content-type': 'application/json',
        }
    }, (error, response, body) => {
        let steamobj = body.response['players'][0];

        userservice.signin(steamobj, req.session).then((data) => {
            res.redirect('/index.html');
        });
        
    });

})

//登出
router.get('/out', (req, res) => { 
    userservice.signout(req.session).then(() => {
        res.redirect('back');
    }).catch((err) => {
        res.json(resjson.err(err));
    });
})

// 不需要steam登陆的测试专用接口
// 传入steamobj的参数格式
router.post('/nosteamin', check({Logined:true}), (req, res) => {
    const steamobj = req.body;

    userservice.signin(steamobj, req.session).then((data) => {
        res.json(resjson.data(data));
    }).catch((err) => {
        res.json(resjson.err(err));
    })
})

router.get('/nosteamout', check({Login:true}), (req, res) => {
    userservice.signout(req.session).then((data) => {
        res.json(resjson.data(data));
    });
})

module.exports = router;