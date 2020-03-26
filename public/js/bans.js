
$(() => {

    // 所有封禁记录
    $('.Bans').click(() => {
        const banstab = $('.bans_tab');
        const tbody = banstab.children('tbody');
        
        require.get({
            url : '/bans/',
            onsuccess : (res) => {
                const bans = res.data;

                if (res.succeed && bans.length != 0) {
                    tbody.children('tr').remove();

                    for (let i = 0; i < bans.length; i++) {
                        const name = users[bans[i].userid].steamobj.personaname || bans[i].userid;
                        const opername = users[bans[i].operid].steamobj.personaname || bans[i].operid;

                        tbody.append(
                            '<tr>' +
                                '<td>' + name + '</td>' +
                                '<td>' + opername + '</td>' +
                                '<td>' + bans[i].serverid + '</td>' +
                                '<td>' + bans[i].unban + '</td>' +
                                '<td>' + bans[i].time + '</td>' +
                                '<td>' + bans[i].reason + '</td>' +
                                '<td>' +
                                    '<div class="quickactions" data-id=' + bans[i].userid + '>' +
                                        '<button class="bans_unbanply">解封</button>' +
                                    '</div>' +
                                '</td>' +
                            '</tr>'
                        )
                    }

                }
            },
            onerror : (err) => {
                console.log(err);
            }
        });



        // 解封玩家
        $('.bans_tab').on('click', '.bans_unbanply', function() {
            const banuserid = $(this).parent().data('id');

            console.log(banuserid);
            require.get({
                url : '/bans/' + banuserid + '/unban',
                onsuccess : (res) => {
                    if (res.succeed) {
                        $(this).parents('tr').remove();
                    }
                    console.log(res);
                },
                onerror : (err) => {
                    console.log(err);
                }
            })
        })
    })


    // 服务器详细页快捷操作
    // 封禁玩家、踢出玩家
    $('.players-table').on('click', '.player_ban, .player_kick', function() {
        const td = $(this).parent();
        const serverid = td.data('id');
        const playername = td.siblings('td').filter('#playerlist_name').html();

        console.log(serverid, playername);

        if ($(this).attr('class') === 'player_ban') {
            require.post({
                url : '/bans/banplayer',
                data : {
                    playername : playername,
                    serverid : serverid,
                    unban : 0,
                    reason : "none"
                },
                onsuccess : (res) => {
                    if (res.succeed) {
                        $(this).parents('tr').remove();
                    }
                    console.log(res);
                },
                onerror : (err) => {
                    console.log(err);
                }
            })            
        }
        if ($(this).attr('class') === 'player_kick') {
            require.post({
                url : '/servers/' + serverid + '/command',
                data : {
                    command : 'ulx kick ' + playername
                },
                onsuccess : (res) => {
                    if (res.succeed) {
                        $(this).parents('tr').remove();
                    }
                    console.log(res);
                },
                onerror : (err) => {
                    console.log(err);
                }
            })            
        } 

    })

})