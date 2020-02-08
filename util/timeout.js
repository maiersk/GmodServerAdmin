module.exports = {
    createTimeout(msg, timeout) {
        let cancle = null;
        const wrapped = new Promise((resolve, reject) => {
            const timeoutFunc = setTimeout(() => {
                reject(msg + ' Time out ' + timeout + 'ms');
            }, timeout);
            cancle = () => {
                clearTimeout(timeoutFunc);
            }
        });
        wrapped.cancle = cancle;
        return wrapped;
    }
}

// const test = createTimeout('test', 3000);
// const test2 = createTimeout('test2', 2000);

// console.log(Promise.race([test, test2]).catch((err) => {
//     console.log(err);
// }));
