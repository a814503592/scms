var UserController = require('../controllers/user.server.controller');
var CommonController = require('../controllers/common.server.controller');

module.exports = function(app){
	app.route('/find_user')
	.get(UserController.example);

	app.route('/rtc')
	.get(CommonController.rtc);

	app.route('/images/headpictures')
	.post(CommonController.fileinput);
}