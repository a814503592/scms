/**
 * [mongoose mogoose接mongo数据库及模型表注册]
 * @type {[type]}
 */
var mongoose = require('mongoose');
var config = require('./config');

/**
 * [exports 接入数据库（函数）]
 *  
 * @Author   bruce
 * @DateTime 2016-07-27T13:44:37+0800
 * @return   {[function]}                 [description]
 */
module.exports = function(){
  var db = mongoose.connect(config.mongodb);
  console.log('mongodb connected :',config.mongodb);

  // 导入 model
  require('../app/models/news.server.model');
  require('../app/models/user.server.model');
  require('../app/models/forewarning.server.model');
  require('../app/models/session.server.model');

  return db;
};