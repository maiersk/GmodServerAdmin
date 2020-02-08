Power = {}

Power.USER_UPLOADIMAGE = 'user_uploadimage';
Power.USER_DELIMAGE = 'user_delimage';
Power.USER_CHECKIMAGE = 'user_checkimage';
Power.USER_CHANGEGROUP = 'user_changegroup';
Power.USER_DEL = 'user_del';

Power.GROUP_DISPLAY = 'group_display'
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



//过滤输出需要的权限
Power.filter = function(filters) {
    let res = [];
    if (filters) {
        filters.forEach((filter) => {
            let prefix, suffix = filter.substring(filter.length - 2, filter.length);
            let all;
            // console.log(prefix, suffix);
            if (suffix === '_*') {
                prefix = filter.substring(0, filter.indexOf("_"));
            }
            if (prefix === '*' && suffix === '_*') {
                all = true;
            }

            for (let k in Power) {
                if (typeof Power[k] === 'function') { return; }
                if (all ||
                        Power[k] === filter ||
                        Power[k].indexOf(prefix) !== -1
                    ) {
                    res.push(Power[k]);
                }
            }
        });
    }
    return JSON.stringify(res);
}

// console.log(Power.filter(['*_*']))
// console.log(Power.filter([Power.GROUP_ADD, Power.GROUP_DEL, 'user_*']))
// console.log(Power.filter(['group_*', 'user_*', 'server_*']));

module.exports = Power;