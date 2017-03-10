var mongoose = require('mongoose');
var User = mongoose.model('User');
var Session = mongoose.model('Session');
// var hash = require('../../config/pass').hash;
var mongoStore = require('../../config/mongoStore');
var bodyParser = require('body-parser');
var SHA256 = require("crypto-js/sha256");
module.exports = {
  signinAquire:function(req, res, next){
    if(req.session && req.session.user && req.session.user.name){
      return next();
    }
    res.redirect('/login');
  },
  adminAquire:function(req, res, next){
    if(req.session.user.authority === 'admin') {
      return next();
    }else{
      return res.render('notAuthorized');
      // return res.json('Not Authorized');
    }
    // res.json('Not Admin Not Allowed');
  },
  open:function(req, res){
    res.render('manage-users',{title:'manage-users'});
  },
  openLogin:function(req, res){
    res.render('login',{title:'login'});
  },
  logout:function(req, res, next){
    if(req.session && req.session.user){
      console.log(req.session.user.name,' logout system');
      if(delete req.session.user && delete req.session.cookieID){
        res.redirect('/');
      }else{
        return res.json("×¢ÏúÊ§°Ü");
      }
    }else{
      return res.redirect('/');
    }
  },
  signup:function(req, res){
    res.render('signup',{title:'signup'});
  },
  doSign:function(req, res, next){
    var user = new User(req.body);
    user.save(function(err){
      if(err) {
        if(err.code === 11000){
          err.message = "用户名已存在，请返回登录，或者注册其他用户！"
        }
        return next(err);
      }

      return res.redirect('/');
    });
  },

  longSign:function(req, res, next){
    var user = new User(req.query);
    user.save(function(err){
      if(err) return res.json(err);

      return res.json(true);
    });
  },

  NotFound: function(req, res){
    res.render('404NotFound');
  },

  // ÐÂÎÅµÄ´´½¨
  create: function(req, res, next){
    var user = new User(req.body);
    user.save(function(err){
      if(err) return next(err);

      return res.json(user);
    });
  },

  // »ñÈ¡ÁÐ±í
  list: function(req, res, next){
    var pagesize = parseInt(req.query.pagesize, 10) || 10;
    var pagestart = parseInt(req.query.pageindex, 10) || 1;

    User
    .find({},{ "password" : 0})
    // ËÑË÷Ê±£¬Ìø¹ýµÄÌõÊý
    // .skip( (pagestart - 1) * pagesize )
    // »ñÈ¡µÄ½á¹û¼¯ÌõÊý
    // .limit( pagesize)
    .exec(function(err, docs){
      if(err) return next(err);

      return res.json(docs);
    });
  },


example: function(req, res, next){
    // var pagesize = parseInt(req.query.pagesize, 10) || 10;
    // var pagestart = parseInt(req.query.pageindex, 10) || 1;

    User
    .find()
    .exec(function(err, docs){
      if(err) return next(err);
      console.log("found");
      return res.json(docs);
    });
  },

  // ´¦ÀíÂ·ÓÉ²ÎÊý
  getById: function(req, res, next, id){
    if(!id) return next(new Error('User not Found!'));

    User
    .findOne({_id: id},{ "password" : 0})
    .exec(function(err, doc){
      if(err) return next(err);

      // ÇëË¼¿¼Ò»ÏÂ£¬Óë 36 ÐÐµÄÌáÊ¾±¨´íÊÇÒ»ÑùµÄ£¬ÕâÑù×ö£¬ÓÐÊ²Ã´È±µã
      if(!doc) return next(new Error('User not Found!'));

      req.user = doc;
      return next();
    });
  },

  getRid:function(req,res,next){
    
    if(!req.user){
        return next(new Error('User not Found!'));
    }else{
      User
      .findOne({_id: req.user._id})
      .exec(function(err,doc){
        if(err) return next(err);
        if(!doc) return next(new Error('User not Found!'));
        
        doc.remove();
        console.log('OK\n');
        return res.json('success');
      });        
    }
    // return next();
  },
  updateIt: function(req, res, next){
    var _user = new User(req.body);
    var id = _user._id;
    delete _user._id;
    if(!_user){
        return next(new Error('User not Found!'));
    }else{
      if(_user.password === ""||_user.password === null||_user.password === undefined)  {
        _user.password = undefined;
      }else{
       _user.password =  SHA256(_user.password);
      }
      User
      .update({_id: id},_user)
      .exec(function(err,doc){
        if(err) return next(err);
        if(!doc) return next(new Error('User not Found!'));
        console.log("User "+ _user.name +" Updated");      
        return res.json('success');
      });        
    }                    
  },
  // »ñÈ¡ÐÂÎÅÏêÇé
  get: function(req, res, next) {
    return res.json(req.user);
  },

  removeChecked:function(req, res, next){
    var IDs = req.body;
    if(IDs.length < 1){
      return res.json('nothing checked');
    }else{
      User.remove({_id: {$in: IDs}},function(err,docs){//É¾³ýidÎª4µÄ¼ÇÂ¼
      return res.json('success');
      });
    }
    // return next();
  },

  longLogin : function(req, res, next) {
    console.log('cookie: ',req.headers.cookie);
    var name = req.query.name;
    var password = req.query.password;
    if(isExist(req, name)){
      return res.json({success:true,data: req.session.user});
    }
    User.findOne({name: name}, function(err, user) {
      if (err) {
        return res.json({success: false, data: err});
      }

      if (!user) {
        console.log("User: ", name, " Not Found.");
        
        return res.json({success:false,data: "No This User"});
        }
      user.comparePassword(password, function(err, isMatch) {
        if (err) {
          return next(err);
        }
        if (isMatch) {
          onlineKick(user._id);
          console.log("User Matched, return user to VIPS4");
          user.password = undefined;
          req.session.user = user;
          console.log("res.cookie: ",res.req.sessionID);
          //Ä£Äâconnect.sid½á¹¹£¬·Ç±ØÒª
          ////s%3AypbxGhOzzAQDlsn3mmVGrO6A.9rtRxhQu3r8ymOZ1s%2FzlfEWaZ9MSorSBobzy8CNhjh0
          req.session.cookieID = "connect.sid=s%3A"+res.req.sessionID+".xxxx";
          return res.json({success:true,data: user});
        }else{
          res.json({success:false,data: "Wrong Password"});
        }
      });
    });
  },

  doLogin : function(req, res, next) {
    var name = req.query.name;
    var password = req.query.password;
    // console.log()
    if(isExist(req, name)){
      return res.redirect('/');
    }
    User.findOne({name: name}, function(err, user) {
      if (err) {
        return next(err);
      }

      if (!user) {
        console.log("User: ", name, " Not Found.");
        
        return res.json("no user");
      }

      user.comparePassword(password, function(err, isMatch) {
        if (err) {
          return next();
        }

        if (isMatch) {
          onlineKick(user._id);
          console.log("Password Matched");
          req.session.user = user;
          req.session.cookieID = req.headers.cookie;
          console.log("login name: ", req.session.user.name);
          console.log("login cookie: ", req.session.cookieID);

          return res.redirect('/');
        }
        else {
          console.log("Wrong Password, Login Refused");
          return res.json('wrong password');
        }
      });
    });
  },
  currentUser:function(req, res){
    if(req.session && req.session.user){
      // console.log("Finding currentUser: ",req.session.user.name)
      var currentUser = new Object;
      currentUser = req.session.user;
      currentUser.cookieID = "connect.sid=s%3A"+res.req.sessionID+".xxxx";
      currentUser.password = undefined;
      return res.json(currentUser);
    }else{
      return res.json(new Error('Login PLS'));
    }
  }
};

function onlineKick(id){
  console.log(id+'');

    Session.find({},function(err,sessions){
      console.log("IN IT");
      if(err) {
        console.log(err);
        next(err);
      }
      // console.log("???");
      var sid;
      // console.log(sessions);
      for(var i in sessions){
        if(sessions[i].session){
          var _session = JSON.parse(sessions[i].session);
          console.log("???",_session);
          if(_session.user && _session.cookieID){
            console.log("ID: ",_session.cookieID);
            // console.log("ID: ",typeof _session.user._id);
            console.log(_session.user.name);
            if(id == _session.user._id){
              console.log('Kick Found');
              var sessionid = _session.cookieID.split('=')[1];
              sid =  sessionid.split('s%3A')[1].split('.')[0];
              // console.log(sid);
              delete sessions[i];
              // res.json('this is deleted');
              break;
            }
            else{
              sid = "";
            }
          }
        }
      }
    //ÌÞ³ý£º
      if(sid != "" && sid != undefined && sid != null){
        mongoStore.destroy(sid);
        console.log('Kicked session: ',sid);
      }
  });
}

function isExist(req, name){
  if(req.session && req.session.user){
    // console.log(req.session.user);
    if(req.session.user.name == name){
      console.log(name, " Exist");
      return true;
    }
  }else{
    return false;
  }
}