/*
 *hichat v0.4.2
 *Wayou Mar 28,2014
 *MIT license
 *view on GitHub:https://github.com/wayou/HiChat
 *see it in action:http://hichat.herokuapp.com/
 */
// var find = findU;
 // function UserFind(){
window.onload = function() {
    // UserFind();
    var hichat = new HiChat();
    hichat.init();
};
var HiChat = function() {
    this.socket = null;
};
HiChat.prototype = {
    init: function() {
        var that = this;
        this.socket = io.connect('http://172.16.40.73:7101');
        this.socket.on('connect', function() {
            // alert(currentUser._id);
            // document.getElementById('info').textContent = 'get yourself a nickname :)';
            // document.getElementById('nickWrapper').style.display = 'block';
            // document.getElementById('nicknameInput').focus();
        });
        this.socket.on('Hold', function(message){
         console.log("message is: ",message);
        });
        this.socket.on('nickExisted', function() {
            // document.getElementById('info').textContent = '!nickname is taken, choose another pls';
        });
        this.socket.on('loginSuccess', function(data) {
            // alert(data);
            // document.title = 'hichat | ' + document.getElementById('nicknameInput').value;
            // document.getElementById('loginWrapper').style.display = 'none';
            // document.getElementById('testSuccess').style.display = 'none';
            // document.getElementById('messageInput').focus();
            // alert("someone login");
        });
        this.socket.on('error', function(err) {
            // if (document.getElementById('loginWrapper').style.display == 'none') {
            //     document.getElementById('status').textContent = '!fail to connect :(';
            // } else {
            //     document.getElementById('info').textContent = '!fail to connect :(';
            // }
            console.log("socket err: ",err)
        });
        this.socket.on('system', function(nickName, userCount, type) {
            var msg = nickName + (type == 'login' ? ' joined' : ' left');
            that._displayNewMsg('system ', msg, 'red');
            // that.socket.emit('postMsg', msg , 'blue');
            // document.getElementById('status').textContent = userCount + (userCount > 1 ? ' users' : ' user') + ' online';
        });
        this.socket.on('newMsg', function(user, msg, color) {
            console.log(msg);
            that._displayNewMsg(user, msg, color);
        });
        this.socket.on('newImg', function(user, img, color) {
            that._displayImage(user, img, color);
        });
        // document.getElementById('loginBtn').addEventListener('click', function() {
        //     var nickName = document.getElementById('nicknameInput').value;
        //     if (nickName.trim().length != 0) {
        //         that.socket.emit('login', nickName);
        //     } else {
        //         document.getElementById('nicknameInput').focus();
        //     };
        // }, false);
        document.getElementById('TxtPush').addEventListener('keyup', function(e) {
            if (e.keyCode == 13) {
                var msg = document.getElementById('TxtPush').value;
                if (msg.trim().length != 0) {
                    that.socket.emit('postMsg', msg, "blue");
                    that._displayNewMsg('me', msg, "blue");
                };
            };
        }, false);
        // document.getElementById('sendBtn').addEventListener('click', function() {
        //     var messageInput = document.getElementById('messageInput'),
        //         msg = messageInput.value,
        //         color = document.getElementById('colorStyle').value;
        //     messageInput.value = '';
        //     messageInput.focus();
        //     if (msg.trim().length != 0) {
        //         that.socket.emit('postMsg', msg, color);
        //         that._displayNewMsg('me', msg, color);
        //         return;
        //     };
        // }, false);
        // document.getElementById('messageInput').addEventListener('keyup', function(e) {
        //     var messageInput = document.getElementById('messageInput'),
        //         msg = messageInput.value,
        //         color = document.getElementById('colorStyle').value;
        //     if (e.keyCode == 13 && msg.trim().length != 0) {
        //         messageInput.value = '';
        //         that.socket.emit('postMsg', msg, color);
        //         that._displayNewMsg('me', msg, color);
        //     };
        // }, false);
        // document.getElementById('clearBtn').addEventListener('click', function() {
        //     document.getElementById('historyMsg').innerHTML = '';
        // }, false);
        document.getElementById('sendImage').addEventListener('change', function() {
            if (this.files.length != 0) {
                var file = this.files[0],
                    reader = new FileReader(),
                    // color = document.getElementById('colorStyle').value;
                    color = '#000000';
                if (!reader) {
                    that._displayNewMsg('system', '!your browser doesn\'t support fileReader', 'red');
                    this.value = '';
                    return;
                };
                reader.onload = function(e) {
                    this.value = '';
                    that.socket.emit('img', e.target.result, color);
                    that._displayImage('me', e.target.result, color);
                };
                reader.readAsDataURL(file);
            };
        }, false);
        // this._initialEmoji();
        // document.getElementById('emoji').addEventListener('click', function(e) {
        //     var emojiwrapper = document.getElementById('emojiWrapper');
        //     emojiwrapper.style.display = 'block';
        //     e.stopPropagation();
        // }, false);
        // document.body.addEventListener('click', function(e) {
        //     var emojiwrapper = document.getElementById('emojiWrapper');
        //     if (e.target != emojiwrapper) {
        //         emojiwrapper.style.display = 'none';
        //     };
        // });
        // document.getElementById('emojiWrapper').addEventListener('click', function(e) {
        //     var target = e.target;
        //     if (target.nodeName.toLowerCase() == 'img') {
        //         var messageInput = document.getElementById('messageInput');
        //         messageInput.focus();
        //         messageInput.value = messageInput.value + '[emoji:' + target.title + ']';
        //     };
        // }, false);
    },
    _initialEmoji: function() {
        var emojiContainer = document.getElementById('emojiWrapper'),
            docFragment = document.createDocumentFragment();
        for (var i = 69; i > 0; i--) {
            var emojiItem = document.createElement('img');
            emojiItem.src = '../content/emoji/' + i + '.gif';
            emojiItem.title = i;
            docFragment.appendChild(emojiItem);
        };
        emojiContainer.appendChild(docFragment);
    },
    _displayNewMsg: function(user, msg, color) {
        var container = document.getElementById('historyMsg'),
            msgToDisplay = document.createElement('p'),
            date = new Date().toTimeString().substr(0, 8);
            //determine whether the msg contains emoji
            // msg = this._showEmoji(msg);
        msgToDisplay.style.color = color || '#000';
        msgToDisplay.innerHTML = user + '<span class="timespan">(' + date + '): </span>' + msg;
        container.appendChild(msgToDisplay);
        container.scrollTop = container.scrollHeight;
    },
    _displayImage: function(user, imgData, color) {
        console.log(imgData);
        var container = document.getElementById('historyMsg'),
            msgToDisplay = document.createElement('p'),
            date = new Date().toTimeString().substr(0, 8);
        msgToDisplay.style.color = color || '#000';
        // msgToDisplay.innerHTML = user + '<span class="timespan">(' + date + '): </span> <br/>' + '<a href="' + imgData + '" target="_blank"><img src="' + imgData + '"/></a>';
        msgToDisplay.innerHTML = user + '<span class="timespan">(' + date + '): </span> <br/>' + '<a href="' + imgData + '" target="_blank" download = "this.txt" ><img src="' + imgData + '"/></a>';
        container.appendChild(msgToDisplay);
        container.scrollTop = container.scrollHeight;
    },
    _showEmoji: function(msg) {
        var match, result = msg,
            reg = /\[emoji:\d+\]/g,
            emojiIndex,
            totalEmojiNum = document.getElementById('emojiWrapper').children.length;
        while (match = reg.exec(msg)) {
            emojiIndex = match[0].slice(7, -1);
            if (emojiIndex > totalEmojiNum) {
                result = result.replace(match[0], '[X]');
            } else {
                result = result.replace(match[0], '<img class="emoji" src="../content/emoji/' + emojiIndex + '.gif" />');//todo:fix this in chrome it will cause a new request for the image
            };
        };
        return result;
    }
};

// var $ = function(className){return document.querySelector(className)};

    // variables
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
    var outputElement = document.querySelector('#output');
    var myAudio = document.querySelector('.my-audio');
    var outputString;

    // feature detection 
    if (!navigator.getUserMedia)
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
                      navigator.mozGetUserMedia || navigator.msGetUserMedia;

    if (navigator.getUserMedia){
        navigator.getUserMedia({audio:true}, success, function(e) {
            // alert('捕获失败！');
        });
    } else console.log('不支持getUserMedia');

        
        // if R is pressed, we start recording

        $('#audio-record').mousedown(function(e){
            recording = true;
            // reset the buffers for the new recording
            leftchannel.length = rightchannel.length = 0;
            recordingLength = 0;
            outputElement.innerHTML = '正在录制...';
        });

        $('#audio-record').mouseup(function(e){
            // we stop recording
            recording = false;

            outputElement.innerHTML = '录制完成！';

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

            var blob = new Blob ( [ view ], { type : 'audio/mpeg' } );

            // android chrome audio不支持blob
            var reader = new FileReader();
            reader.onload = function(event){
                var audio = window.document.createElement('audio');
                audio.src = event.target.result;
                audio.controls = true;
                myAudio.appendChild(audio);
            };
            // 转换base64
            reader.readAsDataURL(blob);

        });


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
            console.log(this.socket);
            console.log('recording');
            }

            // we connect the recorder
            volume.connect (recorder);
            recorder.connect (context.destination); 
        }