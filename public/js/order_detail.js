$(function(){
    $(".wd-order-top .wd-order-top-ul li a").click(function(){
        $(this).parent().addClass("state-on").siblings().removeClass("state-on");
    
    })



    //页面表达相关js代码
    //优惠券页面cashier.html
    $(".zf-zffs-xz span").click(function(){
        $(this).addClass("on").siblings().removeClass("on");
    })
})


















