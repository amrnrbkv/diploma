window.onload = function(){


      var canvas = document.getElementById("c");
      var gl = canvas.getContext("webgl");
      gl.clearColor(0.5, 0.5, 0.5, 1.0);
      //
      var coordinates = new Float32Array([-0.5, 0.5, 0.0, 1.0, -0.5, -0.5, 0.0, 0.0, 0.5, -0.5, 1.0, 0.0, 0.5, 0.5, 1.0, 1.0]);
      var elements = new Uint16Array([0,1,2,2,3,0]);
      var cBuffer = gl.createBuffer();
      var elementBuffer = gl.createBuffer();

      var textureIndex = gl.createTexture();

      var img = new Image();
      img.src = "textures/cat.png";

      gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, coordinates, gl.STATIC_DRAW);

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, elements, gl.STATIC_DRAW);



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


      gl.vertexAttribPointer(0, 2, gl.FLOAT, gl.FALSE, Float32Array.BYTES_PER_ELEMENT * 4, 0);
      gl.vertexAttribPointer(1, 2, gl.FLOAT, gl.FALSE, Float32Array.BYTES_PER_ELEMENT * 4, Float32Array.BYTES_PER_ELEMENT*2);


      // gl.drawArrays(gl.TRIANGLES, 0, 3);


      gl.enableVertexAttribArray(0);
      gl.enableVertexAttribArray(1);


      var t0 = performance.now();
      var red = 0;
      var timeElapsed = 0;

      var location = vec3.create();
      var rotation = 0;



      var translateMatrix4x4 = mat4.create();
      var rotateMatrix4x4 = mat4.create();








       img.onload = function() {

            gl.activeTexture(gl.TEXTURE0);

            gl.bindTexture(gl.TEXTURE_2D, textureIndex);

            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

            gl.uniform1i(uniformLoc_, 0);

            var t1 = performance.now();
            var diff = t1 - t0;
            t0 = performance.now();

            function frame() {
                timeElapsed+= diff;
                gl.clear(gl.COLOR_BUFFER_BIT);

                location[0]+= 0.005;

                if(rotation > 2 * Math.PI){
                  rotation = 0;
                } else {
                  rotation+= 0.1046;
                }


                mat4.fromTranslation(translateMatrix4x4, location);
                mat4.fromZRotation(rotateMatrix4x4, rotation);

                mat4.mul(translateMatrix4x4, translateMatrix4x4, rotateMatrix4x4);

                gl.uniformMatrix4fv(uniformLoc, gl.FALSE, translateMatrix4x4);

                gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
                requestAnimationFrame(frame);
        }

          frame();

     }

}
