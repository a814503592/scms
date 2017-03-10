angular.module('webapp')
	.service("UserService",["$http","$q",UserService]);
	//$q模块的目的是为了防止使用过多的回调，angular.js自带$q模块

function UserService($http, $q){
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
	    list: function(params){
	      return handleRequest('GET', '/data/user', params);
	    },
	    save: function(data){
	      return handleRequest('POST', '/data/user', data);
	    },
	    remove:function(id){
	    	return handleRequest('DELETE', '/data/user/' + id);
	    },
	    removeChecked:function(data){
	    	return handleRequest('PUT', '/data/user/removeChecked', data);
	    },
	    detail: function(id){
	      return handleRequest('GET', '/data/user/' + id);
	    },
	    login: function(data){
	      return handleRequest('POST', '/doLogin', data);
	    },
	    update: function(data){
	    	return handleRequest('PUT', '/user/update', data);
	    }
  	}
}