module.exports = { 
    port : 80, 
    session : { 
        secret : 'serveradmin', 
        key : 'serveradmin', 
        maxAge : 2592000000 
    }, 
    mysql : { 
        host : 'localhost', 
        user : 'root', 
        password : '', 
        database : 'server_admin', 
    }, 
    screenshotpath : '/public/screenshot/', 
    STEAM_APIKEY : 'none', 
} 