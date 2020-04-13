Date.prototype.Format = function(fmt)   
{ //author: meizz   
  var o = {   
    "M+" : this.getMonth()+1,                 //月份   
    "d+" : this.getDate(),                    //日   
    "h+" : this.getHours(),                   //小时   
    "m+" : this.getMinutes(),                 //分   
    "s+" : this.getSeconds(),                 //秒   
    "q+" : Math.floor((this.getMonth()+3)/3), //季度   
    "S"  : this.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
}

$(() => {
    
    // 打印所有服务端
    const dashboardli = $('.Dashboard');

    dashboardli.click(() => {

        const serverdiv = $('.Dashboard_allserver')
        let serverlist = [];

        const getDashboardServer = (name, id, str) => {
            const div = $('<div>', {
                class : 'Dashboard_server col-xs-12 col-sm-12 col-md-4',
                'data-id' : id
            });
            const a = $('<a>', {
                class : 'server_moreinfo',
                href : '#Server_info',
                'data-toggle' : 'tab',
                text : name
            }) 
            const p = $('<p>', { text : '目前 ' });
            const font = $('<font>', {
                text : str
            })
            
            div.append(a);
            p.append(font);
            div.append(p);

            return div;
        }

        const dashboard_server_created = {};
        const dashboard_server = serverdiv.children('.Dashboard_server');
        dashboard_server.remove();

        require.get({
            url :'/servers/',
            async : false,
            onsuccess : (res) =>{
                serverlist = res.data;

                serverlist.forEach((server) => {
                    const div = getDashboardServer(server.name, server.id, '离线');
                    dashboard_server_created[server.id] = div;
                    serverdiv.append(div);
                })
            },
            onerror :(err) =>{
                console.log(err);
            }  
        });

        const fontid=$('.Dashboard_server').children('p').children('font');
        serverlist.forEach((server) => {
            require.get({
                url : '/servers/' + server.id + '/status',
                onsuccess : (res) => {
                    const serverinfo = res.data;
                    
                    if (res.succeed) {
                        const div = dashboard_server_created[server.id];
                        // console.log(div);
                        div.children('.server_moreinfo').html(serverinfo.name);
                        div.children('p').children('font').html('在线');
                        div.children('p').children('font').css("color","#708DFB");
                        //document.getElementById('fontid').style.color='#0e13b9';
                    } else {
                        console.log(res.massage);    
                    }
                },
                onerror : (err) => {
                    console.log(err);
                }
            })            
        })



        // 每周热门
        const hotimagediv = $('#Meter .Community_hot_image');
        
        hotimagediv.children('font, .community_image').remove();

        require.get({
            url : '/screenshots/',
            onsuccess : (res) => {
                if (res.succeed && res.data.length != 0) {
                    const screenshots = res.data;
                    const nowtime = new Date().getTime();

                    screenshots.forEach((item) => {
                        const time = item.id.substr(0, item.id.indexOf('-')) * 1;
                        // console.log((nowtime - time), time, nowtime);

                        if ((nowtime - time) <= (604800 * 1000) && item.pv >= 20) {
                            const uploadtime = new Date(time).Format('yyyy-MM-dd hh:mm:ss');

                            hotimagediv.append(
                                '<div class="community_image col-md-4" data-id=' + item.id + '>' +
                                    '<a href="#Community_image_info" class="community_image_entryinfo" data-toggle="tab">' + 
                                        '<img src="' + item.image + '">' +
                                    '</a>' +
                                    '<span>上传人: ' + users[item.userid].steamobj.personaname + '</span><br>' + 
                                    '<span>浏览量: ' + item.pv + '</span>' +
                                '</div>'
                            )
                        }
                    })
                }
                console.log(res);
            },
            onerror : (err) => {
                console.log(err);
            }
        })    
        
    })

    dashboardli.click();

})