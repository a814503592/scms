angular.module('webapp')
  .controller('WarningController', ['$scope', 'WarningService', WarningController]);

function WarningController($scope, WarningService){
  $scope.list = [];
  $scope.current = {};
  $scope.new = {};
  $scope.update = {};

$scope.loadWarning= function(){
    WarningService.list().then(
      function(data){
        $scope.list = data;
      },
      function(err){}
    );
  };

$scope.createWarning = function(){
    $("#modal-editor").modal('show');
  };


$scope.openDetail = function(id){
      $scope.loadDetail(id);
      $("#modal-detail").modal('show');
    };


$scope.openUpdator = function(id){
    WarningService.detail(id).then(
        function(data){
          $scope.update = data;
          $scope.update.password = "";//拿到加密的密码，无意义
        },
        function(err){}
      );
      // $("#fbtime").datetimepicker({lang:'zh_CN'});
      $("#modal-update").modal('show');
    };

$scope.updateIt = function(){
    var _id = $scope.update._id;
    if(!_id) return;
    WarningService.update($scope.update).then(
      function(data){
        $("#modal-update").modal('hide');
        $scope.loadWarning();  
        },
        function(err){}
      );
  };

$scope.updateIt = function(){
    var _id = $scope.update._id;
    if(!_id) return;
    WarningService.update($scope.update).then(
      function(data){
        $("#modal-update").modal('hide');
        $scope.loadWarning();  
        },
        function(err){
          console.log(err)
        }
      );
  };

$scope.loadDetail = function(id){
    WarningService.detail(id).then(
      function(data){
        $scope.current = data;
      },
      function(err){}
    );
  };

$scope.save = function(){
    $scope.editorMessage = '';
    WarningService.save($scope.new).then(
      function(data){
        $("#modal-editor").modal('hide')
        $scope.loadWarning();
      },
      function(err){
        $scope.editorMessage = err;
      }
    );
  };

  $scope.deleteWarning = function(id){
    console.log('success!');
    if(confirm("are you sure to delete this Warning?")){
      WarningService.remove(id).then(
      function(data){
        $scope.loadWarning();
        console.log('return success');
      },
      function(err){
        $scope.editorMessage = err;        
      });
    }
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
        WarningService.removeChecked(arr).then(
          function(data){
            $scope.loadWarning(); 
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
  };

   $scope.sort_by = function(newSortingOrder) {
        if ($scope.sortingOrder == newSortingOrder)
            $scope.reverse = !$scope.reverse;

        $scope.sortingOrder = newSortingOrder;

        // icon setup
        $('th i').each(function(){
            // icon reset
            $(this).removeClass().addClass('icon-sort');
        });
        if ($scope.reverse)
            $('th.'+new_sorting_order+' i').removeClass().addClass('icon-chevron-up');
        else
            $('th.'+new_sorting_order+' i').removeClass().addClass('icon-chevron-down');
    };

    $scope.datePickerInit();
    $scope.loadWarning();

}