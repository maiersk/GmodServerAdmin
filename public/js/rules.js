$('').click(() =>{
    require.get({
        url :'/rules/',
        onsuccess : (res) =>{
            console.log(res);
        },
        onerror : (err) =>{
            console.log(err);
        }
    });
})

$('#add_rule').click(() => {
    const serverid=$('').val();
    const content=$('').val();
    require.post({
        url:'/rules/create',
        data:{
            serverid: serverid,
            content: content
        },
        onsuccess : (res) => {
            console.log(res);
        },
        onerror : (err) =>　{
            console.log(err);
        }
    });
})

$('#delete_rule').click(() =>{
    const serverid=$('').attr();
    require.get({
        url:'/rules/' + serverid +'/remove',
        onsuccess : (res) =>{
            console.log(res);
        },
        onerror : (err) =>{
            console.log(err);
        }
    });
})

$('#edit_rule').click(() =>{
    const serverid=$('').attr();
    const content=$('').val();
    require.post({
        url:'/rules/' + serverid +'/edit',
        data:{
            content: content
        },
        onsuccess : (res) =>{
            console.log(res);
        },
        onerror : (err) =>{
            console.log(err);
        }
    });
})