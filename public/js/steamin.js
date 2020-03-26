// 全局当前用户id
let steamid64;

require.get({
    url : '/sign/in',
    async : false,
    onsuccess : (res) => {
        steamid64 = res.data;
        console.log(res);
        if (!res.succeed) {
            window.location.href = '/signin.html';
        }
    },
    onerror : (err) => {
        console.log(err);
    }
});

// 全局变量，当前登录的用户数据
let user = users[steamid64];

$(() => {

    if (user) {
        const name = user.steamobj.personaname;
        const avatar = user.steamobj.avatarfull;
        $('.rightul > .name').append(name);
        $('.rightul > .avatar > img').attr("src", avatar);
    }

    $('.rightul > .signout').click(() => {
        require.get({
            url : '/sign/out',
            onsuccess : (res) => {
                console.log(res);
                // var oDate=new Date();
                // oDate.setDate(oDate.getDate()+-1);
                // document.cookie='serveradmin'+"=null;expires="+oDate.toDateString();
                window.location.reload();
            },
            onerror : (err) => {
                console.log(err);
            } 
        })
    })
    
})
