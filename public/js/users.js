// 全局所有用户
let users = {}

require.get({
    url : '/users/',
    async : false,
    onsuccess : (res) => {
        if (res.succeed) {
            const tempusers = res.data;
            tempusers.forEach((item) => {
                users[item.id] = item;
            })
        }
        // console.log(res);
    },
    onerror : (err) => {
        console.log(err);
    }
})

// console.log(users);

$(() => {

    // 显示所有用户
    $('.User .User_all').click(() => {
        const userstab = $('.users_tab');
        const tbody = userstab.children('tbody');

        require.get({
            url : '/users/',
            onsuccess : (res) => {
                if (res.succeed) {
                    const users = res.data;
                    console.log(users);

                    tbody.children('tr').remove();

                    for (let i = 0; i < users.length; i++) {
                        tbody.append(
                            '<tr>' +
                                '<td>' + users[i].steamobj.personaname + '</td>' +
                                '<td>' + groups[users[i].groupid].name + '</td>' +
                                '<td>' +
                                    '<div class="quickactions" data-id=' + users[i].id + '>' +
                                        '<select class="user_editgroupid">' +
                                            '<option value = 0>修改权限组</option>' +
                                        '</select>' +
                                        '<button class="user_remove">删除用户和数据</button>' +
                                    '</div>' +
                                '</td>' +
                            '</tr>'
                        )
                    }

                    for (const key in groups) {
                        $('.user_editgroupid').append(
                            '<option value=' + key + '>' + groups[key].name + '</option>'
                        )
                    }
                }
            },
            onerror : (err) => {
                console.log(err);
            }
        });
    })


    
    // 编辑用户权限组
    $('.users_tab').on('change', '.user_editgroupid', function() {
        const userid = $(this).parent().data('id');
        const selectgroupid = $(this).val();
        // console.log(selectgroupid);

        if (selectgroupid == 0) { return; }
        
        require.post({
            url : '/users/' + userid + '/editgroupid',
            data : {
                groupid : selectgroupid
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



    // 删除用户
    $('.users_tab').on('click', '.user_remove', function() {
        const userid = $(this).parent().data('id');
        
        require.get({
            url : '/users/' + userid + '/remove',
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