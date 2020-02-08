module.exports = (app) => {
    app.use('/sign', require('./sign'));
    
    app.use('/bans', require('./bans'));
    app.use('/users', require('./users'));
    app.use('/groups', require('./groups'));
    app.use('/screenshots', require('./screenshots'));

    app.use('/rules', require('./rules'));
    app.use('/servers', require('./servers'));
}