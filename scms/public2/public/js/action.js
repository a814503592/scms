/*

这里写跟用户前端界面操作有关的函数
*/
var playorpausestate = "play";
var playLoopIdentity = null;
var auto_refreshID =null;
var auto_checkuserIdentity = null;
var userThis = null;
var ACTION = function(){

  function goNext(){

      V.Time_Model.cursor_time = V.Time_Model.cursor_time + V.Time_Model.timeStep;
      if(V.Time_Model.cursor_time <= before_list[before_list.length-1]){
/*         V.Obs_viewModel.radar_Model.search_file();
        V.Obs_viewModel.rmaps_Model.search_file();
        V.Obs_viewModel.aws_Model.search_file(); */
        onPastTimelineClick(V.Time_Model.cursor_time);
      }else{
        if(playLoopIdentity){
          clearInterval(playLoopIdentity)
        }
      }

  };

  function goPrev(){


      V.Time_Model.cursor_time = V.Time_Model.cursor_time - V.Time_Model.timeStep;
      if(V.Time_Model.cursor_time >= before_list[0]){
/*         V.Obs_viewModel.radar_Model.search_file();
        V.Obs_viewModel.rmaps_Model.search_file();
        V.Obs_viewModel.aws_Model.search_file(); */
        onPastTimelineClick(V.Time_Model.cursor_time);
      }else{
        if(playLoopIdentity){
          clearInterval(playLoopIdentity)
        }
      }

  };

  function goPlay(){



        if(playorpausestate == "play"){
          $("#icon_button_play").removeClass("icon_button_play").addClass("icon_button_pause");
          playorpausestate = "pause";
          //V.aws_Model.isSeleted = false;//
          goNext()
          playLoopIdentity = setInterval(goNext , 1000);
        }else{
          $("#icon_button_play").removeClass("icon_button_pause").addClass("icon_button_play");
          playorpausestate = "play";
          //V.aws_Model.isSeleted = true;
          clearInterval(playLoopIdentity)
        }

  };

function freshToBestTime(){
  //读取BestTime信息，将当前鼠标时间自动定位到该时间
  //自动更新时间条信息，？？
  before_list = [];
  after_list = [];
  pastTimeLine();
  futrueTimeLine();

  d3.json(V.Time_Model.BestTimeFile, function(error, data) {
    if (error) throw error;
    if(data){
      collection = data.toString()
      console.log("best time for vips4 data is ",collection)
      var year = parseInt(collection.slice(0,4));
      var month = parseInt(collection.slice(4,6))-1;
      var day = parseInt(collection.slice(6,8));
      var hour = parseInt(collection.slice(8,10));
      var minutes = parseInt(collection.slice(10,12));
      var t = new Date(year,month,day,hour,minutes,0,0);
      if(t.getTime() != V.Time_Model.last_bestTime.getTime()){
        console.log('V.Time_Model.last_bestTime',V.Time_Model.last_bestTime,'<---',t.getTime())
        V.Time_Model.cursor_time = t.getTime();
        V.Time_Model.last_bestTime = t;
        //console.log('t',t)

        onPastTimelineClick(V.Time_Model.cursor_time);
      };
    }

  });
}

function auto_refresh(){
  if(V.Time_Model.auto_refresh){
    auto_refreshID = setInterval(freshToBestTime , 1000*60);
  }else{
    clearInterval(auto_refreshID)
  }

}

function change_refresh(){
  if(V.Time_Model.auto_refresh){
    V.Time_Model.auto_refresh = false;
    clearInterval(auto_refreshID);
    $("#icon_button_refresh").removeClass("icon_button_refresh").addClass("icon_button_refreshstop");
  }else{
    V.Time_Model.auto_refresh = true;
    freshToBestTime();
    $("#icon_button_refresh").removeClass("icon_button_refreshstop").addClass("icon_button_refresh");
    }
}

function chooseAWScolor(s){
  if(s =="black")V.aws_Model.current_textcolor = ["white",s];
  if(s =="white")V.aws_Model.current_textcolor = ["black",s];
  if(s =="green")V.aws_Model.current_textcolor = ["white",s];
  if(s =="yellow")V.aws_Model.current_textcolor = ["black",s];
  if(s =="purple")V.aws_Model.current_textcolor = ["white",s];

  renderOnMap.drawingOnCanvas_103();
}

function adjust_awsFontSize(s){
  if(s==1)V.aws_Model.current_textFontSize = V.aws_Model.current_textFontSize + 1;
  if(s== -1)V.aws_Model.current_textFontSize = V.aws_Model.current_textFontSize -1;
  if(V.aws_Model.current_textFontSize <8)V.aws_Model.current_textFontSize=8;
  renderOnMap.drawingOnCanvas_103();
}

function userlogin(){
  $(".icon_User").click(function(){
    $('#modal-login').modal('show');
  });

  $("input[name='longLogin']").click(function(){
    // var path = 'http://172.16.40.73:7101';
    // var path = 'http://10.224.114.105:7101';
    var path = 'http://172.16.40.73:7101';

    var data = {name:$("input[name='name']").val(),password:$("input[name='password']").val()};
    $.ajax({
      url:path + "/longLogin",
      async:true,
      type:"get",
      dataType:"json",
      data:data,
      success:function(json) {
        if(json.success){
          console.log("logging... current user name=",json)
          $('#modal-login').modal('hide');
          console.log('准备接入聊天系统');
          if(userThis && userThis.name && json.data.name){
            window.location.reload();
          }else{
            // UI.InitChattyUi();
            chatInit();
          }
          // 记录当前用户
          userThis = json.data;
          console.log("*********begin to check the user status every 30s");
          current_userStatus();
        }else{
          console.log(json.data)
          alert('error')
        }
      },
      error:function(e){
        alert("Server "+e.statusText)
      }
    });
  });

  $("#regist_newuser").click(function(){
    alert('regist a new user');
    UI.InitRegistNewUser();

  })
};

function autoLoop_checkuser(){
  $.ajax({
    url:"http://172.16.40.73:7101/currentUser",
    async:false,
    type:"get",
    dataType:"json",
    success:function(json) {
      if(json._id){
        console.log("1--current user name=",json.name);
        console.log("1--start auto_checkuser");

      }else{
        console.log("2--no current user name=",json)
        if(auto_checkuserIdentity){
          console.log("2---close auto_checkuser");
          clearInterval(auto_checkuserIdentity);
        };
         $('#modal-login').modal('show');
      };
    },
    error:function(e){

     // alert('offline');
      if(auto_checkuserIdentity){
        console.log("close auto_checkuser because error");
        clearInterval(auto_checkuserIdentity);
      }
    }
  });
}
function current_userStatus(){
  $.ajax({
    url:"http://172.18.5.40:7101/currentUser",
    async:false,
    type:"get",
    dataType:"json",
    success:function(json) {
      if(json._id){
        console.log("1--current user name=",json.name);
        console.log("1--start auto_checkuser");
        alert('welcom back '+json.name);
        auto_checkuserIdentity = setInterval(autoLoop_checkuser , 1000*10);
      }else{
        console.log("2--no current user name=",json)
        if(auto_checkuserIdentity){
          console.log("2---close auto_checkuser");
          clearInterval(auto_checkuserIdentity);
        };
         $('#modal-login').modal('show');
      };
    },
    error:function(e){

     // alert('offline');
      if(auto_checkuserIdentity){
        console.log("close auto_checkuser because error");
        clearInterval(auto_checkuserIdentity);
      }
    }
  });
};

   return {
      goNext               : goNext,
      goPrev               : goPrev,
      goPlay               : goPlay,
      freshToBestTime      : freshToBestTime,
      auto_refresh         : auto_refresh,
      change_refresh       : change_refresh,
      chooseAWScolor       : chooseAWScolor,
      adjust_awsFontSize   : adjust_awsFontSize,
      userlogin            : userlogin,
      current_userStatus   : current_userStatus


  }
}
