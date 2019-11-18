

$(function(){
    $(".xz-changci .changci").on("click","li",function(){
        $(this).addClass("xz-on").siblings().removeClass("xz-on");
    })
    $(".xz-piaodang .piaodang").on("click","li",function(){
        $(this).addClass("xz-on").siblings().removeClass("xz-on");
    })
    $(".xz-number .number").on("click","li",function(){
        $(this).addClass("xz-on").siblings().removeClass("xz-on");
    })
//////////////////////////////////////////////////////////////////////////////////////
//yc_detail.html  中的     ajax   交互  
  
//字符串 转 数组 转 对象
function strToObj(str){
    let obj={};
    if(str.indexOf("@")==-1){
        let st=str.split(",");
        for(let i=0;i<st.length;i++){ 
            obj[i]=st[i];    
        }          
    }else{
        let st=str.split("@");
        let arr=[];
        for(let i=0;i<st.length;i++){ 
            arr[i]=st[i].split(",");
        }               
        for(let i=0;i<arr.length;i++){ 
            obj[i]=arr[i];    
        }
    }
    return obj;
    
} 
function strToArr(str){
    let arr=[];
    if(str.indexOf("@")==-1){
        let st=str.split(",");
        let arr0=st;
        arr[0]=arr0;    
              
    }else{
        let st=str.split("@");
        let arr0=[];
        for(let i=0;i<st.length;i++){ 
            arr0[i]=st[i].split(",");
        }               
        for(let j=0;j<arr0.length;j++){ 
            arr[j]=arr0[j];    
        }
    }
    return arr;
    
} 

var itic_family_id=window.location.search.slice(1).split("=")[1];


//详情页面 头部详情的显示
function bysty(s){
    let style=["折扣票","演唱会","音乐会","话剧歌剧","舞蹈芭蕾","曲苑杂坛","度假休闲"];
    let style_href=["zkp.html","yanchanghui.html","yinyuehui.html","huajugeju.html","wudaobalei.html","quyuanzatan.html","dujaxiuxian.html"];
    $(".older-jc a:nth-child(2)").html(`${style[s]}`).attr("href",`${style_href[s]}`);
}
$.ajax({
    type:"get",
    url:"http://127.0.0.1:8080/ticket/selectByid/"+itic_family_id,       
    success:function(data){
        if(data=="-1"){
            alert("错误");
        }else{
            var obj=data[0]; 
            bysty(obj.tic_style);
            $(".older-jc a:nth-child(3)").html(`${obj.tic_title}`)
            ///////////////////////////////////////////////////////     
            var htmlstr_top=` 
                    <img src="${obj.tic_pic}" alt="">
                    <div class="w-xinxi">
                        <p class="cc-title">${obj.tic_title}</p>
                        <p>时间：<span class="cc-time">${obj.tic_time}</span></p>
                        <p>场馆：<span class="cc-changguan">${obj.tic_venue}</span></p>
                        <input id="collect" class="like on" type="checkbox" style="display:none" ><label for="collect"><i class="iconfont">&#xe602;</i></label>
                        <input id="like" class="like on" type="checkbox" style="display:none" ><label for="like"><i class="iconfont">&#xe604;</i></label>
                    </div>`
            $(".details-top .top-w").prepend(htmlstr_top);

           var arr_seasons = strToArr(obj.tic_seasons)
           var arr_schedule = strToArr(obj.tic_schedule)
           var arr_number = strToArr(obj.tic_number)
           var arr_price = strToArr(obj.tic_price)
           console.log(arr_seasons);//场次
           console.log(arr_schedule);//票档  
           console.log(arr_number);  
           console.log(arr_price);      
            ////////////////////////////////////页面初始化的时候先显示的部分    
           var htmlstr_changci="";
           for(var k in arr_seasons[0]){
                htmlstr_changci+=`<li class="changci-on">${arr_seasons[0][k]}
                <input  style="display:none" value="${k}"></li>`  
            }
            $(".details .details-l .l-fenlei .xz-changci .changci").html(htmlstr_changci)           
            
            var htmlstr_piaodang="";
            for(var j in arr_schedule[0]){
                console.log(arr_schedule[0][j]);//票档  
                htmlstr_piaodang+=`<li class="piaodang-o">${arr_schedule[0][j]}
                <input  style="display:none" value="${j}"></li>`
            } 
            $(".details .details-l .l-fenlei .xz-piaodang .piaodang").html(htmlstr_piaodang)

            let htmlstr_number="";
                    let number =arr_number[0][0]
                   
                    if(number>=6){
                        for(let l=1;l<=6;l++){
                            htmlstr_number+=`<li class=" number-o ">
                            ${l}<input style="display:none" value="${l}">
                            </li>`;
                        } 
                    }else if(number>=1){
                        for(let l=1;l<=number;l++){
                            htmlstr_number+=`<li class=" number-o ">
                            ${l}<input style="display:none" value="${l}">
                            </li>`;
                        }}else{
                        htmlstr_number+=`<li class=" number-o " style="user-select:none !important;background-color:#eee !important;">0<input style="display:none" value="0">
                        </li>`;
                    }
                        $(".details .details-l .l-fenlei .xz-number .number").html(htmlstr_number)


               ////////////////////////////////////页面初始化的时候先显示的部分     

           $(".details .details-l .l-fenlei .xz-changci .changci").on("click","li",function(){
               
               let val_session=$(this).children().val();
               console.log(val_session);
               let htmlstr_piaodang=""; 
                for(let j in arr_schedule[val_session]){
                    htmlstr_piaodang+=`<li class="piaodang-o">${arr_schedule[val_session][j]}
                    <input  style="display:none" value="${j}"></li>`
                } 

                $(".details .details-l .l-fenlei .xz-piaodang .piaodang").html(htmlstr_piaodang)

                $(".details .details-l .l-fenlei .xz-piaodang .piaodang").on("click","li",function(){
                    let val_schedule=$(this).children().val();
                    
                    let htmlstr_number="";
                    let number =arr_number[val_session][val_schedule]
                    console.log(number);
                    if(number>=6){
                        for(let l=1;l<=6;l++){
                            htmlstr_number+=`<li class=" number-o ">
                            ${l}<input style="display:none" value="${l}">
                            </li>`;
                        } 
                    }else if(number>=1){
                        for(let l=1;l<=number;l++){
                            htmlstr_number+=`<li class=" number-o ">
                            ${l}<input style="display:none" value="${l}">
                            </li>`;
                        }}else{
                        htmlstr_number+=`<li class=" number-o " style="user-selected:none;background-color:#eee !important;">0<input style="display:none" value="0">
                        </li>`;
                    }
                        $(".details .details-l .l-fenlei .xz-number .number").html(htmlstr_number)                   
                                        
                })
                
                

           })
            
            
            
            
                    
                   
                


























               
               
            
                }
            }
        })
    })





