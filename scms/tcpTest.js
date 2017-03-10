var net = require('net');

var HOST = '192.168.203.1';
var PORT = 7101;

var socket = null;

// 创建一个TCP服务器实例，调用listen函数开始监听指定端口
// 传入net.createServer()的回调函数将作为”connection“事件的处理函数
// 在每一个“connection”事件中，该回调函数接收到的socket对象是唯一的
net.createServer(function(sock) {

    // 我们获得一个连接 - 该连接自动关联一个socket对象
    console.log('CONNECTED: ' +
        sock.remoteAddress + ':' + sock.remotePort);
    socket = sock;
    // 为这个socket实例添加一个"data"事件处理函数
    sock.on('data', function(data) {
        console.log('DATA ' + sock.remoteAddress + ': ' + data);
        // 回发该数据，客户端将收到来自服务端的数据
        sock.write('You said "' + data + '"');
    });

    // 为这个socket实例添加一个"close"事件处理函数
    sock.on('close', function(data) {
        console.log('CLOSED: ' +
            sock.remoteAddress + ' ' + sock.remotePort);
        socket = null;
    });

}).listen(PORT, HOST);

// setInterval(function(){
//     socket.write("事件发送！")
// },5000)

console.log('Server listening on ' + HOST +':'+ PORT);

var fs = require('fs');
var fsmonitor = require('fsmonitor');

var path = require('path');

filepath = "D:/testDb";

var fsm01 = fsmonitor.watch(filepath, null, function(change) {
    try{
        if(change.addedFiles.length > 0){
            change.addedFiles.forEach(function(pathName){
                var path =require('path');
                // console.log("changeName: ",pathName);
                var fullPath = path.join(filepath,pathName);
                // console.log('path: ', fullPath);//打印文件完全路径
                var dirPath = path.dirname(path.join(filepath,pathName));
                // console.log("dirPath: ", dirPath);//打印文件根目录
                var dirname = dirPath.substring(dirPath.lastIndexOf('\\')+1);
                // console.log("dirname: ",dirname);//发生变化的目录名称
                var fileName = pathName.substring(pathName.lastIndexOf('\\')+1);
                // console.log(fullPath)
                if(!socket) return console.error("当前tcp连接有错误！无法发送更新信息至解析服务器！")
                socket.write(JSON.stringify({type:001,file:pathName}));

                if(true){
                    console.log(dirPath,"\n",dirname,"\n",fileName);
                }
            });
        }
    }catch(e){
        console.error(e);
    }
});