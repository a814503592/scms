angular.module('webapp')
	.service("MonitorService",["$http","$q",MonitorService]);
	//$q模块的目的是为了防止使用过多的回调，angular.js自带$q模块

function MonitorService($http, $q){
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
	      return handleRequest('GET', '/data/monitor', params);
	    },
	    save: function(data){
	      return handleRequest('POST', '/data/monitor', data);
	    },
	    remove:function(id){
	    	return handleRequest('DELETE', '/data/monitor/' + id);
	    },
	    detail: function(id){
	      return handleRequest('GET', '/data/monitor/' + id);
	    },
	    update: function(data){
	    	return handleRequest('PUT', '/update', data);
	    }
  	}
}