function Appendzero(obj)
    {
        if(obj<10) return "0" +""+ obj;
        else return obj;
    }
 function leave_digit(value,num){
   //保留小数位数
   try{
       var value = value.toString();
       var ss = value.split('.')
       var new_value = ss[0]+'.'+ss[1].slice(0,num);
       new_value = parseFloat(new_value);}
     catch(err){
       new_value = value;
     }
     return new_value
 };
function dufenmiao2deg(dufenmiao,latlng){
 //将经纬度由度分秒转为度
  if(latlng=="lat"){
    var ss = parseFloat(dufenmiao.slice(0,2))+parseFloat(dufenmiao.slice(2,4))/60.0+parseFloat(dufenmiao.slice(4,6))/3600.0;
  };
  if(latlng=="lng"){
    var ss = parseFloat(dufenmiao.slice(0,3))+parseFloat(dufenmiao.slice(3,5))/60.0+parseFloat(dufenmiao.slice(5,7))/3600.0;
  };
  return ss
  //return 10.0
};

function caculate_time_str(starting_time){
  var cursor_time= new Date(starting_time);
  var ss = cursor_time.toString().split(" ");

  var fullYear = ss[3];
  var month = ss[1];
  //months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  if (month == "Jan"){month = "01"};
  if (month == "Feb"){month = "02"};
  if (month == "Mar"){month = "03"};
  if (month == "Apr"){month = "04"};
  if (month == "May"){month = "05"};
  if (month == "Jun"){month = "06"};
  if (month == "Jul"){month = "07"};
  if (month == "Aug"){month = "08"};
  if (month == "Sep"){month = "09"};
  if (month == "Oct"){month = "10"};
  if (month == "Nov"){month = "11"};
  if (month == "Dec"){month = "12"};

  var day = ss[2];
  var hour = ss[4].split(":")[0];
  var minutes = ss[4].split(":")[1];
  var seconds = ss[4].split(":")[2];
  var ss = {"fullYear":fullYear,"month":month,"day":day,"hour":hour,"minutes":minutes,"seconds":seconds};
  return ss
};

/*
	// 作者 yanue
	// 参数：
	// startColor：开始颜色hex
	// endColor：结束颜色hex
    // step:几个阶级（几步）
   */
  function gradientColor(startColor,endColor,step){
       startRGB = this.colorRgb(startColor);//转换为rgb数组模式
       startR = startRGB[0];
       startG = startRGB[1];
       startB = startRGB[2];

       endRGB = this.colorRgb(endColor);
       endR = endRGB[0];
       endG = endRGB[1];
       endB = endRGB[2];

       sR = (endR-startR)/step;//总差值
       sG = (endG-startG)/step;
       sB = (endB-startB)/step;

       var colorArr = [];
       for(var i=0;i<step;i++){
		   //计算每一步的hex值
           var hex = this.rgb2hex('rgb('+parseInt((sR*i+startR))+','+parseInt((sG*i+startG))+','+parseInt((sB*i+startB))+')');
           colorArr.push(hex);
       }
       return colorArr;
   }

   // 将hex表示方式转换为rgb表示方式(这里返回rgb数组模式)
   gradientColor.prototype.colorRgb = function(sColor){
       var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
       var sColor = sColor.toLowerCase();
       if(sColor && reg.test(sColor)){
           if(sColor.length === 4){
               var sColorNew = "#";
               for(var i=1; i<4; i+=1){
                   sColorNew += sColor.slice(i,i+1).concat(sColor.slice(i,i+1));
               }
               sColor = sColorNew;
           }
           //处理六位的颜色值
           var sColorChange = [];
           for(var i=1; i<7; i+=2){
               sColorChange.push(parseInt("0x"+sColor.slice(i,i+2)));
           }
           return sColorChange;
       }else{
           return sColor;
       }
   };

gradientColor.prototype.zero_fill_hex = function(num, digits) {
  var s = num.toString(16);
  while (s.length < digits)
    s = "0" + s;
  return s;
};
gradientColor.prototype.rgb2hex = function(rgb) {



  if (rgb.charAt(0) == '#')
    return rgb;

  var ds = rgb.split(/\D+/);
  var decimal = Number(ds[1]) * 65536 + Number(ds[2]) * 256 + Number(ds[3]);
  return "#" + this.zero_fill_hex(decimal, 6);
};

    function showNowTime(){
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth()+1;
        var day = date.getDate();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();
        //var ss = Appendzero(year) +"年"+Appendzero(month) +"月"+ Appendzero(day) +"日"
        var ss2 = Appendzero(hours)+":"+Appendzero(minutes)+":"+Appendzero(seconds);//+"秒"
        //$("#nowTime").text(ss);
        $("#nowTime").text(ss2);
   }


function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}


function hex2rgb(hex, opacity) {
        var h=hex.replace('#', '');
        h =  h.match(new RegExp('(.{'+h.length/3+'})', 'g'));

        for(var i=0; i<h.length; i++)
            h[i] = parseInt(h[i].length==1? h[i]+h[i]:h[i], 16);

        if (typeof opacity != 'undefined')  h.push(opacity);

        return 'rgba('+h.join(',')+')';
}



function determin_Plength(MAP_LEAF,center_lat,center_lon,angle,radial){
  center_dot = MAP_LEAF.latLngToContainerPoint([center_lat,center_lon]);
  var center_point = L.latLng(center_lat,center_lon);
  var save_distance = 0.0;
  var save_pd = 0.0
  for (var pd =1;pd<1000000;pd++){
    var dx = pd * Math.sin(angle/180.0 * Math.PI);
    var dy = -1* pd * Math.cos(angle/180.0 * Math.PI);
    var new_point  = MAP_LEAF.containerPointToLatLng([center_dot.x+dx,center_dot.y+dy]);
    var distance = new_point.distanceTo(center_point)
    //console.log('pd=',pd,'distance=',distance,'save_distance=',save_distance)
    if(save_distance<1000.0*radial && distance >=1000.0*radial){
      save_pd = pd;
      break
    }
    else{
      save_distance = distance
    }

  }
  return save_pd
}


function polarToLeafleatPoint(MAP_LEAF,center_lat,center_lon,angle,radial){
//convert the polar coordination in (angle,radial)format to leaflet lnglat format
 center_dot = MAP_LEAF.latLngToContainerPoint([center_lat,center_lon]);


var sss = '';
var i = angle;
var j = radial;
  pd = determin_Plength(MAP_LEAF,center_lat,center_lon,i,j);
  var dx = pd * Math.sin(i/180.0 * Math.PI);
  var dy = -1* pd * Math.cos(i/180.0 * Math.PI);
  nx = center_dot.x + dx;
  ny = center_dot.y + dy;
  new_dot_ll = MAP_LEAF.containerPointToLatLng([nx,ny]);
  sss += String(i)+"&"+String(j)+','+String(new_dot_ll.lng)+','+String(new_dot_ll.lat)+'\n';
console.log(sss);
}

