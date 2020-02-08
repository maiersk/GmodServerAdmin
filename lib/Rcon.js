const net = require('net');

const logger = new (require('../lib/Logger'))('', false, 'Rcon.js');

const Packet = require('./packet');

class Rcon {
    constructor(options) {
        /**
         * Server host
         * @type {string}
         * @default '127.0.0.1'
         */
        this.host = options.host || '127.0.0.1';

        /**
         * Server port
         * @type {number}
         * @default 27015
         */
        this.port = options.port || 27015;

        /**
         * Server password
         * @type {string}
         */
        this.password = options.password;

        /**
         * Maximum Packet bytes size, zero to unlimit
         * @type {number}
         * @default 4096
         */
        this.maximumPacketSize = options.maximumPacketSize || 4096; // https://developer.valvesoftware.com/wiki/Source_RCON#Packet_Size

        /**
         * Socket encoding
         * @type {('ascii'|'utf8')}
         * @default 'ascii'
         */
        this.encoding = options.encoding || 'utf-8';

        /**
         * Socket timeout (ms)
         * @type {number}
         * @default 1000
         */
        this.timeout = options.timeout || 1000;

        /**
         * Socket connection
         * @type {net.Socket?}
         */
        this.connection = false;

        /**
         * Is socket connected
         * @type {boolean}
         */
        this.connected = false;

        /**
         * Whether server has been authenticated
         * @type {boolean}
         * @default false
         * @private
         */
        this.authenticated = false;
    }

    connect() {
        return new Promise((resolve, reject) => { 
            this.connection = net.createConnection({
                host : this.host,
                port : this.port
            }, () => {
                this.connection.setTimeout(this.timeout);
                this.connected = true;
                resolve();
            }) 
            const onError = (err) => {
                this.connection.removeListener('error', onError);   // GC
                reject('Rcon connect failure');
            }

            this.connection.on('error', onError);
        });
    }

    auth() {
        return new Promise((resolve, reject) => {
            if (!this.connected) {
                reject('Not connected');
            }
            if (this.authenticated) {
                reject('Already authenticated');
            }

            this.write({
                id : 1,
                type : Packet.SERVERDATA_AUTH,
                body : this.password,
            }).then((data) => {
                // this.connection.connecting = true;
                // logger.debug(data);

                if (data.id !== -1) {
                    this.authenticated = true;
                    resolve(data);
                } else {
                    this.deconnection().catch((err) => reject(err));
                    reject('Unable to authenticate');
                }
            }).catch((err) => reject(err));
        });
    }

    write(options) {
        return new Promise((resolve, reject) => {
            const onData = (data) => {
                const dataPacket = Packet.response(data);
                // 当发送类型0x03时会收到(0x00 and 0x02).但我们只需要0x02
                if (options.type === Packet.SERVERDATA_AUTH && dataPacket.type !== Packet.SERVERDATA_AUTH_RESPONSE) {
                    return;
                }
                this.connection.removeListener('error', onError);   //GC
                resolve(dataPacket);
            }

            const onError = (err) => {
                this.connection.removeListener('data', onData);     //GC
                reject(err)
            }

            const packet = Packet.request({ 
                id : options.id,
                type : options.type,
                body : options.body
            });

            if (this.maximumPacketSize > 0 && packet.length > this.maximumPacketSize) {
                reject('Packet too long');
            }

            this.connection.on('data', onData);
            this.connection.once('error', onError);
            this.connection.write(packet);
        })
    }
    
    command(str) {
        return new Promise((resolve, reject) => {
            this.write({
                id : 1,
                type : Packet.SERVERDATA_EXECCOMMAND,
                body : str,
            }).then((data) => {
                resolve(data.payload.toString(this.encoding));

                this.deconnection().catch((err) => reject(err));
            }).catch((err) => reject(err));
        })
    }

    deconnection() {
        this.connected = false;
        this.authenticated = false;
        this.connection.destroy();

        return new Promise((resolve, reject) => {
            const onError = (e) => {
                this.connection.removeListener('error', onClose);   // GC
                reject(e);
            }

            this.connection.once('error', onError);
        });        
    }
    
}

module.exports = Rcon;

// test.connect().then(() => {
//     return test.command('status').then((data) => {
//         console.log(data);
//     })
// }).then(
//     () => test.command('ulx allply').then((data) => { console.log(data); })
// ).then(
//     () => test.command('status').then((data) => console.log(data))
// ).then(
//     () => test.deconnection()
// )
