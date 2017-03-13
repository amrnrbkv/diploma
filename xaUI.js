var xaUI = new function(){
	var      xaCanvas;
	var      xaCtx2D;
	var      xaFPSCounter;
	var      xaLoadingScreen;
	
	this.Initialize=function(canvasIn){
		xaCanvas = canvasIn;
		xaCtx2D  = canvasIn.getContext('2d');
		//xaCtx2Dfont = '28px sans';
		//xaCtx2DfillStyle = "white";
		xaFPSCounter           = new Object();
		xaFPSCounter.Flag      = false;
		xaFPSCounter.TimeStamp = 0;
		xaFPSCounter.FrmsCntr  = 0;
		xaFPSCounter.Value     = 0;
		xaLoadingScreen        = new Object();
		xaLoadingScreen.Flag   = false;
		//xaLoadingScreen.
	}
	
	this.SetFPSCounter=function(inTrueOrFalse){
		xaFPSCounter.TimeStamp = performance.now();
		xaFPSCounter.Flag=inTrueOrFalse;
	}
	
	this.SetLoadingScreen = function(inTrueOrFalse){
		xaLoadingScreen.Flag = inTrueOrFalse;
	}
	
	this.RenderFrame=function(timeNowIn){
		xaCtx2D.clearRect(0, 0, xaCanvas.width, xaCanvas.height);
		//LOADING SCREEN
		if(xaLoadingScreen.Flag){
			xaCtx2D.fillStyle = 'black';
			xaCtx2D.fillRect(0, 0, xaCanvas.width, xaCanvas.height);
			xaCtx2D.font = '108px sans';
			xaCtx2D.fillStyle = "white";
			xaCtx2D.fillText("LOADING", 300, 400);
		}
		
		
		//
		//FPS COUNTER
		if(xaFPSCounter.Flag){
			xaCtx2D.font = '28px sans';
			xaCtx2D.fillStyle = "white";
			
			if((timeNowIn-xaFPSCounter.TimeStamp)>1000){
				xaFPSCounter.Value     = xaFPSCounter.FrmsCntr;
				xaFPSCounter.FrmsCntr  = 0;
				xaFPSCounter.TimeStamp = timeNowIn;
			}
			else{
				xaFPSCounter.FrmsCntr++;
			}
			xaCtx2D.fillText(xaFPSCounter.Value+" FPS", 50, 100);
		}
		//
		
	}
}