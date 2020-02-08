module.exports = {
    msg(msg) {
        return {succeed : true, massage : msg};
    },
    
    data(data) {
        return {succeed : true, data : data};
    },

    err(err) {
        return {succeed : false, massage : err};
    }
}