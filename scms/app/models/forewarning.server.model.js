var mongoose = require('mongoose');

var DizasterSchema = new mongoose.Schema({
	fbtime: {type: Date, default: Date.now},//发生时间
	sytime: {type: Date, default: Date.now},//提交时间
	// 设置默认值
	disicon:String,
	distype:String,//天气分类
	dissubtype:String,//天气类型
	fbuser:String,//发布人
	distitle:String,//天气标题
	lat:Number,//纬度
	lon:Number,//经度
	fbcontent:String,//发布内容
	pic:String,//图片
	audio:String,//音频
	fbdept:String//发布单位    
});

var MonitorSchema = new mongoose.Schema({
	fbtime: {type: Date},//发布时间
	sytime: {type: Date},//提交时间
	// 设置默认值
	station:String,//观测站点
	distype:String,//灾害类型
	fbuser:String,//发布人
	fbuserId:String,//发布人Id
	fbcontent:String,//发布内容
	fbdept:String//发布单位    
});

var NowcastWarningSchema = new mongoose.Schema({
	fbtime: {type: Date, default: Date.now},//发布时间
	sytime: {type: Date, default: Date.now},//提交时间
	// 设置默认值
	SN_number:Number,//期号
	distype:{
		type:String,
		maxLength: 100,//字符串（数值字符串化）最大长度
		msg: '最大长度不能超过100'	
	},//类型
	warn_content:{
		type:String,
	},//内容
	
	fbdepartment:{
		type:String,
		maxLength: 200,//字符串（数值字符串化）最大长度 
		msg: '最大长度不能超过20' 	
	},//发布单位
	fbuser:{
		type:String,
		maxLength: 20,//字符串（数值字符串化）最大长度 
		msg: '最大长度不能超过20' 	
	},//发布人
	fbuserId:String,//发布人Id
	singer:{
		type:String,
		maxLength: 20,//字符串（数值字符串化）最大长度 
		msg: '最大长度不能超过20' 	
	},//签发人
	location:String,//落区
	valid_time:{type: Date, default: null},//有效时间
	status:{
		type:String,
		maxLength: 100,//字符串（数值字符串化）最大长度
		msg: '最大长度不能超过100' 	
	},//状态
	pdfPath:{
		type:String,
		maxLength: 100,//字符串（数值字符串化）最大长度
		msg: '最大长度不能超过100'  	
	}//PDF

});

var WarningSchema = new mongoose.Schema({
	fbtime: {type: Date, default: Date.now},//发布时间
	sytime: {type: Date, default: Date.now},//提交时间
	// 设置默认值
	SN_number:Number,//期号
	distype:{
		type:String,
		maxLength: 100,//字符串（数值字符串化）最大长度
		msg: '最大长度不能超过100'  	
	},//类型
	warn_content:{
		type:String,
	},//内容
	
	warn_title:{
		type:String,
	},//预警标题

	fbdepartment:{
		type:String,
		maxLength: 200,//字符串（数值字符串化）最大长度
		msg: '最大长度不能超过200'  	
	},//发布单位
	fbuser:{
		type:String,
		maxLength: 20,//字符串（数值字符串化）最大长度 
		msg: '最大长度不能超过20' 	
	},//发布人
	fbuserId:String,//发布人Id
	signer:{
		type:String,
		maxLength: 20,//字符串（数值字符串化）最大长度 
		msg: '最大长度不能超过20' 	
	},//签发人
	location:String,//落区
	
	release_time:Date,//解除时间

	status:{
		type:String,
		maxLength: 100,//字符串（数值字符串化）最大长度
		msg: '最大长度不能超过100'  	
	},//状态
	warningPDF:{
		type:mongoose.Schema.Types.ObjectId
		// maxLength: 100,//字符串（数值字符串化）最大长度
		// msg: '最大长度不能超过100'  	
	},//pdfId
	pdfPath: String,//PDF路径
	fangyu:String,//防御指南
	readme:String//备注说明

});


var Dizaster =  mongoose.model('Dizaster',DizasterSchema);
var Monitor =  mongoose.model('Monitor',MonitorSchema);
var NowcastWarning =  mongoose.model('NowcastWarning',NowcastWarningSchema);
var Warning =  mongoose.model('Warning',WarningSchema);