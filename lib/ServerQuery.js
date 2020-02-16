const UdpSocket = require('./UdpSocket');
const Reader = require('./Reader');

const logger = new (require('../lib/Logger'))('', false, 'ServerQuery.js');

class ServerQuery {
    /**
     * server query data
     * @param {} options
     */
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

        this.udpSocket = new UdpSocket();
        this.udpSocket.options = options;
    }

    async state() {
        let json = {
            name: '',
            map: '',
            ip: this.host,
            connect: this.host + ':' + this.port,
            password: false,

            raw: {},

            maxplayers: 0,
            players: [],
            bots: []
        };

        await this.queryInfo(json);
        await this.queryChallenge();
        await this.queryPlayer(json);

        return json;
    }

    async queryInfo(json) {
        await this.sendPacketRaw(
            ServerQuery.A2S_INFO,
            'Source Engine Query\0',
            false,
            ServerQuery.A2S_INFO_RES,
            (buffer) => {
                logger.debug(buffer);
                
                const reader = this.reader(buffer);
                
                json.raw.protocol = reader.uint(1);
                json.name = reader.string();
                json.map = reader.string();
                json.raw.folder = reader.string();
                json.raw.game = reader.string();
                json.raw.steamappid = reader.uint(2);
                json.raw.numplayers = reader.uint(1);
                json.maxplayers = reader.uint(1);

                json.raw.numbots = reader.uint(1);

                json.raw.listentype = reader.uint(1);
                json.raw.environment = reader.uint(1);
                json.raw.listentype = String.fromCharCode(json.raw.listentype);
                json.raw.environment = String.fromCharCode(json.raw.environment);

                json.password = !!reader.uint(1);

                json.raw.secure = reader.uint(1);
                json.raw.version = reader.string();
                const extraFlag = reader.uint(1);
                if (extraFlag & 0x80) json.gamePort = reader.uint(2);
                if (extraFlag & 0x10) json.raw.steamid = reader.uint(8);
                if (extraFlag & 0x40) {
                    json.raw.sourcetvport = reader.uint(2);
                    json.raw.sourcetvname = reader.string();
                }
                if (extraFlag & 0x20) json.raw.tags = reader.string();
                if (extraFlag & 0x01) json.raw.gameid = reader.uint(8);
            }
        )
    }

    async queryChallenge() {
        await this.sendPacketRaw(
            ServerQuery.A2S_PLAYER,
            null,
            true,
            0x41,
            (buffer) => {
                const reader = this.reader(buffer);
                this._challenge = reader.uint(4);
            }
        )
    }

    async queryPlayer(json) {
        await this.sendPacketRaw(
            ServerQuery.A2S_PLAYER,
            null,
            ServerQuery.A2S_PLAYER_RES,
            ServerQuery.A2S_PLAYER_RES,
            (buffer) => {
                logger.debug(buffer);

                const reader = this.reader(buffer);
                const num = reader.uint(1);
                for (let i = 0; i < num; i++) {
                    reader.skip(1);
                    const name = reader.string();
                    const score = reader.int(4);
                    const time = reader.float();

                    if (!name) continue;
                    json.players.push({name : name, score : score, time : time});
                }
            }
        )
    }

    async sendPacketRaw(
        type,
        payload,
        sendChallenge,
        expect,
        onRespone,
    ) {
        if (typeof payload === 'string') {
            payload = Buffer.from(payload, 'binary');
        }
        const challengeLength = sendChallenge ? 4 : 0;
        const payloadLength = payload ? payload.length : 0;

        const buffer = Buffer.alloc(5 + challengeLength + payloadLength);
        buffer.writeInt32LE(-1, 0);
        buffer.writeInt8(type, 4);

        if (sendChallenge) {
            if (this._challenge) buffer.writeInt32LE(this._challenge, 5);
            else buffer.writeInt32BE(-1, 5);
        }
        if (payloadLength) {
            payload.copy(buffer, 5 + challengeLength);
        }
        
        await this.udpSocket.send(buffer).then((buffer) => {
            if (buffer) {
                const reader = this.reader(buffer);
                const header = reader.int(4);   // console.log(header);
                const restype = reader.uint(1);
                if (restype === expect) {
                    return onRespone(reader.rest());
                }                
            }
        });
    }

    reader(buffer) {
        return new Reader(buffer);
    }
}

ServerQuery.A2S_INFO = 0x54;
ServerQuery.A2S_INFO_RES = 0x49;
ServerQuery.A2S_PLAYER = 0x55;
ServerQuery.A2S_PLAYER_RES = 0x44;

module.exports = ServerQuery;

// const test = new ServerQuery({
//     host : 'vps.nxmod.top',
//     port : 27015,
// })

// test.queryInfo().then((json) => console.log(json));
// test.queryPlayer({ players : []}).then((json) => console.log(json));

// test.state().then((json) => console.log(json));
// console.log(test.state());