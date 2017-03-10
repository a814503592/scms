//在这里定义整个项目中均要使用的全局viewModel,并将其绑定到特定的DOM对象上
//2015-12-30

var VIPS_definition = function(){




  //-------时间类------------------------------------------------
  var Time_Model = kendo.observable({
    //var aa = new Date().getTime();
    cursor_time : new Date().getTime() - 1000*60*5,//当前鼠标选择的时间
    isEnabled : true,
    timeStep : 1000*60*5, //5,
    isHavefuture : true,  //是否开启RAMPS-IN未来12小时预报时间条功能
    futuretimeindex : -1,
    pasttimeindex : -1,
    auto_refresh : true,
    BestTimeFile : "http://10.224.97.38:8080/public2/VIPS_BEST_VALID_TIME.TXT",
    last_bestTime : new Date()

  });



  //----------自动站类------------------------------------------------------------------------------------------
  var aws_Model = kendo.observable({
          isEnabled: true,  //是否开启了该功能
          isVisible: true,  //在在地图上
          isSeleted: true,  //是否选择了观测类资料中的任意一项资料
          awsdataset : [],
          showType : "point",//以站点数据形式显示
          current_category : "当前温度",
          elements : ["温度","降水","相对湿度","风","极大风","能见度","积雪深度"],
          refresh_timeInterval : 60000,//单位毫秒，0-表示不会自动更新
          datapath :"http://10.224.97.38:8080/public2/smart_vips/aws_geojson",
          datapaths :["H:/VIPS4.0/localdata/BEPK","H:/VIPS4.0/localdata/BEHT","H:/VIPS4.0/localdata/BESZ","H:/VIPS4.0/localdata/BETY","H:/VIPS4.0/localdata/BETJ"],//"F:/VIPS4.0/localdata/awsZ/bepk",//
          current_file : "",
          current_files :["","","","",""],
          current_time :"",
          current_textcolor:["black","white"],
          current_textFontSize: 14,
           toggle_show: function () {
             this.isSeleted?$("#aws a").removeClass("icon_button_show_eye").addClass("icon_button_close_eye"):$("#aws a").removeClass("icon_button_close_eye").addClass("icon_button_show_eye");
             if(this.isSeleted){
               this.set("isSeleted",false);
               var canvas = $("#canvas_103")[0];
               $(canvas).hide()
              }else{
                this.set("isSeleted",true);
                // parse_engine.search_awsJsonFile_by_time(this);
                var canvas = $("#canvas_103")[0];
               $(canvas).show()
              }
          },
          search_file : function(){
                //-----根据用户的选择的鼠标时间（或最新时间），生成自动匹配的自动站文件名
                //------这里仍然采用的是文件形式，将来可能采用数据库形式
                // parse_engine.search_awsFile_by_time(this);

             if(this.isSeleted){
               this.set("awsdataset",[]);
                // parse_engine.search_awsJsonFile_by_time(this);
             }
          },
          serverPushFresh:false,//true,表示通过后台信息通知前端进行数据文件的更新，此时就不用通过search_file来更新文件了
          upDateAwsHeatmap:function(){
            // parse_engine.upDateAwsHeatmap(this);
          },
          activeElements_index:[0,2], //对于elements的数组下标，0-代表温度
          isClusterOnZoom :true,//如果开启该功能将在缩放地图时，显示指定像素范围内的自动站要素的统计信息
          pointSearch : true,//是否开启鼠标点击地图上任意位置时，根据该位置搜寻指定范围呢包含的站点信息
          pointSearch_radius : 5000,//如果pointSearch==true,指定搜寻范围，搜寻出来的点建议以gridtable的形式展现
          upDate:function(e){

            var chooseElement = $(e.target).data('parameter');
            if(chooseElement != "当前均风" && chooseElement != "站点"){
              this.set("current_category",chooseElement)
            }
            //alert("-->aws-->you choose "+chooseElement)
            if(chooseElement == "诊断量"){
              $("#awsControl input[name='awsradiogroup']").attr("checked",false);

            }
            if(this.isSeleted){
              // parse_engine.search_awsJsonFile_by_time(this);
            }



          },
          // readDataFromFile: function(){parse_engine.readAwsDataFromFile(this)}//调用程序读取自动站文件内容
  });
  //----------------雷达类-------------------------------------------------------------------------------------
  var radar_Model = kendo.observable({
          isEnabled: true,                                      //是否开启了该功能
          isVisible: true,                                      //是否选择了观测类资料中的任意一项资料
          isSeleted: true,                                      //在在地图上是否显示
          showType : "image",                                   //以图片数据形式显示
          imageBounds : [[42.87916, 112.87187], [37.51319, 119.90312]],
          singleRadarImageBounds : {"bj":[[41.87549033188126,113.73898523859702],[37.74204921146066,119.12256067104393]]},
          current_imageBounds : [[42.87916, 112.87187], [37.51319, 119.90312]],
          category : ["组网雷达","单站雷达","X波段雷达"],
          datapath : "http://10.224.97.38:8080/public2/smart_vips/anc_mosaic",
          singleRadarPath : "http://10.224.97.37/public150/smart_vips/radar",
          //datapath : "localdata/smart_vips/anc_mosaic",
          mosaic_products:["最大组合回波","回波顶高","VIL"],     //组网雷达产品类型
          single_radar_list : ["Z9010"],                        //radar ID
          single_products:["强度","速度","谱宽","冰雹指数"],     //单站雷达产品类型
          X_radar_products:[],
          mosaic_limit :[],
          single_radar_limit:{"Z9010":[]},
          current_category :"组网最强回波",
          current_image:"XXXX",
          current_time:'03112300',
          refresh_timeInterval : 60000,                         //单位毫秒，0-表示不会自动更新
          toggle_show: function () {
             this.isSeleted?$("#radar a").removeClass("icon_button_show_eye").addClass("icon_button_close_eye"):$("#radar a").removeClass("icon_button_close_eye").addClass("icon_button_show_eye");
              if(this.isSeleted){
               this.set("isSeleted",false);
               var canvas = $("#canvas_101")[0];
               $(canvas).hide()
              }else{
                this.set("isSeleted",true);
                // parse_engine.search_radarFile_by_time(this);
                var canvas = $("#canvas_101")[0];
               $(canvas).show()
              }
          },
          search_file : function(){
                //-----根据用户的选择的鼠标时间（或最新时间），以及选择的雷达文件类型，生成自动匹配的雷达文件名
                //------这里仍然采用的是文件形式
             if(this.isSeleted){
                // parse_engine.search_radarFile_by_time(this);
             }
          },
          serverPushFresh:false,//true,表示通过后台信息通知前端进行数据文件的更新，此时就不用通过search_file来更新文件了
          test:function(){alert('d')},
          upDate:function(e){
            var chooseElement = $(e.target).data('parameter');
            this.set("current_category",chooseElement)
            //alert("-->radar-->you choose "+chooseElement)
            if(this.isSeleted){
              // parse_engine.search_radarFile_by_time(this);
            };
          },
          // readDataFromFile:parse_engine.readRadarDataFromFile()//调用程序读取雷达内容（这里主要还是图片形式）
  });

  //----------------卫星类-------------------------------------------------------------------------------------
  var satellite_Model = kendo.observable({
          isEnabled: true,                                      //是否开启了该功能
          isVisible: false,                                      //在在地图上是否显示
          isSeleted: true,                                      //是否选择了观测类资料中的任意一项资料
          showType : "image",                                   //以图片数据形式显示
          category : ["风云","葵花","加密"],
          satellite_products:["可见关","红外","水汽","云分类","云顶高度"],     //组网雷达产品类型
          satellite_limit:{"风云":[],"葵花":[],"加密":[]},
          current_category :"风云",
          refresh_timeInterval : 60000,                         //单位毫秒，0-表示不会自动更新
           toggle_show: function () {
             this.isSeleted?$("#satellite a").removeClass("icon_button_show_eye").addClass("icon_button_close_eye"):$("#satellite a").removeClass("icon_button_close_eye").addClass("icon_button_show_eye");
             this.isSeleted?this.set("isSeleted",false):this.set("isSeleted",true);
          },
          search_file : function(){
                //-----根据用户的选择的鼠标时间（或最新时间），以及选择的雷达文件类型，生成自动匹配的雷达文件名
                //------这里仍然采用的是文件形式
             if(this.isSeleted){
                // parse_engine.search_satelliteFile_by_time(this.category);
             }
          },
          serverPushFresh:false,//true,表示通过后台信息通知前端进行数据文件的更新，此时就不用通过search_file来更新文件了
          // readDataFromFile:parse_engine.readSatelliteDataFromFile()//调用程序读取雷达内容（这里主要还是图片形式）
  });


  //----------------卫星类-------------------------------------------------------------------------------------
  var lighting_Model = kendo.observable({
          isEnabled: true,                                      //是否开启了该功能
          isVisible: false,                                      //在在地图上是否显示
          isSeleted: true                                    //是否选择了观测类资料中的任意一项资料
  });


  //----------------卫星类-------------------------------------------------------------------------------------
  var rmaps_Model = kendo.observable({
          isEnabled: true,                                      //是否开启了该功能
          isVisible: true,                                      //在在地图上是否显示
          isSeleted: true,                                    //是否选择了观测类资料中的任意一项资料
          imageBounds : [[37.435101, 113.2074], [42.702202, 119.427]],
          category : ["地面温度","单站雷达","X波段雷达"],
          current_category :"地面温度",
          current_time : "",
          datapath : "http://10.224.97.38:8080/public2/smart_vips/INCA",
          isoverlaywind : false,
          toggle_show: function () {
             this.isSeleted?$("#rmaps a").removeClass("icon_button_show_eye").addClass("icon_button_close_eye"):$("#rmaps a").removeClass("icon_button_close_eye").addClass("icon_button_show_eye");
              if(this.isSeleted){
               this.set("isSeleted",false);
               var canvas = $("#canvas_100")[0];
               $(canvas).hide()
              }else{
                this.set("isSeleted",true);
                // parse_engine.search_RmapsFile_by_time(this);
                var canvas = $("#canvas_100")[0];
               $(canvas).show()
              }
          },
          search_file : function(){
                //-----根据用户的选择的鼠标时间（或最新时间），以及选择的RMAPS文件类型，生成自动匹配的RMAPS文件名
                //------这里仍然采用的是文件形式
             if(this.isSeleted){
                // parse_engine.search_RmapsFile_by_time(this);
             }
          },
          upDate:function(e){

            var chooseElement = $(e.target).data('parameter');


            if(chooseElement != "地面风场" && chooseElement != "高空风场"){
              this.set("current_category",chooseElement)
            }else{
              if($("#overlaywind").is(':checked')){
                this.set("isoverlaywind",true)
              }else{
                this.set("isoverlaywind",false)
              }
            };

            if(chooseElement == "地面温度" || chooseElement == "地面降水" || chooseElement == "地面相对湿度" || chooseElement == "地面风场"){
              //选择地面要素时，未来12小时的RMAPS-IN预报开启
              V.Time_Model.isHavefuture = true;
              $("#timeline2 g rect").each(function(i){
                $(this).css({"fill":"green"});

              })
            }else{
              //否则关闭
              V.Time_Model.isHavefuture = false;
              $("#timeline2 g rect").each(function(i){
                $(this).css({"fill":"gray"});
                V.Time_Model.futuretimeindex = -1;
              })
            }

            if(this.isSeleted){
              // parse_engine.search_RmapsFile_by_time(this);
            };
          }

  });

  //-----观测类---------------------------
  var Obs_viewModel = kendo.observable({

          isEnabled: true,  //是否开启了该功能
          isVisible: true,  //在在地图上是否显示
          isSeleted: true,  //是否选择了观测类资料中的任意一项资料
          category : ["自动站","雷达","卫星","风廓线+微波辐射计","秒探空"],
          aws_Model: aws_Model,
          radar_Model: radar_Model,
          rmaps_Model:rmaps_Model
          //sat_Model: sat_Model,
          //wind_Model: wind_Model,
          //sond_Model: sond_Model,
          //onChange: function() {
          //    kendoConsole.log("event :: change (" + kendo.toString(this.get("selectedDate"), "D") + ")");
         // }
  });

  //-------------数据导航-----------------------

  //----------------颜色空间类-------------------------------------------------------------------------------------
  var color_Model = kendo.observable({
          rmapsIn_tsfc: null,
          radarMosaic : null
  });


  var MAP_LEAF;
  // var GUI = require('nw.gui');
  // var WIN = GUI.Window.get() ;
  // var CSV_parse = require('csv-parse');
  // var FS = require('fs');


  return {
    Time_Model        : Time_Model        ,
    aws_Model         : aws_Model         ,
    radar_Model       : radar_Model       ,
    satellite_Model   : satellite_Model   ,
    rmaps_Model       : rmaps_Model       ,
    Obs_viewModel     : Obs_viewModel     ,
    color_Model       : color_Model       ,
    // WIN               : WIN               ,
    // GUI               : GUI               ,
    MAP_LEAF          : MAP_LEAF          ,
    // FS                : FS                ,
  }

}









