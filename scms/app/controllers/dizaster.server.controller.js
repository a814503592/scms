var mongoose = require('mongoose');
var Dizaster = mongoose.model('Dizaster');

const REDIS_DIZASTER_PREFIX = 'dizaster_';

module.exports = {
  open: function(req, res){
    res.render('dizaster',{title:'dizaster'});
  },
  // 新闻的创建
  create: function(req, res, next){
    var dizaster = new Dizaster(req.body);
    dizaster.save(function(err){
      if(err) return next(err);
      return res.json(dizaster);
    });
  },

  // 获取列表
  list: function(req, res, next){
    // 对于这两个参数，还需要思考，如果用户传入负数怎么办
    var pagesize = parseInt(req.query.pagesize, 10) || 10;
    var pagestart = parseInt(req.query.pagestart, 10) || 1;

    Dizaster
    .find()
    // // 搜索时，跳过的条数
    // .skip( (pagestart - 1) * pagesize )
    // // 获取的结果集条数
    // .limit( pagesize)
    .exec(function(err, docs){
      if(err) return next(err);

      return res.json(docs);
    });
  },

  listVips: function(req, res, next){
    // 对于这两个参数，还需要思考，如果用户传入负数怎么办
    var pagesize = parseInt(req.query.pagesize, 10) || 1000;
    if(pagesize === 0){
      pagesize = null;
    }
    // var pagestart = parseInt(req.query.pagestart, 10) || 1;
    Dizaster
    .find()
    .sort('-fbtime')
    .limit(pagesize)
    .exec(function(err, docs){
      if(err) {
        res.status(500);
        return res.json(err);
      }
      return res.json(docs);
    });
  },

// 处理路由参数
  getById: function(req, res, next, id){
    if(!id) return next(new Error('Dizaster not Found'));

    Dizaster
    .findOne({_id: id})
    .exec(function(err, doc){
      if(err) return next(err);

      // 请思考一下，与 36 行的提示报错是一样的，这样做，有什么缺点
      if(!doc) return next(new Error('Dizaster not Found'));

      req.dizaster = doc;
      return next();
    });
  },

  getRid:function(req,res,next){
    if(!req.dizaster){
        return next(new Error('Dizaster not Found!'));
    }else{
        Dizaster
        .findOne({_id: req.dizaster._id})
        .exec(function(err,doc){
          if(err) return next(err);
          if(!doc) return next(new Error('Dizaster not Found!'));

          doc.remove();
          console.log('dizaster '+req.dizaster._id+' removed');

          return res.json('删除成功！');
      });
    }    
  },
  updateIt: function(req, res, next){
    var _dizaster = new Dizaster(req.body);
    // console.log(_dizaster);    
    if(!_dizaster){
        return next(new Error('Dizaster not Found!'));
    }else{
      Dizaster
      .update({_id: _dizaster._id},{ $set: _dizaster})
      .exec(function(err,doc){
        if(err) return next(err);
        if(!doc) return next(new Error('Dizaster not Found!'));
        console.log("Dizaster "+_dizaster._id+" Updated");      
        return res.json('success');
      });        
    }                    
  },
  // 获取新闻详情
  get: function(req, res, next) {
    return res.json(req.dizaster);
  },

  removeChecked:function(req, res, next){
    var IDs = req.body;
    if(IDs.length < 1){
      return next(new Error('nothing checked'));
    }else{
      Dizaster.remove({_id: {$in: IDs}},function(err,docs){
        if(err) return next(err);
        return res.json('success');
      });
    }
  },

};