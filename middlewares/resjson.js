const logger = new (require('../lib/Logger'))('Result', false, 'resjson.js');

module.exports = {
    msg(msg) {
        logger.log('exec succeed ' + msg);
        return {succeed : true, massage : msg};
    },
    
    data(data) {
        logger.debug('exec succeed ', data);
        return {succeed : true, data : data};
    },

    err(err) {
        return {succeed : false, massage : err};
    }
}