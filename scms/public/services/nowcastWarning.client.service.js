angular.module('webapp')
  .service("NowcastWarningService",["$http","$q",NowcastWarningService]);
  //$q模块的目的是为了防止使用过多的回调，angular.js自带$q模块

function NowcastWarningService($http, $q){
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
        return handleRequest('GET', '/data/nowcastWarning', params);
      },
      save: function(data){
        return handleRequest('POST', '/data/nowcastWarning', data);
      },
      remove:function(id){
        return handleRequest('DELETE', '/data/nowcastWarning/' + id);
      },
      detail: function(id){
        return handleRequest('GET', '/data/nowcastWarning/' + id);
      }
    }
}