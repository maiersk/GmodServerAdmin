require = {};

require.get = (opations) => {
    $.ajax({
        type: 'GET',        //方法类型
        dataType: 'json',   //预期服务器返回的数据类型
        url : opations.url,
        async : opations.async,
        success : opations.onsuccess,
        error : opations.onerror
    });
};

require.post = (opations) => {
    $.ajax({
        type: 'POST',        //方法类型
        dataType: opations.dataType ? opations.dataType : 'json',   //预期服务器返回的数据类型
        cache: opations.cache,
        contentType: opations.contentType,
        processData: opations.processData, //默认为true，默认情况下，发送的数据将被转换为对象，设为false不希望进行转换
        url : opations.url,
        async : opations.async,
        data : opations.data,
        success : opations.onsuccess,
        error : opations.onerror
    });
};

require.AllData = function(url) {
    let result = {};
    result.run = () => {
        this.get({
            url : url,
            async : false,
            onsuccess : (res) => {
                result.data = res.data;
            },
            onerror : (err) => {
                console.log(err);
            }
        })
    }    
    result.run();

    result.refresh = () => {
        result.run();
        return result;
    }

    return result;
}

// const test = require.AllData('/users/');
// console.log(test);
// console.log(test.refresh());