/**
 * [express 框架配置]
 * @type {[type]}
 */
  var express = require('express');
  //用于解析request中的参数内容，结合express
  var bodyParser = require('body-parser');
  //读写文件系统
  var fs = require('fs');
  //用于解析上传文件，与bodyparser及express同时使用
  var multer = require('multer');
  //解析cookie
  var cookieParser = require('cookie-parser');
  //用于实现session
  var session = require('express-session');
  //将session存在mongo数据库，实现session个控制
  var MongoStore = require('connect-mongo')(session);
  //引用配置
  var config = require('../config/config');
  //上述模块中值得注意的是，express-session模块不再加入express，而connect-mongo需加入到session模块中，这样才不会报错

  var path = require('path');
  //模板引擎
  var ejs = require('ejs');
  //日志模块
  var log4js = require('log4js');
  log4js.configure('./log4js.json', { reloadSecs: 300 });//指向配置文件
  
  var logger = log4js.getLogger('log_file');
  logger.setLevel('INFO');//日志设置

  module.exports  =function(){
    //设置express
    console.log('init expesss...');

    var http = require('http');
    var express = require('express'),
    app = module.exports.app = express();

    //测试用证书
    // var options = {
    //    // pfx:fs.readFileSync('./config/keys/server.pfx'),
    //    key: fs.readFileSync('./config/server.keys/server.key'),
    //    // ca: [fs.readFileSync('./keys/ca-cert.pem')],
    //    cert: fs.readFileSync('./config/server.keys/server.crt')
    //    // passphrase:'Aa18911541805'
    // };

    var mongoStore = new MongoStore({
        // stringify:'true',
        url: config.mongodb,
        collection: 'sessions'
      });
    
    module.exports.mongoStore = mongoStore;
    // 
    app.use(log4js.connectLogger(logger, {level:log4js.levels.INFO}));

    // 匹配session,mongo及express
    app.use(session({
      resave: false,  
      saveUninitialized: true,  
      cookie: {maxAge:3600000*24},
      // cookieID: req.header.cookie,
      secret:'scms',
      store: mongoStore
    }));

    //接消息推送模块
    // var server = http.createServer(app);
    // var io = require('socket.io').listen(server);  //pass a http.Server instance    

    // var SessionSockets = require('../config/session.socket.io');//也就是以上的代码片段
    // var sessionSockets = new SessionSockets(io, mongoStore, cookieParser);  
    
    //退回上级目录
    var scmsPath = __dirname.substring(0,__dirname.lastIndexOf('\\'));
    //模板引擎 setup
    app.set('views', path.join(scmsPath, 'views'));
    app.engine('.html', ejs.__express);
    app.set('view engine', 'html');

    //以前解析文件上传的中间件
    // app.use(bodyParser.urlencoded({extended: true}));
    // app.use(bodyParser({uploadDir:'./upload_tmp'}));
    
    // 配置解析request的两个组件
    app.use(bodyParser.json());
    app.use(multer({
      dest: './public/resources/upload/',
      limits: {
        fileSize: 20000000
      }
    }));

    //发布静态文件目录
    app.use(express.static(path.join(scmsPath, 'public')));

    //根路由处理
    app.get('/',function(req, res){
      // app.locals.user = req.session.user;
      console.log('************* Main Index *************');
      if(req.session && req.session.user && req.session.user.name){
          if(req.session.user.authority ==='admin'){
              res.redirect("/manage-users");
          }else{
              res.redirect("/dizaster");
          }
      }else{
          res.redirect('/login');
      }
    });
    
    //添加路由接口（注：这部分需在express配置好一般解析及中间件后添加）

    require('../app/routes/news.server.routes')(app);
    require('../app/routes/user.server.routes')(app);
    require('../app/routes/dizaster.server.routes')(app);
    require('../app/routes/nowcastWarning.server.routes')(app);
    require('../app/routes/monitor.server.routes')(app);
    require('../app/routes/warning.server.routes')(app);
    require('../app/routes/common.server.routes')(app);
    require('../app/routes/restful.server.routes')(app);
    
    // 处理所有未知的请求
    app.use(function(req, res, next){
      res.status(404);
      try {
        return res.render('404NotFound');
      } catch(e) {
        console.error('404 set header after sent');
      } 
    });
    // 统一处理出错的情况
    // 这个逻辑是这样的，这里相当于也是一个中间件
    // 在上述路由执行完了之后，会执行这个函数，Important
    app.use(function(err, req, res, next){
      if(!err) return next();
      res.status(500);
      try {
        return res.json(err.message || 'server error');
      } catch(e) {
        console.log(e)
      }
    });
    if('development' === app.get('env')){
      app.set('showStackError', true);
      // app.use(logger(':method :url :status'));
    }
    return app;
};