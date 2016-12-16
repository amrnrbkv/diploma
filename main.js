window.onload = function(){


      var canvas = document.getElementById("c");
      var gl = canvas.getContext("webgl");
      gl.clearColor(0.55, 0.43, 0.0, 1.0);
      //
      var coordinates = new Float32Array([-0.5, 0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5]);
      var elements = new Uint16Array([0,1,2,2,3,0]);
      var cBuffer = gl.createBuffer();
      var elementBuffer = gl.createBuffer();

      gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, coordinates, gl.STATIC_DRAW);

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, elements, gl.STATIC_DRAW);

      //
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

      gl.attachShader(shaderProgram, vertexShader);
      gl.attachShader(shaderProgram, fragmentShader);



      gl.linkProgram(shaderProgram);

      if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("An error occurred while linking the shaderProgram program: " + gl.getProgramInfoLog(shaderProgram));
      }


      gl.useProgram(shaderProgram);


      gl.vertexAttribPointer(0, 2, gl.FLOAT, gl.FALSE, Float32Array.BYTES_PER_ELEMENT * 2, 0);


      // gl.drawArrays(gl.TRIANGLES, 0, 3);


      gl.enableVertexAttribArray(0);



      var t0 = performance.now();
      var red = 0;
      var timeElapsed = 0;



      function frame() {
        var t1 = performance.now();
        var diff = t1 - t0;
        t0 = performance.now();


        timeElapsed+= diff;
        gl.clear(gl.COLOR_BUFFER_BIT);


        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
        requestAnimationFrame(frame);


      }

    frame();


}
