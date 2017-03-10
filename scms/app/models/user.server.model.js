var mongoose = require('mongoose');

var SHA256 = require("crypto-js/sha256");

var SALT_WORK_FACTOR = 10;

var UserSchema = new mongoose.Schema({
	name: {unique: true, type: String, msg:'用户名唯一'},
	password: {type:String,minLength: 6},
    // salt: {type: Number, default: 1024},
    // hash: {type: String, default: 'Sha256Hash'},
	// 设置默认值
  createTime: {type: Date, default: Date.now},
  authority: {type: String, default: 'visitor'},
  unit:String,
  unitPwd:String,//单位密码
  department:String,
  position:String,
  phoneNum:Number,//手机号
  email:String, //邮箱
  headPicture:String,//url头像
  meta: {
      createAt: {
        type: Date,
        default: Date.now()
      },
      updateAt: {
        type: Date,
        default: Date.now()
      }
  }
});

UserSchema.pre('save', function(next) {
  var user = this;
  console.log(user)
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now();
  }
  else {
    this.meta.updateAt = Date.now();
  }
  console.log(SHA256(user.password))
  user.password = SHA256(user.password);
  next();
});

// UserSchema.pre('update', function(next) {
//   var user = this;
//   console.log(user)
//   if (this.isNew) {
//     this.meta.createAt = this.meta.updateAt = Date.now();
//   }
//   else {
//     this.meta.updateAt = Date.now();
//   }
//   console.log(SHA256(user.password))
//   user.password = SHA256(user.password);
//   next();
// });

UserSchema.methods = {
  comparePassword: function(_password, cb) {
    console.log(SHA256(_password).toString());
    console.log(this.password);
    if(this.password === SHA256(_password).toString()){
      cb(null,true); 
    }else{
      return cb(null,false);
    }
  },
  codePassword: function(_password){
    return SHA256(_password);
  }
};

var User =  mongoose.model('User',UserSchema);