var xaGraphic = new function(){
	var      xaCanvas;
	var      xaGL;
	var      xaEXTanisotropic;
	var      xaConstObjects;
	var      xaSkyBox;
	var      xaCamera;
	var      xaDoublePI;
	var      xaHalfPI;
	var      xaWorldCenter;
	var      xaNumOfDwnlds;
	var      xaExternalCallBackFunc;
	var      xaSimpleTexturedShader;
	var      xaSkyBoxShader;
	
	function xaCallBackIfReady(){
		if(xaNumOfDwnlds==0){
			xaExternalCallBackFunc();
		}
	}
	
	function xaDwnldXAM(addressIn,callbackIn){
		var request = new XMLHttpRequest();
		request.open("GET", addressIn, true);
		request.responseType = "arraybuffer";
		request.send();
		xaNumOfDwnlds++;
		var returnValue = new Object();
		request.onreadystatechange = function() {
			if(request.readyState === XMLHttpRequest.DONE){
				var data               = new DataView(request.response);
				var indexOfElements    = data.getUint32(0, true);
				returnValue.modelElems = new Uint16Array(request.response, indexOfElements);
				returnValue.modelCoors = new Float32Array(request.response, 4, (indexOfElements - Uint32Array.BYTES_PER_ELEMENT)/Float32Array.BYTES_PER_ELEMENT);
				returnValue.numOfElems = (data.byteLength - indexOfElements)/Uint16Array.BYTES_PER_ELEMENT;
				xaNumOfDwnlds--;
				callbackIn();
				xaCallBackIfReady();
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
			xaCallBackIfReady();
		}
		return img;
	}
	
	function xaCompileShader(shaderNameIn, shaderTypeIn){
		var returnValue           = xaGL.createShader(shaderTypeIn);
		xaGL.shaderSource(returnValue,document.getElementById(shaderNameIn).text);
		xaGL.compileShader(returnValue);
		if (!xaGL.getShaderParameter(returnValue, xaGL.COMPILE_STATUS)){
			alert("An error occurred compiling the shader: " + xaGL.getShaderInfoLog(returnValue));  
		}
		return returnValue;
	}
	
	function xaPrepareShaderPrg(vShaderIn, fShaderIn, programIn){
		xaGL.attachShader(programIn, vShaderIn);
        xaGL.attachShader(programIn, fShaderIn);
		xaGL.linkProgram(programIn);
		if (!xaGL.getProgramParameter(programIn, xaGL.LINK_STATUS)) {
			alert("An error occurred while linking the shaderProgram program: " + xaGL.getProgramInfoLog(programIn));
		}
	}
	
	function xaPrepareSkyBox()
	{
		xaSkyBox = new Object();
		xaSkyBox.arrBuff   = xaGL.createBuffer();
		var vertexRawData  = new Float32Array([
		    -10,  10, -10,
			-10, -10, -10,
			 10, -10, -10,
			 10, -10, -10,
			 10,  10, -10,
			-10,  10, -10,

			-10, -10,  10,
			-10, -10, -10,
			-10,  10, -10,
			-10,  10, -10,
			-10,  10,  10,
			-10, -10,  10,

			 10, -10, -10,
			 10, -10,  10,
			 10,  10,  10,
			 10,  10,  10,
			 10,  10, -10,
			 10, -10, -10,

			-10, -10,  10,
			-10,  10,  10,
			 10,  10,  10,
			 10,  10,  10,
			 10, -10,  10,
			-10, -10,  10,

			-10,  10, -10,
			 10,  10, -10,
			 10,  10,  10,
			 10,  10,  10,
			-10,  10,  10,
			-10,  10, -10,

			-10, -10, -10,
			-10, -10,  10,
			 10, -10, -10,
			 10, -10, -10,
			-10, -10,  10,
			 10, -10,  10]);
			xaGL.bindBuffer(xaGL.ARRAY_BUFFER, xaSkyBox.arrBuff);
			xaGL.bufferData(xaGL.ARRAY_BUFFER, vertexRawData, xaGL.STATIC_DRAW);
			xaSkyBox.texIndx = xaGL.createTexture();
			
			var textureHandler = function(cubeSideIn,imageIn){
				xaGL.bindTexture(xaGL.TEXTURE_CUBE_MAP, xaSkyBox.texIndx);
				//xaGL.texParameteri(xaGL.TEXTURE_CUBE_MAP, xaGL.TEXTURE_MAG_FILTER, xaGL.NEAREST);
				xaGL.texParameteri(xaGL.TEXTURE_CUBE_MAP, xaGL.TEXTURE_MIN_FILTER, xaGL.LINEAR);
				xaGL.texParameteri(xaGL.TEXTURE_CUBE_MAP, xaGL.TEXTURE_WRAP_S, xaGL.CLAMP_TO_EDGE);
				xaGL.texParameteri(xaGL.TEXTURE_CUBE_MAP, xaGL.TEXTURE_WRAP_T, xaGL.CLAMP_TO_EDGE);
				//xaGL.texParameteri(xaGL.TEXTURE_CUBE_MAP, xaGL.TEXTURE_WRAP_R, xaGL.CLAMP_TO_EDGE);
				xaGL.texImage2D (cubeSideIn, 0, xaGL.RGBA, xaGL.RGBA, xaGL.UNSIGNED_BYTE, imageIn);
			}
			

			var imgNegZ = xaDwnldTexture("textures/skybox/-z.png",function(){
				textureHandler(xaGL.TEXTURE_CUBE_MAP_NEGATIVE_Z,imgNegZ);
			});
			var imgPosZ = xaDwnldTexture("textures/skybox/+z.png",function(){
				textureHandler(xaGL.TEXTURE_CUBE_MAP_POSITIVE_Z,imgPosZ);
			});
			var imgNegX = xaDwnldTexture("textures/skybox/-x.png",function(){
				textureHandler(xaGL.TEXTURE_CUBE_MAP_NEGATIVE_X,imgNegX);
			});
			var imgPosX = xaDwnldTexture("textures/skybox/+x.png",function(){
				textureHandler(xaGL.TEXTURE_CUBE_MAP_POSITIVE_X,imgPosX);
			});
			var imgNegY = xaDwnldTexture("textures/skybox/-y.png",function(){
				textureHandler(xaGL.TEXTURE_CUBE_MAP_NEGATIVE_Y,imgNegY);
			});
			var imgPosY = xaDwnldTexture("textures/skybox/+y.png",function(){
				textureHandler(xaGL.TEXTURE_CUBE_MAP_POSITIVE_Y,imgPosY);
			});
	}
	function xaCreateConstObj(XAMAddressIn,TextureAddressIn){
		var constObj = new Object();

		var XAMdata = xaDwnldXAM(XAMAddressIn,function(){
			constObj.arrBuff   = xaGL.createBuffer();
			constObj.elemsBuff = xaGL.createBuffer();
			constObj.numOfElems= XAMdata.numOfElems;
			xaGL.bindBuffer(xaGL.ARRAY_BUFFER, constObj.arrBuff);
			xaGL.bufferData(xaGL.ARRAY_BUFFER, XAMdata.modelCoors, xaGL.STATIC_DRAW);
			xaGL.bindBuffer(xaGL.ELEMENT_ARRAY_BUFFER, constObj.elemsBuff);
			xaGL.bufferData(xaGL.ELEMENT_ARRAY_BUFFER, XAMdata.modelElems, xaGL.STATIC_DRAW);
			
		});
		var img = xaDwnldTexture(TextureAddressIn,function(){
			constObj.texIndx = xaGL.createTexture();
            xaGL.bindTexture(xaGL.TEXTURE_2D, constObj.texIndx);
            xaGL.texParameteri(xaGL.TEXTURE_2D, xaGL.TEXTURE_WRAP_S, xaGL.REPEAT);
            xaGL.texParameteri(xaGL.TEXTURE_2D, xaGL.TEXTURE_WRAP_T, xaGL.REPEAT);
            xaGL.texParameteri(xaGL.TEXTURE_2D, xaGL.TEXTURE_MIN_FILTER, xaGL.LINEAR_MIPMAP_LINEAR);
			
			xaGL.texParameterf(xaGL.TEXTURE_2D, xaEXTanisotropic.TEXTURE_MAX_ANISOTROPY_EXT, 4);

			xaGL.texImage2D (xaGL.TEXTURE_2D, 0, xaGL.RGBA, xaGL.RGBA, xaGL.UNSIGNED_BYTE, img);
			xaGL.generateMipmap(xaGL.TEXTURE_2D);

		});
		xaConstObjects.push(constObj);
	}
	

	this.Initialize = function(canvasIn, callbackIn){
		xaCanvas               = canvasIn;
		xaCanvas.width         = window.innerWidth;
		xaCanvas.height        = window.innerHeight;
		xaGL                   = xaCanvas.getContext("webgl", {antialias:false});
		xaEXTanisotropic       = xaGL.getExtension('EXT_texture_filter_anisotropic');
		xaExternalCallBackFunc = callbackIn;
		xaConstObjects         = [];
		xaNumOfDwnlds          = 0;

		//xaPushConstObj("models/cubemap8x8.xam");
		xaSimpleTexturedShader = new Object();
		xaSkyBoxShader         = new Object();
		xaCamera               = new Object();
		xaSimpleTexturedShader.program = xaGL.createProgram();
		xaPrepareShaderPrg(xaCompileShader("vShader",xaGL.VERTEX_SHADER),
						   xaCompileShader("fShader",xaGL.FRAGMENT_SHADER),
						   xaSimpleTexturedShader.program);
		xaSimpleTexturedShader.matLoc  = xaGL.getUniformLocation(xaSimpleTexturedShader.program, "matrix_");
		xaSimpleTexturedShader.texLoc  = xaGL.getUniformLocation(xaSimpleTexturedShader.program, "texture_");
		
		xaPrepareSkyBox();
		xaSkyBoxShader.program = xaGL.createProgram();
		xaPrepareShaderPrg(xaCompileShader("skyboxVShader",xaGL.VERTEX_SHADER),
						   xaCompileShader("skyboxFShader",xaGL.FRAGMENT_SHADER),
						   xaSkyBoxShader.program);
		xaSkyBoxShader.matLoc = xaGL.getUniformLocation(xaSkyBoxShader.program, "projection");
		xaSkyBoxShader.texLoc = xaGL.getUniformLocation(xaSkyBoxShader.program, "skybox");
		
		
		xaWorldCenter       = vec3.fromValues(0,0,0);
		xaDoublePI = 2*Math.PI;
		xaHalfPI   = Math.PI/2;
		xaCamera.position   = vec3.fromValues(0,0,0);
		xaCamera.rotationY  = 0;
		xaCamera.rotationX  = 0;
		xaCamera.perspMat4  = mat4.create();
		mat4.perspective(xaCamera.perspMat4, 1.0, xaCanvas.width/xaCanvas.height, 0.25, 50.0);

		
		xaCreateConstObj("models/ring1.xam","textures/ring1.png");
		
		
		
		xaGL.clearColor(0.5, 0.5, 0.5, 1.0);
		xaGL.clearDepth(1);
		
		window.onresize = function() {
			xaCanvas.width  = xaCanvas.clientWidth;
			xaCanvas.height = xaCanvas.clientHeight;
			mat4.perspective(xaCamera.perspMat4, 1.0, xaCanvas.width/xaCanvas.height, 0.25, 50.0);
			xaGL.viewport(0.0, 0.0, xaCanvas.width, xaCanvas.height);
		};
	}
	this.RenderFrame = function(){
		xaGL.clear(xaGL.COLOR_BUFFER_BIT | xaGL.DEPTH_BUFFER_BIT);
		var resultMatrix = mat4.create();
		mat4.rotateX(resultMatrix, xaCamera.perspMat4, xaCamera.rotationX);
		mat4.rotateY(resultMatrix, resultMatrix, xaCamera.rotationY);
		

		xaGL.enableVertexAttribArray(0);
		
		xaGL.activeTexture(xaGL.TEXTURE0);
		//SKYBOX
		xaGL.disable(xaGL.DEPTH_TEST);
		xaGL.bindBuffer(xaGL.ARRAY_BUFFER, xaSkyBox.arrBuff);
		xaGL.useProgram(xaSkyBoxShader.program);
		xaGL.bindTexture(xaGL.TEXTURE_CUBE_MAP, xaSkyBox.texIndx);
		xaGL.uniform1i(xaSkyBoxShader.texLoc, 0);
		xaGL.uniformMatrix4fv(xaSkyBoxShader.matLoc, xaGL.FALSE, resultMatrix);
		xaGL.vertexAttribPointer(0, 3, xaGL.FLOAT, xaGL.FALSE, Float32Array.BYTES_PER_ELEMENT * 3, 0);
		xaGL.drawArrays(xaGL.TRIANGLES, 0, 36);
		
		//
		mat4.translate(resultMatrix, resultMatrix, vec3.fromValues(-xaCamera.position[0], -xaCamera.position[1], -xaCamera.position[2]));
		
		
		//
		
		xaGL.enableVertexAttribArray(1);
		
		//
		xaGL.vertexAttribPointer(0, 3, xaGL.FLOAT, xaGL.FALSE, Float32Array.BYTES_PER_ELEMENT * 5, 0);
		xaGL.vertexAttribPointer(1, 2, xaGL.FLOAT, xaGL.FALSE, Float32Array.BYTES_PER_ELEMENT * 5, Float32Array.BYTES_PER_ELEMENT * 3)
		//
		xaGL.enable(xaGL.DEPTH_TEST);
		xaGL.useProgram(xaSimpleTexturedShader.program);
		for (var i = 0; i < xaConstObjects.length; i++) {
			xaGL.bindTexture(xaGL.TEXTURE_2D, xaConstObjects[i].texIndx);
			xaGL.uniform1i(xaSimpleTexturedShader.texLoc, 0);
			xaGL.uniformMatrix4fv(xaSimpleTexturedShader.matLoc, xaGL.FALSE, resultMatrix);
			xaGL.bindBuffer(xaGL.ARRAY_BUFFER, xaConstObjects[i].arrBuff);
			xaGL.bindBuffer(xaGL.ELEMENT_ARRAY_BUFFER, xaConstObjects[i].elemsBuff);
			xaGL.vertexAttribPointer(0, 3, xaGL.FLOAT, xaGL.FALSE, Float32Array.BYTES_PER_ELEMENT * 5, 0);
			xaGL.vertexAttribPointer(1, 2, xaGL.FLOAT, xaGL.FALSE, Float32Array.BYTES_PER_ELEMENT * 5, Float32Array.BYTES_PER_ELEMENT * 3)
			xaGL.drawElements(xaGL.TRIANGLES, xaConstObjects[i].numOfElems, xaGL.UNSIGNED_SHORT, 0);
		}	
	}
	this.MoveCamera   = function(deltaPosIn){
		var tempVec = vec3.create();
		vec3.rotateX(tempVec, deltaPosIn, xaWorldCenter, -xaCamera.rotationX);
		vec3.rotateY(tempVec, tempVec, xaWorldCenter, -xaCamera.rotationY);
		vec3.add(xaCamera.position, xaCamera.position, tempVec);
	}
	this.RotateCamera = function(deltaXRotIn,deltaYRotIn){
		xaCamera.rotationY += deltaYRotIn;
		xaCamera.rotationX += deltaXRotIn;
		if(xaCamera.rotationY>xaDoublePI || xaCamera.rotationY<-xaDoublePI){
			xaCamera.rotationY=0;
		}
		if (xaCamera.rotationX > xaHalfPI) {
			xaCamera.rotationX = xaHalfPI;
        } else if (xaCamera.rotationX < -xaHalfPI) {
            xaCamera.rotationX = -xaHalfPI;
        }
	}
}