var UserController = require('../controllers/user.server.controller');

module.exports = function(app){
	app.route('/manage-users')
	.get(UserController.signinAquire,UserController.adminAquire,UserController.open);

	app.route('/login')
	.get(UserController.openLogin);

	app.route('/doLogin')
	.get(UserController.doLogin);

	app.route('/longLogin')
	.get(UserController.longLogin);

	app.route('/signup')
	.get(UserController.signup);

	app.route('/doSign')
	.post(UserController.doSign);

	app.route('/longSign')
	.get(UserController.longSign);	
	
	app.route('/logout')
	.get(UserController.logout);

	app.route('/404NotFound')
	.get(UserController.NotFound);

	//通用数据
	app.route('/currentUser')
	.get(UserController.currentUser);

	// //测试代理服务器
	// app.route('/transInfo')
	// .get(UserController.transInfo);

	//页面数据
	app.route('/data/user')
	//列表
	.get(UserController.list)
	//新建
	.post(UserController.create);

	app.route('/data/user/removeChecked')
	//删除选中项
	.put(UserController.signinAquire,UserController.adminAquire,UserController.removeChecked);

	app.route('/data/user/:userId')
	.get(UserController.signinAquire,UserController.adminAquire,UserController.get)
	// .put(UserController.updateIt)
	.delete(UserController.signinAquire,UserController.adminAquire,UserController.getRid);
	
	app.route('/user/update')
	.put(UserController.signinAquire,UserController.adminAquire,UserController.updateIt);

	app.param('userId', UserController.getById);
	// app.param('userName', UserController.getByName);
};