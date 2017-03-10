var warning_content;
var warning_action;
var warning_type;
var warning_sign;
var userUnit = new String;
var station = new String;
var flag;
$.ajax({
    url:"http://172.16.40.73:7101/currentUser",
    async:false,
    type:"get",
    dataType:"json",
    success:function(json) {
      if(json._id){
        userUnit = json.name;
        station = json.unit;
        flag = 1;
      }else{
      	flag = 0;
      	alert("未登录");
      };
    },
    error:function(e){
    	flag = 0;
    	alert("找不到服务器");
    }
  });


function activeMake(){
//任何一个地方进行了修改，就立即触发pdf制作程序


 $("#warning_content").change(function(){
   toPDF();
 })

 $("#warning_action").change(function(){
 	var guide=document.getElementById("guide");		//获取指标内容
	var content = document.getElementById("warning_content");
	content.innerText = "";
	guide.innerText = "";
	setSN(userUnit);
   	toPDF();
 })

 $("#warning_type").change(function(){
 	var grid = $("#history").data("kendoGrid");
 	$('.k-input').text("北京台");
 	grid.dataSource.filter({ field: "fbuser", operator: "eq", value: "北京台" });
 	// toPDF();
 })

 $("#warning_sign").change(function(){
   toPDF();
 })

 $("#guide").change(function(){
   toPDF();
 })

}





function makePDF(content,pdfilename) {

	var fs = require('fs');
	// if(fs.existsSync(pdfilename)){
	// 	fs.unlinkSync(pdfilename);
	// }
	var PDFDocument;
	PDFDocument = require('pdfkit');
	var doc = new PDFDocument({size: "A4", margins : {top : 50, bottom : 50, left : 50, right : 50}});
	var stream = doc.pipe(fs.createWriteStream(pdfilename)) ;
	// var content = "预计顺义区16日02时至20时将有4、5级偏北风，阵风可达7级，局地伴有扬沙，请注意防范。";
	// var station = "顺义区气象台";
	var PDFhead = station+"气象灾害预警信号";

	var number = "2016004";

	var timeStamp = $("#dateTimeField").val();

	warning_sign = $("#warning_sign").find("option:selected").text();
	// alert(warning_seal)
	warning_action = $("#warning_action").find("option:selected").text();	
	warning_type = $("#warning_type").find("option:selected").text();
	var warning_seal = $("#warning_sign").find("option:selected").val();
	var signalValue;
	$("img[name='color']").each(function(){
		if($(this).attr('class') === 'curr'){
			signalValue = $(this)[0].attributes.value.value;
		}
	});

	var warnMessage = getWarnJson('warnMessage');
	// console.log(warnMessage.features[5].properties[signalValue?signalValue:'请选择预警等级']);
	var warning_color = warnMessage.features[5].properties[signalValue];
	warning_content = $('#warning_content').val();
	var guide = $('#guide').val();

	stream.on('finish', function () {
		var myParams = {
			url: "../localdata/warning_new.pdf",
			// url:"G:/BJMS/trunk/scms/public/warning_new.pdf",
			height: "100%",

			pdfOpenParams: {
			navpanes: 0,
			toolbar: 1,
			statusbar: 1,
			zoom:60,
			view: "Fit"
		}
	};
	var myPDF = new PDFObject(myParams).embed("mypdf");
	});


	// alert(content);
	// // 文本长842，宽度596
	doc.image('./app/v1.0.1/views/Make_Warning/images/pdflogo.png', 85-25, 63-25, {width: 50});
	doc
		.lineWidth(3)
		.lineCap('round')
		.strokeColor('red')
		//35是边距
		.moveTo(37+0, 120)
		.lineTo(-37+596, 120) 
		.stroke();
	if(!signalValue){signalValue = 'feng'}
	doc.image("./app/v1.0.1/views/Make_Warning/images/"+signalValue+".jpg", 298-40, 200-40, {width: 80});
	doc
		.fontSize(28)
		.fillColor("red")
		.font('./app/v1.0.1/fonts/simhei.ttf','Bold')
		.text("    "+PDFhead,{lineGap:15,align: 'center'});

	doc
		.fontSize(14)
		.fillColor("black")
		.font('./app/v1.0.1/fonts/simhei.ttf','Chalkboard-Bold')
		.text(station+"               编号："+number+"               签发人："+warning_sign,{align: 'left'});

	doc
		.fontSize(16)
		.font('./app/v1.0.1/fonts/simhei.ttf','Chalkboard-Bold')
		.fillColor("black")
		.text("\n\n\n\n\n\n\n\n\n"+timeStamp+warning_action+warning_color,{align: 'center'});

	doc
		.fontSize(16)
		.font('./app/v1.0.1/fonts/simhei.ttf','Chalkboard-Bold')
		.fillColor("black")
		.text("\n"+content,{indent:32});
	if(warning_action != "解除"){
		doc
			.fontSize(14)
			.text("\n\n\n\n\n\n防御指南：")
			.fontSize(12)
			.text(guide);
	}
	var signerPic = './app/v1.0.1/views/Make_Warning/images/signer/'+userUnit+'/'+warning_seal;
	var testUrl = './app/v1.0.1/views/Make_Warning/images/signer/qiaolin.png';
	if(warning_seal){
		doc.image(signerPic, 500-70, 750-70, {width: 140});
	}else{
		doc.image(testUrl, 500-70, 750-70, {width: 140});
	}

	doc.end();

}

function toPDF(){
  var content = $("#warning_content").val();
  //alert(content);
  var pdfilename = "./app/v1.0.1/localdata/warning_new.pdf";
  makePDF(content,pdfilename) ;
};

function formatTime(time) {
	// console.log(time.length);
	var yyyy = time.substring(0,4);
	var mth = parseInt(time.substring(5,7))-1;//这里以后记住了，new Date()方法的月份是0-11，new的时候要-1
	var dd = time.substring(8,10);
	var HH = time.substring(11,13);
	var mm = time.substring(14,16);
	console.log(yyyy+mth+dd+HH+mm);
	return new Date(yyyy,mth,dd,HH,mm);
}

//查看预警PDF
function showPDF(e){
	e.preventDefault();
    var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
	var fs = require('fs');
	// var readfile = fs.readFileSync("C:/Users/Administrator/Desktop/qiaolin.png");
	var request = require('request');
	// var rs = require('stream').Readable;
	var _id = dataItem.warningPDF;
	var blobStream  = require('blob-stream');
	request.get({url:"http://172.16.40.73:7101/pdf/warning/"+_id}, function(err, res, body){
		var s = blobStream();
		s.on('finish', function(){
			var url = this.toBlobURL('application/pdf');
			window.open(url);
		});
		//将buffer类型的body写入blobStream()中
		//知识点：blobStream()是个写入流，调用write方法
		s.write(new Buffer(JSON.parse(body)));
		s.end();
	});
}

function publishPDF(){
	var fs = require('fs');
	// var needle = require('needle');
	if($("#dateTimeField").val() != "" && $("#dateTimeField").val() && $("#dateTimeField").val() != null){
		var fbtime = formatTime($("#dateTimeField").val()).toString();
	}else{
		return alert("请选择发布时间！")
	}
	if(confirm("确定"+warning_action+warning_type+"吗？")){

		var signalValue;
		$("img[name='color']").each(function(){
			if($(this).attr('class') === 'curr'){
				signalValue = $(this)[0].attributes.value.value;
			}
		});
		var SN_number = $("#SN_number").val();
		var warnMessage = getWarnJson('warnMessage');
		console.log(warnMessage.features[5].properties[signalValue?signalValue:'请选择预警等级']);
		var warning_color = warnMessage.features[5].properties[signalValue];

		var districtArr = $("a[name='direction']")
		// console.log(districtArr)
		var location = [];
		districtArr.each(function(){
			if($(this)[0].className === 'curr'){
				location.push($(this).text());
			}
		});
		var buffer = fs.readFileSync('./app/v1.0.1/localdata/warning_new.pdf');
	 	
		var data = {
			fbtime: fbtime,
			SN_number: SN_number,
			distype:warning_color,//类型
			warn_content: warning_content,
			warn_title:station+"气象灾害预警信号",
			fbdepartment:station,//发布单位
			fbuser: userUnit,
			signer: warning_sign,
			location: location.toString(),
			// release_time: //解除时间
			status: ($("#warning_action").find("option:selected").text() === "解除")?"解除":"发布",//状态
			fangyu: $('#guide').val(),//防御指南
			readme: "",//备注

		  	warningPDF:{
			    value:  buffer,
			    options: {
			      filename: 'warning.pdf',
			      contentType: 'application/pdf'
			    }
			}
		};
		var request = require('request');
		request.post({url:"http://172.16.40.73:7101/vips4/warning",formData: data},function(err, res, body){
			console.log("body :",body)
			console.log("err :",err)
			inItGrid();
			alert(body)
		});
		setSN(userUnit);
	}
}

window.onload=function(){

  var GUI = require('nw.gui');
  var WIN = GUI.Window.get() ;
  $("#refresh").click(function(){
    // WIN.reload();
    inItGrid();
    toPDF();
  });
  $("#publish").click(function(){
    publishPDF();
  });
  // $("#main_right").css({"width":(WIN.width-600).toString(),"height":(WIN.height-50).toString()});
    $("#main_left").css({"width":"550","height":(WIN.height-70).toString()});
    $("#main_right").css({"width":(WIN.width-600).toString(),"height":(WIN.height-70).toString()});

    AnyTime.picker('dateTimeField',
                       {"monthAbbreviations":['1','2','3','4','5','6','7','8','9','10','11','12'],
                        "dayAbbreviations":["日","一","二","三","四","五","六"],
                        "labelTitle":"日期和时间",
                        "labelHour":"小时",
                        "labelMinute":"分钟",
                        "labelMonth":"月",
                        "labelYear":"年",
                        "labelDayOfMonth":"日",
                        format: "%Y年%m月%d日%H时%i分"
                       });
  	var myParams = {
      url: "../localdata/warning.pdf",
       height: "100%",

       pdfOpenParams: {
          navpanes: 0,
          toolbar: 1,
          statusbar: 1,
	      zoom:60,
          view: "Fit"
        }
    };
	var myPDF = new PDFObject(myParams).embed("mypdf")

	activeMake();
	var fs = require('fs');
	var sel = $("#warning_type").find("option:selected").val();  //下拉列表值
	var span1=window.document.getElementById("signalState");
	var warnMessage = getWarnJson('warnMessage');
 	// var warnMessage = require('../views/Make_Warning/warnMessage.json');
 	// console.log(warnMessage.features[4].properties[sel])
 	var imgs = warnMessage.features[4].properties[sel];
 	var photo = new String;
 	for(var i in imgs){
 		photo += "<a href='javascript:void(0);'><img title='"+warnMessage.features[2].properties[imgs[i]]+"' width='40px' name='color' value='"+imgs[i]+"' src='Make_Warning/images/"+imgs[i]+".gif'/></a>"
	}
 	document.getElementById("signalState").innerHTML=photo;
 	var signerJSON = getWarnJson('signer');
 	// var userUnit = "北京台";
 	// console.log(signerJSON[userUnit]);
 	for(var i in signerJSON[userUnit]){
 		$('#warning_sign').append("<option value='"+signerJSON[userUnit][i].img+"'>"+signerJSON[userUnit][i].name+"</option>");
 	}
	selectDC();
	selectTp();
	setSN(userUnit);

}

//select 判断选择哪个下拉列表
 function foo(){
		var photo;
		var sel = document.getElementById("warning_type").value; //下拉列表值
		var fs = require('fs');
		var warnMessage = getWarnJson('warnMessage');
     	// var warnMessage = require('../views/Make_Warning/warnMessage.json');
     	console.log(warnMessage.features[4].properties[sel])
     	var imgs = warnMessage.features[4].properties[sel];
     	var photo = new String;
     	for(var i in imgs){
     		photo += "<a href='javascript:void(0);'><img title='"+warnMessage.features[2].properties[imgs[i]]+"' width='40px' value='"+imgs[i]+"' name='color' src='Make_Warning/images/"+imgs[i]+".gif'/></a>"
    	}
     	document.getElementById("signalState").innerHTML=photo;
		selectTp();
}
//判断选择哪种预警
function selectTp(){
var aImg=document.getElementsByName("color");   //获取图片
var guide=document.getElementById("guide");		//获取指标内容
var content = document.getElementById("warning_content");
var lastClick;
var contentValue;   //预警内容
var guideValue;   //指南内容
var filename;	//图片名称
content.innerText = "";
guide.innerText = "";
for(var i=0;i<aImg.length;i++){
	aImg[i].className="";
    aImg[i].onclick = function(){
        if(lastClick){
            lastClick.className = '';
        }
		this.className = 'curr';
		lastClick = this;
		var path=this.src;
		if(path.indexOf("/")>0){
			filename=path.substring(path.lastIndexOf("/")+1,path.length);
		}else{
			filename=path;
		}
		var imgValue = lastClick.attributes.value.value; //下拉列表值
		var fs = require('fs');
		var warnMessage = getWarnJson('warnMessage');
     	// var warnMessage = require('../views/Make_Warning/warnMessage.json');
     	// console.log(warnMessage.features[1].properties[imgValue]);
     	contentValue = warnMessage.features[3].properties[imgValue];
		guideValue = warnMessage.features[1].properties[imgValue];
		if($("#warning_action").find("option:selected").text() != "解除"){
			content.innerText = contentValue;
			guide.innerText = guideValue;
		}
    }

}
// toPDF();
}
//落区选择
function selectDC(){
var dir=document.getElementsByName("direction");
var lastClicks;
dir[0].className='curr';
	for(var i=0;i<dir.length;i++){
	 dir[i].onclick = function(){
		if(lastClicks){
			lastClicks.className = '';
		}
		dir[0].className='';
		this.className='curr';
		lastClicks = this;
	}
	}
	// toPDF();
}

function setSN(Ucon){
	var request = require('request');
	var data = {
					fbuser: Ucon,
					status: $("#warning_action").find("option:selected").text()
				};
	request.get({url:"http://172.16.40.73:7101/vips4/warning",formData:data},function(err, res, body){
		if(err) return console.log(err);
		var jsonBody = JSON.parse(body);
		if(warning_action != "解除"){
			if(jsonBody[0]){
				$('#SN_number').val(jsonBody[0].SN_number+1);
			}else{
				var date = new Date();
				$('#SN_number').val(date.getFullYear().toString()+"001");
			}
			
		}else{
			if(jsonBody[0]){
				$('#SN_number').val(jsonBody[0].SN_number+1);
			}else{
				var date = new Date();
				$('#SN_number').val(date.getFullYear().toString()+"001");
			}
		}
	});
}

function getWarnJson(type){
	var fs = require('fs');
	var warnMessage = JSON.parse(fs.readFileSync('./app/v1.0.1/views/Make_Warning/'+type+'.json'));
	return warnMessage;
}

//分页
var obj,j;
var page=0;
var nowPage=0;//当前页
var listNum=5;//每页显示<ul>数
var PagesLen;//总页数
var PageNum=2;//分页链接数


