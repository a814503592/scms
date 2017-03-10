//初始化程序界面
//程序后续的改动
var UI = function(){

  function InitWebUi(){

    $("#mainView").css({"height":(V.WIN.height-40 -40),"width":V.WIN.width});
    console.log('height'+window.screen.availHeight,'--->window.height ',V.WIN.height)
    console.log('width'+window.screen.availWidth,'---->window.width ',V.WIN.width)

    $("#mainView  #main_top_left").css({"width":"40px"});
    $("#mainView  #main_top_right").css({"width":(V.WIN.width -40).toString()});
    $("#bottom").css({"height":"40px"});
    $("#dataNav").animate({ left: V.WIN.width-260 ,bottom:42}, "slow");



  };


  function InitWarningUi(){
  //open child window for warning web
    // alert('www');
    var thisWidth = Math.round(window.screen.availWidth*0.9);
    var thisHeight = Math.round(window.screen.availHeight);
    if(thisWidth < 1000){thisWidth = window.screen.availWidth};
    if(thisHeight < 800){thisHeight = window.screen.availHeight};


    var WarningWin = V.GUI.Window.open('./app/v1.0.1/views/Make_Warning.html', {
      position: 'center',
      width: thisWidth,
      height: thisHeight
    });
  }

  function InitObjectiveWarningUi(){
  //open child window for warning web
    var thisWidth = Math.round(V.WIN.width);
    var thisHeight = Math.round(V.WIN.height);
    if(thisWidth < 1000){thisWidth = window.screen.availWidth};
    if(thisHeight < 800){thisHeight = window.screen.availHeight};


    var WarningWin = V.GUI.Window.open('./app/v1.0.1/views/object_warning.html', {
      position: 'center',
      width: thisWidth,
      height: thisHeight
    });
  }

  

<<<<<<< .mine
||||||| .r160
    $('#img-chatty-record').click(function(){
        $("#input-chatty-hide").trigger("click");
    });

    $('#settingImg').click(function(){
        $("#settingPad").toggle();
    });
    var HOST = chatLib.HOST;
    var EVENT_TYPE = chatLib.EVENT_TYPE;
    var PORT = chatLib.PORT;
    // var currentUser;
    var socket = null;
    
    var onlineUserMap = new zTool.SimpleMap();
    var selecteduser = new zTool.SimpleMap();
    var receivemap = new zTool.SimpleMap();

    var currentUser = null;
    var currentUserNick = null;
    var uid = 1;
    var connCounter = 1;
    var flag = 0;

    // 录音频变量
    var leftchannel = [];
    var rightchannel = [];
    var recorder = null;
    var recording = false;
    var recordingLength = 0;
    var volume = null;
    var audioInput = null;
    var sampleRate = null;
    var audioContext = null;
    var context = null;
    var outputElement = $('#audio-record');
    var myAudio = $('#talkFrame');
    var outputString;

    $.ajax({
      // url:"http://10.224.114.105:7101/currentUser",
      url:"http://172.16.40.73:7101/currentUser",
      async:false,
      type:"get",
      dataType:"json",
      success:function(json) {
        if(json._id){
          console.log("chat IN ",json.name);
          currentUser = json;
          // $('#chatPad').html('登录成功')
        }else{
          console.log("chat Not Login ",json)
          // $('#chatPad').html('请登录')
        };
      },
      error:function(e){
        console.log("chat error: ",e)
        // $('#chatPad').html('服务器繁忙')
      }
    });
    $("#errorPage").hide();
    if(typeof WebSocket === 'undefined') {
        mainPage
        $("#mainPage").hide();
        $("#prePage").attr('class','page')
        $("#prePage").html('当前浏览器不支持WebSocket，请使用chrome or opera or firefox 18');
        $("#errorPage").show();
    }
    // feature detection 
    if (!navigator.getUserMedia)
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
                      navigator.mozGetUserMedia || navigator.msGetUserMedia;

    if (navigator.getUserMedia){
        navigator.getUserMedia({audio:true}, success, function(e) {
            // alert('捕获失败！');
            
        });
    } else {
      //此处设置flag标识录音不可用
      alert('当前浏览器不支持语音，若要使用语音功能，请选用谷歌浏览器或打开浏览器的极速模式！');
    };

    function interleave(leftChannel, rightChannel){
            var length = leftChannel.length + rightChannel.length;
            var result = new Float32Array(length);

            var inputIndex = 0;

            for (var index = 0; index < length; ){
                result[index++] = leftChannel[inputIndex];
                result[index++] = rightChannel[inputIndex];
                inputIndex++;
            }
            return result;
        }

        function mergeBuffers(channelBuffer, recordingLength){
            var result = new Float32Array(recordingLength);
            var offset = 0;
            var lng = channelBuffer.length;
            for (var i = 0; i < lng; i++){
                var buffer = channelBuffer[i];
                result.set(buffer, offset);
                offset += buffer.length;
            }
            return result;
        }

        function writeUTFBytes(view, offset, string){ 
                var lng = string.length;
                for (var i = 0; i < lng; i++){
                view.setUint8(offset + i, string.charCodeAt(i));
            }
        }

        function success(e){
            // creates the audio context
            audioContext = window.AudioContext || window.webkitAudioContext;
            context = new audioContext();

            // we query the context sample rate (varies depending on platforms)
            sampleRate = context.sampleRate;

            console.log('succcess');

            // creates a gain node
            volume = context.createGain();

            // creates an audio node from the microphone incoming stream
            audioInput = context.createMediaStreamSource(e);

            // connect the stream to the gain node
            audioInput.connect(volume);

            /* From the spec: This value controls how frequently the audioprocess event is 
            dispatched and how many sample-frames need to be processed each call. 
            Lower values for buffer size will result in a lower (better) latency. 
            Higher values will be necessary to avoid audio breakup and glitches */
            var bufferSize = 2048;
            recorder = context.createScriptProcessor(bufferSize, 2, 2);

            recorder.onaudioprocess = function(e){
                if (!recording) return;
                var left = e.inputBuffer.getChannelData (0);
                var right = e.inputBuffer.getChannelData (1);
                // we clone the samples
                leftchannel.push (new Float32Array (left));
                rightchannel.push (new Float32Array (right));
                recordingLength += bufferSize;            
                console.log('recording');
            }

            // we connect the recorder
            volume.connect (recorder);
            recorder.connect (context.destination); 
        }
    
    if(currentUser && currentUser.name){
        currentUserNick = currentUser.name;
    }else{
        // alert("未登录");
        $('#talkFrame').html('未连接服务器，需要登录!')
        $('#chatPad').html('未连接服务器，需要登录!')
        return;
    }

    // if '#audio-record' is pressed, we start recording
    $('#audio-record').mousedown(function(e){
        recording = true;
        // reset the buffers for the new recording
        leftchannel.length = rightchannel.length = 0;
        recordingLength = 0;
        outputElement.html('正在录制...');
    });
     $('#audio-chatty-record').mousedown(function(e){
        recording = true;
        // reset the buffers for the new recording
        leftchannel.length = rightchannel.length = 0;
        recordingLength = 0;
        this.src = 'public/images/recording.png';
    });

    $("#message").keyup(function(event) {
        if(13 == event.keyCode) {
            sendMsg();
        }
    });

    $('#audio-record').mouseup(function(e){
        sendAudio();
    });
    $('#audio-chatty-record').mouseup(function(e){
        this.src = 'public/images/record.png';
        sendAudio();
    });

    $('#chatInput').keyup(function(event) {
        if(13 == event.keyCode) {
            sendChattyMsg();
        }
    });

    $("#send").click(function(event) {
        sendMsg();
    });

    $('#chatClear').click(function(e){
        $('#talkFrame').html("");
    });
    
    $('#chatRecord').click(function(e){
        $('.talkRight').hide();
        // $("#mainPage").css("width","960px");
        $('#viewRecord').html("");
        $('.viewRight').show();
        socket.send(JSON.stringify({
            'EVENT': EVENT_TYPE.LIST_RECORD,
            'values': [currentUser.uid, "", currentUser]
        }));

    });

    $('#closeView').click(function(e){
        $('.viewRecord').html("");
        
        $('.viewRight').hide();
        $("#mainPage").css("width","890px");
        $('.talkRight').show();
        
    });

    $('#pre').click(function(e){
        socket.send(JSON.stringify({
            'EVENT': EVENT_TYPE.LIST_RECORD,
            'values': [currentUser.uid, '-1']
        }));
    });

    $('#next').click(function(e){
        socket.send(JSON.stringify({
            'EVENT': EVENT_TYPE.LIST_RECORD,
            'values': [currentUser.uid, '1']
        }));
    });

    reset();

    socket = new WebSocket("ws://" + HOST + ":" + PORT);
        // socket = new WebSocket("wss://" + HOST + ":" + "8000");
    onlineUserMap = new zTool.SimpleMap();
    socket.onmessage = function(event) {

        var mData = chatLib.analyzeMessageData(event.data);

            if(mData && mData.event) {
                switch(mData.event) {
                case EVENT_TYPE.LOGIN:
                    // 新用户连接
                    var newUser = mData.values[0];
                    if(flag == 0) {
                        currentUser = newUser;
                        flag = 1;
                    }
                    connCounter = mData.counter;
                    onlineUserMap.clone(mData.values[1]);
                    updateOnlineUser();
                    appendMessageChatty(generalformatUserString(newUser) + "[进入聊天室]");
                    appendMessage(generalformatUserString(newUser) + "[进入聊天室]" + '<hr>');
                    break;

                case EVENT_TYPE.LOGOUT:
                    // 用户退出
                    var user = mData.values[0];
                    onlineUserMap.remove(user.uid);
                    updateOnlineUser();
                    appendMessageChatty(generalformatUserString(user) + "[离开聊天室]")
                    appendMessage(generalformatUserString(user) + "[离开聊天室]" + '<hr>');
                    break;

                case EVENT_TYPE.SPEAK:
                    // 用户发言
                    var content = mData.values[0];
                    if(mData.user.uid != currentUser.uid) {
                        if(mData.values[1]) {
                            receivemap.clone(mData.values[1]);
                            uids = receivemap.keySet();
                            for(i in uids) {
                                if(uids[i] == currentUser.uid) {
                                    appendMessageChatty(formatReceiveUserTalkString(mData.user));
                                    appendMessageChatty("<span>&nbsp;&nbsp;</span>" + content);
                                    appendMessage(formatReceiveUserTalkString(mData.user));
                                    appendMessage("<span>&nbsp;&nbsp;</span>" + content);
                                }
                            }

                        } else {
                            appendMessageChatty(formatAllUserString(mData.user));
                            appendMessageChatty("<span>&nbsp;&nbsp;</span>" + content);
                            appendMessage(formatAllUserString(mData.user));
                            appendMessage("<span>&nbsp;&nbsp;</span>" + content);
                        }
                    }
                    break;

                case EVENT_TYPE.AUDIO:
                    // 用户语音
                    var content = mData.values[0];
                    var audio = window.document.createElement('audio');
                    audio.src = content;
                    var settings = $('#autoplay').val();
                    if(settings){
                        audio.autoplay = 'autoplay';
                    }else{
                        alert('no autoplay')
                    }
                    if(mData.user.uid != currentUser.uid) {
                        if(mData.values[1].mapSize > 0) {
                            receivemap.clone(mData.values[1]);
                            uids = receivemap.keySet();
                            for(i in uids) {
                                if(uids[i] == currentUser.uid) {
                                    appendMessageChatty(formatReceiveUserTalkString(mData.user));
                                    appendMessageChatty('<img src="public/images/recorder.png" onclick="audioPlay(this)" />'+audio.outerHTML);
                                    appendMessage(formatReceiveUserTalkString(mData.user));
                                    appendMessage('<img src="public/images/recorder.png" onclick="audioPlay(this)" />'+audio.outerHTML);
                                }
                            }

                        } else {
                            appendMessageChatty(formatAllUserString(mData.user));
                            appendMessageChatty('<img src="public/images/recorder.png" onclick="audioPlay(this)" />'+audio.outerHTML);
                            appendMessage(formatAllUserString(mData.user));
                            appendMessage('<img src="public/images/recorder.png" onclick="audioPlay(this)" />'+audio.outerHTML);
                        }
                    }
                    break;

                case EVENT_TYPE.LIST_USER:
                    // 获取当前在线用户
                    var users = mData.values;
                    if(users && users.length) {
                        for(var i in users) {
                            // alert(i + ' user : ' + users[i].uid);
                            // alert('uid: ' + currentUser.uid);
                            if(users[i].uid != currentUser.uid) onlineUserMap.put(users[i].uid, users[i]);
                        }
                    }
                    //alert('currentUser:' + currentUser);
                    updateOnlineUser();
                    break;

                case EVENT_TYPE.LIST_HISTORY:
                    // 获取历史消息
                    //{'user':data.user,'content':content,'time':new Date().getTime()}
                    var data = mData.values;
                    if(data && data.length) {
                        for(var i in data) {
                            if(typeof data[i] === 'string'){
                                // appendMessage(formatUserTalkHisString(data[i].user, data[i].time));
                                // if(data[i].event === 'AUDIO'){
                                //     appendMessage('<audio src="' + data[i].content + '" controls />');
                                // }else{
                                //     appendMessage("<span>&nbsp;&nbsp;</span>" + data[i].content);
                                // }
                            }else{
                                appendMessage(formatUserTalkHisString(data[i].user.nick, data[i].time));
                                if(data[i].event === 'AUDIO'){
                                    appendMessage('<img src="public/images/recorder.png" onclick="audioPlay(this)" /><audio src="' + data[i].content + '" />');
                                }else{
                                    appendMessage("<span>&nbsp;&nbsp;</span>" + data[i].content);
                                }
                            }
                        }
                        appendMessage("<span class='gray'>==================以上为最近的历史消息==================</span>");
                    }
                    break;

                case EVENT_TYPE.LIST_RECORD:
                    var data = mData.values;
                    $('#viewRecord').html('');
                    if(data && data.length) {
                        for(var i in data) {
                            appendRecord(formatUserTalkHisString(data[i].fromName, data[i].createTime));
                            if(data[i].content.dataType === 'AUDIO'){
                                appendRecord('<img src="public/images/recorder.png" onclick="audioPlay(this)" /><audio src="' + data[i].content.dataContent + '" />');
                            }else{
                                appendRecord("<span>&nbsp;&nbsp;</span>" + data[i].content.dataContent);
                            }
                        }
                    }else{
                        appendRecord("===============没有消息记录===============");
                    }

                    // 获取消息记录
                    //{'user':data.user,'content':content,'time':new Date().getTime()}                    
                    break;

                case EVENT_TYPE.ERROR:
                    // 出错了
                    appendMessageChatty("[系统繁忙...]");
                    appendMessage("[系统繁忙...]");
                    break;

                default:
                    break;
                }

            }

    }

    socket.onerror = function(event) {
        console.log("[网络出错啦，请稍后重试...]");
    };

    socket.onclose = function(event) {
        console.log("[网络连接已被关闭...]");
        // close();
    };
    socket.onopen = function(event) {
        socket.send(JSON.stringify({
            'EVENT': EVENT_TYPE.LOGIN,
            'values': [currentUserNick,'',currentUser._id]
        }));
        socket.send(JSON.stringify({
            'EVENT': EVENT_TYPE.LIST_USER,
            'values': [currentUserNick,'',currentUser._id]
        }));
        socket.send(JSON.stringify({
            'EVENT': EVENT_TYPE.LIST_HISTORY,
            'values': [currentUserNick,'',currentUser._id]
        }));
    };

    function reset() {
        if(socket) {
            socket.close();
        }
        socket = null;
        onlineUserMap = null;
        $("#onlineUsers").html("");
        $("#talkFrame").html("");
        $("#chatPad").html("");
        $("#nickInput").val("");
    }
    //监控发送图片
    document.getElementById('input-chatty-hide').addEventListener('change', function() {
            if (this.files.length != 0) {
                var file = this.files[0];
                if(!(file.type === "image/png" || file.type === "image/jpeg" || file.type === "image/gif" || file.type === "image/tiff" || file.type === "image/fax" || file.type === "image/x-icon")){
                    return alert('请选择正确的图片格式');
                }
                var reader = new FileReader();
                if (!reader) {
                    return console.error(new Error('当前不支持FileReader()'));
                }
                reader.onload = function(event) {
                    this.value = '';

                    if(selecteduser.size() === 0) {
                        appendMessage(formatAllUserString(currentUser));
                        appendMessage('<img src="'+event.target.result+'" width="300px" />')
                        $('#viewRecord').scrollTop( $('#viewRecord')[0].scrollHeight );
                        appendMessageChatty(formatAllUserString(currentUser));
                        appendMessageChatty('<img src="'+event.target.result+'" width="300px" />')
                        $('#chatPad').scrollTop( $('#chatPad')[0].scrollHeight );
                    }else{
                        var uids = selecteduser.keySet();
                        for(var i in uids) {
                            appendMessage(formatUserString(onlineUserMap.get(uids[i])));
                            appendMessage('<img src="'+event.target.result+'" width="300px" />')
                            $('#viewRecord').scrollTop( $('#viewRecord')[0].scrollHeight );
                            appendMessageChatty(formatUserString(onlineUserMap.get(uids[i])));
                            appendMessageChatty('<img src="'+event.target.result+'" width="300px" />')
                            $('#chatPad').scrollTop( $('#chatPad')[0].scrollHeight );
                        }
                    }
                    sendPic(event.target.result);
                };
                reader.readAsDataURL(file);
            };
        }, false);

    //定义函数
      //按钮函数
    function sendAudio(){
        // we stop recording
            recording = false;
            $('#audio-chatty-record').val('按住录音');
            outputElement.html('按住录音');

            // we flat the left and right channels down
            var leftBuffer = mergeBuffers ( leftchannel, recordingLength );
            var rightBuffer = mergeBuffers ( rightchannel, recordingLength );
            // we interleave both channels together
            var interleaved = interleave ( leftBuffer, rightBuffer );

            // we create our wav file
            var buffer = new ArrayBuffer(44 + interleaved.length * 2);


            var view = new DataView(buffer);

            // RIFF chunk descriptor
            writeUTFBytes(view, 0, 'RIFF');
            view.setUint32(4, 44 + interleaved.length * 2, true);
            writeUTFBytes(view, 8, 'WAVE');
            // FMT sub-chunk
            writeUTFBytes(view, 12, 'fmt ');
            view.setUint32(16, 16, true);
            view.setUint16(20, 1, true);
            // stereo (2 channels)
            view.setUint16(22, 2, true);
            view.setUint32(24, sampleRate, true);
            view.setUint32(28, sampleRate * 4, true);
            view.setUint16(32, 4, true);
            view.setUint16(34, 16, true);
            // data sub-chunk
            writeUTFBytes(view, 36, 'data');
            view.setUint32(40, interleaved.length * 2, true);

            // write the PCM samples
            var lng = interleaved.length;
            var index = 44;
            var volume = 1;
            for (var i = 0; i < lng; i++){
            view.setInt16(index, interleaved[i] * (0x7FFF * volume), true);
            index += 2;
            }

            var blob = new Blob ( [ view ], { type : 'audio/wav' } );

            // android chrome audio不支持blob
            var reader = new FileReader();
            reader.onload = function(event){
                var audio = window.document.createElement('audio');
                audio.src = event.target.result;
                audio.controls = false;

                if(selecteduser.size() === 0) {
                    appendMessage(formatAllUserString(currentUser));
                    // appendMessage('<i class="web_voice web_voice_green" onclick="audioPlay(this)" >'+audio.outerHTML+'<sapn>'+audio.duration+'</span></i>')
                    appendMessage('<img src="public/images/recorder.png" onclick="audioPlay(this)" />'+audio.outerHTML+'<sapn>'+'</span>')
                    $('#viewRecord').scrollTop( $('#viewRecord')[0].scrollHeight );
                    appendMessageChatty(formatAllUserString(currentUser));
                    appendMessageChatty('<img src="public/images/recorder.png" onclick="audioPlay(this)" />'+audio.outerHTML+'<sapn>'+'</span>');
                    // appendMessageChatty('<a href="'+event.target.result+'" download="this.wav">this.wav</a>')
                    $('#chatPad').scrollTop( $('#chatPad')[0].scrollHeight );
                }else{
                    var uids = selecteduser.keySet();
                    for(var i in uids) {
                        appendMessage(formatUserString(onlineUserMap.get(uids[i])));
                        // appendMessage("<span>&nbsp;&nbsp;</span>" + value);
                        appendMessage('<img src="public/images/recorder.png" onclick="audioPlay(this)" />'+audio.outerHTML)
                        // myAudio.append(audio);
                        $('#viewRecord').scrollTop( $('#viewRecord')[0].scrollHeight );

                        appendMessageChatty(formatUserString(onlineUserMap.get(uids[i])));
                        // appendMessage("<span>&nbsp;&nbsp;</span>" + value);
                        appendMessageChatty('<img src="public/images/recorder.png" onclick="audioPlay(this)" />'+audio.outerHTML)
                        // myAudio.append(audio);
                        $('#chatPad').scrollTop( $('#chatPad')[0].scrollHeight );
                    }
                }
                
                socket.send(JSON.stringify({
                    'EVENT': EVENT_TYPE.AUDIO,
                    'values': [currentUser.uid, event.target.result, selecteduser]
                }));
            };
            // 转换base64
            reader.readAsDataURL(blob);

    }

    function sendPic(pic){

        socket.send(JSON.stringify({
                        'EVENT': EVENT_TYPE.IMG,
                        'values': [currentUser.uid, pic, selecteduser]
                    }));

    }

    function sendChattyMsg() {
        var value = $.trim($("#chatInput").val());
        console.log(currentUser.uid)
        if(value) {
            $("#chatInput").val('');
                if(selecteduser.size() === 0) {
                    appendMessageChatty(formatAllUserString(currentUser));
                    appendMessageChatty("<span>&nbsp;&nbsp;</span>" + value);
                    appendMessage(formatAllUserString(currentUser));
                    appendMessage("<span>&nbsp;&nbsp;</span>" + value);
                    socket.send(JSON.stringify({
                        'EVENT': EVENT_TYPE.SPEAK,
                        'values': [currentUser.uid, value]
                    }));
                }else{  
                    var uids = selecteduser.keySet();
                    for(var i in uids) {
                        appendMessageChatty(formatUserString(onlineUserMap.get(uids[i])));
                        appendMessageChatty("<span>&nbsp;&nbsp;</span>" + value);
                        appendMessage(formatUserString(onlineUserMap.get(uids[i])));
                        appendMessage("<span>&nbsp;&nbsp;</span>" + value);
                    }
                    socket.send(JSON.stringify({
                        'EVENT': EVENT_TYPE.SPEAK,
                        'values': [currentUser.uid, value, selecteduser]
                    }));
                }
        }
    };

    function sendMsg() {
        var value = $.trim($("#message").val());
        console.log(currentUser.uid)
        if(value) {
            $("#message").val('');
                if(selecteduser.size() === 0) {
                    appendMessageChatty(formatAllUserString(currentUser));
                    appendMessageChatty("<span>&nbsp;&nbsp;</span>" + value);
                    appendMessage(formatAllUserString(currentUser));
                    appendMessage("<span>&nbsp;&nbsp;</span>" + value);
                    socket.send(JSON.stringify({
                        'EVENT': EVENT_TYPE.SPEAK,
                        'values': [currentUser.uid, value]
                    }));
                }else{  
                    var uids = selecteduser.keySet();
                    for(var i in uids) {
                        appendMessageChatty(formatUserString(onlineUserMap.get(uids[i])));
                        appendMessageChatty("<span>&nbsp;&nbsp;</span>" + value);
                        appendMessage(formatUserString(onlineUserMap.get(uids[i])));
                        appendMessage("<span>&nbsp;&nbsp;</span>" + value);
                    }
                    socket.send(JSON.stringify({
                        'EVENT': EVENT_TYPE.SPEAK,
                        'values': [currentUser.uid, value, selecteduser]
                    }));
                }
        }
    };
    
    //
    //功能函数
    function updateOnlineUser() {
        var html = ["<div id = 'display'>在线用户(" + onlineUserMap.size() + ")"];
        if(onlineUserMap.size() > 0) {
            var users = onlineUserMap.values();
            for(var i in users) {
                if(users[i].uid == currentUser.uid) {
                    html.push("<p id =" + users[i].uid + ">" + generalformatUserString(users[i]) + "(我)" + "</p>");
                } else {
                    html.push("<p id =" + users[i].uid + ">" + generalformatUserString(users[i]) + "</p>");
                }
            }
        }
        html.push("</div>")

        $("#onlineUsers").html(html.join(''));
        $("#display>p").click(function(){
            if($(this).attr('class') === 'click'){
                $(this).removeClass('click');
                selecteduser.remove($(this).attr('id'));
                console.log(selecteduser);
            }else{
                selecteduser.put($(this).attr('id'), onlineUserMap.get($(this).attr('id')));
                console.log(selecteduser);
                $(this).addClass('click');

            }
        });
        // $("#display>p").toggle(

        // function() {
        //     selecteduser.put($(this).attr('id'), onlineUserMap.get($(this).attr('id')));
        //     console.log(selecteduser);
        //     $(this).addClass('click');

        // }, function() {
        //     $(this).removeClass('click');
        //     selecteduser.remove($(this).attr('id'));
        //     console.log(selecteduser);
        // });
    }

    function appendMessageChatty(msg) {
        $("#chatPad").append("<div>" + msg + "</div>");
        $('#chatPad').scrollTop( $('#chatPad')[0].scrollHeight );
    }
    
    function appendRecordChatty(msg) {
        $("#chatPad").append("<div>" + msg + "</div>");
        $('#chatPad').scrollTop( $('#chatPad')[0].scrollHeight );
    }

    function appendMessage(msg) {
        $("#talkFrame").append("<div>" + msg + "</div>");
        $('#talkFrame').scrollTop( $('#talkFrame')[0].scrollHeight );
    }
    
    function appendRecord(msg) {
        $("#viewRecord").append("<div>" + msg + "</div>");
        $('#viewRecord').scrollTop( $('#viewRecord')[0].scrollHeight );
    }

    // 给用户发言添加颜色
    function formatUserString(user) {
        if(!user) {
            return '';
        }
        if(user.uid != currentUser.uid) {
            return currentUser.nick + "<span>(" + currentUser.uid + ")</span> " + "对" + user.nick + "(" + user.uid + ")" + "说:";
        } else {
            return currentUser.nick + "<span>(" + currentUser.uid + ")</span> " + "对自己说:";
        }
        return null;
    }

    function formatAllUserString(user) {
        if(!user) {
            return '';
        }
        return user.nick + "<span>" + user.uid + ")</span> " + "对大家说:";
    }

    function formatReceiveUserTalkString(user) {
        if(!user) {
            return '';
        }
        return user.nick + "<span>(" + user.uid + ")</span>" + "对你说:";
    }

    function generalformatUserString(user) {
        if(!user) {
            return '';
        }
        return user.nick + "<span class='gray'> (" + user.uid + ") ";
    }

    // function formatUserString(user) {
    //     if(!user) {
    //         return '';
    //     }
    //     return user.nick + "<span class='gray'>(" + user.uid + ")</span> ";
    // }

    function formatUserTalkString(user) {
        return formatUserString(user) + new Date().format("hh:mm:ss") + " ";
    }

    function formatUserTalkHisString(user, time) {
        return user + " " + new Date(time).format("yyyy-MM-dd hh:mm:ss") + " ";
    }
    //定义END
 }

   function InitSinglelRadarUi(){

    var thisWidth = Math.round(window.screen.availWidth*0.8);
    var thisHeight = Math.round(window.screen.availHeight*0.8);
/*     if(thisWidth < 1000){thisWidth = window.screen.availWidth};
    if(thisHeight < 800){thisHeight = window.screen.availHeight}; */


    var WarningWin = V.GUI.Window.open('/views/Singel_radar.html', {
      position: 'center',
      width: thisWidth,
      height: thisHeight
    });
  }

=======
    $('#img-chatty-record').click(function(){
        $("#input-chatty-hide").trigger("click");
    });

    $('#settingImg').click(function(){
        $("#settingPad").toggle();
    });
    var HOST = chatLib.HOST;
    var EVENT_TYPE = chatLib.EVENT_TYPE;
    var PORT = chatLib.PORT;
    // var currentUser;
    var socket = null;
    
    var onlineUserMap = new zTool.SimpleMap();
    var selecteduser = new zTool.SimpleMap();
    var receivemap = new zTool.SimpleMap();

    var currentUser = null;
    var currentUserNick = null;
    var uid = 1;
    var connCounter = 1;
    var flag = 0;

    // 录音频变量
    var leftchannel = [];
    var rightchannel = [];
    var recorder = null;
    var recording = false;
    var recordingLength = 0;
    var volume = null;
    var audioInput = null;
    var sampleRate = null;
    var audioContext = null;
    var context = null;
    var outputElement = $('#audio-record');
    var myAudio = $('#talkFrame');
    var outputString;

    $.ajax({
      // url:"http://10.224.114.105:7101/currentUser",
      url:"http://172.16.40.73:7101/currentUser",
      async:false,
      type:"get",
      dataType:"json",
      success:function(json) {
        if(json._id){
          console.log("chat IN ",json.name);
          currentUser = json;
          // $('#chatPad').html('登录成功')
        }else{
          console.log("chat Not Login ",json)
          // $('#chatPad').html('请登录')
        };
      },
      error:function(e){
        console.log("chat error: ",e)
        // $('#chatPad').html('服务器繁忙')
      }
    });
    $("#errorPage").hide();
    if(typeof WebSocket === 'undefined') {
        mainPage
        $("#mainPage").hide();
        $("#prePage").attr('class','page')
        $("#prePage").html('当前浏览器不支持WebSocket，请使用chrome or opera or firefox 18');
        $("#errorPage").show();
    }
    // feature detection 
    if (!navigator.getUserMedia)
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
                      navigator.mozGetUserMedia || navigator.msGetUserMedia;

    if (navigator.getUserMedia){
        navigator.getUserMedia({audio:true}, success, function(e) {
            // alert('捕获失败！');
            
        });
    } else {
      //此处设置flag标识录音不可用
      alert('当前浏览器不支持语音，若要使用语音功能，请选用谷歌浏览器或打开浏览器的极速模式！');
    };

    function interleave(leftChannel, rightChannel){
            var length = leftChannel.length + rightChannel.length;
            var result = new Float32Array(length);

            var inputIndex = 0;

            for (var index = 0; index < length; ){
                result[index++] = leftChannel[inputIndex];
                result[index++] = rightChannel[inputIndex];
                inputIndex++;
            }
            return result;
        }

        function mergeBuffers(channelBuffer, recordingLength){
            var result = new Float32Array(recordingLength);
            var offset = 0;
            var lng = channelBuffer.length;
            for (var i = 0; i < lng; i++){
                var buffer = channelBuffer[i];
                result.set(buffer, offset);
                offset += buffer.length;
            }
            return result;
        }

        function writeUTFBytes(view, offset, string){ 
                var lng = string.length;
                for (var i = 0; i < lng; i++){
                view.setUint8(offset + i, string.charCodeAt(i));
            }
        }

        function success(e){
            // creates the audio context
            audioContext = window.AudioContext || window.webkitAudioContext;
            context = new audioContext();

            // we query the context sample rate (varies depending on platforms)
            sampleRate = context.sampleRate;

            console.log('succcess');

            // creates a gain node
            volume = context.createGain();

            // creates an audio node from the microphone incoming stream
            audioInput = context.createMediaStreamSource(e);

            // connect the stream to the gain node
            audioInput.connect(volume);

            /* From the spec: This value controls how frequently the audioprocess event is 
            dispatched and how many sample-frames need to be processed each call. 
            Lower values for buffer size will result in a lower (better) latency. 
            Higher values will be necessary to avoid audio breakup and glitches */
            var bufferSize = 2048;
            recorder = context.createScriptProcessor(bufferSize, 2, 2);

            recorder.onaudioprocess = function(e){
                if (!recording) return;
                var left = e.inputBuffer.getChannelData (0);
                var right = e.inputBuffer.getChannelData (1);
                // we clone the samples
                leftchannel.push (new Float32Array (left));
                rightchannel.push (new Float32Array (right));
                recordingLength += bufferSize;            
                console.log('recording');
            }

            // we connect the recorder
            volume.connect (recorder);
            recorder.connect (context.destination); 
        }
    
    if(currentUser && currentUser.name){
        currentUserNick = currentUser.name;
    }else{
        // alert("未登录");
        $('#talkFrame').html('未连接服务器，需要登录!')
        $('#chatPad').html('未连接服务器，需要登录!')
        return;
    }

    // if '#audio-record' is pressed, we start recording
    $('#audio-record').mousedown(function(e){
        recording = true;
        // reset the buffers for the new recording
        leftchannel.length = rightchannel.length = 0;
        recordingLength = 0;
        outputElement.html('正在录制...');
    });
     $('#audio-chatty-record').mousedown(function(e){
        recording = true;
        // reset the buffers for the new recording
        leftchannel.length = rightchannel.length = 0;
        recordingLength = 0;
        this.src = 'public/images/recording.png';
    });

    $("#message").keyup(function(event) {
        if(13 == event.keyCode) {
            sendMsg();
        }
    });

    $('#audio-record').mouseup(function(e){
        sendAudio();
    });
    $('#audio-chatty-record').mouseup(function(e){
        this.src = 'public/images/record.png';
        sendAudio();
    });

    $('#chatInput').keyup(function(event) {
        if(13 == event.keyCode) {
            sendChattyMsg();
        }
    });

    $("#send").click(function(event) {
        sendMsg();
    });

    $('#chatClear').click(function(e){
        $('#talkFrame').html("");
    });
    
    $('#chatRecord').click(function(e){
        $('.talkRight').hide();
        // $("#mainPage").css("width","960px");
        $('#viewRecord').html("");
        $('.viewRight').show();
        socket.send(JSON.stringify({
            'EVENT': EVENT_TYPE.LIST_RECORD,
            'values': [currentUser.uid, "", currentUser]
        }));

    });

    $('#closeView').click(function(e){
        $('.viewRecord').html("");
        
        $('.viewRight').hide();
        $("#mainPage").css("width","890px");
        $('.talkRight').show();
        
    });

    $('#pre').click(function(e){
        socket.send(JSON.stringify({
            'EVENT': EVENT_TYPE.LIST_RECORD,
            'values': [currentUser.uid, '-1']
        }));
    });

    $('#next').click(function(e){
        socket.send(JSON.stringify({
            'EVENT': EVENT_TYPE.LIST_RECORD,
            'values': [currentUser.uid, '1']
        }));
    });

    reset();

    socket = new WebSocket("ws://" + HOST + ":" + PORT);
        // socket = new WebSocket("wss://" + HOST + ":" + "8000");
    onlineUserMap = new zTool.SimpleMap();
    socket.onmessage = function(event) {

        var mData = chatLib.analyzeMessageData(event.data);

            if(mData && mData.event) {
                switch(mData.event) {
                case EVENT_TYPE.LOGIN:
                    // 新用户连接
                    var newUser = mData.values[0];
                    if(flag == 0) {
                        currentUser = newUser;
                        flag = 1;
                    }
                    connCounter = mData.counter;
                    onlineUserMap.clone(mData.values[1]);
                    updateOnlineUser();
                    appendMessageChatty(generalformatUserString(newUser) + "[进入聊天室]");
                    appendMessage(generalformatUserString(newUser) + "[进入聊天室]" + '<hr>');
                    break;

                case EVENT_TYPE.LOGOUT:
                    // 用户退出
                    var user = mData.values[0];
                    onlineUserMap.remove(user.uid);
                    updateOnlineUser();
                    appendMessageChatty(generalformatUserString(user) + "[离开聊天室]")
                    appendMessage(generalformatUserString(user) + "[离开聊天室]" + '<hr>');
                    break;

                case EVENT_TYPE.SPEAK:
                    // 用户发言
                    var content = mData.values[0];
                    if(mData.user.uid != currentUser.uid) {
                        if(mData.values[1]) {
                            receivemap.clone(mData.values[1]);
                            uids = receivemap.keySet();
                            for(i in uids) {
                                if(uids[i] == currentUser.uid) {
                                    appendMessageChatty(formatReceiveUserTalkString(mData.user));
                                    appendMessageChatty("<span>&nbsp;&nbsp;</span>" + content);
                                    appendMessage(formatReceiveUserTalkString(mData.user));
                                    appendMessage("<span>&nbsp;&nbsp;</span>" + content);
                                }
                            }

                        } else {
                            appendMessageChatty(formatAllUserString(mData.user));
                            appendMessageChatty("<span>&nbsp;&nbsp;</span>" + content);
                            appendMessage(formatAllUserString(mData.user));
                            appendMessage("<span>&nbsp;&nbsp;</span>" + content);
                        }
                    }
                    break;

                case EVENT_TYPE.AUDIO:
                    // 用户语音
                    var content = mData.values[0];
                    var audio = window.document.createElement('audio');
                    audio.src = content;
                    var settings = $('#autoplay').val();
                    if(settings){
                        audio.autoplay = 'autoplay';
                    }else{
                        alert('no autoplay')
                    }
                    if(mData.user.uid != currentUser.uid) {
                        if(mData.values[1].mapSize > 0) {
                            receivemap.clone(mData.values[1]);
                            uids = receivemap.keySet();
                            for(i in uids) {
                                if(uids[i] == currentUser.uid) {
                                    appendMessageChatty(formatReceiveUserTalkString(mData.user));
                                    appendMessageChatty('<img src="public/images/recorder.png" onclick="audioPlay(this)" />'+audio.outerHTML);
                                    appendMessage(formatReceiveUserTalkString(mData.user));
                                    appendMessage('<img src="public/images/recorder.png" onclick="audioPlay(this)" />'+audio.outerHTML);
                                }
                            }

                        } else {
                            appendMessageChatty(formatAllUserString(mData.user));
                            appendMessageChatty('<img src="public/images/recorder.png" onclick="audioPlay(this)" />'+audio.outerHTML);
                            appendMessage(formatAllUserString(mData.user));
                            appendMessage('<img src="public/images/recorder.png" onclick="audioPlay(this)" />'+audio.outerHTML);
                        }
                    }
                    break;

                case EVENT_TYPE.LIST_USER:
                    // 获取当前在线用户
                    var users = mData.values;
                    if(users && users.length) {
                        for(var i in users) {
                            // alert(i + ' user : ' + users[i].uid);
                            // alert('uid: ' + currentUser.uid);
                            if(users[i].uid != currentUser.uid) onlineUserMap.put(users[i].uid, users[i]);
                        }
                    }
                    //alert('currentUser:' + currentUser);
                    updateOnlineUser();
                    break;

                case EVENT_TYPE.LIST_HISTORY:
                    // 获取历史消息
                    //{'user':data.user,'content':content,'time':new Date().getTime()}
                    var data = mData.values;
                    if(data && data.length) {
                        for(var i in data) {
                            if(typeof data[i] === 'string'){
                                // appendMessage(formatUserTalkHisString(data[i].user, data[i].time));
                                // if(data[i].event === 'AUDIO'){
                                //     appendMessage('<audio src="' + data[i].content + '" controls />');
                                // }else{
                                //     appendMessage("<span>&nbsp;&nbsp;</span>" + data[i].content);
                                // }
                            }else{
                                appendMessage(formatUserTalkHisString(data[i].user.nick, data[i].time));
                                if(data[i].event === EVENT_TYPEAUDIO){
                                    appendMessage('<img src="public/images/recorder.png" onclick="audioPlay(this)" /><audio src="' + data[i].content + '" />');
                                }else if(data[i].event === EVENT_TYPE.IMG){
                                    appendMessage('<img src="'+data[i].content+'" width="300px" />')
                                }else{
                                    appendMessage("<span>&nbsp;&nbsp;</span>" + data[i].content);
                                }
                            }
                        }
                        appendMessage("<span class='gray'>==================以上为最近的历史消息==================</span>");
                    }
                    break;

                case EVENT_TYPE.LIST_RECORD:
                    var data = mData.values;
                    $('#viewRecord').html('');
                    if(data && data.length) {
                        for(var i in data) {
                            appendRecord(formatUserTalkHisString(data[i].fromName, data[i].createTime));
                            if(data[i].content.dataType === 'AUDIO'){
                                appendRecord('<img src="public/images/recorder.png" onclick="audioPlay(this)" /><audio src="' + data[i].content.dataContent + '" />');
                            }else{
                                appendRecord("<span>&nbsp;&nbsp;</span>" + data[i].content.dataContent);
                            }
                        }
                    }else{
                        appendRecord("===============没有消息记录===============");
                    }

                    // 获取消息记录
                    //{'user':data.user,'content':content,'time':new Date().getTime()}                    
                    break;

                case EVENT_TYPE.ERROR:
                    // 出错了
                    appendMessageChatty("[系统繁忙...]");
                    appendMessage("[系统繁忙...]");
                    break;

                default:
                    break;
                }

            }

    }

    socket.onerror = function(event) {
        console.log("[网络出错啦，请稍后重试...]");
    };

    socket.onclose = function(event) {
        console.log("[网络连接已被关闭...]");
        // close();
    };
    socket.onopen = function(event) {
        socket.send(JSON.stringify({
            'EVENT': EVENT_TYPE.LOGIN,
            'values': [currentUserNick,'',currentUser._id]
        }));
        socket.send(JSON.stringify({
            'EVENT': EVENT_TYPE.LIST_USER,
            'values': [currentUserNick,'',currentUser._id]
        }));
        socket.send(JSON.stringify({
            'EVENT': EVENT_TYPE.LIST_HISTORY,
            'values': [currentUserNick,'',currentUser._id]
        }));
    };

    function reset() {
        if(socket) {
            socket.close();
        }
        socket = null;
        onlineUserMap = null;
        $("#onlineUsers").html("");
        $("#talkFrame").html("");
        $("#chatPad").html("");
        $("#nickInput").val("");
    }
    //监控发送图片
    document.getElementById('input-chatty-hide').addEventListener('change', function() {
            if (this.files.length != 0) {
                var file = this.files[0];
                if(!(file.type === "image/png" || file.type === "image/jpeg" || file.type === "image/gif" || file.type === "image/tiff" || file.type === "image/fax" || file.type === "image/x-icon")){
                    return alert('请选择正确的图片格式');
                }
                var reader = new FileReader();
                if (!reader) {
                    return console.error(new Error('当前不支持FileReader()'));
                }
                reader.onload = function(event) {
                    this.value = '';

                    if(selecteduser.size() === 0) {
                        appendMessage(formatAllUserString(currentUser));
                        appendMessage('<img src="'+event.target.result+'" width="300px" />')
                        $('#viewRecord').scrollTop( $('#viewRecord')[0].scrollHeight );
                        appendMessageChatty(formatAllUserString(currentUser));
                        appendMessageChatty('<img src="'+event.target.result+'" width="300px" />')
                        $('#chatPad').scrollTop( $('#chatPad')[0].scrollHeight );
                    }else{
                        var uids = selecteduser.keySet();
                        for(var i in uids) {
                            appendMessage(formatUserString(onlineUserMap.get(uids[i])));
                            appendMessage('<img src="'+event.target.result+'" width="300px" />')
                            $('#viewRecord').scrollTop( $('#viewRecord')[0].scrollHeight );
                            appendMessageChatty(formatUserString(onlineUserMap.get(uids[i])));
                            appendMessageChatty('<img src="'+event.target.result+'" width="300px" />')
                            $('#chatPad').scrollTop( $('#chatPad')[0].scrollHeight );
                        }
                    }
                    sendPic(event.target.result);
                };
                reader.readAsDataURL(file);
            };
        }, false);

    //定义函数
      //按钮函数
    function sendAudio(){
        // we stop recording
            recording = false;
            $('#audio-chatty-record').val('按住录音');
            outputElement.html('按住录音');

            // we flat the left and right channels down
            var leftBuffer = mergeBuffers ( leftchannel, recordingLength );
            var rightBuffer = mergeBuffers ( rightchannel, recordingLength );
            // we interleave both channels together
            var interleaved = interleave ( leftBuffer, rightBuffer );

            // we create our wav file
            var buffer = new ArrayBuffer(44 + interleaved.length * 2);


            var view = new DataView(buffer);

            // RIFF chunk descriptor
            writeUTFBytes(view, 0, 'RIFF');
            view.setUint32(4, 44 + interleaved.length * 2, true);
            writeUTFBytes(view, 8, 'WAVE');
            // FMT sub-chunk
            writeUTFBytes(view, 12, 'fmt ');
            view.setUint32(16, 16, true);
            view.setUint16(20, 1, true);
            // stereo (2 channels)
            view.setUint16(22, 2, true);
            view.setUint32(24, sampleRate, true);
            view.setUint32(28, sampleRate * 4, true);
            view.setUint16(32, 4, true);
            view.setUint16(34, 16, true);
            // data sub-chunk
            writeUTFBytes(view, 36, 'data');
            view.setUint32(40, interleaved.length * 2, true);

            // write the PCM samples
            var lng = interleaved.length;
            var index = 44;
            var volume = 1;
            for (var i = 0; i < lng; i++){
            view.setInt16(index, interleaved[i] * (0x7FFF * volume), true);
            index += 2;
            }

            var blob = new Blob ( [ view ], { type : 'audio/wav' } );

            // android chrome audio不支持blob
            var reader = new FileReader();
            reader.onload = function(event){
                var audio = window.document.createElement('audio');
                audio.src = event.target.result;
                audio.controls = false;

                if(selecteduser.size() === 0) {
                    appendMessage(formatAllUserString(currentUser));
                    // appendMessage('<i class="web_voice web_voice_green" onclick="audioPlay(this)" >'+audio.outerHTML+'<sapn>'+audio.duration+'</span></i>')
                    appendMessage('<img src="public/images/recorder.png" onclick="audioPlay(this)" />'+audio.outerHTML+'<sapn>'+'</span>')
                    $('#viewRecord').scrollTop( $('#viewRecord')[0].scrollHeight );
                    appendMessageChatty(formatAllUserString(currentUser));
                    appendMessageChatty('<img src="public/images/recorder.png" onclick="audioPlay(this)" />'+audio.outerHTML+'<sapn>'+'</span>');
                    // appendMessageChatty('<a href="'+event.target.result+'" download="this.wav">this.wav</a>')
                    $('#chatPad').scrollTop( $('#chatPad')[0].scrollHeight );
                }else{
                    var uids = selecteduser.keySet();
                    for(var i in uids) {
                        appendMessage(formatUserString(onlineUserMap.get(uids[i])));
                        // appendMessage("<span>&nbsp;&nbsp;</span>" + value);
                        appendMessage('<img src="public/images/recorder.png" onclick="audioPlay(this)" />'+audio.outerHTML)
                        // myAudio.append(audio);
                        $('#viewRecord').scrollTop( $('#viewRecord')[0].scrollHeight );

                        appendMessageChatty(formatUserString(onlineUserMap.get(uids[i])));
                        // appendMessage("<span>&nbsp;&nbsp;</span>" + value);
                        appendMessageChatty('<img src="public/images/recorder.png" onclick="audioPlay(this)" />'+audio.outerHTML)
                        // myAudio.append(audio);
                        $('#chatPad').scrollTop( $('#chatPad')[0].scrollHeight );
                    }
                }
                
                socket.send(JSON.stringify({
                    'EVENT': EVENT_TYPE.AUDIO,
                    'values': [currentUser.uid, event.target.result, selecteduser]
                }));
            };
            // 转换base64
            reader.readAsDataURL(blob);

    }

    function sendPic(pic){

        socket.send(JSON.stringify({
                        'EVENT': EVENT_TYPE.IMG,
                        'values': [currentUser.uid, pic, selecteduser]
                    }));

    }

    function sendChattyMsg() {
        var value = $.trim($("#chatInput").val());
        console.log(currentUser.uid)
        if(value) {
            $("#chatInput").val('');
                if(selecteduser.size() === 0) {
                    appendMessageChatty(formatAllUserString(currentUser));
                    appendMessageChatty("<span>&nbsp;&nbsp;</span>" + value);
                    appendMessage(formatAllUserString(currentUser));
                    appendMessage("<span>&nbsp;&nbsp;</span>" + value);
                    socket.send(JSON.stringify({
                        'EVENT': EVENT_TYPE.SPEAK,
                        'values': [currentUser.uid, value]
                    }));
                }else{  
                    var uids = selecteduser.keySet();
                    for(var i in uids) {
                        appendMessageChatty(formatUserString(onlineUserMap.get(uids[i])));
                        appendMessageChatty("<span>&nbsp;&nbsp;</span>" + value);
                        appendMessage(formatUserString(onlineUserMap.get(uids[i])));
                        appendMessage("<span>&nbsp;&nbsp;</span>" + value);
                    }
                    socket.send(JSON.stringify({
                        'EVENT': EVENT_TYPE.SPEAK,
                        'values': [currentUser.uid, value, selecteduser]
                    }));
                }
        }
    };

    function sendMsg() {
        var value = $.trim($("#message").val());
        console.log(currentUser.uid)
        if(value) {
            $("#message").val('');
                if(selecteduser.size() === 0) {
                    appendMessageChatty(formatAllUserString(currentUser));
                    appendMessageChatty("<span>&nbsp;&nbsp;</span>" + value);
                    appendMessage(formatAllUserString(currentUser));
                    appendMessage("<span>&nbsp;&nbsp;</span>" + value);
                    socket.send(JSON.stringify({
                        'EVENT': EVENT_TYPE.SPEAK,
                        'values': [currentUser.uid, value]
                    }));
                }else{  
                    var uids = selecteduser.keySet();
                    for(var i in uids) {
                        appendMessageChatty(formatUserString(onlineUserMap.get(uids[i])));
                        appendMessageChatty("<span>&nbsp;&nbsp;</span>" + value);
                        appendMessage(formatUserString(onlineUserMap.get(uids[i])));
                        appendMessage("<span>&nbsp;&nbsp;</span>" + value);
                    }
                    socket.send(JSON.stringify({
                        'EVENT': EVENT_TYPE.SPEAK,
                        'values': [currentUser.uid, value, selecteduser]
                    }));
                }
        }
    };
    
    //
    //功能函数
    function updateOnlineUser() {

        var html = ["<div id = 'display'>在线用户(" + onlineUserMap.size() + ")"];
        // var htmlC = ["<div id = 'displayC'>在线用户(" + onlineUserMap.size() + ")"];
        var htmlC = ["<div id = 'displayC'>"];
        if(onlineUserMap.size() > 0) {
            var users = onlineUserMap.values();
            console.log(users)
            for(var i in users) {
                if(users.length < 2) htmlC.push("<p >只有你自己咯</p>");
                if(users[i].uid == currentUser.uid) {
                    html.push("<p id =" + users[i].uid + ">" + generalformatUserString(users[i]) + "(我)" + "</p>");
                    // htmlC.push("<p name =" + users[i].uid + ">" + generalformatUserString(users[i]) + "(我)" + "</p>");
                } else {
                    html.push("<p id =" + users[i].uid + ">" + generalformatUserString(users[i]) + "</p>");
                    htmlC.push("<p name =" + users[i].uid + " >" + generalformatUserString(users[i]) + "</p>");
                }
            }
        }
        html.push("</div>")
        //添加列表
        $("#onlineUsers").html(html.join(''));
        $("#check_user").html(htmlC.join(''));

        $("#display>p").click(function(){
            if($(this).attr('class') === 'click'){
                $(this).removeClass('click');
                $("#displayC>p"+"[name='"+$(this).attr('id')+"']").removeClass('click');
                selecteduser.remove($(this).attr('id'));
                console.log(selecteduser);
            }else{
                selecteduser.put($(this).attr('id'), onlineUserMap.get($(this).attr('id')));
                console.log(selecteduser);
                $(this).addClass('click');
                $("#displayC>p"+"[name='"+$(this).attr('id')+"']").addClass('click');

            }
        });
        $("#displayC>p").click(function(){
            if($(this).attr('class') === 'click'){
                $(this).removeClass('click');
                $("#display>p"+"[id='"+$(this).attr('name')+"']").removeClass('click');
                selecteduser.remove($(this).attr('name'));
                console.log(selecteduser);
            }else{
                selecteduser.put($(this).attr('name'), onlineUserMap.get($(this).attr('name')));
                console.log(selecteduser);
                $(this).addClass('click');
                $("#display>p"+"[id='"+$(this).attr('name')+"']").addClass('click');

            }
        });
        // $("#display>p").toggle(

        // function() {
        //     selecteduser.put($(this).attr('id'), onlineUserMap.get($(this).attr('id')));
        //     console.log(selecteduser);
        //     $(this).addClass('click');

        // }, function() {
        //     $(this).removeClass('click');
        //     selecteduser.remove($(this).attr('id'));
        //     console.log(selecteduser);
        // });
    }

    function appendMessageChatty(msg) {
        $("#chatPad").append("<div>" + msg + "</div>");
        $('#chatPad').scrollTop( $('#chatPad')[0].scrollHeight );
    }
    
    function appendRecordChatty(msg) {
        $("#chatPad").append("<div>" + msg + "</div>");
        $('#chatPad').scrollTop( $('#chatPad')[0].scrollHeight );
    }

    function appendMessage(msg) {
        $("#talkFrame").append("<div>" + msg + "</div>");
        $('#talkFrame').scrollTop( $('#talkFrame')[0].scrollHeight );
    }
    
    function appendRecord(msg) {
        $("#viewRecord").append("<div>" + msg + "</div>");
        $('#viewRecord').scrollTop( $('#viewRecord')[0].scrollHeight );
    }

    // 给用户发言添加颜色
    function formatUserString(user) {
        if(!user) {
            return '';
        }
        if(user.uid != currentUser.uid) {
            return currentUser.nick + "<span>(" + currentUser.uid + ")</span> " + "对" + user.nick + "(" + user.uid + ")" + "说:";
        } else {
            return currentUser.nick + "<span>(" + currentUser.uid + ")</span> " + "对自己说:";
        }
        return null;
    }

    function formatAllUserString(user) {
        if(!user) {
            return '';
        }
        return user.nick + "<span>" + user.uid + ")</span> " + "对大家说:";
    }

    function formatReceiveUserTalkString(user) {
        if(!user) {
            return '';
        }
        return user.nick + "<span>(" + user.uid + ")</span>" + "对你说:";
    }

    function generalformatUserString(user) {
        if(!user) {
            return '';
        }
        return user.nick + "<span class='gray'>  ";
    }

    // function formatUserString(user) {
    //     if(!user) {
    //         return '';
    //     }
    //     return user.nick + "<span class='gray'>(" + user.uid + ")</span> ";
    // }

    function formatUserTalkString(user) {
        return formatUserString(user) + new Date().format("hh:mm:ss") + " ";
    }

    function formatUserTalkHisString(user, time) {
        return user + " " + new Date(time).format("yyyy-MM-dd hh:mm:ss") + " ";
    }
    //定义END
 }

   function InitSinglelRadarUi(){

    var thisWidth = Math.round(window.screen.availWidth*0.8);
    var thisHeight = Math.round(window.screen.availHeight*0.8);
/*     if(thisWidth < 1000){thisWidth = window.screen.availWidth};
    if(thisHeight < 800){thisHeight = window.screen.availHeight}; */


    var WarningWin = V.GUI.Window.open('/views/Singel_radar.html', {
      position: 'center',
      width: thisWidth,
      height: thisHeight
    });
  }

>>>>>>> .r172
  function InitColorSpace(){
    filename = './app/v1.0.1/config/RmapsIn_tsfc_color.txt'
    V.FS.readFile(filename,'utf-8',function(err,contents){
           if(err){return}
            else{
              data = contents.split("\n");
              var q = d3.scale.quantize().domain(data[0].split(",")).range(data[1].split(","));
              V.color_Model.rmapsIn_tsfc = q;
            }
    });

    filename = './app/v1.0.1/config/radar_mosaic_color.txt'
    V.FS.readFile(filename,'utf-8',function(err,contents){
           if(err){return}
            else{
              data = contents.split("\n");
              var q = d3.scale.quantize().domain(data[0].split(",")).range(data[1].split(","));
              V.color_Model.radarMosaic = q;
            }
    });
  }

  function InitRegistNewUser(){
    var thisWidth = Math.round(window.screen.availWidth*0.6);
    var thisHeight = Math.round(window.screen.availHeight*0.8);
    var RegistNewUserWin = V.GUI.Window.open('/views/Singel_radar.html', {
      position: 'center',
      width: thisWidth,
      height: thisHeight
    });

  }

  return {
      InitWebUi            : InitWebUi,
      InitWarningUi        : InitWarningUi,
      InitObjectiveWarningUi:InitObjectiveWarningUi,
      // InitSinglelRadarUi   : InitSinglelRadarUi,
      InitColorSpace       : InitColorSpace   ,
      InitRegistNewUser    : InitRegistNewUser
      // InitChattyUi         : InitChattyUi

  }


}
