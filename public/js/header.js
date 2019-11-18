$(function(){
    $.ajax({
        url:"header.html",
        type:"get",
        success:function(res){
            $(res).replaceAll("header")
            //动态创建一个 link元素 并将
            $(`<link rel="stylesheet" href="./css/header.css">`).appendTo("head")
        }
    })
})