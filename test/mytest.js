// const url = require('url');

// let test = encodeURIComponent("http://baidu.com")
// let test2 = decodeURIComponent("http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&amp")
// console.log(test + "\n" + test2)

function build_url(json) {
    let comp = new Array();
    for (let item in json) {
        comp.push(item + "=" + encodeURIComponent(json[item]));
    }
    return comp.join("&amp;");
}

let url = build_url({
    'openid.ns' : 'http://specs.openid.net/auth/2.0',
    'openid.mode' : 'checkid_setup',
    'openid.return_to' : 'signin',
    'openid.realm' : 'http:127.0.0.1',
    'openid.identity' : 'http://specs.openid.net/auth/2.0/identifier_select',
    'openid.claimed_id' : 'http://specs.openid.net/auth/2.0/identifier_select'
});

console.log(url);

