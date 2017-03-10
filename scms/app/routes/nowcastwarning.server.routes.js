var NowcastWarningController = require('../controllers/nowcastWarning.server.controller');
var UserController = require('../controllers/user.server.controller');

module.exports = function(app){
	app.route('/nowcastWarning')
	.get(UserController.signinAquire,NowcastWarningController.open);

	app.route('/data/nowcastWarning')
	.get(UserController.signinAquire,NowcastWarningController.list)
	.post(UserController.signinAquire,NowcastWarningController.create);

	app.route('/data/nowcastWarning/:nowcastWarningId')
	.get(UserController.signinAquire,NowcastWarningController.get)
	.delete(UserController.signinAquire,NowcastWarningController.getRid);

	app.param('nowcastWarningId', NowcastWarningController.getById);
};