function build_url(json) {
    let comp = new Array();
    for (let item in json) {
        comp.push(item + "=" + encodeURIComponent(json[item]));
    }
    return comp.join("&amp;");
}

module.exports = build_url;