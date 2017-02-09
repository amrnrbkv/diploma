// window.location.reload(true);


window.onload = function() {

      var loadingStatus = 0;

      var canvas = document.getElementById("c");
      var gl = canvas.getContext("webgl");
      gl.clearColor(0.5, 0.5, 0.5, 1.0);
      gl.enable(gl.DEPTH_TEST);
      gl.clearDepth(1);
      //

      var textureIndex = gl.createTexture();

      var img = new Image();

      img.src = "textures/cubemap_texture.png";
      loadingStatus++;



      var shaderProgram = gl.createProgram();

      var vertexShader = gl.createShader(gl.VERTEX_SHADER);
      var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);



      var vertexShaderCode = document.getElementById("vShader").text;
      var fragmentShaderCode = document.getElementById("fShader").text;


      gl.shaderSource(vertexShader, vertexShaderCode);
      gl.shaderSource(fragmentShader, fragmentShaderCode);


      gl.compileShader(vertexShader);
      gl.compileShader(fragmentShader);


      if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS) || !gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
          alert("An error occurred compiling the vertexShader: " + gl.getShaderInfoLog(vertexShader));
          alert("An error occurred compiling the fragmentShader: " + gl.getShaderInfoLog(fragmentShader));
      }

      gl.bindAttribLocation(shaderProgram, 0, "a_vertex");
      gl.bindAttribLocation(shaderProgram, 1, "tex_");

      gl.attachShader(shaderProgram, vertexShader);
      gl.attachShader(shaderProgram, fragmentShader);



      gl.linkProgram(shaderProgram);

      if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("An error occurred while linking the shaderProgram program: " + gl.getProgramInfoLog(shaderProgram));
      }

      var uniformLoc = gl.getUniformLocation(shaderProgram, "matrix_");
      var uniformLoc_ = gl.getUniformLocation(shaderProgram, "texture_");

      gl.useProgram(shaderProgram);




      // gl.drawArrays(gl.TRIANGLES, 0, 3);




      var t0 = performance.now();
      var red = 0;
      var timeElapsed = 0;

      var location = vec3.create();
      var rotation = 0;
      var cameraPosition = vec3.create();



      var rotateZMatrix4x4 = mat4.create();
      var rotateXMatrix4x4 = mat4.create();
      var resultMatrix4x4 = mat4.create();


              var qwerty = new XMLHttpRequest();
              qwerty.open("GET", "models/cubemap8x8.xam", true);
              qwerty.responseType = "arraybuffer";
              qwerty.send();
              loadingStatus++;



              var numberOfElements = null;















                qwerty.onreadystatechange = function() {

                  if(qwerty.readyState === XMLHttpRequest.DONE){
                    var data = new DataView(qwerty.response);
                    var indexOfElements = data.getUint32(0, true);
                    var modelElements = new Uint16Array(qwerty.response, indexOfElements);
                    var modelCoordinates = new Float32Array(qwerty.response, 4, (indexOfElements - Uint32Array.BYTES_PER_ELEMENT)/Float32Array.BYTES_PER_ELEMENT);
                    numberOfElements = (data.byteLength - indexOfElements)/Uint16Array.BYTES_PER_ELEMENT;



                    var modelCoordinatesBuffer = gl.createBuffer();
                    gl.bindBuffer(gl.ARRAY_BUFFER, modelCoordinatesBuffer);
                    gl.bufferData(gl.ARRAY_BUFFER, modelCoordinates, gl.STATIC_DRAW);

                    var modelElementsBuffer = gl.createBuffer();
                    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, modelElementsBuffer);
                    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, modelElements, gl.STATIC_DRAW);

                    gl.vertexAttribPointer(0, 3, gl.FLOAT, gl.FALSE, Float32Array.BYTES_PER_ELEMENT * 5, 0);
                    gl.vertexAttribPointer(1, 2, gl.FLOAT, gl.FALSE, Float32Array.BYTES_PER_ELEMENT * 5, Float32Array.BYTES_PER_ELEMENT * 3);


                    gl.enableVertexAttribArray(0);
                    gl.enableVertexAttribArray(1);



                    loadingStatus--;
                  }










                // else {
                //   alert("Something wrong with requesting of resource!!!");
                // }
              };















       img.onload = function() {

            gl.activeTexture(gl.TEXTURE0);

            gl.bindTexture(gl.TEXTURE_2D, textureIndex);

            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);


            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

            gl.uniform1i(uniformLoc_, 0);


            loadingStatus--;
          }






      var t1 = performance.now();
      var diff = t1 - t0;
      t0 = performance.now();



      var perspectiveMatrix4x4 = mat4.create();

      mat4.perspective(perspectiveMatrix4x4, 1.57, 800/600, 0.25, 50.0);


      var isWKeyPressed, isAKeyPressed, isSKeyPressed, isDKeyPressed;
       isWKeyPressed = isAKeyPressed = isSKeyPressed = isDKeyPressed = false;


      window.onkeydown = function(event) {
        switch(event.key){
          case 'w':
            isWKeyPressed = true;
            break;


          case 'a':
            isAKeyPressed = true;
            break;


          case 's':
            isSKeyPressed = true;
            break;


          case 'd':
            isDKeyPressed = true;
            break;


        }

      };


      window.onkeyup = function(event) {
        switch(event.key){
          case 'w':
            isWKeyPressed = false;
            break;

          case 'a':
            isAKeyPressed = false;
            break;

          case 's':
            isSKeyPressed = false;
            break;

          case 'd':
            isDKeyPressed = false;
            break;

        }
      };



      var cameraSpeed = 0.05;






      //PointerLock API --- Start
      canvas.onclick = function() {
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


      var onYDegree = 0, onXDegree = 0;


      function updatePosition(event) {
        onYDegree += event.movementX;
        onXDegree += event.movementY;


        if(onYDegree > 360 || onYDegree < -360){
          onYDegree %= 360;
        }


        if(onXDegree > 90){
          onXDegree = 90;

        }
        else if (onXDegree < -90) {
          onXDegree = -90;
        }


      }

      //PointerLock API --- End















      function frame() {

        if(loadingStatus > 0){
          gl.clearColor(0.0,0.0,0.0,1.0);
          gl.clear(gl.COLOR_BUFFER_BIT);

        }

        else{


          timeElapsed+= diff;


          if (isWKeyPressed) {
            cameraPosition[2] -= cameraSpeed * diff;
          }

          if (isSKeyPressed) {
            cameraPosition[2] += cameraSpeed * diff;
          }

          if (isAKeyPressed) {
            cameraPosition[0] -= cameraSpeed * diff;
          }

          if (isDKeyPressed) {
            cameraPosition[0] += cameraSpeed * diff;
          }






          gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


          location[0]+= 0.005;

          if(rotation > 2 * Math.PI){
            rotation = 0;
          } else {
            rotation+= 0.023;
          }




          mat4.fromZRotation(rotateZMatrix4x4, rotation);
          mat4.fromXRotation(rotateXMatrix4x4, rotation);

          // mat4.mul(resultMatrix4x4, perspectiveMatrix4x4, rotateXMatrix4x4);

          // mat4.translate(resultMatrix4x4, perspectiveMatrix4x4, vec3.fromValues(0.0, 0.0, -1.5));
          mat4.rotateX(resultMatrix4x4, perspectiveMatrix4x4, (onXDegree/180) * Math.PI);
          mat4.rotateY(resultMatrix4x4, resultMatrix4x4, (onYDegree/180) * Math.PI);
          mat4.translate(resultMatrix4x4, resultMatrix4x4, vec3.fromValues(-cameraPosition[0], -cameraPosition[1], -cameraPosition[2]));


          // mat4.mul(resultMatrix4x4, resultMatrix4x4, rotateXMatrix4x4);
          // mat4.mul(resultMatrix4x4, resultMatrix4x4, rotateZMatrix4x4);




          gl.uniformMatrix4fv(uniformLoc, gl.FALSE, resultMatrix4x4);

          gl.drawElements(gl.TRIANGLES, numberOfElements, gl.UNSIGNED_SHORT, 0);

        }


        requestAnimationFrame(frame);

      }


        frame();


}
