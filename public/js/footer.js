$(function(){
    $.ajax({
        url:"footer.html",
        type:"get",
        success:function(res){
            $(res).replaceAll("footer")
            //动态创建一个 link元素 并将
            $(`<link rel="stylesheet" href="./css/footer.css">`).appendTo("head")
        }
    })
})