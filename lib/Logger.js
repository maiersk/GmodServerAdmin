const moment = require('moment');

class Logger {
    /**
     * Logger log and debug
     * @param {string} tag 
     * @param {boolean} debug 
     * @param {string} position debug code position
     */
    constructor(tag, debug, position) {
        this.tag = tag || '';
        this.debugEnabled = debug || false;

        this.position = position || false;
    }

    log(msg) {
        if (this.tag) {
            const time = moment(new Date()).format('HH:mm:ss');
            console.log(`[${this.tag}] ${time} : ${msg}`);
        }
    }
    
    debug(...msg) {
        if (!this.debugEnabled) return;
        this._print(...msg);
    }

    _print(...msg) {
        const out = [];
        for (const arg of msg) {
            if (arg instanceof Error) {
                out.push(arg.stack);
            } else if (typeof arg === 'function') {
                const result = arg.call(undefined, (...arg) => this._print(...arg));
                if (result != undefined) out.push(result);
            } else {
                out.push(arg);                
            }
        }
        if (out.length) {
            if (this.position) {
                out.unshift(`[DEBUG ${this.position}]`);
            }
            console.log(...out);            
        }
    }
}


// const logger = new Logger('Logger', true);
// logger.log('Logger runing');
// logger.debug('a = 1');
// logger.log('my first log class');

module.exports = Logger;