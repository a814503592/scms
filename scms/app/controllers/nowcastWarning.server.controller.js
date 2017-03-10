var mongoose = require('mongoose');
var NowcastWarning = mongoose.model('NowcastWarning');

const REDIS_DIZASTER_PREFIX = 'dizaster_';

module.exports = {
  open:function(req, res){
    res.render('nowcastwarning',{title:'nowcastwarning'});
  },
  // 新闻的创建
  create: function(req, res, next){
    var nowcastwarning = new NowcastWarning(req.body);
    nowcastwarning.save(function(err){
      if(err) return next(err);

      return res.json(nowcastwarning);
    });
  },

  // 获取列表
  list: function(req, res, next){
    // 对于这两个参数，还需要思考，如果用户传入负数怎么办
    var pagesize = parseInt(req.query.pagesize, 10) || 10;
    var pagestart = parseInt(req.query.pagestart, 10) || 1;

    NowcastWarning
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

  // // 处理路由参数
  // getById: function(req, res, next, id){
  //   if(!id) return next(new Error('Dizaster not Found!'));
  //   getDizasterFromRD(id,function(err,doc){
  //     if(err) return next(err);

  //     if(!doc){
  //       getDizasterFromMG(id,function(err,doc){
  //         if(err) return next(err);          
          
  //         if(!doc){
  //           return next(new Error('Dizaster not Found'));
  //         }
  //       })
  //     }else{
  //       req.dizaster = doc;
  //       return next();

  //     }
  //   });
  //   // gerDizasterFromMG(id);
  // },

// 处理路由参数
  getById: function(req, res, next, id){
    if(!id) return next(new Error('nowcastwarning not Found'));

    NowcastWarning
    .findOne({_id: id})
    .exec(function(err, doc){
      if(err) return next(err);

      // 请思考一下，与 36 行的提示报错是一样的，这样做，有什么缺点
      if(!doc) return next(new Error('nowcastwarning not Found'));

      req.nowcastwarning = doc;
      return next();
    });
  },

  // gerDizasterFromMG:function(id, cb){
  //   Dizaster
  //   .findOne({_id: id})
  //   .exec(function(err, doc){
  //     if(doc){
  //       redisClient.set(REDIS_DIZASTER_PREFIX+id,JSON.stringify(doc));
  //     }
  //    return cb(err,doc);
  //   });
  // },

  // getDizasterFromRD:function(id,cb){
  //   redisClient.get(REDIS_DIZASTER_PREFIX+id,function(err,v){
  //     if(err) return cb(err,null);
  //     try{
  //       v = JSON.parse(v);
  //     }catch(e){
  //       return cb(e,null);
  //     }
  //     return cb(err,v)
  //   });
  // },

  pictureSave:function(req, res, next){
   
  },

  getRid:function(req, res, next){
    if(!req.nowcastwarning){
        return next(new Error('nowcastwarning not Found!'));
    }else{
        NowcastWarning
        .findOne({_id: req.nowcastwarning._id})
        .exec(function(err,doc){
          if(err) return next(err);
          if(!doc) return next(new Error('nowcastwarning not Found!'));

          doc.remove();
          console.log('nowcastwarning removed');

          return res.json('删除成功！');
      });
    }    
  },

  // 获取新闻详情
  get: function(req, res, next) {
    return res.json(req.nowcastwarning);
  }
};