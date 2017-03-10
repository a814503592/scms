var http = require('http');

var server = http.createServer();
var io = require('socket.io').listen(server);  //pass a http.Server instance
// var io = require('socket.io');
console.log("socketio created!");
io.on("connection",function(client){
	console.log(client)
	client.on('event',function(data){
		console.log(data);
	});
	client.on("disconnect",function(){

	});
});
// io.on("")	
server.listen(7101);