var xaGraphic = new function(){
	var      xaCanvas;
	var      xaGL;
	var      xaEXTanisotropic;
	var      xaConstObjects;
	var      xaPlayersEntites;
	var      xaSkyBox;
	var      xaCamera;
	var      xaDoublePI;
	var      xaHalfPI;
	var      xaWorldCenter;
	var      xaSunPosition;
	var      xaNumOfDwnlds;
	var      xaExternalCallBackFunc;
	var      xaSimpleTexturedShader;
	var      xaSkyBoxShader;
	
	function xa3dParty_HSVtoRGB(h, s, v) {
		//Written by Parthik Gosar,
		//Modified by stackoverflow user Paul S.
		var r, g, b, i, f, p, q, t;
		if (arguments.length === 1) {
			s = h.s, v = h.v, h = h.h;
		}
		i = Math.floor(h * 6);
		f = h * 6 - i;
		p = v * (1 - s);
		q = v * (1 - f * s);
		t = v * (1 - (1 - f) * s);
		switch (i % 6) {
			case 0: r = v, g = t, b = p; break;
			case 1: r = q, g = v, b = p; break;
			case 2: r = p, g = v, b = t; break;
			case 3: r = p, g = q, b = v; break;
			case 4: r = t, g = p, b = v; break;
			case 5: r = v, g = p, b = q; break;
		}
		return {
			r: r,
			g: g,
			b: b
		};
	}
	
	function xaCallBackIfReady(){
		
		if(xaNumOfDwnlds==0){
			xaExternalCallBackFunc();
		}
	}
	
	function xaDwnldXAM(addressIn,objectIn){
		var request = new XMLHttpRequest();
		request.open("GET", addressIn, true);
		request.responseType = "arraybuffer";
		request.send();
		xaNumOfDwnlds++;
		request.onreadystatechange = function() {
			if(request.readyState === XMLHttpRequest.DONE){
				var data               = new DataView(request.response);
				var indexOfElements    = data.getUint32(0, true);
				var modelElems = new Uint16Array(request.response, indexOfElements);
				var modelCoors = new Float32Array(request.response, 4, (indexOfElements - Uint32Array.BYTES_PER_ELEMENT)/Float32Array.BYTES_PER_ELEMENT);
				var numOfElems = (data.byteLength - indexOfElements)/Uint16Array.BYTES_PER_ELEMENT;
				xaNumOfDwnlds--;
				//
				objectIn.arrBuff   = xaGL.createBuffer();
				objectIn.elemsBuff = xaGL.createBuffer();
				objectIn.numOfElems= numOfElems;
				xaGL.bindBuffer(xaGL.ARRAY_BUFFER, objectIn.arrBuff);
				xaGL.bufferData(xaGL.ARRAY_BUFFER, modelCoors, xaGL.STATIC_DRAW);
				xaGL.bindBuffer(xaGL.ELEMENT_ARRAY_BUFFER, objectIn.elemsBuff);
				xaGL.bufferData(xaGL.ELEMENT_ARRAY_BUFFER, modelElems, xaGL.STATIC_DRAW);
				//
				xaCallBackIfReady();
			}
		}
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

		xaDwnldXAM(XAMAddressIn,constObj);
			
		
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
	
	function xaPreparePlayersEntites(){
		
		
		xaDwnldXAM("models/player.xam", xaPlayersEntites);
		function entityPusher(colorRGB)
		{
			var playerEntity = new Object();
			playerEntity.position= vec3.create();
			playerEntity.matrix = mat4.create();
			playerEntity.isExistFlag=false;
			playerEntity.color = new Float32Array([colorRGB.r,colorRGB.g, colorRGB.b]);
			xaPlayersEntites.push(playerEntity);
		}
		
		for (var i = 0; i < 10; i++) {
			entityPusher(xa3dParty_HSVtoRGB(i*0.1,0.60,0.90)); 
		}
		
		var img = xaDwnldTexture("textures/player.png",function(){
			xaPlayersEntites.texIndx = xaGL.createTexture();
            xaGL.bindTexture(xaGL.TEXTURE_2D, xaPlayersEntites.texIndx);
            xaGL.texParameteri(xaGL.TEXTURE_2D, xaGL.TEXTURE_WRAP_S, xaGL.REPEAT);
            xaGL.texParameteri(xaGL.TEXTURE_2D, xaGL.TEXTURE_WRAP_T, xaGL.REPEAT);
            xaGL.texParameteri(xaGL.TEXTURE_2D, xaGL.TEXTURE_MIN_FILTER, xaGL.LINEAR_MIPMAP_LINEAR);
			
			xaGL.texParameterf(xaGL.TEXTURE_2D, xaEXTanisotropic.TEXTURE_MAX_ANISOTROPY_EXT, 4);

			xaGL.texImage2D (xaGL.TEXTURE_2D, 0, xaGL.RGBA, xaGL.RGBA, xaGL.UNSIGNED_BYTE, img);
			xaGL.generateMipmap(xaGL.TEXTURE_2D);
		});
		
		var	img2 = xaDwnldTexture("textures/player_normal.png",function(){
			xaPlayersEntites.normTexIndx = xaGL.createTexture();
            xaGL.bindTexture(xaGL.TEXTURE_2D, xaPlayersEntites.normTexIndx);
            xaGL.texParameteri(xaGL.TEXTURE_2D, xaGL.TEXTURE_WRAP_S, xaGL.REPEAT);
            xaGL.texParameteri(xaGL.TEXTURE_2D, xaGL.TEXTURE_WRAP_T, xaGL.REPEAT);
            xaGL.texParameteri(xaGL.TEXTURE_2D, xaGL.TEXTURE_MIN_FILTER, xaGL.LINEAR_MIPMAP_LINEAR);
			
			xaGL.texParameterf(xaGL.TEXTURE_2D, xaEXTanisotropic.TEXTURE_MAX_ANISOTROPY_EXT, 4);

			xaGL.texImage2D (xaGL.TEXTURE_2D, 0, xaGL.RGB, xaGL.RGB, xaGL.UNSIGNED_BYTE, img2);
			xaGL.generateMipmap(xaGL.TEXTURE_2D);
		});
		
		
		
		xaPlayersEntites.program = xaGL.createProgram();
		xaPrepareShaderPrg(xaCompileShader("playerVShader",xaGL.VERTEX_SHADER),
						   xaCompileShader("playerFShader",xaGL.FRAGMENT_SHADER),
						   xaPlayersEntites.program);
		xaPlayersEntites.matLoc = xaGL.getUniformLocation(xaPlayersEntites.program, "matrix_");
		xaPlayersEntites.texLoc = xaGL.getUniformLocation(xaPlayersEntites.program, "texture_");
		xaPlayersEntites.normTexLoc = xaGL.getUniformLocation(xaPlayersEntites.program, "norm_texture_");
		xaPlayersEntites.skinColLoc = xaGL.getUniformLocation(xaPlayersEntites.program, "skinColor");
		xaPlayersEntites.sunDirLoc = xaGL.getUniformLocation(xaPlayersEntites.program, "sunDirection");
		
	}
	

	this.Initialize = function(canvasIn, callbackIn){
		xaCanvas               = canvasIn;
		xaCanvas.width         = window.innerWidth;
		xaCanvas.height        = window.innerHeight;
		xaGL                   = xaCanvas.getContext("webgl", {antialias:false});
		xaEXTanisotropic       = xaGL.getExtension('EXT_texture_filter_anisotropic');
		xaExternalCallBackFunc = callbackIn;
		xaConstObjects         = [];
		xaPlayersEntites       = [];
		xaNumOfDwnlds          = 0;

		xaSunPosition          = vec2.fromValues(0.087266,-2.356194);

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
		xaSimpleTexturedShader.normTexLoc = xaGL.getUniformLocation(xaSimpleTexturedShader.program, "norm_texture_");
		xaSimpleTexturedShader.sunDirLoc = xaGL.getUniformLocation(xaSimpleTexturedShader.program, "sunDirection");
		
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

		
		xaPreparePlayersEntites();
		xaCreateConstObj("models/ring1.xam","textures/ring1.png");
		xaCreateConstObj("models/wall.xam","textures/wall.png");
		
		
		
		xaGL.clearColor(1.0, 0, 0, 1.0);
		xaGL.clearDepth(1);
		
		window.onresize = function() {
			xaCanvas.width  = xaCanvas.clientWidth;
			xaCanvas.height = xaCanvas.clientHeight;
			mat4.perspective(xaCamera.perspMat4, 1.0, xaCanvas.width/xaCanvas.height, 0.25, 50.0);
			xaGL.viewport(0.0, 0.0, xaCanvas.width, xaCanvas.height);
		};
		
		//SUN_DEBUG
		vec2
		//SUN_DEBUG_END
		
		//DEBUG
		xaPlayersEntites[0].isExistFlag=true;
		//DEBUG_END
	}
	this.RenderFrame = function(){
		xaGL.clear(xaGL.COLOR_BUFFER_BIT | xaGL.DEPTH_BUFFER_BIT);
		var resultMatrix = mat4.create();
		var cameraMatrix = mat4.create();
		mat4.rotateX(resultMatrix, xaCamera.perspMat4, xaCamera.rotationX);
		mat4.rotateY(resultMatrix, resultMatrix, xaCamera.rotationY);

		var sunLightDirection=vec3.fromValues(0,0,-1);
		vec3.rotateX(sunLightDirection, sunLightDirection, xaWorldCenter, xaSunPosition[0]);
		vec3.rotateY(sunLightDirection, sunLightDirection, xaWorldCenter, xaSunPosition[1]);
		
		//xaGL.disableVertexAttribArray(2);
		
		
		
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
		mat4.translate(cameraMatrix, resultMatrix, vec3.fromValues(-xaCamera.position[0], -xaCamera.position[1], -xaCamera.position[2]));

		
		
		//
		
		xaGL.enableVertexAttribArray(1);
		xaGL.enableVertexAttribArray(2);
		//
		
		
		//
		xaGL.enable(xaGL.DEPTH_TEST);
		xaGL.useProgram(xaSimpleTexturedShader.program);
		xaGL.uniform3fv(xaSimpleTexturedShader.sunDirLoc, sunLightDirection);
		for (var i = 0; i < xaConstObjects.length; i++) {
			xaGL.bindTexture(xaGL.TEXTURE_2D, xaConstObjects[i].texIndx);
			xaGL.uniform1i(xaSimpleTexturedShader.texLoc, 0);
			xaGL.uniformMatrix4fv(xaSimpleTexturedShader.matLoc, xaGL.FALSE, cameraMatrix);
			xaGL.bindBuffer(xaGL.ARRAY_BUFFER, xaConstObjects[i].arrBuff);
			xaGL.bindBuffer(xaGL.ELEMENT_ARRAY_BUFFER, xaConstObjects[i].elemsBuff);
			xaGL.vertexAttribPointer(0, 3, xaGL.FLOAT, xaGL.FALSE, Float32Array.BYTES_PER_ELEMENT * 8, 0);
		xaGL.vertexAttribPointer(1, 2, xaGL.FLOAT, xaGL.FALSE, Float32Array.BYTES_PER_ELEMENT * 8, Float32Array.BYTES_PER_ELEMENT * 3)
		xaGL.vertexAttribPointer(2, 3, xaGL.FLOAT, xaGL.FALSE, Float32Array.BYTES_PER_ELEMENT * 8, Float32Array.BYTES_PER_ELEMENT * 5)
			xaGL.drawElements(xaGL.TRIANGLES, xaConstObjects[i].numOfElems, xaGL.UNSIGNED_SHORT, 0);
		}
		//PLAYER_ENTITES

		xaGL.useProgram(xaPlayersEntites.program);
		xaGL.bindTexture(xaGL.TEXTURE_2D, xaPlayersEntites.texIndx);
		xaGL.activeTexture(xaGL.TEXTURE1);
		xaGL.bindTexture(xaGL.TEXTURE_2D, xaPlayersEntites.normTexIndx);
		xaGL.uniform1i(xaPlayersEntites.texLoc, 0);
		xaGL.uniform1i(xaPlayersEntites.normTexLoc, 1);
		xaGL.uniform3fv(xaPlayersEntites.sunDirLoc, sunLightDirection);
		xaGL.bindBuffer(xaGL.ARRAY_BUFFER, xaPlayersEntites.arrBuff);
		xaGL.bindBuffer(xaGL.ELEMENT_ARRAY_BUFFER, xaPlayersEntites.elemsBuff);
		xaGL.vertexAttribPointer(0, 3, xaGL.FLOAT, xaGL.FALSE, Float32Array.BYTES_PER_ELEMENT * 8, 0);
		xaGL.vertexAttribPointer(1, 2, xaGL.FLOAT, xaGL.FALSE, Float32Array.BYTES_PER_ELEMENT * 8, Float32Array.BYTES_PER_ELEMENT * 3)
		xaGL.vertexAttribPointer(2, 3, xaGL.FLOAT, xaGL.FALSE, Float32Array.BYTES_PER_ELEMENT * 8, Float32Array.BYTES_PER_ELEMENT * 5)
		for (var i = 0; i < xaPlayersEntites.length; i++) {
			if(xaPlayersEntites[i].isExistFlag===true){
				xaGL.uniform3fv(xaPlayersEntites.skinColLoc, xaPlayersEntites[i].color);
				mat4.multiply(resultMatrix,cameraMatrix,xaPlayersEntites[i].matrix);
				xaGL.uniformMatrix4fv(xaPlayersEntites.matLoc, xaGL.FALSE, resultMatrix);
				xaGL.drawElements(xaGL.TRIANGLES, xaPlayersEntites.numOfElems, xaGL.UNSIGNED_SHORT, 0);
			}
		}
		//PLAYER_ENTITES_END
	}
	this.MoveCamera   = function(deltaPosIn){
		var tempVec = vec3.create();
		vec3.rotateX(tempVec, deltaPosIn, xaWorldCenter, -xaCamera.rotationX);
		vec3.rotateY(tempVec, tempVec, xaWorldCenter, -xaCamera.rotationY);
		vec3.add(xaCamera.position, xaCamera.position, tempVec);
	}
	
	this.SetPlayer   = function(inPlayerID,inTrueOrFalse){
		xaPlayersEntites[inPlayerID].isExistFlag=inTrueOrFalse;
		
	}
	
	this.UpdatePlayerPosition   = function (inPlayerID, inPosition){
		var player = xaPlayersEntites[inPlayerID];
		vec3.copy(player.position, inPosition);
		mat4.fromTranslation(player.matrix,vec3.fromValues(-player.position[0],-player.position[1],-player.position[2]));
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