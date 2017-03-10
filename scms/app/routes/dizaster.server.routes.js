var DizasterController = require('../controllers/dizaster.server.controller');
var UserController = require('../controllers/user.server.controller');

module.exports = function(app){
	app.route('/dizaster')
	.get(UserController.signinAquire,DizasterController.open);

  app.route('/data/dizaster')
    .get(UserController.signinAquire,DizasterController.list)
    .post(UserController.signinAquire,DizasterController.create);

  app.route('/data/dizaster/removeChecked')
  //删除选中项
  .put(DizasterController.removeChecked);

  app.route('/data/dizaster/:dizasterId')
    .get(UserController.signinAquire,DizasterController.get)
    .delete(UserController.signinAquire,DizasterController.getRid);
    
  app.route('/vips4/dizaster')
    .get(DizasterController.listVips)
  	.post(DizasterController.create);
    
  app.route('/update/dizaster')
  .put(DizasterController.updateIt);

  app.param('dizasterId', DizasterController.getById);
};