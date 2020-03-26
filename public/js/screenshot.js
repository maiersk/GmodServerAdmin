/*jshint esversion: 6 */
$(() => {
	"use strict"; 
    const div = $('#Community .Community-Show #warp');
 
    // 所有截图
    $('.Community > a').click(() => {   
        require.get({
            url : '/screenshots/',
            onsuccess : (res) => {
                const images = res.data;
                if (res.succeed && images.length !== 0) {
                    div.parent().children('font').remove();
					if(div.children('.community_image').length===0){
						images.forEach((item) => {
							if (item.audit !== 0) {
									div.append(
										'<div class="community_image col-md-4" data-id=' + item.id + '>' +
											'<a href="#Community_image_info" class="community_image_entryinfo" data-toggle="tab">' + 
												'<img src="' + item.image + '">' +
											'</a>' +
											'<span>上传人: ' + users[item.userid].steamobj.personaname + '</span><br>' + 
											'<span>浏览量: ' + item.pv + '</span><br>' + 
											'<button class="community_image_del">删除</button><br>' +
										'</div>'
									);
								}
						});
					}
                }
//                console.log(res);
            },
            onerror : (err) => {
                console.log(err);
            }
        });
    });



    // 进入图片详细页/删除图片/通过审核点击事件
    $('.Community_body, .Community_images, .Community_audit, .Community_hot_image').on('click', '.community_image_entryinfo, .community_image_del, .community_image_check', function() {
        const imageid = $(this).parent().data('id');
        console.log(imageid);

        if ($(this).attr('class') === 'community_image_entryinfo') {
            const imageimg = $('#Community_image_info .community-image');
            const imgdesc = $('#Community_image_info .community-desc');
			const informationHeadimg = $(".information-head-img");
			const informationHeadname = $(".information-head-name");
			const informationHeadread = $(".information-body-read span");
            const editsubimt = $('#Community_image_info .community-editsubmit');

            require.get({
                url : '/screenshots/' + imageid,
                onsuccess : (res) => {
                    const imagedata = res.data;
					if (res.succeed) {
						imageimg.attr('src', imagedata.image);
						imgdesc.val(imagedata.description);
						informationHeadimg.attr('src',users[imagedata.userid].steamobj.avatar);
						informationHeadname.text(users[imagedata.userid].steamobj.personaname);
						informationHeadread.text(imagedata.pv);
					}
					console.log(res);
                },
                onerror : (err) => {
                    console.log(err);
                }
            });
  
  
  
            // 截图信息页内点击事件
            editsubimt.unbind('click');
            editsubimt.bind('click', () => {
    
                // 把数据转为formdata对象
                const obj = {
                    description : imgdesc.val(),
                };
                let formData = new FormData();
                $.each(obj, (key, value) => {
                    formData.append(key, value);
                });
                
                require.post({
                    url : '/screenshots/' + imageid + '/edit',
                    cache: false,
                    contentType: false,
                    processData: false,
                    data : formData,
                    onsuccess : (res) => {
                        if (res.succeed) {

                        }
                        console.log(res);
                    },
                    onerror : (err) => {
                        console.log(err);
                    }
                });
            });

        }
        if ($(this).attr('class') === 'community_image_check') {
            require.post({
                url : '/screenshots/' + imageid + '/checkimage',
                onsuccess : (res) => {
                    if (res.succeed) {
                        $(this).parent('.community_image').remove();
                    }
                    console.log(res);
                },
                onerror : (err) => {
                    console.log(err);
                }
            });
        }
        if ($(this).attr('class') === 'community_image_del') {
            require.get({
                url : '/screenshots/' + imageid + '/remove',
                onsuccess : (res) => {
                    if (res.succeed) {
                        $(this).parent('.community_image').remove();
                    }
                    console.log(res);
                },
                onerror : (err) => {
                    console.log(err);
                }
            });            
        }

        $(this).parent('.community_image').remove = () => {
            console.log('??');
        };
    });


    // 用户截图/审核截图
    $('.User .User_screenshot').click(() => {

        // 列出待审核截图
        const auditdiv = $('#User_screenshot .Community_audit');
        require.get({
            url : '/screenshots/',
            onsuccess : (res) => {
                if (res.succeed && res.data.length !== 0) {
                    const screenshots = res.data;

                    screenshots.forEach((item) => {
                        if (item.audit === 0) {
                            auditdiv.children('font, div').remove();
                            auditdiv.append(
                                '<div class="community_image col-md-4" data-id=' + item.id + '>' +
                                    '<a href="#Community_image_info" class="community_image_entryinfo" data-toggle="tab">' + 
                                        '<img src="' + item.image + '">' +
                                    '</a>' +
                                    '<span>上传人: ' + users[item.userid].steamobj.personaname + '</span><br>' + 
                                    '<span>浏览量: ' + item.pv + '</span><br>' + 
                                    '<button class="community_image_del">删除</button>' +
                                    '<button class="community_image_check">通过审核</button>' +
                                '</div>'
                            );
                        }
                    });
                }
                console.log(res);
            },
            onerror : (err) => {
                console.log(err);
            }
        });


        // 列出所有用户
        const list = $('#User_screenshot select');
        list.children().filter('option:gt(0)').remove();    // 排除第一项其余删除

        for (const key in users) {
            list.append(
                '<option value=' + key + '>' + users[key].steamobj.personaname + '</option>'
            );            
        }



        // 选中用户后列出用户的截图
        const imagesdiv = $('#User_screenshot .Community_images');
        imagesdiv.css('display', imagesdiv.css('display') == 'block' ? 'none' : 'none');

        list.unbind('change');
        list.bind('change', function() {
            const selectuser = $(this).val();
            
            require.get({
                url : '/screenshots/users/' + selectuser,
                onsuccess : (res) => {
                    if (res.succeed && selectuser != 0 ) {
                        const screenshots = res.data;
                        imagesdiv.children('div').remove();
                        imagesdiv.css('display', 'block');
                        
                        screenshots.forEach((item) => {
                            imagesdiv.append(
                                '<div class="community_image col-md-4" data-id=' + item.id + '>' +
                                    '<a href="#Community_image_info" class="community_image_entryinfo" data-toggle="tab">' + 
                                        '<img src="' + item.image + '">' +
                                    '</a>' +
                                    '<span>浏览量: ' + item.pv + '</span><br>' + 
                                    '<button class="community_image_del">删除</button>' +
                                '</div>'
                            )
                        })
                    } else {
                        imagesdiv.children('div').remove();
                    }
                    console.log(res);
                },
                onerror : (err) => {
                    console.log(err);
                }
            })
        })
    })


    // 上传截图提交按钮
    $('#upload_submit').click(() => {
        const description = $('.Community-upload textarea').val();
        const image = $('.Community-upload > #images > #files');

        // 把数据转为formdata对象
        const obj = {
            description : description,
            image : image[0].files[0]
        }
        let formData = new FormData();
        $.each(obj, (key, value) => {
            formData.append(key, value);
        })

        // console.log(description, image);
        
        require.post({
            url : '/screenshots/upload',
            cache: false,
            contentType: false,
            processData: false,
            data : formData,
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