 /*
这里写一些用户端的函数

*/


function user_function(){
  //预警等级分3级，最内圈（或行政区域）最高，然后一次往外降低等级，当高等级存在警报是，低等级可以忽略
  function RadarMosaicWarning(){
    //根据雷达组网回波强度进行报警，报警标准如下（可在界面端设置）
    if(V.radar_Model.isSeleted){
      var canvas = $("#canvas_88")[0];
      var ctx = canvas.getContext('2d');
      var imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
      for(var i =0;i<imageData.length;i+=4){
        var r = imageData.data[i];
        var g = imageData.data[i+1];
        var b = imageData.data[i+2];
        var a = imageData.data[i+3];
        var hexcolor = rgbToHex(r,g,b);
        var value88 = V.color_Model.radarMosaic.invertExtent(hexcolor);
        if(ss88 != "NaN-NaN"){
          var value = 0.5 * (value88[0] + value88[1]);

          }
      }
    };
  };


  function AwsWarning(){
    //默认情况下，自动站报警总是自动当前显示的最新自动站数据进行报警
    var center_point = L.latLng(V.Map_Model.center_lat,V.Map_Model.center_lon);
    if(V.aws_Model.awsdataset.length >0){
      for(var i=0;i<V.aws_Model.awsdataset.length;i++){
          var dd = V.aws_Model.awsdataset[i]
          var lonlat = dd.geometry.coordinates;
          var stationid = dd.properties["stationid"];
          var stationname = dd.properties["stationname"];
          var lon = parseFloat(lonlat.split("[")[1].split("]")[0].split(",")[0]);
          var lat = parseFloat(lonlat.split("[")[1].split("]")[0].split(",")[1]);
          var currh = dd.properties["currh"];
          var point = L.latLng(lat,lon);
          var distance = point.distanceTo(center_point);
          if(distance < 50000.0 && currh >30.0){
            console.log('stationid=',stationid,'rh=',currh);
          }

      };
    };
  };

  return {

        AwsWarning          :  AwsWarning          ,

  }

};
