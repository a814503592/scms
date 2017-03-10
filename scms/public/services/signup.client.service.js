angular.module('webapp')
	.service("SignService",["$http","$q",SignService]);
	//$q模块的目的是为了防止使用过多的回调，angular.js自带$q模块

function SignService($http, $q){
	function handleRequest(method, url, data){
		var defered = $q.defer();
		var config = {
			method : method,
			url : url
		};
		if('POST' === method){
			config.data = data;
			//config.params = data;
		}else if('GET' === method){
			config.params = data;
		}else if('DELETE' === method){
			config.params = data;
		}else if('PUT' === method){
			config.data = data;
		}

		$http(config)
			.success(function(data){
		      defered.resolve(data);
		    })
    		.error(function(err){
		      defered.reject(err);
		    });
	    return defered.promise;

	}
	 return {
	    save: function(data){
	      return handleRequest('POST', '/doSign', data);
	    }
  	}
}