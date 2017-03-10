//----处理时间函数-----
var onMouseDownFlag=0;
var timeline_before_data = [];
var timeline_after_data = [];
var before_list =[];
var after_list =[];
var cursor_time ;
var timeindex;
var dirrection =1 ; //时间移动方向
var old_past_cursor_timeindex = -1;
var old_future_cursor_timeindex = -1;

function zeroPad(n, width) {
        var s = n.toString();
        var i = Math.max(width - s.length, 0);
        return new Array(i + 1).join("0") + s;
    }

function toLocalTime(cursor_time){
  var ss = cursor_time.toLocaleString();
  var s1 = ss.split(',')[0].split("/");
  var s2 = ss.split(',')[1].split(" ");


}

function DivFlying() {
  var div = document.getElementById("mouseTips");
  if (!div) {
 return;
  }
  var intX = window.event.clientX;
  //var intY = window.event.clientY;
  div.style.left = (intX - 82) + "px";
 // div.style.top = intY + "px";
}

function onPastTimelineClick(t){
  timeindex = before_list.indexOf(t);
  console.log("================timeindex is ",timeindex);
  cursor_time= new Date(t);
  if(old_past_cursor_timeindex >=0 && timeindex !=old_past_cursor_timeindex){
    var current_color = $($("#Timeline1 g rect")[old_past_cursor_timeindex]).css("fill");
    if(current_color != "rgb(255, 255, 0)"){
      $($("#Timeline1 g rect")[old_past_cursor_timeindex]).css({"fill":"rgb(0, 150, 136)"});
    }
    $($("#Timeline1 g rect")[old_past_cursor_timeindex]).attr({"y":13,"cy":23});
  }
  old_past_cursor_timeindex = timeindex;
  var current_color = $($("#Timeline1 g rect")[timeindex]).css("fill");
  //console.log(current_color)
  if(current_color == "rgb(0, 150, 136)"){
    $($("#Timeline1 g rect")[timeindex]).css({"fill":"red"});
  }
  $($("#Timeline1 g rect")[timeindex]).attr({"y":5,"cy":31})

  //

  //鼠标点击以后，右侧的未来时间条应该根据当前鼠标事件进行调整，由于目前我们只需要知道对应的小时，因此不需要重新加载时间条，只需要改变每个时间块对应的时间标注就行
  if(V.Time_Model.isHavefuture){
    $($("#Timeline2 g rect")).css({"fill":"green"});
  }
  var timess = caculate_time_str(cursor_time);//bjt-utc
  cursor_minutes = timess.minutes;
  cursor_hour = timess.hour
  $($("#Timeline2 g text")).each(function(i){
    var thishour = parseInt(cursor_hour) + i;
    if(parseInt(cursor_minutes) >= 50)thishour = thishour +1;
    if(thishour>23)thishour = thishour -23;

    $(this).text(Appendzero(thishour))
  })
  //console.log('当前选择时间为：'+cursor_time.toLocaleString());
  V.Time_Model.cursor_time = t;
  V.Obs_viewModel.radar_Model.search_file();
  V.Obs_viewModel.rmaps_Model.search_file();
  V.Obs_viewModel.aws_Model.search_file();



};


var scrollFunc=function(e){

  e=e || window.event;
  if(e.deltaY){//IE/Opera/Chrome
    if(e.deltaY>0)
    {
      dirrection = 1;
      $("#timeline1").empty();
      $("#timeline2").empty();
      pastTimeLine();
      futrueTimeLine();

    }else
    {
      dirrection = 0;
      $("#timeline1").empty();
      $("#timeline2").empty();
      pastTimeLine();
      futrueTimeLine();

    }
  }
 };


if(document.addEventListener){
  //adding the event listerner for Mozilla
   document.addEventListener("DOMMouseScroll" ,scrollFunc, false);
}
   //IE/Opera/Chrome
window.onmousewheel=document.onmousewheel=scrollFunc;




mytime = {};
mytime.default_time = function () {
   var current = new Date();
   var timess = caculate_time_str(current.getTime());//bjt-utc
   var new_current = new Date(parseInt(timess.fullYear),parseInt(timess.month)-1,parseInt(timess.day),parseInt(timess.hour),parseInt(timess.minutes),0,0);
   var oneMinute = 1000 * 60 ;
   var current_before_6h = new_current.getTime() - oneMinute * 60 * 6 ;
   var current_after_12h = new_current.getTime() + oneMinute * 60 * 12 ;
   before_list = [];
   for(var t=current_before_6h;t<new_current.getTime();){
       before_list.push(t);
       t = t + oneMinute;
   };
   after_list = [];
   for(var t=new_current.getTime();t<current_after_12h;){
       after_list.push(t);
       t =  t + 60*oneMinute;
   };
   return {"before_list":before_list,"after_list":after_list}

};


function pastTime(){

  if(dirrection ==1){offset = 1000 * 60 *60;}else{offset = -1000 * 60 *60;}

  if(before_list.length ==0){
      var default_time = mytime.default_time();
      before_list = default_time.before_list;
  }
  else{
    for(var i=0;i<before_list.length;i++){
       before_list[i] = before_list[i] + offset;
     };
  }

  timeline_before_data = [];
  var fisthour = 1;
  for(var i=0;i<before_list.length;i++){
      var vv = new Date(before_list[i]);
        if(vv.getMinutes() == 0){
          if(fisthour ==1){
            timeline_before_data.push({"starting_time":before_list[i],"ending_time": before_list[i]+1000*60,"color":"yellow","label":zeroPad(vv.getDate(),2)+'/'+zeroPad(vv.getHours(),2)});
          }else{
            timeline_before_data.push({"starting_time":before_list[i],"ending_time": before_list[i]+1000*60,"color":"yellow","label":zeroPad(vv.getHours(),2)});
          }
          fisthour = -1;
        }
        else{
               timeline_before_data.push({"starting_time":before_list[i],"ending_time": before_list[i]+1000*60,"color":"#009688"});
      };
  };

};



function futrueTime(){
  if(V.Time_Model.isHavefuture){var color = "green"}else{var color = "gray"}
  if(dirrection ==1){offset = 1000 * 60 *60;}else{offset = -1000 * 60 *60;}
  if(after_list.length ==0){
      var default_time = mytime.default_time();
      after_list = default_time.after_list;
  }else{
    for(var i=0;i<after_list.length;i++){
       after_list[i] = after_list[i] + offset;
   };
  }
  timeline_after_data = [];
  for(var i=0;i<after_list.length;i++){
    var vv = new Date(after_list[i]);
    timeline_after_data.push({"starting_time":after_list[i],"ending_time": after_list[i]+1000*60*60,"color":color,"label":zeroPad(vv.getHours(),2)});
  };
};




//过去6小时时间轴
function pastTimeLine(){
  pastTime();
  var width = (window.screen.availWidth-210-50)*0.6;
  var chart_before = d3.timeline()
        .width(width)
        .stack()
        .margin({left:5, right:3, top:-10, bottom:5})
        .itemMargin(3)
        .itemHeight(20)
        .showTodayFormat({marginTop:5 , marginBottom:5 , width:5 , color: "#ffff00"})
        .mouseover(function (d, i, datum) {
          cursor_time= new Date(d.starting_time);
            $("#mouseTips").html(cursor_time.toLocaleString());
         // $("#mouseTips").show();
          //  DivFlying();
        })
        .mouseout(function (d, i, datum){
          $("#mouseTips").hide();
        })
        .click(function (d, i, datum) {
          onPastTimelineClick(d.starting_time);
        })
        .scroll(function (x, scale) {
        });
  $("#timeline1").empty();
  var svg = d3.select("#timeline1").append("svg").attr("width", width)
           .datum([{times:timeline_before_data}]).call(chart_before);
  $($("#Timeline1 g text")).attr({"y":12});

};


function futrueTimeLine(){
    futrueTime();
    var width = (window.screen.availWidth-210-50)*0.4;
    var chart_after = d3.timeline()
      .width(width)
      .stack()
      .margin({left:1, right:5, top:-10, bottom:0})
      .itemHeight(20)
      .itemMargin(3)
      .hover(function (d, i, datum) {
        cursor_time= new Date(d.starting_time);
        timeindex = after_list.indexOf(d.starting_time);
        if(V.Time_Model.isHavefuture){
          if(old_future_cursor_timeindex >=0 ){
            $($("#Timeline2 g rect")[old_future_cursor_timeindex]).css({"fill":"green"});
          };
          old_future_cursor_timeindex = timeindex;
          $($("#Timeline2 g rect")[timeindex]).css({"fill":"red"});
          V.Time_Model.futuretimeindex = timeindex;
          V.Obs_viewModel.rmaps_Model.search_file();
        }
      })
      .mouseout(function (d, i, datum) {
        V.Time_Model.futuretimeindex = -1;
      })
      .click(function (d, i, datum) {
      })

$("#timeline2").empty();
  var svg = d3.select("#timeline2").append("svg").attr("width", width)
          .datum([{times:timeline_after_data}]).call(chart_after);

}






