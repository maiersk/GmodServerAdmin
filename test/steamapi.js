const express = require('express');
const session = require('express-session');
const request = require('request');
const app = express();

const User = require('./class/User');

const build_url = require('./util/build_url');

app.use(session({
    name : 'testapi',
    secret : 'testapi',
    resave : true,
    saveUninitialized : false,
    cookie : {
        maxAge : 2592000000
    }
}))

const APIKEY = '985438D9C169CDF9C8303DB02B15C629';

// 生成登录url接口
app.get('/sign/buildurl', (req, res) => {
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
app.get('/sign/in', (req, res) => {
    if (req.session.user) {
        res.send({ code : 1, msg : 'you has sign in'});
        return; 
    };

    // console.log(req);
    //读取访问完steam登录页的请求
    //直接找请求内的身份地址，使用URL类拿出最后的路径地址
    let url = new URL(req.query['openid.identity']);
    let pathname = url.pathname;
    let steam64 = pathname.split('/')[3];
    //分割地址'/'取最后一项
    //得到玩家steam64位id
    // console.log(steam64);
    
    //请求GetPlayerSummaries api得到用户信息。将所有信息放到User类中操作
    let plyObj;
    request({
        url : 'http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=' + APIKEY + '&steamids=' + steam64,
        method: 'GET',
        json: true,
        headers: {
            'content-type': 'application/json',
        }
    }, (error, response, body) => {
        plyObj = body.response['players'][0];

        //session中新建用户对象
        req.session.user = plyObj;
        
        res.redirect('/index.html');
    })

})

//登出
app.get('/sign/out', (req, res) => {
    if (req.session.user) {
        req.session.user = null;
        res.redirect('back');
    };    
})

//得到登录后的用户信息
app.get('/sign/getuserinfo', (req, res) => {
    let userdata = req.session.user;

    if (userdata != null) {
        let user = new User(userdata);
        let nick = user.getNick();
        let steam64 = user.getSteamid64();
        let avatar = user.getData().avatar;

        console.log(user);
        res.json({
            nick : nick,
            avatar : avatar,
            steam64 : steam64
        });
    } else {
        res.json({ code : 0, msg : 'you no sign in'});
    }
})

// 使用www目录下静态页
app.use('/',express.static('www'));

app.listen(80, () => {
    console.log('listening')
})