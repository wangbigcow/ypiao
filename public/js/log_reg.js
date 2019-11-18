$(function(){
   // 登录时，如果记录的有数据就直接填充
   $("#login #phone").value=window.sessionStorage.getItem('phone');
   $("#login #upwd").value=window.sessionStorage.getItem('upwd');
   $("#login input#phone").focus();
  //判断是否敲击了Enter键 
$(document).keyup(function(e){ 
  if(e.keyCode == 13){ 
    $("#login #login_btn").trigger("click"); 
  } 
})
$(document).keyup(function(e){
  if(e.keyCode==9){
      if($("#login input#phone").focus()){
        $("#login input#phone").blur()
        $("#login input#upwd").focus()
        return;
      }
      if($("#login input#upwd").focus()){
        $("#login input#upwd").blur()
        $("#login input#phone").focus() 
        return;
      }
  }
})
/////////////////////////////////////////////////////登录
  $("#login_btn").click(function(){ 
    var phone = $("#login .dz-ipu-sj").val();//取值
    var upwd = $("#login .dz-ipu-mima").val();
    if(!phone){
        alert("用户名不能为空");
            $("#login .dz-ipu-sj").focus();//获取焦点
            return ;
    }
    if(!upwd){
        alert("密码不能为空");
            $("#login .dz-ipu-mima").focus();//获取焦点
            return ;
    }
  //发送ajax请求 使用post方式发送json字符串给后台login
  var param = {phone:phone,upwd:upwd};
  console.log(param); 
  $.ajax({
    type: "post",
    url: "http://127.0.0.1:8080/user/login",
    data:param,
    success: function(data){
    //接受返回的数据，前端判断采取的动作
    console.log(data);
      if(data){
        if(data=="-1"){
          alert('密码错误，请重新输入');
          window.location.href="login.html"; 
        }else{ 
          //https://www.cnblogs.com/chris-oil/p/9461760.html 
          let str=JSON.stringify(data); 
          window.sessionStorage.userInfo=str;
          
          alert('登陆成功');
          window.location.href="index.html";    
        }
      }
    }  
    });
  })
///////////////////////////////////////////////////////注册
//////////////////注册页面 各种用户输入  的验证
$("#register #phone").keyup(function(){
  var phone = $(this).val()
  var reg= /^1[34578]\d{9}$/
  if(reg.test(phone)){
    $("#phone+span").hide() 
    $("#phone+span").parent().addClass("on")
  }
  if(!reg.test(phone)){
    $("#phone+span").html("<i class='iconfont' style='color:red'>&#xe607;</i>输入手机号...").show()
    $("#phone+span").parent().removeClass("on")
  }
})
$("#register #phone").blur(function(){    
    var phone = $(this).val()
    var reg = /^1[34578]\d{9}$/
    if(phone=="" || phone==null){
       $("#phone+span").html("用户名不能为空").show();
        $("#phone+span").parent().removeClass("on");
        $("#phone").focus();
    }else if (!reg.test($("#phone").val())){
       $("#phone+span").html("请输入正确的手机号").show();
        $("#phone+span").parent().removeClass("on");
        $("#phone").focus();
   }else{
      $("#phone+span").hide();
      $("#phone+span").parent().addClass("on");
   }
});

$("#email").focus(function() {
  var reg = /\w+[@]{1}\w+[.]\w+/;
  if (!reg.test($("#email").val())){
    $("#email+span").html("请输入正确的email！");
    $("#email").focus();
  }
}).blur(function(){
   $("#emails").empty();
   var mail = $(this).val();
   if(mail==""|| mail==null){
    $("#email+sapn").html("邮箱不能为空");
     $("#email").empty(); 
  }
});



$("#register #upwd").keyup(function(){
  var upwd = $(this).val()
  var reg= /^([A-Z]|[a-z]|[0-9]){6,15}$/
  if(reg.test(upwd)){
    $("#upwd+span").hide() 
    $("#upwd+span").parent().addClass("on")
  }
  if(!reg.test(upwd)){
    $("#upwd+span").html("<i class='iconfont' style='color:red'>&#xe607;</i>6-15位 数字 或 字母 或 两者的组合...").show()
    $("#upwd+span").parent().removeClass("on")
  }
})
$("#register #upwd").blur(function(){ 
    var upwd = $(this).val();
    var reg= /^([A-Z]|[a-z]|[0-9]){6,15}$/
    //var reg= /^(?![^a-zA-Z]+$)(?!\D+$)(?![^_]+$).{6,15}$/;//6=15位数字 或 字母 或 下划线 的组合
    if(upwd==""|| upwd==null){
      $("#upwd+span").parent().removeClass("on")
       $("#upwd+span").html("密码不能为空").show()
                  
    }else if(!reg.test($("#upwd").val())){
        $("#upwd+span").parent().removeClass("on")
        $("#upwd+span").html("密码格式不正确").show()
        $("#upwd").empty()              
    }else{
        $("#upwd+span").hide()
        $("#upwd+span").parent().addClass("on")
    }
              
})
$("#register #cupwd").keyup(function(){
  var cupwd = $(this).val();
  var upwd=$("#upwd").val();
  if(cupwd===upwd){
    $("#cupwd+span").hide() 
    $("#cupwd+span").parent().addClass("on")
  }
  if(cupwd!=upwd){
    $("#cupwd+span").html("<i class='iconfont' style='color:red'>&#xe607;</i>再次输入密码中...").show()
    $("#cupwd+span").parent().removeClass("on")
  }
})
$("#register #cupwd").blur(function(){
  var cupwd = $(this).val()
  var upwd=$("#upwd").val()
  if(cupwd==""||cupwd==null){
      $("#cupwd+span").parent().removeClass("on")
      $("#cupwd+span").html("请重复输入密码").show()
  }else if(cupwd!=upwd){
      $("#cupwd+span").parent().removeClass("on")
      $("#cupwd+span").html("两次密码输入不一致").show()    
  }else{$("#cupwd+span").hide()
      $("#cupwd+span").parent().addClass("on")
  }
})
$("#register .dz-ipu.nik-l").blur(function(){             
   if($(this).val()==""||$(this).val()==null){         
      $(".nickname span.span1").html("请输入您的姓氏...").show()
       $(".dz-ipu.nik-l").focus();
   }else{
      $(".nickname span.span1").hide()                  
   }
})
$("#register .dz-ipu.nik-l").blur(function(){  
  var inpche = $(".nickname .gender input:checked").val()           
   if(inpche==null){         
      $(".nickname span.span2").html("请选择您的性别...").show()
   }else{
      $(".nickname span.span2").hide()                  
   }
})

//下面就是判断是否==的代码，无需解释
$("#register #yanzhengma").blur(function() {
  var oValue = $(".dz-ipu.dz-ipu-yzm-l").val().toUpperCase();
  if(oValue ==""){
    $("#yanzhengma").parent().removeClass("on");
    $(".yzm-msg").html("请输入验证码").show();
    
  }else if(oValue != $("#zc-yzm-cc").val()){
    $("#yanzhengma").parent().removeClass("on");
    $(".yzm-msg").html("验证码不正确，请重新输入").show();
   
  }else{
    $(".yzm-msg").hide();
    $("#yanzhengma").parent().addClass("on");
               
  }
})
//////////////////注册的   ajax
$("#register #reg_btn").click(function(){ 
  var phone = $("#register #phone").val();//取值
  var upwd = $("#register #upwd").val();
  var user_name= $("#register #user_name").val();
  var gender= $("#register .gender input:checked").val();

//发送ajax请求 使用post方式发送json字符串给后台login
  var param = {phone,upwd,user_name,gender};
  console.log(param); 
  $.ajax({
    type: "post",
    url: "http://127.0.0.1:8080/user/reg",
    data:param,
    success: function(data){
    //接受返回的数据，前端判断采取的动作
    
      if(data==="-1"){
        alert('注册失败');
        window.location.href="register.html"; 
      }
      if(data==="0"){
        alert('用户名已经注册，请登录');
        window.location.href="login.html"; 
      }
      
      if(data==="1"){         
        alert('注册成功');
        window.location.href="login.html";    
      }
    
  }  

})
})





})
