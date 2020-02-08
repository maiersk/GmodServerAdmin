const Long = require('long');

function readUInt64LE(buffer, offset) {
    const low = buffer.readUInt32LE(offset);
    const high = buffer.readUInt32LE(offset + 4);
    return new Long(low, high, true);
}

class Read {
    /**
     * Read UdpSocket data
     * @param {UdpSocket} udpsocket 
     * @param {Buffer} buffer 
     */
    constructor(buffer) {
        this.encoding = 'utf-8'; 
        this.delimiter = '\0';
        this.buffer = buffer;

        this.i = 0;
    }

    offset() {
        return this.i;
    }

    skip(i) {
        this.i += i;
    }
    
    string(arg) {
        let length = null;
        let str = null;

        if (typeof arg === 'number') length = arg;
        
        if (length === null) {
            let delim = this.delimiter;
            if (typeof delim === 'string') delim = delim.charCodeAt(0);
            
            for (let end = this.i; end < this.buffer.length; end++) {
                // console.log(bodybuffer.readUInt8(delim));
                if (this.buffer.readUInt8(end) == delim) {
                    str = this.buffer.slice(this.i, end);
                    this.i = end + 1;
                    break;
                }
            }
        }

        return str.toString(this.encoding);
    }

    int(bytes) {
        let r = 0;
        if (this.remaining() >= bytes) {
            if (bytes === 1) r = this.buffer.readInt8(this.i);
            else if (bytes === 2) r = this.buffer.readInt32LE(this.i);
            else if (bytes === 4) r = this.buffer.readInt32LE(this.i);
        }
        this.i += bytes;
        return r;
    }

    uint(bytes) {
        let r = 0;
        if (this.remaining() >= bytes) {
            if (bytes === 1) r = this.buffer.readUInt8(this.i);
            else if (bytes === 2) r = this.buffer.readUInt16LE(this.i);
            else if (bytes === 4) r = this.buffer.readUInt32LE(this.i);
            else if (bytes === 8) r = readUInt64LE(this.buffer, this.i).toString();
        }
        this.i += bytes;
        return r;
    }

    float() {
        let r = 0;
        if (this.remaining() >= 4) {
            r = this.buffer.readFloatLE(this.i);
        }
        this.i += 4;
        return r;
    }

    remaining() {
        return this.buffer.length - this.i;
    }

    rest() {
        return this.buffer.slice(this.i);
    }

    done() {
        return this.i >= this.buffer.length;
    }
    
}

module.exports = Read;