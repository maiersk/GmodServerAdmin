const net = require("net")
const packet = require("../lib/packet")

let config = {
    host : 'vps.nxmod.top',
    port : 27015,
    password : "yqmdx123"
}

let connection

new Promise((resolve, reject) => {
    connection = net.createConnection({
        host : config.host,
        port : config.port
    }, () => {
        console.log("连接服务端");
        connection.write(packet.request({
            id : 1,
            type : packet.SERVERDATA_AUTH,
            body : config.password
        }));

        new Promise((resolve, reject) => {
            connection.on('data', (data) => {
                resolve(data)
            })
        }).then((data) => {
            console.log(packet.response(data))
        })

        resolve(connection);
    })
}).then((connection) => {
    //console.log(connection)
})




// Promise.race([
//     new Promise(reslove => setTimeout(reslove, 3000)),
//     new Promise((reslove, reject) => {
//         connection.removeListener('error', error => console.error(error));
//         connection.on('error', error => console.error(error));
//         connection.on('data', data => {
//             reslove(data);
//         })
        
//     })
// ]).then(data => {
//     let res = packet.response(data);
//     if (res.id === -1) {
//         let err = new Error('Wrong rcon password');
//         return Promise.reject(err);
//     } else {
//         let but = packet.request({
//             id : 1,
//             type : packet.SERVERDATA_EXECCOMMAND,
//             body : 'status'
//         })
//         connection.write(but)
        
//         connection.removeListener('error', error => console.error(error));
//         connection.removeListener('data', data => { console.log(data.toString('utf8')) });

//         connection.on("data", (data) => {
//             console.log(data.toString('utf8'))
//         })

//     }
// })

