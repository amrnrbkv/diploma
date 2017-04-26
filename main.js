
// var IPAddress = document.getElementById('ip');
// var nickname = document.getElementById('nickname');
// var playButton = document.getElementsByTagName("button");
// var data;
// var visible = document.getElementsByClassName('visible');
//
// function ValidateIPaddress(){
//
//  if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(IPAddress.value))
//   {
//     return (true);
//   }
//
//   IPAddress.style.borderColor = "red";
//   IPAddress.style.boxShadow = "0px 0px 25px 5px rgba(255,0,0,0.5)";
//   visible[0].style.background = "linear-gradient(135deg, white, #ff0000)";
//   alert("You have entered an invalid IP address!");
//   return (false);
// }
//
//
// //////////////////////////////////////
//
//
//
// //////////////////////////////////////
//
//
//
//
//
//
//
//
// function ValidateNickname(){
//
//
//
//   if(nickname.value.length == 0){
//     nickname.style.borderColor = "red";
//     nickname.style.boxShadow = "0px 0px 25px 5px rgba(255,0,0,0.5)";
//     visible[0].style.background = "linear-gradient(135deg, white, #ff0000)";
//     alert("Your nickname should contain at least one symbol");
//     return false;
//   }
//
//   else if(nickname.value.length > 10){
//     nickname.style.borderColor = "red";
//     nickname.style.boxShadow = "0px 0px 25px 5px rgba(255,0,0,0.5)";
//     visible[0].style.background = "linear-gradient(135deg, white, #ff0000)";
//     alert("Your nickname should contain no more than 10 symbols");
//     return false;
//   }
//
//   else{
//     return true;
//   }
// }
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
// function initConnection(){
//   var address = 'ws://' + IPAddress.value + ':8888';
//   var socket = new WebSocket(address);
//   var ready = false;
//   socket.binaryType = "arraybuffer";
//
//   socket.addEventListener('open', function (event) {
//
//     console.log("Connection was successfully installed!!!");
//     var encodedText;
//     var dataSize = nickname.value.length + 2;
//     var data = new ArrayBuffer(dataSize);
//     var view = new DataView(data);
//     var encoder = new TextEncoder();
//     view.setUint16(0, 1001, true);
//     encodedText = encoder.encode(nickname.value);
//
//     for (var i = 0; i < nickname.value.length; i++) {
//       view.setUint8(i+2, encodedText[i], true);
//     }
//
//     socket.send(data);
//
//   });
//
//   socket.addEventListener('message', function (event) {
//     console.log(event.data);
//     var dataview = new DataView(event.data);
//     var code = dataview.getUint16(0, true);
//     console.log(code);
//
//     if(code == 2001){
//       document.getElementById('win').style.display='none';
//       start();
//     }
//
//
//     else if(code == 2002){
//       nickname.value = "Your nick is already used";
//       nickname.style.borderColor = "red";
//       nickname.style.boxShadow = "0px 0px 25px 5px rgba(255,0,0,0.5)";
//       IPAddress.style.color = "red";
//       visible[0].style.background = "linear-gradient(135deg, white, #ff0000)";
//     }
//
//     else if(code == 2003){
//       IPAddress.value = "This server is full!!!";
//       IPAddress.style.borderColor = "red";
//       IPAddress.style.color = "red";
//       IPAddress.style.boxShadow = "0px 0px 25px 5px rgba(255,0,0,0.5)";
//       visible[0].style.color = "linear-gradient(135deg, white, #ff0000);";
//     }
//
//     else {
//       IPAddress.value = "Unknown Error!!!";
//       IPAddress.style.borderColor = "red";
//       IPAddress.style.color = "red";
//       IPAddress.style.boxShadow = "0px 0px 25px 5px rgba(255,0,0,0.5)";
//       nickname.value = "Unknown Error!!!";
//       nickname.style.borderColor = "red";
//       nickname.style.color = "red";
//       nickname.style.boxShadow = "0px 0px 25px 5px rgba(255,0,0,0.5)";
//       visible[0].style.background = "linear-gradient(135deg, white, #ff0000)";
//     }
//
//   });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//     socket.onclose = function(){
//       document.getElementById('win').style.display ='inline';
//
//       IPAddress.value = "Connection was terminated...";
//       IPAddress.style.color = "red";
//       IPAddress.style.borderColor = "red";
//       IPAddress.style.boxShadow = "0px 0px 25px 5px rgba(255,0,0,0.5)";
//       visible[0].style.background = "linear-gradient(135deg, white, #ff0000)";
//     };
//
//
//   return ready;
//
// };
//
//
//
// playButton[0].onclick = function(){
//   if (ValidateIPaddress() && ValidateNickname()) {
//       initConnection();
//   }
// };
//





var start = function() {

    var loadingStatus = 0;




    var t0 = performance.now();
    var red = 0;
    var timeElapsed = 0;

    var location = vec3.create();
    var rotation = 0;


    var t1 = performance.now();
    var diff = t1 - t0;
    t0 = performance.now();


	var canvas  = document.getElementById("c");
	var canvas2 = document.getElementById("c2");
    canvas.width = window.innerWidth;
    canvas.height =  window.innerHeight;
	canvas2.width = window.innerWidth;
    canvas2.height =  window.innerHeight;


	loadingStatus++;
	xaGraphic.Initialize(canvas,function(){
		loadingStatus--;
		xaUI.SetLoadingScreen(false);
		console.log("xaGraphic Ready!");
	});
	//Context2D
	xaUI.Initialize(canvas2);
	//

    var isWKeyPressed, isAKeyPressed, isSKeyPressed, isDKeyPressed;
    isWKeyPressed = isAKeyPressed = isSKeyPressed = isDKeyPressed = false;


    window.onkeydown = function(event) {
        switch (event.code) {
            case 'KeyW':
                isWKeyPressed = true;
                break;


            case 'KeyA':
                isAKeyPressed = true;
                break;


            case 'KeyS':
                isSKeyPressed = true;
                break;


            case 'KeyD':
                isDKeyPressed = true;
                break;


        }

    };


    window.onkeyup = function(event) {
        switch (event.code) {
            case 'KeyW':
                isWKeyPressed = false;
                break;

            case 'KeyA':
                isAKeyPressed = false;
                break;

            case 'KeyS':
                isSKeyPressed = false;
                break;

            case 'KeyD':
                isDKeyPressed = false;
                break;

        }
    };



    var cameraSpeed = 0.001;




    //PointerLock API --- Start
    document.onclick = function() {
        canvas.requestPointerLock();
    };



    document.addEventListener('pointerlockchange', lockChangeAlert, false);


    function lockChangeAlert() {
        if (document.pointerLockElement === canvas) {
            console.log('The pointer lock status is now locked');
            document.addEventListener("mousemove", updatePosition, false);
        } else {
            console.log('The pointer lock status is now unlocked');
            document.removeEventListener("mousemove", updatePosition, false);
        }
    }


    var onYDegree = 0,
        onXDegree = 0;


    function updatePosition(event) {
        onYDegree += event.movementX*0.0015;
        onXDegree += event.movementY*0.0015;
    }

    //PointerLock API --- End

	//DEBUG


	xaUI.SetFPSCounter(true);

	xaUI.SetLoadingScreen(true);


	//DEBUG_END

    requestAnimationFrame(frame);

	var temp1=performance.now();
	var temp2=0;
	var temp3=0;

    function frame() {
		var t1 = performance.now();
		var diff = t1 - t0;
		t0 = t1;
		timeElapsed += diff;

        if (loadingStatus > 0) {
        } else {


			var cameraDislocation = vec3.create();
            if (isWKeyPressed) {
                cameraDislocation[2] -= cameraSpeed * diff;
            }

            if (isSKeyPressed) {
                cameraDislocation[2] += cameraSpeed * diff;
            }

            if (isAKeyPressed) {
                cameraDislocation[0] -= cameraSpeed * diff;
            }

            if (isDKeyPressed) {
                cameraDislocation[0] += cameraSpeed * diff;
            }
			xaGraphic.MoveCamera(cameraDislocation);
			xaGraphic.RotateCamera(onXDegree,onYDegree);
			xaGraphic.RenderFrame();



			onYDegree = 0;
			onXDegree = 0;
        }
		xaUI.RenderFrame(t1);
        requestAnimationFrame(frame);
    }


}





start();
