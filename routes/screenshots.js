const path = require('path');
const express = require('express');
const router = express.Router();

const screenshotpath = require('../config/defeult').screenshotpath;
const imagepath = path.join(__dirname, '..' + screenshotpath);
const formidable = require('express-formidable') ({
    //上传文件目录
    uploadDir : imagepath, 
    //保留后续
    keepExtensions : true 
})

const resjson = require('../middlewares/resjson');
const check = require('../middlewares/check').check;
const createat = require('../util/createat');

const screenshotSer = require('../controllers/ScreenshotService');

router.get('/', check({Login:true}), (req, res) => {
    screenshotSer.findAll().then((screenshotlist) => {
        res.json(resjson.data(screenshotlist));
    })
})

// 该用户的所有截图
router.get('/users/:userid', check({Login:true}), (req, res) => {
    const userid = req.params.userid;

    screenshotSer.findAll().then((screenshotlist) => {
        let list = [];
        for (let i = 0; i < screenshotlist.length; i++) {
            if (screenshotlist[i].userid == userid) {
                list.push(screenshotlist[i]);
            }
        }
        res.json(resjson.data(list));
    })        
})

router.post('/upload', formidable, check({Login:true, Power:Power.USER_UPLOADIMAGE}), (req, res) => {
    const user = req.session.user;
    const desc = req.fields.description;
    const image = req.files.image;
    // console.log(image, path.sep, image.path.split(path.sep));

    let screenshot = {
        id : createat.timeid(),
        userid : user.id,
        description : desc || '',
        image : image.path.split(path.sep).pop() || '',
    }
    
    screenshotSer.create(screenshot).then((data) => {
        res.json(resjson.msg(data));
    }).catch((err) => {
        res.json(resjson.err(err));
    });

})

router.get('/:id', check({Login:true}), (req, res) => {
    const shotid = req.params.id;

    screenshotSer.addPv(shotid).then((screenshot) => {
        res.json(resjson.data(screenshot.toJson()));
    }).catch((err) => {
        res.json(resjson.err(err));
    })
})

router.post('/:id/edit', check({Login:true}), formidable, (req, res) => {
    const shotid = req.params.id;
    const userid = req.session.user;
    const desc = req.fields.description;
    const image = req.files.image;

    const shotjson = {
        userid : userid,
        description : desc,
        image : image
    }

    screenshotSer.editByid(shotid, shotjson).then((data) => {
        res.json(resjson.msg(data));
    }).catch((err) => {
        res.json(resjson.err(err));
    })

})

router.get('/:id/remove', check({Login:true}), (req, res) => {
    const shotid = req.params.id;
    const userid = req.session.user.id;

    const shotjson = {
        id : shotid,
        userid : userid
    }

    screenshotSer.remove(shotjson).then((data) => {
        res.json(resjson.msg(data));
    }).catch((err) => {
        res.json(resjson.err(err));
    })
})

module.exports = router;