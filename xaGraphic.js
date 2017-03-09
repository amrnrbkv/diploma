var xaGraphic={
	var      xaCanvas;
	var      xaGL;
	var      xaConstObjects;
	var      xaNumOfDwnlds;
	var      xaExternalCallBackFunc;
	var      xaSimpleTexturedShader;
	function xaCallBackIfReady(){
		if(xaNumOfDwnlds===0){
			xaExternalCallBackFunc();
		}
	}
	function xaDwnldXAM(addressIn,callbackIn){
		var request = new XMLHttpRequest();
		request.open("GET", "addressIn", true);
		request.responseType = "arraybuffer";
		request.send();
		xaNumOfDwnlds++;
		var returnValue = new Object();
		request.onreadystatechange = function() {
			if(request.readyState === XMLHttpRequest.DONE){
				var data               = new DataView(request.response);
				var indexOfElements    = data.getUint32(0, true);
				returnValue.modelElems = new Uint16Array(qwerty.response, indexOfElements);
				returnValue.modelCoors = new Float32Array(qwerty.response, 4, (indexOfElements - Uint32Array.BYTES_PER_ELEMENT)/Float32Array.BYTES_PER_ELEMENT);
				returnValue.numOfElems = (data.byteLength - indexOfElements)/Uint16Array.BYTES_PER_ELEMENT;
				xaNumOfDwnlds--;
				callbackIn();
			}
		}
		return returnValue;
	}
	
	function xaDwnldTexture(addressIn,callbackIn){
		var img    = new Image();
		img.src    = addressIn;
		xaNumOfDwnlds++;
		img.onload = function(){
			xaNumOfDwnlds--;
			callbackIn();
		}
		return img;
	}
	
	function xaCompileShader(shaderNameIn, shaderTypeIn){
		var returnValue           = gl.createShader(shaderTypeIn);
		gl.shaderSource(returnValue,document.getElementById(shaderNameIn).text);
		gl.compileShader(returnValue);
		if (!gl.getShaderParameter(returnValue, gl.COMPILE_STATUS){
			alert("An error occurred compiling the shader: " + gl.getShaderInfoLog(returnValue));  
		}
		return returnValue;
	}
	
	function xaLinkShaderPrg(vShaderIn, fShaderIn){
		var returnValue = gl.createProgram();
		gl.attachShader(returnValue, vShaderIn);
        gl.attachShader(returnValue, fShaderIn);
		gl.linkProgram(returnValue);
		if (!gl.getProgramParameter(returnValue, gl.LINK_STATUS)) {
			alert("An error occurred while linking the shaderProgram program: " + gl.getProgramInfoLog(returnValue));
		}
		return returnValue;
	}
	function xaCreateConstObj(XAMAddressIn,TextureAddressIn){
		var constObj = new Object();

		var XAMdata = xaDwnldXAM(XAMAddressIn,function(){
			constObj.arrBuff   = xaGL.createBuffer();
			constObj.elemsBuff = xaGL.createBuffer();
			constObj.numOfElems= XAMdata.numOfElems();
			xaGL.bindBuffer(xaGL.ARRAY_BUFFER, XAMdata.modelCoors);
			xaGL.bufferData(xaGL.ARRAY_BUFFER, XAMdata.modelCoors, xaGL.STATIC_DRAW);
			xaGL.bindBuffer(xaGL.ELEMENT_ARRAY_BUFFER, XAMdata.modelElems);
			xaGL.bufferData(xaGL.ELEMENT_ARRAY_BUFFER, XAMdata.modelElems, xaGL.STATIC_DRAW);
			xaCallBackIfReady();
		});
		var img = xaDwnldTexture(TextureAddressIn,function(){
			constObj.texIndx = gl.createTexture();
           // gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, textureIndex);
            gl.texImage2D (gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

            //gl.uniform1i(uniformLoc_, 0);
		});
		xaConstObjects.push(constObj);
	}

	this.Initialize(canvasIn, callbackIn){
		xaCanvas               = canvasIn;
		xaCanvas.width         = window.innerWidth;
		xaCanvas.height        = window.innerHeight;
		xaGL                   = canvas.getContext("webgl");
		xaExternalCallBackFunc = callbackIn;
		xaConstObjects         = [];
		xaNumOfDwnlds          = 0;
		//xaPushConstObj("models/cubemap8x8.xam");
		xaSimpleTexturedShader = new Object();
		xaSimpleTexturedShader.program = gl.createProgram();
		xaLinkShaderPrg(xaCompileShader("vShader",gl.VERTEX_SHADER), xaCompileShader("fShader",gl.FRAGMENT_SHADER));
		xaSimpleTexturedShader.matLoc  = xaSimpleTexturedShader.program(shaderProgram, "matrix_");
		xaSimpleTexturedShader.texLoc  = xaSimpleTexturedShader.program(shaderProgram, "texture_");
		
		xaCreateConstObj("models/cubemap8x8.xam","textures/cubemap_texture.png");
		
		xaGL.clearColor(0.5, 0.5, 0.5, 1.0);
		xaGL.enable(xaGL.DEPTH_TEST);
		xaGL.clearDepth(1);
	}
	this.RenderFrame(){
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		
		gl.enableVertexAttribArray(0);
		gl.enableVertexAttribArray(1);
		gl.vertexAttribPointer(0, 3, gl.FLOAT, gl.FALSE, Float32Array.BYTES_PER_ELEMENT * 5, 0);
		gl.vertexAttribPointer(1, 2, gl.FLOAT, gl.FALSE, Float32Array.BYTES_PER_ELEMENT * 5, Float32Array.BYTES_PER_ELEMENT * 3);
		for (var i = 0; i < xaConstObjects.length; i++) {
			
		}
		
	}
}