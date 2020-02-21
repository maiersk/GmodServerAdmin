'use strict';

module.exports = {
    ID_AUTH : 0x999,

    SERVERDATA_AUTH : 0x03,
    SERVERDATA_AUTH_RESPONSE : 0x02,
    SERVERDATA_EXECCOMMAND : 0x02,
    SERVERDATA_RESPONSE_VALUE : 0x00,

    request : function (options) {
        let id = options.id;
        let type = options.type;
        let body = options.body;

        let size = Buffer.byteLength(body);
        let buffer = Buffer.alloc(size + 14);

        buffer.writeInt32LE(buffer.length - 4, 0);
        buffer.writeInt32LE(id,     4);
        buffer.writeInt32LE(type,   8)
        buffer.write(body, 12, buffer.length - 2, 'utf-8');
        buffer.writeInt16LE(0, buffer.length - 2);

        return buffer;
    },

    response : function(buffer) {
        let size = buffer.readInt32LE(0);
        let id = buffer.readInt32LE(4);
        let type = buffer.readInt32LE(8);

        let payload = buffer.slice(12, buffer.length - 2);
        
        return {
            size : size,
            id : id,
            type : type,
            payload : payload
        }
    },


}