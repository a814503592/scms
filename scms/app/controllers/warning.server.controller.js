var mongoose = require('mongoose');
var Warning = mongoose.model('Warning');
var fs = require('fs');

const REDIS_DIZASTER_PREFIX = 'dizaster_';

module.exports = {
  open:function(req, res){
    res.render('warning',{title:'warning'});
  },
  // 新闻的创建
  create: function(req, res, next){
    // req.body.fbtime = new Date(req.body.fbtime);
    var warning = new Warning(req.body);
    warning.save(function(err){
      if(err) {
        console.log(err);
        return next(err);
      }
      return res.json(warning);
    });
  },

  // 获取列表
  list: function(req, res, next){
    var pagesize = parseInt(req.query.pagesize, 10) || 10;
    var pagestart = parseInt(req.query.pagestart, 10) || 1;

    Warning
    .find()
    // 搜索时，跳过的条数
    .skip( (pagestart - 1) * pagesize )
    // 获取的结果集条数
    .limit( pagesize)
    .exec(function(err, docs){
      if(err) return next(err);

      return res.json(docs);
    });
  },

  vips4listDT: function(req, res, next){
    return res.json(req.warning);
  },

  vips4create: function(req, res, next){
    // console.log(req.body);
    console.log(req.files);
    if(req.body.fbtime === undefined){
      console.log("not good");
      // return next(new Error("数据未上传！"))
      return res.status(500).json("数据未上传！")
    }
    if(req.files.warningPDF === undefined){
      // return next(new Error("未找到文件！"))
      return res.status(500).json("未找到文件！");
    }
    if(req.files.warningPDF.extension != "pdf"){
      // return next(new Error("未找到文件！"))
      return res.status(500).json("非pdf文件！");
    }
    var pdfName = req.files.warningPDF.name;
    //存文件到数据库
    var mongooseNew = require('mongoose');
    var Grid = require('gridfs-stream');
    Grid.mongo = mongooseNew.mongo;
    var mongodbPath = require('../../config/env/development.js').mongodb;
    var conn = mongooseNew.createConnection(mongodbPath);
    conn.once('open', function () {
      console.log("************* GridFS Open *************");
      var gfs = Grid(conn.db);
      var writestream = gfs.createWriteStream({
          filename: pdfName
      });
      fs.createReadStream('./public/resources/upload/'+pdfName).pipe(writestream);
   
      writestream.on('close', function (file) {
          // do something with `file`
          console.log("fileID: ",file._id)
          // fs.unlinkSync('./public/resources/upload/'+pdfName);
          console.log(file.filename + ' Written To DB');
          var warning = new Warning(req.body);
          // console.log(pdfName)
          warning.warningPDF = file._id;
          warning.pdfPath = req.files.warningPDF.path;
          console.log("warning: ",warning.pdfPath)
          warning.save(function(err){
            if(err) {
                console.log("Warning err :",err)
              return res.status(500).json(err);
            }
            return res.json("发布成功！");
          });
      });
    });
  },

  vips4list: function(req, res){
    // var pagesize = parseInt(req.query.pagesize, 10) || 10;
    // var pagestart = parseInt(req.query.pagestart, 10) || 1;
    var fbuser = req.body.fbuser;
    var status = req.body.status;
    var query = {};
    if(fbuser){
      query["fbuser"] = fbuser;
    }
    if(status && status === "解除"){
      query["status"] = status;
    }
    console.log("query: ",query)
    Warning
    .find(query)
    // // 搜索时，跳过的条数
    // .skip( (pagestart - 1) * pagesize )
    // // 获取的结果集条数
    // .limit( pagesize)
    .sort({'SN_number':-1})
    .exec(function(err, docs){
      if(err) return res.status(500).json(err);
      return res.json(docs);
    });
  },

// 处理路由参数
  getById: function(req, res, next, id){
    if(!id) return next(new Error('Warning not Found'));

    Warning
    .findOne({_id: id})
    .exec(function(err, doc){
      if(err) return next(err);

      if(!doc) return next(new Error('Warning not Found'));

      req.warning = doc;
      return next();
    });
  },

getPdfFromDb: function(req, res, next){
    var mongooseNew = require('mongoose');
    var Grid = require('gridfs-stream');
    Grid.mongo = mongooseNew.mongo;
    var mongodbPath = require('../../config/env/development.js').mongodb;
    var conn = mongooseNew.createConnection(mongodbPath);
    var chunks = [];
    var size = 0;
    conn.once('open', function () {
      console.log("抓取PDF: ", req.thisID);
      var gfs = Grid(conn.db);
      var readStream = gfs.createReadStream({
        _id: req.thisID,
      });
      readStream.on('data', function(chunk) {
        //此处拼接gfs流中的chunk到数组
        chunks.push(chunk);
        size += chunk.length;
      });
      readStream.on('end', function() {
        //此处解析chunks为大Buffer
        var data = null;  
        switch(chunks.length) {  
          case 0: data = new Buffer(0);  
            break;  
          case 1: data = chunks[0];  
            break;  
          default:
            data = new Buffer(size);  
            for (var i = 0, pos = 0, l = chunks.length; i < l; i++) {  
              var chunk = chunks[i];  
              chunk.copy(data, pos);  
              pos += chunk.length;  
            }  
            break;  
        }
        res.json(data);
      });
      readStream.on('error', function (err) {
        console.log('An readStream error occurred!\n', err);
        return next(err);
      });
    });
  },

  getPdfById: function(req, res, next, id){
    if(!id) return next(new Error('PDF not Found'));
    req.thisID = id;
    next();
  },

  pictureSave:function(req, res, next){
   
  },

  getRid:function(req, res, next){
    if(!req.warning){
        return next(new Error('Warning not Found!'));
    }else{
        Warning
        .findOne({_id: req.warning._id})
        .exec(function(err,doc){
          if(err) return next(err);
          if(!doc) return next(new Error('Warning not Found!'));

          doc.remove();
          console.log('Warning removed');

          return res.json('删除成功！');
      });
    }    
  },

  updateIt: function(req, res, next){
    var _warning = new Warning(req.body);
    if(!_warning){
        return next(new Error('Warning not Found!'));
    }else{
      console.log(_warning);    
      Warning
      .update({_id: _warning._id},{ $set: _warning})
      .exec(function(err,doc){
        console.log(err)
        if(err) return next(err);
        if(!doc) return next(new Error('Warning not Found!'));
        console.log("Warning Updated",doc);      
        return res.json('success');
      });        
    }                    
  },

  // 获取新闻详情
  get: function(req, res, next) {
    return res.json(req.warning);
  },

  removeChecked:function(req, res, next){
    var IDs = req.body;
    if(IDs.length < 1){
      return next(new Error('nothing checked'));
    }else{
      Warning.remove({_id: {$in: IDs}},function(err,docs){
        if(err) return next(err);
        return res.json('success');
      });
    }
  }
};