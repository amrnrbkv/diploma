var canvas = document.getElementById("c");
var gl = canvas.getContext("webgl");




var t0 = performance.now();
var red = 0;
var timeElapsed = 0;


function frame() {
  var t1 = performance.now();
  var diff = t1 - t0;
  t0 = performance.now();

    gl.clearColor(1 - timeElapsed/5000, timeElapsed/5000, 0.0, 1.0);


    if(timeElapsed > 5000 && timeElapsed < 10000){
      gl.clearColor(0.0, 1 - (timeElapsed - 5000)/5000, (timeElapsed - 5000)/5000, 1.0);

    }

    else if(timeElapsed > 10000){
      gl.clearColor((timeElapsed - 10000)/5000, 0.0, 1 - (timeElapsed - 10000)/5000, 1.0);
      timeElapsed = 0;
    }

  gl.clear(gl.COLOR_BUFFER_BIT);
  timeElapsed+= diff;
  requestAnimationFrame(frame);

}


  frame();
