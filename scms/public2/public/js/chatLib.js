(function(exports) {
	// 事件类型
	exports.EVENT_TYPE = {
		'LOGIN'			: 'LOGIN',
		'LOGOUT'		: 'LOGOUT',
		'SPEAK'			: 'SPEAK',
		'AUDIO'			: 'AUDIO',
		'LIST_USER'		: 'LIST_USER',
		'ERROR'			: 'ERROR',
		'LIST_HISTORY'	: 'LIST_HISTORY',
		"LIST_RECORD" 	: 'LIST_RECORD',
		'IMG'			: 'IMG'
	};

	// 服务端口
	exports.PORT = 8000;

	// 服务端口 
	// need to alter to your ip adress
	exports.HOST = "172.16.40.73";
	// exports.HOST = "192.168.252.1";

	var analyzeMessageData = exports.analyzeMessageData = function(message) {
			try {
				return JSON.parse(message);
			} catch(error) {
				// 收到了非正常格式的数据
				console.log('method:analyzeMsgData,error:' + error);
			}

			return null;
		}

	var getMsgFirstDataValue = exports.getMsgFirstDataValue = function(mData) {
			if(mData && mData.values && mData.values[0]) {
				return mData.values[0];
			}

			return '';
		}

	var getMsgSecondDataValue = exports.getMsgSecondDataValue = function(mData) {
			if(mData && mData.values && mData.values[1]) {
				return mData.values[1];
			}

			return '';
		}

})((function() {
	if(typeof exports === 'undefined') {
		window.chatLib = {};
		return window.chatLib;
	} else {
		return exports;
	}
})());