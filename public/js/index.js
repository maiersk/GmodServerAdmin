/*jshint esversion: 6 */
var listHas=0;
var i;
var i,arr=[],column,boxswidth,boxsHeight,showWidth,warpwidth,minheight,minindex,leftvalue;
var choiceOneF5,choiceThreeF5,choiceSevenF5;
var list = [1];

// JavaScript Document
$(window).ready(function(){
	"use strict";
	$(".wrapper-left").css("height",$(window).height()-80+"px");
	$(".wrapper-right").css("height",$(window).height()-80+"px");
	$("#vtab_small_div").css("display","none");
	
	scrollF5($('.Community_hot_image'),$(".Community_hot_image .community_image"),$(".Community_hot_image_show"));
	setTimeout(function(){
		$(".Dashboard").addClass("active");
		
		if($(window).width()<768){
			$(".rightul .glyphicon-align-justify").css("display","block");
			$(".creative_graphics").fadeOut();
		}else{
			$(".rightul .glyphicon-align-justify").css("display","none");
			$(".creative_graphics").fadeIn();
		}
	},1);
	
	
	$("i").each(function(){
		if($(this).hasClass("glyphicon-ok")){
			$(this).parent().css("border-left","4px solid rgb(62, 219, 117)");//绿色
		}else if($(this).hasClass("glyphicon-remove")){
			$(this).parent().css("border-left","4px solid rgb(219, 62, 76)");//红色
		}
	});
	
	$(".creative_graphics").click(function(){
		$(".creative_graphics").fadeOut();
	});
			
	$("#Setting_editBlacklist thead th input").change(function(){
		if($(this).prop("checked")){
			$("#Setting_editBlacklist tbody td:nth-child(1) input").each(function(){
				$(this).prop("checked",true);
			});
		}else{
			$("#Setting_editBlacklist tbody td:nth-child(1) input").each(function(){
				$(this).prop("checked",false);
			});
		}
	});
	$("#Setting_editData thead th input").change(function(){
		if($(this).prop("checked")){
			$("#Setting_editData tbody td:nth-child(1) input").each(function(){
				$(this).prop("checked",true);
			});
		}else{
			$("#Setting_editData tbody td:nth-child(1) input").each(function(){
				$(this).prop("checked",false);
			});
		}
	});
	$("#Setting_editData .body-table-green tr > td:nth-last-child(2)").each(function(){
		if($(this).text()==="未审核"){
		   $(this).css("color","#ffffff");
		}else if($(this).text()==="审核通过"){
		   $(this).css("color","rgb(62, 219, 117)");
		}else{
		   $(this).css("color","rgba(219,62,62,1.00)");
		}
	});
	$("#Admin_addJurisdiction td span").click(function(){
		if($(this).css("border-left")==="4px solid rgb(219, 62, 76)"){
			$(this).css("border-left","4px solid rgb(62, 219, 117)");//绿色
			$(this).children("i").removeClass("glyphicon-remove");
			$(this).children("i").addClass("glyphicon-ok");
		}else{
			$(this).css("border-left","4px solid rgb(219, 62, 76)");//红色
			$(this).children("i").removeClass("glyphicon-ok");
			$(this).children("i").addClass("glyphicon-remove");
		}	
	});

	$('.powers-checkboxlist').on('click', 'span', function() {
		if($(this).css("border-left")==="4px solid rgb(219, 62, 76)"){
			$(this).css("border-left","4px solid rgb(62, 219, 117)");//绿色
			$(this).children(':checkbox').attr('checked', true);
			$(this).children("i").removeClass("glyphicon-remove");
			$(this).children("i").addClass("glyphicon-ok");
		}else{
			$(this).css("border-left","4px solid rgb(219, 62, 76)");//红色
			$(this).children(':checkbox').attr('checked', false);
			$(this).children("i").removeClass("glyphicon-ok");
			$(this).children("i").addClass("glyphicon-remove");
		}		
	});

	$("#Setting_General td span").click(function(){
		if($(this).css("border-left")==="4px solid rgb(219, 62, 76)"){
			$(this).css("border-left","4px solid rgb(62, 219, 117)");//绿色
			$(this).children("i").removeClass("glyphicon-remove");
			$(this).children("i").addClass("glyphicon-ok");
		}else{
			$(this).css("border-left","4px solid rgb(219, 62, 76)");//红色
			$(this).children("i").removeClass("glyphicon-ok");
			$(this).children("i").addClass("glyphicon-remove");
		}
	});
	
	$("#upload_submit").click(function(){
		var fileList = $("#files")[0].files;
		if(fileList.length!==0){
			$("#myModal .modal-body").text("上传成功，请等待审核！");
			$("#ni").text(0);
			$("#fi").text(10);
			$("#list li").remove();
			$(".Community-upload > textarea").val("");
	    }else{
			$("#myModal .modal-body").text("请添加截图再上传！");
		}
	});
	$(".group-add-submit").click(function(){
		$("#myModal .modal-body").text("提交成功！");
	});
	$(".group-edit-submit").click(function(){
		$("#myModal .modal-body").text("编辑成功！");
	});
	$(".group-remove-submit").click(function(){
		$("#myModal .modal-body").text("删除成功！");
	});
	$(".addServer-submit").click(function(){
		$("#myModal .modal-body").text("提交成功！");
	});
	$(".editServer-submit").click(function(){
		$("#myModal .modal-body").text("提交成功！");
	});
	
	$(".rightul .glyphicon-align-justify").click(function(){
		$("#vtab_small_div").slideToggle();
	});
	
	$("#vtab_small>li").click(function(){
		if($(this).data("choice")==="choiceTwo" || 
			$(this).data("choice")==="choiceThree" ||
			$(this).data("choice")==="choiceFour" ||
			$(this).data("choice")==="choiceSix"
		){
			//选中按钮为choice Two、Three、Four、Five的情况，展开对应的ul并旋转i图标
			if($(".choice-"+$(this).data("choice")).css("display")==="none"){
				//判断是否为第一次选择
				//第一次选择的话i图标旋转为90deg，并展开对应ul
				allRetract();
				$(this).find(".chevron-right").css("transform","rotate(90deg)");
				$(".choice-"+$(this).data("choice")).slideDown();
			}else{
				//不是第一次选择的话i图标旋转回0deg，并收起对应ul
				$(this).find(".chevron-right").css("transform","rotate(0deg)");
				$(".choice-"+$(this).data("choice")).slideUp();
			}
		}else{
			$("#vtab_small_div").slideUp();
			//选中按钮不是为choice Two、Three、Four、Five的情况，收起所有的ul并旋转所有i图标回0deg
			allRetract();
			$(".nav ul>li").removeClass("active");
		}
	});
	
	
	$("#vtab_small>li li").click(function(){
		$("#vtab_small_div").slideUp();
	});
	
	$(".wrapper-left>ul>li").click(function(){
		if($(this).data("choice")==="choiceTwo" || 
			$(this).data("choice")==="choiceThree" ||
			$(this).data("choice")==="choiceFour" ||
			$(this).data("choice")==="choiceFive" ||
			$(this).data("choice")==="choiceSix"
		){
			//选中按钮为choice Two、Three、Four、Five的情况，展开对应的ul并旋转i图标
			if($(".choice-"+$(this).data("choice")).css("display")==="none"){
				//判断是否为第一次选择
				//第一次选择的话i图标旋转为90deg，并展开对应ul
				allRetract();
//				$(this).addClass("active");
				$(this).find(".chevron-right").css("transform","rotate(90deg)");
				$(".choice-"+$(this).data("choice")).slideDown();	
			}else{
				//不是第一次选择的话i图标旋转回0deg，并收起对应ul
				$(this).find(".chevron-right").css("transform","rotate(0deg)");
				$(".choice-"+$(this).data("choice")).slideUp();
			}
		}else{
			//选中按钮不是为choice Two、Three、Four、Five的情况，收起所有的ul并旋转所有i图标回0deg
			allRetract();
			$(".nav ul>li").removeClass("active");
//			$(this).addClass("active");
		}
	});
	
	
	//ul展开的a标签点击事件
	$(".wrapper-left>ul ul a").click(function(){
		//移除所有ul列表下的li active效果
		$(".nav ul>li").removeClass("active");
		//给当前选中的按钮添加active效果
		$(this).addClass("active");
		//给当前选中的按钮的大大大li父亲添加active效果
		$(this).parent().parent().parent().addClass("active");
	});
	
	//右边wrapper-right模块宽度
	resetWidth(".wrapper-right",window,0,240);
	
	
	//网页尺寸改变触发事件
	$(window).resize(function(){
		//网页尺寸改变wrapper-right模块调整宽度
		if($(window).width()<768){
			resetWidth(".wrapper-right",window,0,0);
			$(".rightul .glyphicon-align-justify").css("display","block");
		}else{
			$("#vtab_small_div").slideUp();
			resetWidth(".wrapper-right",window,0,240);
			$(".rightul .glyphicon-align-justify").css("display","none");
		}
		if($("#Meter > .tab-pane-body").width()<950){
			$(".creative_graphics").fadeOut();
		}else{
			$(".creative_graphics").fadeIn();
		}
		if($(window).height()<480){
			$(".version-marker").css("display","none");
		}else{
			$(".version-marker").css("display","block");
		}
		$(".wrapper-left").css("height",$(window).height()-80+"px");
		$(".wrapper-right").css("height",$(window).height()-80+"px");
		
		$(".search-input").each(function(index){
			resetWidth(".search-input",".search-div",index,54);
		});
		
		
		
	});
	
	
	var rightSOS = setInterval(function(){
		if($(document.body).width()<768){
			resetWidth(".wrapper-right",window,0,0);
		}else{
			resetWidth(".wrapper-right",window,0,240);
		}
		$(".search-input").each(function(index){
			resetWidth(".search-input",".search-div",index,54);
		});
//		console.log("rightSOS");
	},100);
	
	//allRetract()方法
	function allRetract(){
		//收起四个ul拓展列表
		$(".choice-choiceTwo").css("display","none");
		$(".choice-choiceThree").css("display","none");
		$(".choice-choiceFour").css("display","none");
		$(".choice-choiceFive").css("display","none");
		
		//所有i.chevron-right图标调整回0deg
		$(".chevron-right").css("transform","rotate(0deg)");
		
		//所有li选择项取消active效果
		$(".nav>li").removeClass("active");
	}
	
	
	
        //图片添加
		var y = [10];
		$("#files").change(function(){
            // 获取上传图片的个数
            var fileList = $("#files")[0].files;
            if(listHas<=9){
//				把input[type=file]里选择的图片传入y[]
                for (i = 0; i < fileList.length; i++) {
					y[listHas+i] = "<li><img src='"+window.URL.createObjectURL(fileList[i])+"'/></li>";
                }
				
//				把y[]里的图片打印出来
				if(listHas+fileList.length<=10){
					$("#list li").remove();
					for(i = 0; i < y.length; i++) {
						$("#list").append(y[i]);
                	}
					listHas+=fileList.length;
					$("#ni").text(listHas);
					$("#fi").text(10-listHas);
				}else{
					$("#list li").remove();
					for(i = 0; i < 10; i++) {
						$("#list").append(y[i]);
					}
					$("#ni").text(10);
					$("#fi").text(0);
				}
            }else{
                $("#ni").text(10);
                $("#fi").text(0);
            }
		});
	
		$("#Community .Community-upload #list").on("click","li",function(){
			for(i = $(this).index();i<9;i++){
				y[i]=y[i+1];
			}
			listHas--;
            if(listHas<=10 && listHas>-1){
				$("#ni").text(listHas);
				$("#fi").text(10-listHas);
			}else{
				listHas=9;
				$("#ni").text(9);
				$("#fi").text(1);
			}
			$(this).remove();
		});

});
	//自制-自适应宽度【两件制】
	function resetWidth(thisWidth,fatherWidth,i,notWantWidth){
			"use strict";
		$(thisWidth).eq(i).css("width",$(fatherWidth).eq(i).width()-notWantWidth+"px");
	}
	   
	
		// 主要瀑布流布局函数
/*		function waterfall(warp,boxes,show){
			"use strict";
			var Community_show = show;
			// 第一步:先获取能容纳的列数：窗口宽度/每列宽度
			// +20是外边距
			boxswidth=boxes.eq(0).width()+30;
			//窗口宽度
			showWidth=Community_show.width();
			//页面宽度能容纳的列数
			column=Math.floor(showWidth/boxswidth);
			// 顺便计算得出容器的宽度，让盒子居中
			warpwidth=column*boxswidth;
			warp.width(warpwidth);
			// 遍历每一个盒子
			for(i=0;i<boxes.length;i++){
				// 当i<column时，说明在第一行，把盒子的高度存入到数组里
				if(i<column){
					boxsHeight = boxes.eq(i).height();
					arr[i]=boxsHeight+20;
				}else{// 否则就是第二行，开始按最小高度插入图片到列中
					// 先获取最小高度列的索引
					var minheight=Math.min.apply(null,arr);
					var minindex=getMinIndex(minheight,arr);
					// 这里的leftvalue，是指最小高度列距离窗口左边的距离，相当于间接定位了这一列接下来要插入图片时，position定位的left值是多少
					var leftvalue=boxes.eq(minindex).position().left;
					setStyle(boxes.eq(i),minheight,leftvalue,i);
					// 到这里已经插入了一张图片在最低高度列，接下来要改变arr里的最低高度的值，让它继续下次遍历
					arr[minindex]+=boxes.eq(i).height()+20;
				}
			}
			$(".wrapper-right").scroll(function(event){
				scrollF5(warp,boxes,show);
			});
		}*/
		

		// 计算最小高度列的索引函数
		function getMinIndex(minheight,arr){
			"use strict";
			var minindex=arr.indexOf(minheight);
			return minindex;
		}

		//刷新布局的代码
		function scrollF5(warp,boxes,show){
			"use strict";
			arr=[];
			showWidth=show.width();
			boxswidth=boxes.eq(0).width()+30;
			column=Math.floor(showWidth/boxswidth);
			warpwidth=column*boxswidth;
//			console.log("column : "+column+",boxswidth : "+boxswidth+",warpwidth : "+warpwidth+",showWidth : "+showWidth+",boxswidth : "+boxswidth);
			warp.width(warpwidth);
			for(i=0;i<boxes.length;i++){
				boxsHeight = boxes.eq(i).height()+40;
				if(i<column){
					boxes.eq(i).css({
						 'position':'absolute',
						 'top':0,
						 'left':i*210
					 });
					arr[i]=boxsHeight;
				}else{
					minheight=Math.min.apply(null,arr);
					minindex=getMinIndex(minheight,arr);
					leftvalue=boxes.eq(minindex).position().left;
					boxes.eq(i).css({
						 'position':'absolute',
						 'top':minheight,
						 'left':leftvalue
					 });
					arr[minindex]+=boxsHeight;
				}
			}
			var maxheight=Math.max.apply(null,arr);
			warp.height(maxheight);
		}



$("#vtab_small>li").click(function(){
	"use strict";
	if($(this).data("choice")==="choiceOne"){
		list.forEach((item,index)=>{
			clearInterval(item);
		});
		list=[];
		choiceOneF5 = setInterval(function(){
			scrollF5($('.Community_hot_image'),$(".Community_hot_image .community_image"),$(".Community_hot_image_show"));
		},20);
		list.push(choiceOneF5);
	}else if($(this).data("choice")==="choiceThree"){
		list.forEach((item,index)=>{
			clearInterval(item);
		});
		list = [];
		choiceThreeF5 = setInterval(function(){
//			console.log("windowWidth : "+$(window).width());
//			console.log("Community_audit.width : "+$(".Community_audit").width());
			scrollF5($('#User_screenshot .Community_audit'),$("#User_screenshot .Community_audit .community_image"),$("#User_screenshot .Community_audit_show"));
			scrollF5($('#User_screenshot .Community_images'),$("#User_screenshot .Community_images .community_image"),$("#User_screenshot .Community_images_show"));
		},20);
		list.push(choiceThreeF5);
	}else if($(this).data("choice")==="choiceSeven"){
		list.forEach((item,index)=>{
			clearInterval(item);
		});
		list = [];
		choiceSevenF5 = setInterval(function(){
			scrollF5($('#Community .Community-Show #warp'),$("#Community .Community-Show .community_image"),$("#Community .Community-Show"));
		},20);
		list.push(choiceSevenF5);
	}else{
		list.forEach((item,index)=>{
			clearInterval(item);
		});
		list = [];
	}
});
$(".wrapper-left li").click(function(){
	"use strict";
	if($(this).data("choice")==="choiceOne"){
		list.forEach((item,index)=>{
			clearInterval(item);
		});
		list=[];
		choiceOneF5 = setInterval(function(){
			scrollF5($('.Community_hot_image'),$(".Community_hot_image .community_image"),$(".Community_hot_image_show"));
			$(".panel-information").height($("#Community_image_info .panel-default").height());
			resetWidth("#Community_image_info .panel-default","#Community_image_info .tab-pane-body",0,150);
		},20);
		list.push(choiceOneF5);
	}else if($(this).data("choice")==="choiceThree"){
		list.forEach((item,index)=>{
			clearInterval(item);
		});
		list = [];
		choiceThreeF5 = setInterval(function(){
//			console.log("windowWidth : "+$(window).width());
//			console.log("Community_audit.width : "+$(".Community_audit").width());
			scrollF5($('#User_screenshot .Community_audit'),$("#User_screenshot .Community_audit .community_image"),$("#User_screenshot .Community_audit_show"));
			scrollF5($('#User_screenshot .Community_images'),$("#User_screenshot .Community_images .community_image"),$("#User_screenshot .Community_images_show"));
			$(".panel-information").height($("#Community_image_info .panel-default").height());
			resetWidth("#Community_image_info .panel-default","#Community_image_info .tab-pane-body",0,150);
		},20);
		list.push(choiceThreeF5);
	}else if($(this).data("choice")==="choiceSeven"){
		list.forEach((item,index)=>{
			clearInterval(item);
		});
		list = [];
		choiceSevenF5 = setInterval(function(){
			scrollF5($('#Community .Community-Show #warp'),$("#Community .Community-Show .community_image"),$("#Community .Community-Show"));
			$(".panel-information").height($("#Community_image_info .panel-default").height());
			resetWidth("#Community_image_info .panel-default","#Community_image_info .tab-pane-body",0,150);
		},20);
		list.push(choiceSevenF5);
	}else{
		list.forEach((item,index)=>{
			clearInterval(item);
		});
		list = [];
	}
});

$("#testBtn").click(function(){
	"use strict";
//	alert($(".wrapper-left .active").data("choice"));
	console.log(list);
	console.log(list[0]);
	console.log(typeof(list[0]));
});