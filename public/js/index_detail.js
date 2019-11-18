$(function(){

/*轮播图*/
var count = 0 ; //定义全局变量count来表示当前图片
function run(){
    count++;
    count = count ==3?0:count;
    $('.banner img').eq(count).fadeIn(300).siblings('img').fadeOut(300); //利用eq来遍历img，并将count位图片显示，其他兄弟元素隐藏，fadeIN位淡入显示，fadeOut为淡出
    $('.banner ul li').eq(count).css('background','#f40').siblings('li').css('background','#fff'); //同样利用遍历改变圆点的背景色
}
function reverserun(){
    count--;
    count = count == -1?2:count;
    $('.banner img').eq(count).fadeIn(300).siblings('img').fadeOut(300);
    $('.banner ul li').eq(count).css('background','#f40').siblings('li').css('background','#fff');
}
var timer = setInterval(run,2000); //设置定时器
$('.banner').hover(function(){ //设置鼠标移入移出事件
    clearInterval(timer);
    $('.right').fadeIn(300);
    $('.left').fadeIn(300);
},function(){
    timer = setInterval(run,2000);
    $('.right').fadeOut(300);
    $('.left').fadeOut(300);
})
$('.banner ul li').mouseenter(function(){ //设置移入圆点事件
    count = $(this).index();
    count = count ===3?0:count;
    $('.banner img').eq(count).fadeIn(300).siblings('img').fadeOut(300);
    $('.banner ul li').eq(count).css('background','#f40').siblings('li').css('background','#fff');
})
$('.banner .right').click(function(){ //设置右键按钮点击事件
    run();
})
$('.banner .left').click(function(){ //设置左键按钮点击事件
    reverserun();
})
//楼梯导航

//页面加载
$('.right').fadeOut(0);
$('.left').fadeOut(0);
$("#lt-menu").fadeOut("fast");  


//滚动条滚动事件
$(document).scroll(function() {
     t=window.pageYOffset;//获取滚动条距顶部距离
    var top = document.getElementById('lt-b');//获取固定顶栏的操作对象
    if(t>=parseFloat($("#lt-b").css("height"))){
            
            $("#lt-menu").fadeIn("slow");
    }else{ 
           
            $("#lt-menu").fadeOut("slow");//隐藏     
    }
    });

 //楼梯导航滚动效果
 
 /* 滚动监听 */
      // 定义一个获取所有模块的距离高度
      var arrOffsetTop = [
        $('#louti3').offset(),
        $('#louti4').offset(),
        $('#louti5').offset(),
        $('#louti6').offset(),
        $('#louti7').offset(),
        $('#louti8').offset()    
     ];

     // 获取每个div的平均高度
     var fTotalHgt = 0;
     for(var i=0; i<$('div').length; i++) {
        fTotalHgt += $('div').eq(i).outerHeight();
     }
     var fAverageHgt = parseFloat(fTotalHgt / $('div').length);

     // 滚动事件(每次滚动都做一次循环判断)
     $(window).scroll(function() {
        for(var i=0; i<$('div').length; i++) {
           if($(this).scrollTop() > arrOffsetTop[i] - fAverageHgt) {  // 减去一个固定值，是定位准确点
              $('ul li').eq(i).addClass('active').siblings().removeClass('active');
           }
        }
     });

  /* 点击事件 */
     $('ul li').click(function() {
        $(this).addClass('active').siblings().removeClass('active');
        $('body, html').animate({scrollTop: arrOffsetTop[$(this).index()]}, 500);
     });
////////////////////////////////////////////index 中的 遍历
function show(style){
    $.ajax({
        type:"get",
        url:"http://127.0.0.1:8080/ticket/select/"+style,       
        success:function(data){
            if(data=="-1"){
                alert("错误");
            }else{
                for(var i=0;i<data.length;i++){
                        var obj=data[i];
                        var itic_family_id=obj.itic_family_id;
                        $.ajax({                               
                            type:"get",
                            url:"http://127.0.0.1:8080/ticket/selectByid/"+itic_family_id,       
                            success:function(data){
                                
                                var dat=data[0];
                                var htmlstr="";
                                console.log(dat.tic_pic);
                                htmlstr+=`<div class="qs-cc">
                                            <div class="qs-cc-tt">                    
                                                <span class="haibao">
                                                <a href="yc_details.html?itic_family_id=${dat.tic_id}">
                                                    <img src="${dat.tic_pic}" class="haibao-img"/>
                                                </a>
                                                </span>
                                                <ul class="ico haibao-xx">
                                                    <li><i></i>${dat.tic_venue}</li>
                                                    <li><i></i>${dat.tic_time}</li>
                                                </ul>
                                            </div>
                                            <a href="#" class="cc-title slh qs-cc-haibao" target="_blank">${dat.tic_title}</a>
                                            <div class="cc-b">
                                                <span style="color: red">￥</span> <span class="cc-b-pri" style="color: red">${dat.itic_price}</span>
                                                <span>&nbsp;起</span>
                                                <span class="cc-b-ct">${dat.tic_location}</span>
                                            </div>
                                        </div>` 
                                  
                                        $(".yanchu").children().eq(dat.tic_style-1).children().children().eq(1).append(`${htmlstr}`);
                                                                         
                            }
                            
                        })                       
                }                 
            }
        }
    })

} 
function showzk(s){
    $.ajax({
        type:"get",
        url:"http://127.0.0.1:8080/ticket/select/"+s,       
        success:function(data){
            if(data=="-1"){
                alert("错误");
            }else{
                for(var i=0;i<data.length;i++){
                        var obj=data[i];
                        var itic_family_id=obj.itic_family_id;
                        $.ajax({                               
                            type:"get",
                            url:"http://127.0.0.1:8080/ticket/selectByid/"+itic_family_id,       
                            success:function(data){
    
                                let dat=data[0];
                                let htmlstr0="";
                                
                                htmlstr0+=`<div class="qs-cc">
                                <div class="qs-cc-tt">
                                        <span class="cc-tubiao ico">2${dat.tic_zk}折</span>
                                        <span class="haibao">
                                            <a href="yc_details.html?itic_family_id=${dat.tic_id}">
                                            <img src="${dat.tic_pic}" alt="" class="haibao-img"/>
                                            </a>
                                        </span>
            
                                        <ul class="ico haibao-xx">
                                            <li><i></i>${dat.tic_venue}</li>
                                            <li><i></i>${dat.tic_time}</li>
                                        </ul>
                                </div>
                                <a href="#" class="cc-title slh qs-cc-haibao" target="_blank">${dat.tic_title}</a>
                                <div class="cc-b">
                                    <span style="color: red">￥</span> <span class="cc-b-pri" style="color: red">${dat.tic_price[0]}</span>
                                    <span>&nbsp;起</span>
                                    <span class="cc-b-ct">${dat.tic_location}</span>
                                </div>
                            </div>` 
                                  
                                        $(".lb-qs.zkp .qs-c").append(`${htmlstr0}`);
                                                                         
                            }
                            
                        })                       
                }                 
            }
        }
    })  

}
 //////////////////////////////////////////////////////////////////////////////////////
  //index中的     ajax   交互

showzk(0);
show(1);
show(2); 
show(3); 
show(4);
show(5); 
show(6); 
    
})


 




   








