
// window.currentUser = {}; 

angular.module('webapp')
  .controller('SignController', ['$scope', 'SignService', SignController]);
// UserController.$inject = ["NgTableParams", "ngTableSimpleMediumList"];
function SignController($scope, SignService){

  $scope.new = {};

  $scope.sign = function(){
    if(!$scope.new.name) {
        $scope.editorMessage = 'name is required';
        return;
      }

      if(!$scope.new.password) {
        $scope.editorMessage = 'password is required';
        return;
      }

      $scope.editorMessage = '';

      SignService.save($scope.new).then(
        function(data){
          alert("注册成功!");
          window.location = '/login';
          // $("#modal-editor").modal('hide')
          // $scope.loadUser();
        },
        function(err){
          $scope.editorMessage = err;
        }
      );
  }

  //初始化fileinput控件（第一次初始化）
  $scope.initFileInput = function (ctrlName, uploadUrl) {
    var control = $('#' + ctrlName); 

    control.fileinput({
        language: 'zh', //设置语言
        uploadUrl: uploadUrl, //上传的地址
        allowedFileExtensions : ['pdf', 'jpg', 'png', 'gif', 'doc' ,'docx'],//接收的文件后缀
        showUpload: true, //是否显示上传按钮
        showCaption: true,//是否显示标题
        browseClass: "btn btn-primary", //按钮样式             
        previewFileIcon: "<i class='glyphicon glyphicon-king'></i>", 
    }).on('filepreupload', function() {
        $('#kv-success-box').html('');
    }).on('fileuploaded', function(event, data) {
      console.log(data);
      $scope.new.headPicture = data.response.new_path;
      $('.file-footer-caption').title = data.response.new_path;
        $('#kv-success-box').append(data.response.link);
        $('#kv-success-modal').modal('show');
    });
  };

  $scope.initFileInput("headPicture-Url", "/images/headpictures");

  // $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', loadUser);

}