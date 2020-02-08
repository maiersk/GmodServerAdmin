const express = require('express');
const session = require('express-session');
const body_parser = require('body-parser');
const path = require('path');
const conf = require('./config/defeult');

const logger = new (require('./lib/Logger'))('App', false, 'app.js');

const routes = require('./routes');

const app = express();

app.use(session({
    secret : conf.session.secret,
    key : conf.session.key,
    resave : true,
    saveUninitialized : false,
    cookie : {
        maxAge : conf.session.maxAge
    }
}));

// POST 使用json参数提交解析方法
app.use(body_parser.json({limit : '1mb'}));
app.use(body_parser.urlencoded({ extended : true }));

routes(app);

app.use('/', express.static(path.join(__dirname, 'public')));

app.listen(conf.port, () => {
    logger.log('listening ' + conf.port);
});