angular.module('webapp')
  .controller('DizasterController', ['$scope', 'DizasterService', DizasterController]);
// angular.module("webapp", ["ngTable"]);

function DizasterController($scope, DizasterService){
  $scope.list = [];
  $scope.current = {};
  $scope.new = {};
  $scope.update = {};

$scope.loadDizaster= function(){
    DizasterService.list().then(
      function(data){
        $scope.list = data;
      },
      function(err){}
    );
  };

$scope.createDizaster = function(){
    $("#modal-editor").modal('show');
  };

$scope.openDetail = function(id){
    $scope.loadDetail(id);
    $("#modal-detail").modal('show');
  };

$scope.openUpdator = function(id){
    $scope.loadDetail(id);
    $("#modal-updator").modal('show');
  };


$scope.loadDetail = function(id){
    DizasterService.detail(id).then(
      function(data){
        $scope.current = data;
      },
      function(err){}
    );
  };

$scope.save = function(){
    $scope.editorMessage = '';

    DizasterService.save($scope.new).then(
      function(data){
        $("#modal-editor").modal('hide')
        $scope.loadDizaster();
      },
      function(err){
        $scope.editorMessage = err;
      }
    );
  };

  $scope.deleteDizaster = function(id){
    if(confirm("are you sure to delete this Dizaster?")){
      DizasterService.remove(id).then(
      function(data){
        $scope.loadDizaster();
        console.log('remove success');
      },
      function(err){
        $scope.editorMessage = err;        
      });
    }
  }

  $scope.openUpdator = function(id){
      DizasterService.detail(id).then(
        function(data){
          $scope.update = data;
          $scope.update.password = "";//拿到加密的密码，无意义
          // $scope.update._id = id;
        },
        function(err){}
      );
      $("#modal-update").modal('show');
    };

  $scope.updateIt = function(){
    var _id = $scope.update._id;
    if(!_id) return;
    DizasterService.update($scope.update).then(
      function(data){
        $("#modal-update").modal('hide');
        $scope.loadDizaster();  
        },
        function(err){}
      );
  };

  $scope.selectAll = function(){
    $("input[name='listTable']").prop("checked",true);
  };

  $scope.reverseCheck = function(){
    $("input[name='listTable']").each(function(){
      if($(this).prop('checked') === true){
        $(this).prop("checked",false);
      }else{
        $(this).prop("checked",true);
      }
    });
  };

  $scope.deleteChecked = function(){
    var arr = [];
    $("input[name='listTable']").each(function(){
      if($(this).prop('checked') === true){
        arr.push($(this).val());
      }
    });
    console.log(arr);
    if(arr.length > 0){
      if(confirm('确定删除这'+arr.length+'项么？')){
        DizasterService.removeChecked(arr).then(
          function(data){
            $("#modal-editor").modal('hide');
            $scope.loadDizaster(); 
          },
          function(err){
            console.log(err);
          }
        );
      }
    }else{
      alert('请选择！');
    }
  };

  $scope.datePickerInit = function(time){
    $("input[name='date']").datetimepicker({});
  };

  $scope.formatTime = function(time){
    if(!time){
      return '';
    }
    return moment(time).format('YYYY/MM/DD HH:mm');
    // return moment(time).format('l');
  };

  $scope.datePickerInit();  
  $scope.loadDizaster();

}