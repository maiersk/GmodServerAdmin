// 全局所有权限组
let groups = {}

require.get({
    url : '/groups/',
    async : false,
    onsuccess : (res) => {
        if (res.succeed) {
            const tempgroups = res.data;
            tempgroups.forEach((item) => {
                groups[item.id] = item;
            })
        }
        // console.log(res);
    },
    onerror : (err) => {
        console.log(err);
    }
})

// console.log(groups);

$(() => {

    let Power = {}

    Power.USER_UPLOADIMAGE = 'user_uploadimage';
    Power.USER_DELIMAGE = 'user_delimage';
    Power.USER_CHECKIMAGE = 'user_checkimage';
    Power.USER_CHANGEGROUP = 'user_changegroup';
    Power.USER_DEL = 'user_del';
    
    Power.GROUP_DISPLAY = 'group_display';
    Power.GROUP_ADD = 'group_add';
    Power.GROUP_EDIT = 'group_edit';
    Power.GROUP_DEL = 'group_del';
    
    Power.SERVER_ADD = 'server_add';
    Power.SERVER_EDIT = 'server_edit';
    Power.SERVER_DEL = 'server_del';
    Power.SERVER_COMMAND = 'server_command';
    
    Power.RULE_ADD = 'rule_add';
    Power.RULE_EDIT = 'rule_edit';
    Power.RULE_DEL = 'rule_del';
    
    Power.PLAYER_SERVERBANS = 'player_serverbans';
    Power.PLAYER_BAN = 'player_ban';
    Power.PLAYER_UNBAN = 'player_unban';
    Power.PLAYER_KICK = 'player_kick';

    const translationPowers = {};
    translationPowers[Power.USER_UPLOADIMAGE] = '用户上传游戏截图';
    translationPowers[Power.USER_DELIMAGE] = '用户截图删除';
    translationPowers[Power.USER_CHECKIMAGE] = '用户截图审核';
    translationPowers[Power.USER_CHANGEGROUP] = '用户更改权限组';
    translationPowers[Power.USER_DEL] = '用户删除数据';

    translationPowers[Power.GROUP_DISPLAY] = '后端管理相关可见';
    translationPowers[Power.GROUP_ADD] = '权限组添加';
    translationPowers[Power.GROUP_EDIT] = '权限组编辑';
    translationPowers[Power.GROUP_DEL] = '权限组删除';

    translationPowers[Power.SERVER_ADD] = '服务端添加';
    translationPowers[Power.SERVER_EDIT] = '服务端编辑';
    translationPowers[Power.SERVER_DEL] = '服务端删除';
    translationPowers[Power.SERVER_COMMAND] = '服务端命令发送';

    translationPowers[Power.RULE_ADD] = '服务端规则添加';
    translationPowers[Power.RULE_EDIT] = '服务端规则编辑';
    translationPowers[Power.RULE_DEL] = '服务端规则删除';
    
    translationPowers[Power.PLAYER_SERVERBANS] = '服务端封禁列表';
    translationPowers[Power.PLAYER_BAN] = '封禁服务端玩家';
    translationPowers[Power.PLAYER_UNBAN] = '解封服务端玩家';
    translationPowers[Power.PLAYER_KICK] = '踢出服务端玩家';

    

    //无权限用户无法浏览选项
    require.get({
        url : '/groups/' + user.groupid,
        onsuccess : (res) => {
            if (res.succeed) {
                const group = res.data;

                let powersjson = {};
                group.powers.forEach((power) => {
                    powersjson[power] = power;
                })
                
                console.log(powersjson);

                if (!powersjson[Power.USER_DEL] && !powersjson[Power.USER_CHANGEGROUP]) {
                    $('.User .User_all').css('display', 'none');
                }
                if (!powersjson[Power.USER_DEL]) {
                    $('#Player_allPlayer .user_remove').css('display', 'none');
                }
                if (!powersjson[Power.USER_CHANGEGROUP]) {
                    $('#Player_allPlayer .user_editgroupid').css('display', 'none');
                }

                if (!powersjson[Power.GROUP_EDIT] && !powersjson[Power.GROUP_DEL]) {
                    $('.Group').css('display', 'none');
                }
                if (!powersjson[Power.GROUP_ADD]) {
                    $('.Group .Admin_addJurisdiction').css('display', 'none');
                }
                if (!powersjson[Power.GROUP_EDIT]) {
                    $('.Group .Admin_editJurisdiction').css('display', 'none');
                }
                if (!powersjson[Power.GROUP_DEL]) {
                    $('#Admin_editJurisdiction .group-remove-submit').css('display', 'none');
                }

                if (!powersjson[Power.SERVER_ADD]) {
                    $('.Server .Server_addServer').css('display', 'none');
                }
                if (!powersjson[Power.SERVER_EDIT]) {
                    $('.Server .Server_editServer').css('display', 'none');
                }
                if (!powersjson[Power.SERVER_DEL]) {
                    $('.Server').css('display', 'none');
                }
                if (!powersjson[Power.SERVER_COMMAND]) {
                    $('#Server_info .server-rcon').css('display', 'none');
                }

                if (!powersjson[Power.PLAYER_BAN]) {
                    $('#Server_info .player_ban').css('display', 'none'); 
                }
                if (!powersjson[Power.PLAYER_KICK]) {
                    $('#Server_info .player_kick').css('display', 'none');
                }

            } else {
                $('.User').css('display', 'none');
                $('.Server').css('display', 'none');
                $('.Group').css('display', 'none');

                // $('#server_info .server-editrule').css('display', 'none');
                // $('#server_info .server-delrule').css('display', 'none');
                $('#Server_info .server-rcon').css('display', 'none');
                $('#Server_info .player_ban').css('display', 'none'); 
                $('#Server_info .player_kick').css('display', 'none');
            }

            console.log(res);
        },
        onerror : (err) => {
            console.log(err);
        }
    })



    const displayPowers = (tabElem) => {
        require.get({
            url : '/groups/powers',
            onsuccess : (res) => {
                if (res.succeed) {
                    const powerList = res.data;
                    // console.log(powerList);
                    
                    tabElem.children('span').remove();

                    for (let i = 0; i < powerList.length; i++) {
                        tabElem.append(
                            '<span class="col-md-6 col-sm-12 col-xs-12">' +
                                '<i class="glyphicon glyphicon-remove"></i>' +
                                '<input style="display: none;" type="checkbox" name="' + powerList[i] + '">' +
                                '<font>' + translationPowers[powerList[i]] + '</font>' +
                            '</span>'
                        )
                    }
                }
            },
            onerror : (err) => {
                console.log(err);
            }
        });
    };

    const add_powersdiv = $('#Admin_addJurisdiction .powers-checkboxlist');

    // 添加权限组点击事件
    $('.groups > .Admin_addJurisdiction').click(() => {
        displayPowers(add_powersdiv);
    });

    // 添加权限组提交按钮点击事件
    $('#Admin_addJurisdiction .group-add-submit').click(() => {
        const groupname = $('#Admin_addJurisdiction .group-add-name').val();
        const span = add_powersdiv.children('span');
        const checkeds = span.children(':checked');
        let powers = [];

        checkeds.each((i, item) => {
            powers.push(item.name);    
        });
        
        console.log(groupname, powers);

        require.post({
            url :'/groups/create',
            data:{
                name : groupname,
                powers: powers
            },
            onsuccess : (res) => {
                if (res.succeed) {
                    console.log('添加成功');
                    return;
                }
                console.log(res);
            },
            onerror : (err) =>　{
                console.log(err);
            }
        });

    });



    // 编辑权限组点击事件
    $('.groups .Admin_editJurisdiction').click(() =>{
        const list = $('#Admin_editJurisdiction select');
        // 排除第一项其余删除
        list.children().filter('option:gt(0)').remove();

        const editdiv = $('#Admin_editJurisdiction .Group_editvalue');
        if (editdiv.css('display') === 'block') {
            editdiv.css('display', 'none');
        }

        require.get({
            url : '/groups/',
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
    });

    const edit_powersdiv = $('#Admin_editJurisdiction .powers-checkboxlist');

    // select选中事件
    $('#Admin_editJurisdiction select').bind('change', function() {
        const groupid = $(this).val();
        const editdiv = $('#Admin_editJurisdiction .Group_editvalue');

        displayPowers(edit_powersdiv);

        const name = $('#Admin_editJurisdiction .group-edit-name');
        
        require.get({
            url : '/groups/' + groupid,
            onsuccess : (res) => {
                if (res.succeed && groupid != 0) {
                    editdiv.css('display', 'block');
                    const span = edit_powersdiv.children('span');
                    const checkboxs = span.children(':checkbox');
                    const group = res.data;

                    name.val(group.name);
                    console.log(group);

                    group.powers.forEach(power => {
                        checkboxs.each(function(i, item) {
                            if (power === item.name) {
                                $(this).parent().click();
                            }
                        })
                        // console.log(power);
                    });

                } else {
                    editdiv.css('display', 'none');
                }
            },
            onerror : (err) => {
                console.log(err);
            }
        });
    });



    // 提交编辑按钮点击事件
    $('#Admin_editJurisdiction .group-edit-submit').click(() =>{
        const groupid = $('#Admin_editJurisdiction select').val();
        const name = $('#Admin_editJurisdiction .group-edit-name').val();
        const span = edit_powersdiv.children('span');
        const checkeds = span.children(':checked');
        // console.log(checkeds);
        
        let powers = [];

        checkeds.each((i, item) => {
            powers.push(item.name);    
        });
        
        require.post({
            url :'/groups/' + groupid + '/edit',
            data : {
                name : name,
                powers : powers
            },
            onsuccess : (res) =>{
                if (res.succeed) {
                    
                }
                console.log(res);
            },
            onerror : (err) =>{
                console.log(err);
            }
        });
    });
    
    // 删除此组按钮点击事件
    $('#Admin_editJurisdiction .group-remove-submit').click(() =>{
        const groupid = $('#Admin_editJurisdiction select').val();

        require.get({
            url :'/groups/' + groupid + '/remove',
            onsuccess : (res) =>{
                if (res.succeed) {

                }
                console.log(res);
            },
            onerror : (err) =>{
                console.log(err);
            }
        });
    });

})