/*

  主程序入口
*/
function audioPlay(ele){
  var audio = $(ele).next()[0];
  // audio.pause();
  audio.play();
  }
function preview(e) {

        }

function testlogin(){
 alert('login');
  $.ajax({
			url:"http://172.18.5.40:7101/login",
			async:false,
			type:"post",
			dataType:"json",
			data:"",
			success:function(json) {
       alert(json)
      },
      error:function(e){alert('ddd')}

  })

}

$(function(){

  /*

  程序自动更新，修改任何js文件后，保持以后等待1-3秒，页面就会自动响应！！！！
  */



  // require('nw.gui').Window.get().evalNWBin(null, './app/v1.0.1/public/js/parse_engine.bin');
  // require('nw.gui').Window.get().evalNWBin(null, './app/v1.0.1/public/js/renderOnMap.bin');
  // parse_engine = parse_engine();
  V = VIPS_definition();
  // renderOnMap = renderOnMap() ;

  UI = UI() ;
  UI.InitWebUi();
  // V.WIN.maximize()



  UI.InitColorSpace();

  // renderOnMap.InitMap();
  // renderOnMap.mapsMouseMove();
  setInterval(showNowTime , 1000);
  showNowTime()

  ACTION = ACTION();
  ACTION.userlogin();
  ACTION.current_userStatus();
  $(".icon_button_next").click(function(){ACTION.goNext();});
  $(".icon_button_back").click(function(){ACTION.goPrev();});
  $("#icon_button_play").click(function(){ACTION.goPlay();});


  $(".icon_power").click(function(){
    //V.WIN.reload();
	 // V.WIN.close();

  });


  pastTimeLine();
  futrueTimeLine();

  AnyTime.picker('dateTimeField',
                 {"monthAbbreviations":['1','2','3','4','5','6','7','8','9','10','11','12'],
                  "dayAbbreviations":["日","一","二","三","四","五","六"],
                  "labelTitle":"日期和时间",
                  "labelHour":"小时",
                  "labelMonth":"月",
                  "labelYear":"年",
                  "labelDayOfMonth":"日",
                  format: "%Y-%m-%d %H"
                 });

  //关闭定时刷新功能
/*   ACTION.freshToBestTime();
  ACTION.auto_refresh(); */




  // kendo.bind($("#radar"), V.radar_Model);
  // kendo.bind($("#aws"), V.aws_Model);
  // kendo.bind($("#satellite"), V.satellite_Model);
  // kendo.bind($("#lighting"), V.lighting_Model);
  // kendo.bind($("#rmaps"), V.rmaps_Model);
  // kendo.bind($("#radarControl"), V.radar_Model);
  // kendo.bind($("#awsControl"), V.aws_Model);
  // kendo.bind($("#satelliteControl"), V.satellite_Model);
  // kendo.bind($("#lightingControl"), V.lighting_Model);
  // kendo.bind($("#rmapsControl"), V.rmaps_Model);



  $('#mydatasource').multiselect(
        {
          selectAllValue: 'multiselect-all',
          onChange: function(element, checked) {
            var current_choosen_datasource = $('#mydatasource').val();
            //var current_choosen_array = current_choosen_datasource.split(',');
            try{

              var index = current_choosen_datasource.indexOf("radar");
              if(index >=0){
                // V.radar_Model.set("isVisible",true)
                }
              else{
                // V.radar_Model.set("isVisible",false);
              }
            }catch(e){}
            try{
              var index = current_choosen_datasource.indexOf("aws");
              if(index >=0){
                // V.aws_Model.set("isVisible",true)
                }
              else{
                // V.aws_Model.set("isVisible",false);
              }}catch(e){}
/*           var index = current_choosen_datasource.indexOf("satellite");
            if(index >=0){
              V.satellite_Model.set("isVisible",true)
              }
            else{
              V.satellite_Model.set("isVisible",false);
            } */
            try{
              var index = current_choosen_datasource.indexOf("rmaps");
              if(index >=0){
                // V.rmaps_Model.set("isVisible",true)
                }
              else{
                // V.rmaps_Model.set("isVisible",false);
              }}catch(e){}

/*            var index = current_choosen_datasource.indexOf("lighting");
            if(index >=0){
              V.lighting_Model.set("isVisible",true)
              }
            else{
              V.lighting_Model.set("isVisible",false);
            } */

          }
        }
  );

  $(".icon_button_warning").click(function(){

      UI.InitWarningUi();
  })

  $(".icon_button_radar").click(function(){

      UI.InitObjectiveWarningUi();
  })

  // UI.InitChattyUi();
  chatInit();
  $("#icon_button_chat").click(function(){
    var thisWidth = Math.round(window.screen.availWidth);
    var thisHeight = Math.round(window.screen.availHeight);
    $('#modal-chat').css('top',(thisHeight-505)/2+'px')
    $('#modal-chat').css('left',(thisWidth-890)/2+'px')
    $('#modal-chat').toggle('normal')
  })
  $("#icon_check_user ").click(function(){
    
    $('#check_user').css('border','border:heavy solid red');
    $('#check_user').toggle('normal')
  })


  $("#showhide_panel").click(function(){
    $("#dataControl").toggle("slow");
  })

  $(".icon_bynow").click(function(){
    ACTION.freshToBestTime();
  })
  

  //===================================
  var center_lat = 39.808888;
  var center_lon = 116.471944;
  var angle = 315;
  var radial = Math.sqrt(230*230+230*230);
  // polarToLeafleatPoint(V.MAP_LEAF,center_lat,center_lon,angle,radial);
  var angle = 135;
  var radial = Math.sqrt(230*230+230*230);
  // polarToLeafleatPoint(V.MAP_LEAF,center_lat,center_lon,angle,radial);

})
