var mongoose = require('mongoose');
var User = mongoose.model('User');
var hash = require('../../config/pass').hash;
var fs = require('fs');
var path = require('path');
var config = require('../../config/config');
module.exports = {
  fileinput:function(req, res){
    console.log(req.files)
    if(req.files.headPicture){
      res.json({'success': true, new_path:'/resources/upload/' + req.files.headPicture.name});
    }else{
      res.status(500).json("no file uploaded");
    }
  },
    rtc: function(req, res){
      console.log("good one");
      res.render('rtc');
    },
  // 新闻的创建
  create: function(req, res, next){
    var user = new User(req.body);
    user.save(function(err){
      if(err) return next(err);

      return res.json(user);
    });
  },

  // 获取列表
  list: function(req, res, next){
    var pagesize = parseInt(req.query.pagesize, 10) || 10;
    var pagestart = parseInt(req.query.pageindex, 10) || 1;

    User
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


  search: function(req, res, next){
    console.log("User Searching");
    console.log(req.body);
    console.log(req.query);
    console.log(req.params);
    console.log(req.files);
    console.log(req.data);
              res.setHeader('Access-Control-Allow-Origin', '*');
    var name = req.query.name;
    var password = req.query.password;
    User.findOne({name: name}, function(err, user) {
        if (err) {
        console.log(err);
        return next();
        }

        if (!user) {
        console.log("User ", name," Not Found.");

        return res.json("无权访问");
        }
        console.log("User ", name," exists");
        user.comparePassword(password, function(err, isMatch) {
        if (err) {
          console.log(err);
        }

        if (isMatch) {
          console.log("Password: Matched");
          User
            .find({},{"password":0})
            .exec(function(err, docs){
              console.log("Data founded");
              if(err) return next(err);

              return res.json(docs);
            });
        }
        else {
          console.log("Wrong Password, Login Refused");
          return res.json('无权访问');
        }
      });
    });

    
  },

  // 处理路由参数
  getById: function(req, res, next, id){
    if(!id) return next(new Error('not Found!'));

    User
    .findOne({_id: id})
    .exec(function(err, doc){
      if(err) return next(err);

      // 请思考一下，与 36 行的提示报错是一样的，这样做，有什么缺点
      if(!doc) return next(new Error('not Found!'));

      req.user = doc;
      return next();
    });
  },

  getRid:function(req,res,next){
    
    if(!req.user){
        return next(new Error('not Found!'));
    }else{
      User
      .findOne({_id: req.user._id})
      .exec(function(err,doc){
        if(err) return next(err);
        if(!doc) return next(new Error('not Found!'));
        
        doc.remove();
        console.log('OK\n');
        return res.json('删除成功！');
      });        
    }
    // return next();
  },
  updateIt: function(req, res, next){
    var _user = new User(req.body);
    // console.log(_user);    
    if(!_user){
        return next(new Error('User not Found!'));
    }else{
      if(_user.password === ""||_user.password === null||_user.password === undefined)  _user.password = undefined;
      User
      .update({_id: _user._id},{ $set: _user})
      .exec(function(err,doc){
        if(err) return next(err);
        if(!doc) return next(new Error('User not Found!'));
        console.log("User Updated",doc);      
        return res.json('删除成功！');
      });        
    }                    
  },
  // 获取新闻详情
  get: function(req, res, next) {
    return res.json(req.user);
  },

  doLogin: function(req, res) {
    console.log("good day");
    console.log(req.body,"!!!!!!!!!!!!!!!!!!!!!!");
    res.json("good");
  }
};