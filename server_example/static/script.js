     easyrtc.setStreamAcceptor( function(callerEasyrtcid, stream) {
        var video = document.getElementById('caller');


        easyrtc.setVideoObjectSrc(video, stream);
    });

     easyrtc.setOnStreamClosed( function (callerEasyrtcid) {
        easyrtc.setVideoObjectSrc(document.getElementById('caller'), "");
    });


    easyrtc.setAcceptChecker(function(otherGuy, acceptorCallback){
        acceptorCallback(true, [ "canvas_stream"]);
    });
                    

    function my_init() {

        var canvas = document.getElementById('canvas_el');
        
        console.log('blah');
        navigator.mediaDevices.getUserMedia({audio: true, video: true}).then(function(stream){
                console.log('bla');
                var video = document.getElementById("self");
                var canvas = document.getElementById('canvas_el');
                var ctx = canvas.getContext("2d");
                ctx.fillStyle = 'hsl(' + 360 * Math.random() + ', 50%, 50%)';
                
                var step = function(timestamp){
                
                    canvas.getContext('2d').
                        drawImage(video, 0, 0, canvas.width, canvas.height);
                    ctx.font = "30px Arial";
                    ctx.fillText("Hello World",10,50);

                    window.requestAnimationFrame(step);
                }

                window.requestAnimationFrame(step);

        }).catch(function(error){
            console.log(error);

        });
        var canvas_stream = canvas.captureStream(24);
        easyrtc.register3rdPartyLocalMediaStream(canvas_stream, "canvas_stream");
        console.log(easyrtc);

        easyrtc.setRoomOccupantListener( loggedInListener);
        var connectSuccess = function(myId) {
            console.log("My easyrtcid is " + myId);
        }
        var connectFailure = function(errorCode, errText) {
            console.log(errText);
        }
        easyrtc.initMediaSource(
              function(){        // success callback


                  var selfVideo = document.getElementById("self");
                  //easyrtc.setVideoObjectSrc(selfVideo, easyrtc.getLocalStream());
                  easyrtc.setVideoObjectSrc(selfVideo, easyrtc.getLocalStream());
                  
                  easyrtc.connect("Company_Chat_Line", connectSuccess, connectFailure);
              },
              connectFailure 
        );
     }


    function loggedInListener(roomName, otherPeers) {
        var otherClientDiv = document.getElementById('otherClients');
        while (otherClientDiv.hasChildNodes()) {
            otherClientDiv.removeChild(otherClientDiv.lastChild);
        }
        for(var i in otherPeers) {
            var button = document.createElement('button');
            button.onclick = function(easyrtcid) {
                return function() {
                    performCall(easyrtcid);
                }
            }(i);

            label = document.createTextNode(i);
            button.appendChild(label);
            otherClientDiv.appendChild(button);
        }
    }


    function performCall(easyrtcid) {
        easyrtc.call(
           easyrtcid,
           function(easyrtcid) { console.log("completed call to " + easyrtcid);},
           function(errorCode, errorText) { console.log("err:" + errorText);},
           function(accepted, bywho) {
              console.log((accepted?"accepted":"rejected")+ " by " + bywho);
           }, ["canvas_stream"]
       );
    }
