var WarningController = require('../controllers/warning.server.controller');
var UserController = require('../controllers/user.server.controller');

module.exports = function(app){
	app.route('/warning')
		.get(UserController.signinAquire,WarningController.open);
    
	app.route('/data/warning')
		.get(UserController.signinAquire,WarningController.list)
		.post(UserController.signinAquire,WarningController.create);

	app.route('/data/warning/:warningId')
		.get(UserController.signinAquire,WarningController.get)
		.delete(UserController.signinAquire,WarningController.getRid);

	app.route('/vips4/warning')
		.get(WarningController.vips4list)
		.post(WarningController.vips4create);

	app.route('/vips4/warning/:warningId')
		.get(WarningController.vips4listDT)
		.delete(WarningController.getRid);

	app.route('/data/warning/removeChecked')
	  //删除选中项
	  .put(WarningController.removeChecked);

	app.route('/pdf/warning/:pdfId')
		.get(WarningController.getPdfFromDb);

	app.route('/update/warning')
	.put(WarningController.updateIt);

	app.param('warningId', WarningController.getById);
	app.param('pdfId', WarningController.getPdfById);
};