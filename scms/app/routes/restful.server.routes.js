var CommonController = require('../controllers/common.server.controller');

module.exports = function(app){

	app.use(function(req, res, next) {
    var _user = req.session.user;

    app.locals.user = _user;

    next();
  })

	//用户路由
	app.route('/rest/user/:userId')
	.get(CommonController.get)
	.delete(CommonController.getRid);

	app.route('/rest/users/create')
	.post(CommonController.create)

	app.route('/rest/users')
	.get(CommonController.list);

	app.route('/rest/users/search')
	.get(CommonController.search)
	.post(CommonController.search);

	app.route('/rest/users/update')
	.put(CommonController.updateIt);

	app.param('userId', CommonController.getById);
	// app.param('userName', UserController.getByName);

	//dizaster路由
	app.route('/rest/dizaster/:dizasterDataId')
	.get(CommonController.get)
	.delete(CommonController.getRid);

	app.route('/rest/dizasters/create')
	.post(CommonController.create)

	app.route('/rest/dizasters')
	.get(CommonController.list);

	app.route('/rest/dizasters/search')
	.get(CommonController.search);

	app.route('/rest/dizasters/update')
	.put(CommonController.updateIt);

	app.param('dizasterDataId', CommonController.getById);
	// app.param('userName', UserController.getByName);
};