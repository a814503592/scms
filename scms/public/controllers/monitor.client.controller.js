angular.module('webapp')
  .controller('MonitorController', ['$scope', 'MonitorService', MonitorController]);
// angular.module("webapp", ["ngTable"]);

function MonitorController($scope, MonitorService){
  $scope.list = [];
  $scope.current = {};
  $scope.new = {};

$scope.loadMonitor= function(){
    MonitorService.list().then(
      function(data){
        $scope.list = data;
      },
      function(err){}
    );
  };

$scope.createMonitor = function(){
    $("#modal-editor").modal('show');
  };

$scope.openMonitorDetail = function(id){
    $scope.loadDetail(id);
    $("#modal-detail").modal('show');
  };

$scope.openUpdator = function(id){
    $scope.loadDetail(id);
    $("#modal-updator").modal('show');
  };


$scope.loadDetail = function(id){
    MonitorService.detail(id).then(
      function(data){
        $scope.current = data;
      },
      function(err){}
    );
  };

$scope.save = function(){
    // if(!$scope.new.name) {
    //   $scope.editorMessage = 'name is required';
    //   return;
    // }

    // if(!$scope.new.fbcontent) {
    //   $scope.editorMessage = 'fbcontent is required';
    //   return;
    // }

    $scope.editorMessage = '';

    MonitorService.save($scope.new).then(
      function(data){
        $("#modal-editor").modal('hide')
        $scope.loadMonitor();
      },
      function(err){
        $scope.editorMessage = err;
      }
    );
  };

  $scope.deleteMonitor = function(id){
    console.log('success!');
    if(confirm("are you sure to delete this Monitor?")){
      MonitorService.remove(id).then(
      function(data){
        $scope.loadMonitor();
        console.log('return success');
      },
      function(err){
        $scope.editorMessage = err;        
      });
    }
  }

  $scope.formatTime = function(time){
    if(!time){
      return '';
    }
    return moment(time).format('YYYY/MM/DD HH:mm');
    // return moment(time).format('l');
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

    $scope.loadMonitor();

}