var point_data;



function index_of_zeroclock(point_time){
  //从时间序列中找到整点时刻出现的位置index

  for(var i=0;i<point_time.length;i++){
    var minute = point_time[i].split(":")[1];

    if(minute == "00"){console.log(point_time[i]+";at "+i)}
  }

}


function ArrayCaculate(list){
  //对数组求和,最大，最小，平均
  //根据当前时刻是否是整点来确定如何计算

  //计算过去1小时，3小时，12小时累计降水量




  var missing = 9999;
  var vmax = -9999;
  var vmin = 9999;
  var vmean = 9999;
  var vsum = 9999;
  var validnum = 0
  for (var i =0;i<list.length;i++){
    d = parseFloat(list[i]);
    if( d >-100.0 && d < 100.0 ){
      vsum = vsum + d;
      if(d > vmax) vmax = d;
      if(d < vmin) vmin = d;
      validnum = validnum + 1 ;
    };
  };
  vmean = vsum / validnum;

  return {"max":vmax,"min":vmin,"mean":vmean,"sum":vsum}

}
function asign_color(level){

  if(level == 1){color = "blue"};
  if(level == 2){color = "yellow"};
  if(level == 3){color = "orange"};
  if(level == 4){color = "red"};
  return color
}

function detect_warning(series_data){
  //input:单个站点上的时间序列数据(过去12小时到未来12小时）

    thisdata = series_data["rain"].split(",");
    //

    for (var i =thisdata.length-1;i>=0;i--){
      index_min = i-12;
      index_max = i;
      if(index_min <0){index_min == 0};
      sta  = ArrayCaculate(thisdata.slice(index_min,index_max));
      console.log(sta);
    }


};


//----加载地理信息数据
function loadGis(map,gisfile,name){
  var svg = d3.select(map.getPanes().overlayPane).append("svg").attr({"class":"top"}),
  g = svg.append("g").attr({"class": "leaflet-zoom-hide","name":name});
  d3.json(gisfile, function(error, collection) {
    if (error) throw error;


    var tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "100")
    .style("visibility", "hidden")
    .style("font-size", "14pt")
    .style("background-color", "#ffffff")
    .text("a simple tooltip");

  var subunits = topojson.feature(collection, collection.objects['name']);//this is for topojson
    //  var subunits = collection; //this is  for geojson
      var transform = d3.geo.transform({point: projectPoint}),
        path = d3.geo.path().projection(transform);

        var feature = g.selectAll("path")
            .data(subunits.features)
            .enter().append("path")
              .attr("stroke","#000")
              .attr("stroke-width",2)
              .attr("fill","#ccc" )
              .attr('opacity', 0.6)
              .attr("d", path );
/*               .on("mouseover", function(d,i){
               console.log(d.properties["MID"])
              })
	      .on("mousemove", function(d,i){
        })
       	.on("mouseout", function(d,i){ return tooltip.style("visibility", "hidden");});

 */

  map.on("viewreset", reset);
  reset();

  function reset() {
    var bounds = path.bounds(subunits),
        topLeft = bounds[0],
        bottomRight = bounds[1];

    svg.attr("width", bottomRight[0] - topLeft[0])
        .attr("height", bottomRight[1] - topLeft[1])
        .style("left", topLeft[0] + "px")
        .style("top", topLeft[1] + "px");

    g.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");

    feature.attr("d", path);
  }


  // Use Leaflet to implement a D3 geometric transformation.
  function projectPoint(x, y) {
    var point = map.latLngToLayerPoint(new L.LatLng(y, x));
    this.stream.point(point.x, point.y);
  }

});
}



function load_point_data(datafile){

  d3.json(datafile, function(error, collection) {
    if (error) throw error;

    point_data = collection["DS"];
    point_time = collection.requestParams;
    index_of_zeroclock(point_time.split(","));

/*     for(var i = 0;i<point_data.length;i++){
      detect_warning(point_data[i])
    }; */
  });
}

$(function(){

   var GUI = require('nw.gui');
   var WIN = GUI.Window.get() ;
  $("#icon_button_exit").click(function(){
    WIN.reload();
  });



    $("#mainView").css({"height":(window.screen.availHeight-100).toString(),"width":window.screen.availWidth.toString()});

    $("#mainView  #map").css({"width":"80%","height":"100%"});



  MAP_LEAF = L.map('map').setView([39.85, 116.57], 10);

/*   L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: ''
  }).addTo(MAP_LEAF);

 */
  loadGis(MAP_LEAF,"../localdata/GIS/bjxz_new_line_topo.json","bjt_gis");

 //load_point_data("../localdata/station_data/20150717142500.json");

})
