/**
 * [session 匹配session]
 * @type {[type]}
 */
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var config = require('../config/config');
module.exports = new MongoStore({
  // stringify:'true',
  url: config.mongodb,
  collection: 'sessions'
});