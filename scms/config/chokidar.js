/**
 * [chokidar 文件监控模块]
 * @type {[description]}
 */
var chokidar = require('chokidar');//文件监控模块
var fs = require('fs');
const sourcePath = "E:/smart_vips/";
const targetPath = "E:/target/";
// var watcher = chokidar.watch('file, dir, or glob', {
//  ignored: /[/]./, persistent: true
// });
//雷达文件，文件命中的时间为世界时
var watcher_anc = chokidar.watch(sourcePath+'anc_mosaic', {
 ignored: /[\/\\]\./, persistent: true
});
//自动站文件，文件名中的时间为北京时
var watcher_aws = chokidar.watch(sourcePath+'aws_genjson', {
 ignored: /[\/\\]\./, persistent: true
});

var log = console.log.bind(console);

watcher_anc
 .on('add', function(path) { getAncTimeStamp(path);})
 .on('error', function(error) { log('Error happened: ', error); }
);

 watcher_aws
 .on('add', function(path) { getAwsTimeStamp(path);})
 .on('error', function(error) { log('Error happened: ', error); }
);


//1，截取字段
//2，加时区
//
//世界时
function getAncTimeStamp(path){
	// console.log(path);
	var latestStamp = fs.readFileSync('./config/latestUpdate.txt','utf-8');
	var latestD = cut_12_Time(latestStamp);
	var index = path.lastIndexOf('\\')+1;
	var time = path.substring(index,index+12);
	var thisDate = cut_12_Time(time);
	console.log("***** An Anc_mosaic Data Comes *****");
  	console.log("Last: ",latestD);
	console.log("This: ",thisDate);
	// console.log(latestD);
	if(thisDate > latestD){
		console.log("It's New Data");
		fs.writeFile(targetPath+path.substring(index),fs.readFileSync(sourcePath+'anc_mosaic/'+path.substring(index),'utf-8'));
		fs.writeFileSync('./config/latestUpdate.txt', time);
		console.log(time," "+fs.readFileSync('./config/latestUpdate.txt','utf-8'));
	}else{
		console.log("Not New Data");
	}
	return;
}

//北京时
function getAwsTimeStamp(path){
	var index = path.lastIndexOf('_')+1;
	var time = path.substring(index,index+14);
	// var myDate = cut_14_Time(time);
	// console.log(myDate);
}

function cut_12_Time(timeString){//截取12位的字符串，并加上时区
	var year = timeString.substring(0,4);
	var mon = timeString.substring(4,6);
	var day = timeString.substring(6,8);
	var HH = (parseInt(timeString.substring(8,10))+8)+'';//加八个时区
	var mm = timeString.substring(10,12);
	var myDate = new Date(year,mon,day,HH,mm);
	// console.log(myDate);
	return myDate;
}

function cut_14_Time(timeString){
	var year = timeString.substring(0,4);
	var mon = timeString.substring(4,6);
	var day = timeString.substring(6,8);
	var HH = timeString.substring(8,10);
	var mm = timeString.substring(10,12);
	var ss = timeString.substring(12,14);
	var myDate = new Date(year,mon,day,HH,mm,ss);
	return myDate;
}


// .on('add', function(path) { log('File', path, 'has been added'); })
// .on('addDir', function(path) { log('Directory', path, 'has been added'); })
// .on('unlink', function(path) { log('File', path, 'has been removed'); })
// .on('unlinkDir', function(path) { log('Directory', path, 'has been removed'); })
// .on('ready', function() { log('Initial scan complete. Ready for changes.'); })
// .on('raw', function(event, path, details) { log('Raw event info:', event, path, details);}