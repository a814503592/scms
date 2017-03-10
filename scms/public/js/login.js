/*
Originally found at http://cssdeck.com/labs/login-form-using-html5-and-css3

by: http://cssdeck.com/user/kamalchaneman




*/
var initFileInput = function (ctrlName, uploadUrl) {
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

initFileInput("headPicture-Url", "/images/headpictures");