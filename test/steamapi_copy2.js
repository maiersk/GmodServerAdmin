const express = require('express');
const session = require('express-session');
const request = require('request');
const app = express();

const User = require("./class/User");

const build_url = require("./util/build_url");

app.use(session({
    name : "testapi",
    secret : "testapi",
    resave : true,
    saveUninitialized : false,
    cookie : {
        maxAge : 2592000000
    }
}))

const APIKEY = "985438D9C169CDF9C8303DB02B15C629";

// app.set("view engine", "ejs");
app.use(express.static("www"));

app.get("/", (req, res) => {
    // console.log(req.url)
    // var userdata = req.session.user;
    // if (userdata) {
    //     var user = new User(userdata);
    //     var nick = user.getNick();
    //     var steam64 = user.getSteamid64();

    //     res.render("index", {nick : nick, steam64 : steam64})
    // } else {
    //     res.render("index")
    // }
})

app.get("/signinurl", (req, res) => {
    var realm = "http://127.0.0.1";
    var return_path = realm + "/signin";

    var url = build_url({
        'openid.ns' : 'http://specs.openid.net/auth/2.0',
        'openid.mode' : 'checkid_setup',
        'openid.return_to' : return_path,
        'openid.realm' : realm,
        'openid.identity' : 'http://specs.openid.net/auth/2.0/identifier_select',
        'openid.claimed_id' : 'http://specs.openid.net/auth/2.0/identifier_select'
    });

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.send({ url : "https://steamcommunity.com/openid/login?" + url});
})

app.get("/signin", (req, res) => {
    if (req.session.user) {
        res.send({ msg : "you has sign in"});
        return; 
    };

    // console.log(req);
    //读取访问完steam登录页的请求
    //直接找请求内的身份地址，使用URL类拿出最后的路径地址
    var url = new URL(req.query['openid.identity']);
    var pathname = url.pathname;
    var steam64 = pathname.split('/')[3];
    //分割地址'/'取最后一项
    //得到玩家steam64位id
    // console.log(steam64);
    
    //请求GetPlayerSummaries api得到用户信息。将所有信息放到User类中操作
    var plyObj;
    request({
        url : "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=" + APIKEY + "&steamids=" + steam64,
        method: "GET",
        json: true,
        headers: {
            "content-type": "application/json",
        }
    }, (error, response, body) => {
        plyObj = body.response["players"][0];

        //session中新建用户对象
        req.session.user = plyObj;
        // console.log(plyObj)        
        //console.log(req.session.user)

        // res.redirect("http://127.0.0.1/index.html");
        res.redirect("/index.html");
    })

})

app.get("/getuserinfo", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    var userdata = req.session.user;

    if (userdata != null) {
        var user = new User(userdata);
        var nick = user.getNick();
        var steam64 = user.getSteamid64();
        var avatar = user.getData().avatar;

        console.log(user);
        res.json({
            nick : nick,
            avatar : avatar,
            steam64 : steam64
        });
    } else {
        res.json({ msg : "you no sign in"});
    }
})

app.get("/signout", (req, res) => {
    if (req.session.user) {
        req.session.user = null;
        res.send("成功退出");
    };    
})

app.listen(80, () => {
    console.log("listening")
})