const dgram = require('dgram');
const createTimeout = require('../util/timeout').createTimeout;

const logger = new (require('../lib/Logger'))('', true, 'UpdSocket.js');

class UdpSocket {
    constructor() {
        this.socket = null;
        this.options = null;
        this.timeout = 2000;
    }

    _getSocket() {
        if(!this.socket) {
            const udpsocket = this.socket = dgram.createSocket('udp4');
            udpsocket.unref();
            udpsocket.bind();
        }
        return this.socket;
    }

    async send(buffer) {
        const host = this.options.host;
        const port = this.options.port;
        this.assertVaildPort(port);
        
        if (typeof buffer === 'string') {
            buffer = Buffer.from(buffer, 'binary');
        }

        let udpsocket = this._getSocket();
        let timeoutfunc;
        try {
            const sendAndRes = new Promise((resolve, reject) => {
                const onData = (buffer, rinfo) => {
                    udpsocket.removeListener('error', onError); 
                    // logger.debug('[BUFFER]', buffer.toString());

                    const banmsg = buffer.toString();
                    if (banmsg.indexOf('Banned by server') != -1) {
                        // Rcon密码访问次数太多，被服务端ban了
                        reject('Banned by server');
                    }

                    resolve(buffer);
                }
        
                const onError = (err) => {
                    udpsocket.removeListener('message', onData);
                    logger.debug('[ERROR]', buffer);
                    reject(err);
                }
                


                udpsocket.on('message', onData);
                udpsocket.on('error', onError);
                udpsocket.send(buffer, 0, buffer.length, port, host);
            })

            timeoutfunc = createTimeout('udpsocket', this.timeout);

            return Promise.race([sendAndRes, timeoutfunc]);
        } catch(err) {
            timeoutfunc.cancle();
        }
    }

    assertVaildPort(port) {
        if (!port || port < 1 || port > 65535) {
            throw new Error('Invalid tcp/ip port: ' + port);
        }
    }

} 

module.exports = UdpSocket;