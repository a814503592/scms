 var users = [];
 var sids = [];
 var fs = require('fs');
 var fsmonitor = require('fsmonitor');

 const warPath = "W:/flood_new/savewarning/warning/";
 const sourcePath = "E:/smart_vips/";
 const targetPath = "E:/target/";
 const testPath = "D:/VIPS4/test/";

 module.exports = function (io, mongoStore, cookieParser) {
    //开始监听客户端连接
    io.on('connection', function (socket) {
        console.log('socket.io online');
        console.log("Connection " + socket.id + " accepted.");
       
        socket.on('disconnect', function() {
            console.log("socket.io offline");
            users.splice(socket.userIndex, 1);
            socket.broadcast.emit('system', socket.nickname, users.length, 'logout');
        });
        //new message get
        socket.on('postMsg', function(msg, color) {
          console.log('Message Post');
            socket.broadcast.emit('newMsg', socket.nickname, msg, color);
        });
        //new image get
        socket.on('img', function(imgData, color) {
            console.log(imgData);
            socket.broadcast.emit('newImg', socket.nickname, imgData, color);
        });
    });


    fsmonitor.watch(sourcePath, null, function(change) {
        if(change.addedFiles.length > 0){
            change.addedFiles.forEach(function(pathName){
                var path =require('path');
                console.log('path: ', path.join(sourcePath,pathName));//打印文件完全路径
                var dirnamePath = path.dirname(path.join(sourcePath,pathName))
                console.log("dirnamePath: ", dirnamePath);//打印文件根目录
                var dirname = dirnamePath.substring(dirnamePath.lastIndexOf('\\')+1)
                console.log("dirname: ",dirname);//发生变化的目录名称
                if(dirname === 'anc_mosaic' || dirname === 'aws_geojson'){
                    io.sockets.emit('Hold', path.join(sourcePath,pathName));//发送
                }
            });
        }
     });

    // fsmonitor.watch(warPath, null, function(change) {
    //     if(change.addedFiles.length > 0){
    //         change.addedFiles.forEach(function(pathName){
    //             console.log(warPath+pathName);
    //         });
    //     }
    //  });

    //  fsmonitor.watch(sourcePath+"anc_mosaic/", null, function(change) {
    //     if(change.addedFiles.length > 0){
    //         change.addedFiles.forEach(function(pathName){
    //             getAncTimeStamp(sourcePath+"anc_mosaic/"+pathName);
    //         });
    //     }
    //  });

    //  fsmonitor.watch(sourcePath+"aws_geojson/", null, function(change) {
    //     if(change.addedFiles.length > 0){
    //         change.addedFiles.forEach(function(pathName){
    //             getAwsTimeStamp(sourcePath+"aws_geojson/"+pathName,"Add");
    //         });
    //     }
    //     if(change.modifiedFiles.length > 0){
    //         change.modifiedFiles.forEach(function(pathName){
    //             getAwsTimeStamp("D:/VIPS4/test/"+pathName,"modified");
    //         });
    //     }
    //  });

    //世界时
    function getAncTimeStamp(path){
        // console.log(path);
        var latestStamp = fs.readFileSync('./config/anc_mosaic.txt','utf-8');        
        var latestD = cut_12_Time(latestStamp);
        var index = path.lastIndexOf('/')+1;
        var time = path.substring(index,index+12);
        console.log(time);
        var thisDate = cut_12_Time(time);
        // console.log("***** An Anc_mosaic Data Comes *****");
        if(thisDate > latestD){
            console.log("It's New Data");
            io.sockets.emit('newMsg', "File-Monitor", {dataType:"warning", event:"Add", path: path}, "blue");
            fs.writeFile('./config/anc_mosaic.txt', time);
        }else{
            console.log("Not New Data");
        }
        return;
    }

    //北京时
    function getAwsTimeStamp(path, event){
        var latestStamp = fs.readFileSync('./config/aws_geojson.txt','utf-8');
        console.log(latestStamp);
        var latestD = cut_14_Time(latestStamp);
        var index = path.lastIndexOf('_')+1;
        var time = path.substring(index,index+14);        
        var thisDate = cut_14_Time(time);
        console.log("***** An Aws_geojson Data Event *****");
        if(thisDate > latestD){
            console.log("It's New Data");
            io.sockets.emit('newMsg', "File-Monitor", {dataType: "aws_geojson", event: event, path: path}, "blue");
            fs.writeFile('./config/aws_geojson.txt', time);
        }else{
            console.log("Not New Data");
        }
        return;
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
}