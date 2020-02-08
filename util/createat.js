const moment = require('moment');
const uid = require('uid');

module.exports = {
    timeid : () => {
        return moment(new Date()) + '-' + uid(6);
    },

    format : (strid) => {
        return moment(parseInt(strid.substring(0, strid.indexOf('-')))).format('YYYY-MM-DD HH:mm');
    }
}