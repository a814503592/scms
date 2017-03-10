angular.module('webapp')
	.service("DizasterService",["$http","$q",DizasterService]);
	//$q模块的目的是为了防止使用过多的回调，angular.js自带$q模块

function DizasterService($http, $q){
	function handleRequest(method, url, data){
		var defered = $q.defer();
		var config = {
			method : method,
			url : url
		};

		 // GET、HEAD、PUT、POST、OPTIONS 和 DELETE方法
		if('POST' === method){
			config.data = data;
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
	      return handleRequest('GET', '/data/dizaster', params);
	    },
	    save: function(data){
	      return handleRequest('POST', '/data/dizaster', data);
	    },
	    remove:function(id){
	    	return handleRequest('DELETE', '/data/dizaster/' + id);
	    },
	    removeChecked:function(data){
	    	return handleRequest('PUT', '/data/dizaster/removeChecked', data);
	    },
	    detail: function(id){
	      return handleRequest('GET', '/data/dizaster/' + id);
	    },
	    update: function(data){
	    	return handleRequest('PUT', '/update/dizaster', data);
	    }
  	}
}