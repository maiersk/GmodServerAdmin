$(() => {

    // 打印所有服务端
    $('.servers > .Server_allServer').click(() => {
        const onlinetab = $('.allServer-onlineServer > div > table');
        const offlinetab = $('.allServer-offlineServer > div > table');
        
        let serverlist = [];
        let online = [];
        let offline = [];

        require.get({
            url :'/servers/',
            async : false,
            onsuccess : (res) =>{
                serverlist = res.data;
            },
            onerror :(err) =>{
                console.log(err);
            }  
        });

        console.log(serverlist);
        
        for (let i = 0; i < serverlist.length; i++) {
            require.get({
                url : '/servers/' + serverlist[i].id + '/status',
                async : false,
                onsuccess : (res) => {
                    if (res.succeed) {
                        online.push(serverlist[i]);
                    } else {
                        offline.push(serverlist[i]);
                        console.log(res.massage);
                    }
                },
                onerror : (err) => {
                    console.log(err);
                }
            })
        
        }

        const getHtml = (name, userid, ip, port, id) => {
            return'<tbody>' +
                '<tr>' +
                    '<td>'+ name +'</td>' +
                    '<td>'+ userid +'</td>' +
                    '<td>'+ ip +'</td>' +
                    '<td>'+ port +'</td>' +
                    '<td data-id=' + id + '>' +
                        '<a href="javascript:void(0)" class="delete_server">删除</a>' + '&nbsp;' +
                        '<a href="#Server_info" data-toggle="tab" class="server_moreinfo">更多信息</a>' +
                    '</td>' +
                '</tr>' +
            '</tbody>';
        }

        if (online.length) {
            console.log(online);
            onlinetab.children().filter('tbody').remove();

            for (let i = 0; i < online.length; i++) {
                onlinetab.append(
                    getHtml(
                        online[i].name,
                        online[i].userid,
                        online[i].ip,
                        online[i].port,
                        online[i].id
                    )
                );
            }
        }

        if (offline.length) {
            console.log(offline);
            offlinetab.children().filter('tbody').remove();

            for (let i = 0; i < offline.length; i++) {
                offlinetab.append(
                    getHtml(
                        offline[i].name,
                        offline[i].userid,
                        offline[i].ip,
                        offline[i].port,
                        offline[i].id
                    )
                );
            }
        }



    })



    // 服务端详细信息
    $('.allServer_pane, .Dashboard_allserver').on('click', '.server_moreinfo', function() {
        const td = $(this).parent();
        const serverid = td.data('id');
      
        // console.log(serverid);

        const serverName = $('.serverinfo_pane .server-name');
        const serverPass = $('.serverinfo_pane .server-password');        
        const serverMap = $('.serverinfo_pane .server-map');
        const servergamemode = $('.serverinfo_pane .server-gamemode');
        const playersOnline = $('.serverinfo_pane .playersOnline');
        const playersMax = $('.serverinfo_pane .playersMax');
        const playertab = $('.serverinfo_pane .server-box .players-table')
        const serverIp = $('.serverinfo_pane .server-ip');
        const serverJoin = $('.serverinfo_pane .server-join');

        const sendcmd = $('.serverinfo_pane .server-rcon .server-rconbody > .server-cmd');
        const sendcmdbtn = $('.serverinfo_pane .server-rcon .server-rconbody > span > .server-sendcmd');

        // console.log(serverName, playersOnline, playersMax, playertab, serverIp, serverJoin, sendcmd, sendcmdbtn);

        // 刷新按钮
        const serverRefresh = $('.serverinfo_pane .server-refresh');
        serverRefresh.unbind('click');
        serverRefresh.bind('click', () => {
            $(this).click();
        })

        require.get({
            url : '/servers/' + serverid + '/status',
            onsuccess : (res) => {
                if (res.succeed) {
                    const data = res.data;
                    console.log(data);

                    serverName.html(data.name);
                    serverPass.html(data.password ? '有' : '无');
                    serverMap.html(data.map);
                    servergamemode.html(data.raw.game);
                    playersOnline.html(data.raw.numplayers);
                    playersMax.html(data.maxplayers);
                    serverIp.html(data.ip);
                    serverJoin.attr('href', 'steam://connect/' + data.connect);

                    if (data.players.length) {
                        playertab.children().filter('tbody').remove();
                        
                        for (let i = 0; i < data.players.length; i++) {
                            playertab.append('<tbody>' +
                                '<tr>' +
                                    '<td id="playerlist_name">' + data.players[i].name + '</td>' +
                                    '<td>' + data.players[i].score + '</td>' +
                                    '<td>' + Math.floor(data.players[i].time / 60) + '分钟 </td>' +
                                    '<td data-id = ' + serverid + '>' +
                                        '<a href="javascript:void(0)" class="player_ban">封禁</a>' + '&nbsp;' +
                                        '<a href="javascript:void(0)" class="player_kick">踢出</a>' + '&nbsp;' +
                                    '</td>' +
                                '</tr>' +
                            '</tbody>'
                            )
                        }
                    } else {
                        playertab.children().filter('tbody').not('.none').remove();
                    }

                } else {
                    serverName.html('');
                    serverPass.html('无');
                    serverMap.html('无');
                    servergamemode.html('无');
                    playersOnline.html(0);
                    playersMax.html(0);
                    serverIp.html('0.0.0.0');
                    serverJoin.attr('href', '#');

                    playertab.children().filter('tbody').not('.none').remove();
                }
            }
        })


        const rulediv = $('.server-rule');
        const rulecontent = rulediv.children('.server-rule-content');
        const addrule = rulediv.children('.server-addrule');
        const editrule = rulediv.children('.server-editrule');
        const delrule = rulediv.children('.server-delrule');
        // 服务器规则
        require.get({
            url : '/rules/' + serverid,
            onsuccess : (res) => {
                const rule = res.data;
                if (res.succeed && res.data) {
                    rulecontent.val(rule.content);
                    addrule.css('display', 'none');
                    editrule.css('display', 'block');
                    delrule.css('display', 'block');
                } else {
                    rulecontent.val('');
                    addrule.css('display', 'block');
                    editrule.css('display', 'none');
                    delrule.css('display', 'none');
                }
                console.log(res);
            },
            onerror : (err) => {
                console.log(err);
            }
        })


        // 添加服务端规则点击事件
        addrule.unbind('click');
        addrule.bind('click', () => {

            require.post({
                url : '/rules/create',
                data : {
                    serverid : serverid,
                    content : rulecontent.val()
                },
                onsuccess : (res) => {
                    console.log(res);
                },
                onerror : (err) => {
                    console.log(err);
                }
            })
        })

        // 编辑规则
        editrule.unbind('click');
        editrule.bind('click', () => {
            require.post({
                url : '/rules/' + serverid +'/edit',
                data : {
                    content: rulecontent.val()
                },
                onsuccess : (res) =>{
                    console.log(res);
                },
                onerror : (err) =>{
                    console.log(err);
                }
            });
        })

        // 删除规则
        delrule.unbind('click');
        delrule.bind('click', () => {
            require.get({
                url : '/rules/' + serverid +'/remove',
                onsuccess : (res) =>{
                    console.log(res);
                },
                onerror : (err) =>{
                    console.log(err);
                }
            });
        })

        // 发送控制台命令按钮点击事件
        // 使用bind，在绑定一次事件后，下一次进入详细页解开上一次绑定的点击事件，防止事件执行次数增加
        sendcmdbtn.unbind('click');
        sendcmdbtn.bind('click', () => {
            console.log(sendcmd.val());

            require.post({
                url : '/servers/' + serverid + '/command',
                data : {
                    command : sendcmd.val()
                },
                onsuccess : (res) => {
                    if (res.succeed) {
                        
                    }
                    console.log(res);
                },
                onerror : (err) => {
                    console.log(err);
                }
            })
        })

    })

    // 添加服务端
    $('#Server_addServer .addServer-submit').click(() => {
        const name=$('.addServer-name').val();
        const address=$('.addServer-address').val();
        const port=$('.addServer-port').val();
        const rconpassword=$('.addServer-rconpassword').val();

        if (!name.length || !address.length || !port.length || !rconpassword.length) {
            return;
        }

        require.post({
            url :'/servers/create',
            data:{
                name: name,
                ip: address,
                port: port,
                rconpass: rconpassword
            },
            onsuccess :(res) =>{
                console.log(res);
            },
            onerror : (err) =>{
                console.log(err);
            }

        });
    })    

    const editdiv = $('#Server_editServer .Server_editvalue');

    // 编辑服务端
    // 传服务端名到select
    $('.servers > .Server_editServer').click(() => {
        const list = $('#Server_editServer select');
        // 排除第一项其余删除
        list.children().filter('option:gt(0)').remove();
        editdiv.css('display', editdiv.css('display') == 'block' ? 'none' : 'none');

        require.get({
            url :'/servers/',
            onsuccess : (res) =>{
                for(let i = 0; i < res.data.length; i++){
                    list.append(
                        '<option value=' + res.data[i].id + '>' + res.data[i].name + '</option>'
                    );
                }
            },
            onerror :(err) =>{
                console.log(err);
            }  
        });
    })

    // select选中事件
    $('#Server_editServer select').bind('change', function() {
        const serverid = $(this).val();

        const name = $('.editServer-name');
        const address = $('.editServer-address');
        const port = $('.editServer-port');
        const rconpassword = $('.editServer-rconpassword');

        require.get({
            url : '/servers/' + serverid,
            onsuccess : (res) => {
                if (res.succeed && serverid != 0) {
                    editdiv.css('display', 'block');

                    name.val(res.data.name);
                    address.val(res.data.ip);
                    port.val(res.data.port);
                    rconpassword.val(res.data.rconpass);

                } else {
                    editdiv.css('display', 'none');
                }
            },
            onerror : (err) => {
                console.log(err);
            }
        })
    });

    // 编辑提交
    $('#Server_editServer .Server_editvalue .editServer-submit').bind('click', () => {
        const serverid = $('#Server_editServer select').val();

        const name = $('.editServer-name').val();
        const address = $('.editServer-address').val();
        const port = $('.editServer-port').val();
        const rconpassword = $('.editServer-rconpassword').val();

        if (!name.length || !address.length || !port.length) { return; }

        if (editdiv.css('display') != 'none') {
            require.post({
                url : '/servers/' + serverid + '/edit',
                data : {
                    name : name,
                    ip : address,
                    port : port,
                    rconpass : rconpassword
                },
                onsuccess : (res) => {
                    if (res.succeed) {
                        console.log('编辑成功');
                    }
                },
                onerror : (err) => {
                    console.log(err);
                }
            })
        }
    })

    // 删除服务端
    $('.allServer-onlineServer, .allServer-offlineServer').on('click', '.delete_server', function() {
        // console.log($(this));
        const td = $(this).parent();
        const id = td.data('id');
        const tbody = td.parent().parent();

        require.get({
            url:'/servers/' + id + '/remove',
            onsuccess :(res) =>{
                tbody.remove();
                console.log(res);
            },
            onerror : (err) =>{
                console.log(err);
            }
        })
    })

})
