var mongoose = require('mongoose');
// var User = mongoose.model('User');
// var user = new User;
var SessionSchema = new mongoose.Schema({
	// cookie:String,
	// _id: String,
	session: Object,
		// cookie: {
		// 	originalMaxAge: Number,
		// 	expires: Date,
		// 	httpOnly: Boolean,
		// 	path: String
		// 	},
		// user: {
		// 	_id: String,
		// 	name: String,
		// 	password: String,
		// 	createTime: Date,
		// 	authority: String,
		// 	unit:String,
		// 	department:String,
		// 	position:String,
		// 	phoneNum:Number,//手机号
		// 	email:String, //邮箱
		// 	headPicture:String,//url头像
		// 	meta: {
		// 	  createAt: Date,
		// 	  updateAt: Date
		// 	},
		// 	__v: Number,
		// 	cookieID: String
		// },
		// cookieID: String
	// },
	expires:String
});

var Session =  mongoose.model('Session',SessionSchema);