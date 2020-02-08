const express = require('express');
const session = require('express-session');

const request = require('request');

const User = require("./class/User");
const build_url = require("./util/build_url");

const app = express();

app.use(session({
    name : "testapi",
    secret : "testapi",
    resave : true,
    saveUninitialized : false,
    cookie : {
        maxAge : 2592000000
    }
}))

app.get("/test", (req, res) => {
    res.render("/views/index")
})

app.get("/", (req, res) => {
    var userdata = req.session.user;

    if (userdata) {
        var user = new User(userdata.steamObj)
        res.send("hello " + user.getNick() + "<a href='./signout'>signout</a>");
    } else {
        res.send("you not signin please " + "<a href='./signinurl'>click here</a>")
    }
})

app.get("/signinurl", (req, res) => {
    var realm = "http://127.0.0.1:8080";
    var return_path = realm + "/signin";

    // var html = "<form method='POST'>" +
    // "<a href='https://steamcommunity.com/openid/login?openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&amp;openid.mode=checkid_setup&amp;openid.return_to=http%3A%2F%2F"+ ip +"%2F" + return_path + "&amp;openid.realm=http%3A%2F%2F"+ ip +"&amp;openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&amp;openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select'>" +
    // "    <h2>Sign in through Steam</h2>" +
    // "</a>";

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

    // res.redirect("https://steamcommunity.com/openid/login?" + url);

    // var html = "<form method='POST'><a href="+ "https://steamcommunity.com/openid/login?" + url +">click here</a></form>";
    // res.send(html)
})

app.get("/signin", (req, res) => {
    if (req.session.user) {
        res.send("你已登录");
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
    
    var apikey = "985438D9C169CDF9C8303DB02B15C629";
    var plyObj;
    request({
        url : "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=" + apikey + "&steamids=" + steam64,
        method: "GET",
        json: true,
        headers: {
            "content-type": "application/json",
        }
    }, (error, response, body) => {
        plyObj = body.response["players"][0];

        req.session.user = new User(plyObj);
        // req.session.user = User.create(plyObj.steamid, plyObj);

        console.log(plyObj)        
        // res.send("welcome " + player.personaname);
        console.log(req.session.user)
        res.send("welcome " + req.session.user.getNick() + " <a href='./signout'>signout</a>");
        //res.redirect("/")
    })

})

app.get("/signout", (req, res) => {
    if (req.session.user) {
        req.session.user = null;
        res.send("成功退出");
    };    
})

app.listen(8080, () => {
    console.log("listening")
})