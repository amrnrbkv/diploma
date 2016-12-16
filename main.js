function start(){


  var canvas = document.getElementById("c");
  var gl = canvas.getContext("webgl");
  gl.clearColor(1.0, 1.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  //
  var coordinates = new Float32Array([-1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0]);
  var cBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, coordinates, gl.STATIC_DRAW);

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


  gl.vertexAttribPointer(0, 3, gl.FLOAT, gl.FALSE, Float32Array.BYTES_PER_ELEMENT * 3, 0);


  gl.drawArrays(gl.TRIANGLES, 0, 3);






  var t0 = performance.now();
  var red = 0;
  var timeElapsed = 0;


  function frame() {
    var t1 = performance.now();
    var diff = t1 - t0;
    t0 = performance.now();


    timeElapsed+= diff;


    gl.drawArrays(gl.TRIANGLES, 0, 3);
    requestAnimationFrame(frame);


  }


    frame();
}
