
// window.currentUser = {}; 

angular.module('webapp')
  .controller('UserController', ['$scope', 'UserService', UserController]);
// UserController.$inject = ["NgTableParams", "ngTableSimpleMediumList"];
function UserController($scope, UserService){
  $scope.list = [];
  $scope.current = {};
  $scope.new = {};
  $scope.update = {};
  $scope.login = {};
  $scope.loadUser = function(){

      $scope.paginationConf = {
          currentPage: 1,
          totalItems: 8000,
          itemsPerPage: 15,
          pagesLength: 15,
          perPageOptions: [10, 20, 30, 40, 50],
          rememberPerPage: 'perPageItems',
          onChange: function(){

          }
      };

      var pageParams = {
        pagesize: $scope.pagesize,
        pageindex: $scope.pageindex
      };

      UserService.list(pageParams).then(
        function(data){
          $scope.list = data;
        },
        function(err){}
      );

    };

  $scope.createUser = function(){

      $("#modal-editor").modal('show');
    };

  $scope.openUpdator = function(id){
      UserService.detail(id).then(
        function(data){
          $scope.update = data;
          $scope.update.password = "";//拿到加密的密码，无意义
        },
        function(err){}
      );
      $("#modal-update").modal('show');
    };

  $scope.updateIt = function(){
    var _id = $scope.update._id;
    if(!_id) return;
    UserService.update($scope.update).then(
      function(data){
        $("#modal-update").modal('hide');
        $scope.loadUser();  
        },
        function(err){}
      );
  };

  $scope.openDetail = function(id){
      $scope.loadDetail(id);
      $("#modal-detail").modal('show');
    };

  $scope.loadDetail = function(id){
      UserService.detail(id).then(
        function(data){
          $scope.current = data;
        },
        function(err){}
      );
    };

  $scope.save = function(){
      if(!$scope.new.name) {
        $scope.editorMessage = 'name is required';
        return;
      }

      if(!$scope.new.password) {
        $scope.editorMessage = 'password is required';
        return;
      }

      $scope.editorMessage = '';

      UserService.save($scope.new).then(
        function(data){
          $("#modal-editor").modal('hide')
          $scope.loadUser();
        },
        function(err){
          $scope.editorMessage = err;
        }
      );
  };

  $scope.deleteUser = function(id){
    if(confirm("确定要删除么?")){
      UserService.remove(id).then(
      function(data){
        $scope.loadUser();        
      },
      function(err){        
        $scope.editorMessage = err;        
      });
    }
  };

  $scope.formatTime = function(time){
    
    return moment(time).format('YY/MM/DD HH:mm');
    // return moment(time).format('l');
  };

  //初始化fileinput控件（第一次初始化）
  $scope.initFileInput = function (ctrlName, uploadUrl) {
    var control = $('#' + ctrlName); 

    control.fileinput({
        language: 'zh', //设置语言
        uploadUrl: uploadUrl, //上传的地址
        allowedFileExtensions : ['jpg', 'png', 'gif'],//接收的文件后缀
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

  $scope.doLogin = function(){
    if($scope.login.name === undefined || $scope.login.password === undefined){
      alert("请输入账户密码");
      return;
    }
    UserService.login($scope.login).then(
      function(data){
        console.log(data);
        if(data === 'no user'){
          alert("无此用户！");
          window.loaction = 'login.html';
        }else if(data === 'wrong password'){
          alert("账户名或密码错误！");
          window.loaction = 'login.html';
        }else{
          // window.currentUser = data;
          window.location = 'manage-users.html';
        }
      },
      function(err){
        $scope.editorMessage = err;
      }
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
        UserService.removeChecked(arr);
        $scope.loadUser();
      }
    }else{
      alert('请选择！');
    }
  }

  $scope.signupShow = function(){
    $("#modal-signup").modal('show')
  }


  $scope.loadUser();

  $scope.initFileInput("headPicture-Url", "/images/headpictures");

  // $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', loadUser);

}