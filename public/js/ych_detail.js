$(function(){
    
var style=1;

$.ajax({                               
    type:"get",
    url:"http://127.0.0.1:8080/ticket/selectBystyle/"+style,       
    success:function(data){
        if(data=="-1"){
            alert("错误");
        }else{
            
        var htmlstr="";
        for(var i=0;i<=data.length;i++){
            var obj=data[i];
            console.log(obj);
            htmlstr+=`<div class="jieguo-xm">
            <a href="">
                <img class="l cc-haibao" src="" alt="">
            </a>
            <div class="l xm-l">
                <a class="cc-title" href="/t/">
                ${obj[tic_id]}
                </a>
                <span class="blc cc-time">
                
                </span>
                <span class="blc cc-changguan">
                </span>
            </div>
            <div class="r xm-r">
                <span class="r-dz"></span>
                <span class="cc-price">起</span>
                <a href="/t_61246/" class="blc" target="_blank">立即购买</a>
            </div>

        </div>`;}
        $(".all-xmu .l-jieguo .jieguo-jieguo ").html(htmlstr);
        
         
        }
                                                 
    }
    
}) 









})