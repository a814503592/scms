/**
 * [config 配置项]
 * @type {[description]}
 */
var config = null;
	
if(process && process.env && process.env.NODE_ENV) {
  config = require('./env/' + process.env.NODE_ENV + '.js');
} else {
  config = require('./env/development.js');
}

var scmspath = __dirname.substring(0,__dirname.lastIndexOf('\\'));
// scmspath = scmspath.substring(0,scmspath.lastIndexOf('\\'));

config.projectPath = scmspath;

module.exports = config;