var MonitorController = require('../controllers/monitor.server.controller');
var UserController = require('../controllers/user.server.controller');

module.exports = function(app){
	app.route('/monitor')
	.get(UserController.signinAquire,MonitorController.open);

	app.route('/data/monitor')
	.get(UserController.signinAquire,MonitorController.list)
	.post(UserController.signinAquire,MonitorController.create);

	app.route('/data/monitor/:monitorId')
	.get(UserController.signinAquire,MonitorController.get)
	.delete(UserController.signinAquire,MonitorController.getRid);

	app.param('monitorId', MonitorController.getById);
};