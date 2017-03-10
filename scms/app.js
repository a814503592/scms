var express = require('./config/express');
var mongodb = require('./config/mongoose');

//链接数据库
var db = mongodb();
//express
var app = express();
//注：	如今想来，上述两部分其实是独立开来的
//		他们实现交互式经route->controller->model实现交互、
//		使得请求被体现到数据库中，思想值得学习
//		秩序比对mogoose.js文件和express.js即可探知
//		如此一来，nodejs mvc的形式大致已很清晰了

//暴露接口
module.exports = app;
