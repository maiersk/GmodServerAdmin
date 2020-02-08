const dgran = require('dgram');
const udpSocket = dgran.createSocket('udp4');

const packet = {
    A2S_INFO : 0x54,
    A2S_PLAYER : 0x55,

    serverInfo : function(opations) {
        let body = 'Source Engine Query\0';
        let buffer = Buffer.alloc(body.length + 5);
        buffer.writeInt32LE(-1, 0);
        // buffer.write('FFFFFFFF', 0, 'hex');
        buffer.writeInt32LE(packet.A2S_INFO, 4);
        buffer.write(body, 5, buffer.length - 1, 'ascii');
        return buffer;
    },

    serverPlayer : function(opations) {
        
    },

    sendPacket(type, payload) {
        return new Promise((resolve, reject) => {
            
        })
    }
}

const Reader = require('../lib/Reader');

// udpSocket.unref();
// udpSocket.bind();
udpSocket.on('message', (buffer, rinfo) => {
    const fromAddress = rinfo.address;
    const fromPort = rinfo.port;
    console.log(fromAddress, fromPort);
    console.log(buffer);
    console.log(buffer.toString('utf-8'));
    const header = buffer.slice(4, 5);
    const priticol = buffer.slice(5, 6);
    // const name = buffer.slice()
    console.log(header, priticol);
    


    let bodybuffer = buffer.slice(6, buffer.length);
    let reader = new Reader(bodybuffer);

    let state = {};

    state.name = reader.string();
    state.map = reader.string();
    state.folder = reader.string();
    state.game = reader.string();
    state.steamappid = reader.uint(2);
    state.numplayers = reader.uint(1);
    state.maxplayers = reader.uint(1);
    state.numbots = reader.uint(1);

    state.listentype = reader.uint(1);
    state.environment = reader.uint(1);

    state.password = reader.uint(1);
    
    console.log(state);

    // let bufferlist = [];
    // let start = 0;
    // for (let i = 0; i < bodybuffer.length; i++) {
    //     // console.log(bodybuffer.readUInt8(i));
    //     if (bodybuffer.readUInt8(i) == 0) {
    //         let item = bodybuffer.slice(start, i);
    //         if (item.length != 0) {
    //             console.log(item.toString());
    //             bufferlist.push(item);
    //             start = i + 1;
    //         }
    //     }
    // }
    // console.log(bufferlist);
});
udpSocket.on('error', e => {
    console.log(e);
});

let buffer = packet.serverInfo();
console.log(buffer);
// udpSocket.send(buffer, 32691, 'mc9.starmc.cn')
udpSocket.send(buffer, 27015, 'vps.nxmod.top');

// new Promise((resolve, reject) => {
//     udpSocket.connect(32691, 'mc9.starmc.cn', (err) => {
//         udpSocket.on('message', (msg, rinfo) => {
//             console.log(msg.toString());
//             console.log(rinfo);
//         })
//         udpSocket.on('connect', () => {
//             console.log('connecting');
//         })
//         let header = packet.A2S_INFO;
//         let payload = '';
//         let buffer = Buffer.from(header);

//         udpSocket.send(buffer, 0, buffer.length);
//     })
// })
