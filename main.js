// window.location.reload(true);
window.onload = function() {

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
		console.log("xaGraphic Ready!");
	});
	//Context2D
	var context2D = canvas2.getContext('2d');
	context2D.font = '28px sans';
	context2D.fillStyle = "white";
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
	xaGraphic.MoveCamera(vec3.fromValues(0,1,0));
	xaGraphic.RotateCamera(0.5,0.9);
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
			
			context2D.clearRect(0, 0, canvas2.width, canvas2.height);
			
			temp1+=diff;
			if(temp1>1000){
				temp2=temp3;
				temp3=0;
				temp1=0;
			}
			temp3++;
			
			context2D.fillText(temp2+" FPS", 50, 100);
			
			onYDegree = 0;
			onXDegree = 0;
        }
        requestAnimationFrame(frame);
    }
	

}