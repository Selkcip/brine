var gameLoop;
var oldTime;
var MSPF = 17;
var FPS = 60;
var brinePaused = false;
var brineBlurred = false;
var pauseOnBlurred = true;
var canvas;
var aspectRatio;
var ctx;
var matrixStack = new List();
var clearColor = [1,1,1,1];
var effects = new PostFXChain();
var log = new List();
var showConsole = false;
var use2D = getCookie("use2D") ? getCookie("use2D") == "true" : false;
var brineConsole;
var useViewCulling = true;
var allowContextMenu = true;
var useStates = false;
var brineFPS = 0;
var oldDrawTime = 0;
var fpsCounter = new Widget(0,0,0,60,15);
fpsCounter.style.color = "#ffffff";
fpsCounter.style.background = "black";
fpsCounter.style.opacity = "0.75";
fpsCounter.visible = false;
/*var unpauseBtn = new Widget("",0,0,"","");
unpauseBtn.style.background = "black";
unpauseBtn.btn = unpauseBtn.add("button");
unpauseBtn.btn.innerHTML = "Resume";
unpauseBtn.btn.onclick = function(){
	brinePaused = false;
	unpauseBtn.removeFrom();
}*/
//fpsCounter.style.opacity = "0.75";

Math.sign = function(val){
	val = val != 0 ? val : 1;
	return val/Math.abs(val);
}

var world = new Sprite();
world.init = function(){};

var display;

/**
 * Initializes the drawing context and input handlers with the given canvas.
 * 
 * @param {string} The DOM id of the canvas object you want to use for Brine.
 */
function initGame(canvasId){
	canvas = document.getElementById(canvasId);
	canvas.setAttribute("tabindex", "0");
	canvas.radius = Math.sqrt(canvas.width*canvas.width+canvas.height*canvas.height)/2;
	canvas.pos = [canvas.width/2, canvas.height/2, 0];
	aspectRatio = canvas.width/canvas.height;
	canvas.initialWidth = canvas.width;
	canvas.initialHeight = canvas.height;
	canvas.scaleX = canvas.offsetWidth/canvas.width;
	canvas.scaleY = canvas.offsetHeight/canvas.height;
	canvas.focus();
	
	//display = document.getElementById("display");
	display = document.createElement('div');
	canvas.parentElement.replaceChild(display,canvas);
	display.appendChild(canvas);
	if(display != undefined){
		display.style.width = canvas.offsetWidth+"px";//Math.max(canvas.width, canvas.style.width.replace("px",""));
		display.style.height = canvas.offsetHeight+"px";//Math.max(canvas.height, canvas.style.height.replace("px",""));
		display.style.margin = "0px";
		display.style.overflow = "hidden";
		display.style.position = "relative";
		display.style.backgroundColor = document.body.bgColor;
		
		display.style.webkitTouchCallout = "none";
		display.style.webkitUserSelect = "none";
		display.style.khtmlUserSelect = "none";
		display.style.MozUserSelect = "none";
		display.style.msUserSelect = "none";
		display.style.UserSelect = "none";
	}
	
	fpsCounter.addTo(display);
	fpsCounter.style.fontSize = "10px";
	
	brineConsole = document.getElementById("console");
	
	//Attempts to create a 3D context falling back to 2D if 3D is unavailable
	if(canvas.getContext){
		try{
			if(!use2D){
				ctx = canvas.getContext("experimental-webgl", {alpha: true, preserveDrawingBuffer: true});
			}
		}catch(e){
		}
		if(!ctx){
			ctx = canvas.getContext("2d");
			use2D = true;
		}else{
			initGL(canvas);
			Textures.create();
		}
		rewriteCTXFunctions();
		
		/*if(typeof(States) != "undefined"){
			useStates = true;
		}*/
		
		world.init();
		
		//input.init();
		gInput.addFunc(192, toggleConsole, false);
		gInput.addFunc(45, togglePrintKey);
		gameLoop = requestAnimationFrame(update); //New Method
		//gameLoop = setInterval(update, 30); //Old method
	}
	canvas.addEventListener("keydown",canvasHandleKeyDown,false);
	canvas.addEventListener("keyup",canvasHandleKeyUp,false);
	canvas.addEventListener("keypress",canvasHandleKeyPress,false);
	
	document.addEventListener('mousemove',canvasMouseMove,false);
	canvas.addEventListener('mousedown',canvasMouseDown,false);
	document.addEventListener('mouseup',canvasMouseUp,false);
	canvas.addEventListener('mousewheel',canvasMouseWheel,false);
	canvas.addEventListener('DOMMouseScroll',canvasMouseWheel,false);
	
	/**
	 * Called when the browser tab/window loses focus. Override for a custom action when the game loses focus.
	 */
	canvas.onBrinePaused = function(){
		/*unpauseBtn.addTo(display);
		unpauseBtn.x = canvas.width/2-unpauseBtn.width/2;
		unpauseBtn.y = canvas.height/2-unpauseBtn.height/2;
		brinePaused = true;*/
	}
	
	window.onfocus = function(){
		brineBlurred = false;
	}
	
	window.onblur = function(){
		//brinePaused = true;
		//println("paused");
		brineBlurred = true;
		if(pauseOnBlurred && !brinePaused){
			canvas.onBrinePaused();
		}
	}
	
	//document.onselectstart = function(){ return false;};
	
	//Enable/disable the context menu on the canvas based on allowContextMenu
	if(!allowContextMenu){
		canvas.oncontextmenu = function(){ return false; }
	}
}

/**
 * Switches between the 2d and webgl drawing contexts. Set this as an empty link's onclick function and the link will reload the page with the context switched.
 */
function switchContext(){
	if(use2D){
		setCookie("use2D", false, 100);
		//window.location.reload();
	}else{
		setCookie("use2D", true, 100);
		//window.location.reload();
	}
}

/**
 * Input handlers pass events to a global input object as well as the active state's input object. You probably don't need to bother with this as it's an internal functon.
 */
function canvasMouseMove(e){
	if(!e) e = window.event;
	if(useStates){
		States.current().input.mouseMove(e);
	}
	gInput.mouseMove(e);
}

/**
 * Input handlers pass events to a global input object as well as the active state's input object. You probably don't need to bother with this as it's an internal functon.
 */
function canvasMouseDown(e){
	if(!e) e = window.event;
	canvas.focus();
	if(useStates){
		States.current().input.mouseDown(e);
	}
	gInput.mouseDown(e);
}

/**
 * Input handlers pass events to a global input object as well as the active state's input object. You probably don't need to bother with this as it's an internal functon.
 */
function canvasMouseUp(e){
	if(!e) e = window.event;
	if(useStates){
		States.current().input.mouseUp(e);
	}
	gInput.mouseUp(e);
}

/**
 * Input handlers pass events to a global input object as well as the active state's input object. You probably don't need to bother with this as it's an internal functon.
 */
function canvasMouseWheel(e){
	if(!e) e = window.event;
	if(useStates){
		States.current().input.mouseWheel(e);
	}
	gInput.mouseWheel(e);
}

/**
 * Input handlers pass events to a global input object as well as the active state's input object. You probably don't need to bother with this as it's an internal functon.
 */
function canvasHandleKeyDown(e){
	var key = e.keyCode;
	//println(key);
	if(useStates){
		States.current().input.handleKeyDown(e);
	}
	gInput.handleKeyDown(e);
}

/**
 * Input handlers pass events to a global input object as well as the active state's input object. You probably don't need to bother with this as it's an internal functon.
 */
function canvasHandleKeyUp(e){
	var key = e.keyCode;
	if(useStates){
		States.current().input.handleKeyUp(e);
	}
	gInput.handleKeyUp(e);
}

/**
 * Input handlers pass events to a global input object as well as the active state's input object. You probably don't need to bother with this as it's an internal functon.
 */
function canvasHandleKeyPress(e){
	var key = e.which;
	if(useStates){
		States.current().input.handleKeyPress(e);
	}
	gInput.handleKeyPress(e);
}

/**
 * Blocks the context menu on the canvas
 */
function contextMenu(e){
	println("context");
	return false;
}

/**
 * Toggles printing pressed keys
 */
function togglePrintKey(){
	if(gInput.printKey){
		gInput.printKey = false;
	}else{
		gInput.printKey = true;
	}
}

/**
  * Game loop update function. Called in draw where time is the current execution time. Update then calculates a delta
  * time for how much time has passed since the last update and passes that on to the state manager update (if using States)
  * as well as the world object's update.
  */
function update(time){
	canvas.scaleX = canvas.offsetWidth/canvas.width;
	canvas.scaleY = canvas.offsetHeight/canvas.height;
	
	if(!oldTime || brinePaused || (brineBlurred && pauseOnBlurred)){
		oldTime = time;
	}
	//if(brinePaused){println("unpaused:"+(time-oldTime)/MSPF);}
	if(!brinePaused){
		if(brineBlurred && pauseOnBlurred){
			canvas.onBrinePaused();
		}
		var delta = (time-oldTime)/MSPF;
		oldTime = time;
		delta = Math.min(100,delta);
		//println(delta);
		for(; delta > 0; delta--){
			var updateScale = delta > 1 ? 1 : delta;
			if(useStates){
				States.update(updateScale);
			}
			
			world.update(updateScale);
		}
	}
	
	draw(time);
	
	//brineBlurred = false;
	
	gameLoop = requestAnimationFrame(update);
}

/**
 * Clears the canvas and calls draw on the state manager/world.
 * Currently also does brineConsole display stuff, but that should be relocated.
 */
function draw(time){
	if(!use2D){
		ctx.setBuffer(null);
		ctx.viewport(0, 0, ctx.viewportWidth, ctx.viewportHeight);
		var alpha = clearColor[3];
		ctx.clearColor(clearColor[0]*alpha, clearColor[1]*alpha, clearColor[2]*alpha, alpha);
		ctx.clear(ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT);
		
		ctx.setBuffer(colorBuffer);
		ctx.viewport(0, 0, ctx.viewportWidth, ctx.viewportHeight);
		//ctx.clearColor(clearColor[0]*alpha, clearColor[1]*alpha, clearColor[2]*alpha, alpha);
		ctx.clearColor(0,0,0,0);
		ctx.clear(ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT);
	}else{
		ctx.clearRect(0,0,canvas.width,canvas.height);
		ctx.fillStyle = rgb(clearColor);
		ctx.globalAlpha = clearColor[3];
		ctx.fillRect(0,0,canvas.width,canvas.height);
	}
	
	mat4.ortho(pMatrix, -0, 1*aspectRatio, -1, 0, -1, 1);
	mat4.identity(mvMatrix);
	
	if(useStates){
		States.draw(ctx);
	}
	
	//Draw the stateless world
	world.transform(ctx);
	world.draw(ctx);
	world.unTransform(ctx);
	
	if(!use2D){
		ctx.clearColor(0, 0, 0, 0);
		effects.apply(ctx, colorBuffer);
		
		ctx.useProgram(shaderProgram);
		
		ctx.bindTexTo(colorBuffer.texture, shaderProgram.samplerUniform);
		
		ctx.uniform1f(shaderProgram.alpha, 1.0);
		
		ctx.setBuffer(null);
		
		ctx.drawScreenBuffer(shaderProgram);
	}
	
	if(showConsole){
		if(!use2D){
			brineConsole = document.getElementById("console");
			if(brineConsole != null && brineConsole != undefined){
				var text = "";
				for(var node = log.head; node !== null; node = node.link){
					text = node.item+"<br/>"+text;
				}
				brineConsole.innerHTML = text;
			}
			brineConsole.style.visibility = "visible";
		}else{
			ctx.fillStyle = "#ffffff";
			ctx.globalAlpha = 0.25;
			ctx.fillRect(0,0,canvas.width,canvas.height);
			ctx.globalAlpha = 1.0;
			ctx.fillStyle = "#000000";
			//ctx.shadowBlur = 3;
			ctx.shadowColor = "#ffffff";
			var lineHeight = 18;
			var lineNumber = 0;
			for(var node = log.head; node !== null; node = node.link){
				var line = node.item;
				//ctx.font="16px Arial";
				//ctx.strokeText(line, 5, canvas.height-(log.length-lineNumber)*12);
				ctx.font = lineHeight+"px Arial";
				ctx.fillText(line, 5, canvas.height-(log.length-lineNumber)*lineHeight);
				lineNumber++;
			}
			ctx.shadowBlur = 0;
		}
	}else{
		if(brineConsole != null && brineConsole != undefined && !use2D){
			brineConsole.innerHTML = "";
			brineConsole.style.visibility = "hidden";
		}
	}
	
	var timeDiff = time-oldDrawTime;
	brineFPS = Math.round((1000/timeDiff)*10)/10;
	fpsCounter.html = "FPS: "+brineFPS;
	oldDrawTime = time;
}

var brinePixelData = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkZDRjI0RUYxRDdDNTExRTFBRkJCQzk5NTUyMDgzMDVDIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkZDRjI0RUYyRDdDNTExRTFBRkJCQzk5NTUyMDgzMDVDIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RkNGMjRFRUZEN0M1MTFFMUFGQkJDOTk1NTIwODMwNUMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RkNGMjRFRjBEN0M1MTFFMUFGQkJDOTk1NTIwODMwNUMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7FSUX/AAAAD0lEQVR42mL4//8/QIABAAX+Av4tzonuAAAAAElFTkSuQmCC";
Textures.load(brinePixelData);

/**
 * Rewrites the default canvas context functions so that they work the same for 2D and 3D contexts
 */
function rewriteCTXFunctions(){
	//Add a fullscreen function to the canvas
	var prefixes = ["moz","webkit","o","ms"];
	canvas.matchScreenRes = false;
	
	canvas.enterFullScreen = function(resize){
		if(exists(this.requestFullScreen)){
			this.requestFullScreen();
		}else{
			for(var prefix in prefixes){
				prefix = prefixes[prefix];
				if(exists(this[prefix+"RequestFullScreen"])){
					this[prefix+"RequestFullScreen"]();
				}
			}
		}
		
		this.matchScreenRes = resize;
	}
	
	canvas.exitFullScreen = function(){
		if(exists(this.cancelFullScreen)){
			this.cancelFullScreen();
		}else{
			for(var prefix in prefixes){
				prefix = prefixes[prefix];
				if(exists(canvas[prefix+"CancelFullScreen"])){
					canvas[prefix+"CancelFullScreen"]();
				}
			}
		}
	}
	
	canvas.onFullScreenChange = function(e){
		if(document.webkitIsFullScreen || document.mozFullScreen){
			console.log("enter full")
			if(canvas.matchScreenRes){
				canvas.width = screen.width;
				canvas.height = screen.height;
			}
			canvas.style.width = screen.width+"px";
			canvas.style.height = screen.height+"px";
		}else{
			console.log("exit full")
			if(exists(canvas.initialWidth)){
				canvas.width = canvas.initialWidth;
			}
			
			if(exists(canvas.initialHeight)){
				canvas.height = canvas.initialHeight;
			}
			
			canvas.style.width = "";
			canvas.style.height = "";
		}
		aspectRatio = canvas.width/canvas.height;
		ctx.viewportWidth = canvas.width;
		ctx.viewportHeight = canvas.height;
	}
	
	document.addEventListener("fullscreenchange", canvas.onFullScreenChange, false);
	document.addEventListener("mozfullscreenchange", canvas.onFullScreenChange, false);
	document.addEventListener("webkitfullscreenchange", canvas.onFullScreenChange, false);
	
	//var ctxProto = ctx.__proto__;
	var ctxProto = ctx.constructor.prototype;
	
	var identityMat = mat4.create();
	mat4.identity(identityMat);
	ctx.save = function(){
		var tempMat = mat4.create();
		mat4.multiply(tempMat, mvMatrix, identityMat);
		ctx.matrix = tempMat;
		matrixStack.push_back(tempMat);
		if(use2D){
			ctxProto.save.call(ctx);
		}
	}
	
	ctx.restore = function(){
		mvMatrix = matrixStack.pop_back();
		if(use2D){
			ctxProto.restore.call(ctx);
		}
	}
	
	ctx.curDrawPos = new Vector(0,0,0);
	
	ctx.moveTo = function(x, y){
		if(!use2D){
			ctx.curDrawPos.x = x;
			ctx.curDrawPos.y = y;
		}else{
			return ctxProto.moveTo.call(this, x, y);
		}		
	}
	
	var lineSprite = new Sprite();
	//lineSprite.image = Textures.load("../engine/images/pixel.png");
	lineSprite.image = Textures.load(brinePixelData);
	ctx.lineSprite = lineSprite;
	ctx.glLineWidth = 1;
	ctx.lineTo = function(x, y){
		if(!use2D){
			var xDis = x-this.curDrawPos.x;
			var yDis = y-this.curDrawPos.y;
			var length = Math.sqrt(xDis*xDis+yDis*yDis);
			var ang = Math.atan2(yDis, xDis);
			this.lineSprite.x = this.curDrawPos.x;
			this.lineSprite.y = this.curDrawPos.y;
			this.lineSprite.rotation = ang;
			this.lineSprite.width = length;
			this.lineSprite.height = this.glLineWidth;
			this.lineSprite.offsetY = -this.lineSprite.height/2;
			this.lineSprite.transform(this);
			this.lineSprite.draw(this);
			this.lineSprite.unTransform(this);
			this.curDrawPos.x = x;
			this.curDrawPos.y = y;
		}else{
			return ctxProto.lineTo.call(this, x, y);
		}
	}
	
	ctx.getMatrix = function(){
		return this.matrix;
	}
	
	ctx.scale = function(x, y){
		x = x == 0 ? 0.0000001 : x;
		y = y == 0 ? 0.0000001 : y;
		
		mat4.scale(mvMatrix, mvMatrix, [x, y, 1.0]);
		if(use2D){
			return ctxProto.scale.call(this, x, y);
		}
	}
	
	ctx.rotate = function(angle){
		mat4.rotateZ(mvMatrix, mvMatrix, -angle);
		if(use2D){
			return ctxProto.rotate.call(this, angle);
		}
	}
	
	ctx.translate = function(x, y){
		mat4.translate(mvMatrix, mvMatrix, [x*aspectRatio/canvas.width, -y/canvas.height, 0.0]);
		if(use2D){
			return ctxProto.translate.call(this, x, y);
		}
	}
	
	//These 2 still need to be fixed
	ctx.transform = function(a, b, c, d, e, f){
		if(use2D){
			return ctxProto.transform.call(this, a, b, c, d, e, f);
		}
	}
	
	ctx.setTransform = function(a, b, c, d, e, f){
		if(use2D){
			return ctxProto.setTransform.call(this, a, b, c, d, e, f);
		}
	}
	
	if(use2D){
		//Buffer for drawing scrolling sprite to
		ctx.spriteBuffer = document.createElement("canvas");
		ctx.spriteBCTX = ctx.spriteBuffer.getContext("2d");
		//document.body.appendChild(ctx.spriteBuffer);
	}else{
		ctx.currentBuffer = null;
		ctx.setBuffer = function(buffer){
			ctx.currentBuffer = buffer;
			this.bindFramebuffer(this.FRAMEBUFFER, buffer);
		}
		
		//Simplifies binding textures
		ctx.bindTexTo = function(texture, uniform, num){
			if(exists(texture)){// && exists(uniform)){
				num = num ? num : 0;
				this.activeTexture(this.TEXTURE0+num);
				this.bindTexture(this.TEXTURE_2D, texture);
				this.uniform1i(uniform, num);
			}
		}
		
		var oldUseProgram = ctx.useProgram;
		ctx.useProgram = function(program){
			oldUseProgram.call(this, program);
			for(var i = 0; i < 10; i++){
				if(i < program.attribCount){
					this.enableVertexAttribArray(i);
				}else{
					this.disableVertexAttribArray(i);
				}
			}
		}
		
		ctx.drawScreenBuffer = function(shader, clearBuffer, width, height, blendFunc){
			this.useProgram(shader);
			mat4.identity(mvMatrix);
			mat4.scale(mvMatrix, mvMatrix, [aspectRatio, 1, 1.0]);
			
			width = width ? width : this.viewportWidth;
			height = height ? height : this.viewportHeight;
			
			//this.viewport(0, 0, this.viewportWidth, this.viewportHeight);
			this.viewport(0, 0, width, height);
			if(clearBuffer){
				this.clear(this.COLOR_BUFFER_BIT);
			}
			
			blendFunc = blendFunc ? blendFunc : {a:"ONE", b:"ONE_MINUS_SRC_ALPHA"};
			//this.blendFunc(this.ONE, this.ONE_MINUS_SRC_ALPHA); //This might need to be taken out if there is some buffer drawing issue down the line.
			this.blendFuncSeparate(ctx[blendFunc.a], ctx[blendFunc.b], ctx.ONE, ctx.ONE_MINUS_SRC_ALPHA);
			//this.blendFuncSeparate(ctx.ONE, ctx.ONE_MINUS_SRC_ALPHA, ctx.ONE, ctx.ONE_MINUS_SRC_ALPHA);
			
			this.bindBuffer(this.ARRAY_BUFFER, spriteVPB);
			this.vertexAttribPointer(shader.aVertexPosition, spriteVPB.itemSize, this.FLOAT, false, 0, 0);
			
			this.bindBuffer(this.ARRAY_BUFFER, spriteVTB);
			this.vertexAttribPointer(shader.aTextureCoord, spriteVTB.itemSize, this.FLOAT, false, 0, 0);
			
			this.bindBuffer(this.ELEMENT_ARRAY_BUFFER, spriteVIB);
			setMatrixUniforms(shader);
			this.drawElements(this.TRIANGLES, spriteVIB.numItems, this.UNSIGNED_SHORT, 0);
			
			mat4.identity(mvMatrix);
			
			this.blendFunc(this.ONE, this.ONE_MINUS_SRC_ALPHA);
		}
		
		ctx.fillRect = function(shader, x, y, width, height, blendFunc){
			this.useProgram(shader);
			
			mat4.identity(mvMatrix);
			mat4.scale(mvMatrix, mvMatrix, [aspectRatio, 1, 1.0]);
			
			width = width ? width : this.currentBuffer.width;
			height = height ? height : this.currentBuffer.height;
			
			this.viewport(x, y, width, height);
			
			blendFunc = blendFunc ? blendFunc : {a:"ONE", b:"ONE_MINUS_SRC_ALPHA"};
			//this.blendFunc(this.ONE, this.ONE_MINUS_SRC_ALPHA); //This might need to be taken out if there is some buffer drawing issue down the line.
			this.blendFuncSeparate(ctx[blendFunc.a], ctx[blendFunc.b], ctx.ONE, ctx.ONE_MINUS_SRC_ALPHA);
			//this.blendFuncSeparate(ctx.ONE, ctx.ONE_MINUS_SRC_ALPHA, ctx.ONE, ctx.ONE_MINUS_SRC_ALPHA);
			
			this.bindBuffer(this.ARRAY_BUFFER, spriteVPB);
			this.vertexAttribPointer(shader.aVertexPosition, spriteVPB.itemSize, this.FLOAT, false, 0, 0);
			
			this.bindBuffer(this.ARRAY_BUFFER, spriteVTB);
			this.vertexAttribPointer(shader.aTextureCoord, spriteVTB.itemSize, this.FLOAT, false, 0, 0);
			
			this.bindBuffer(this.ELEMENT_ARRAY_BUFFER, spriteVIB);
			setMatrixUniforms(shader);
			this.drawElements(this.TRIANGLES, spriteVIB.numItems, this.UNSIGNED_SHORT, 0);
			
			mat4.identity(mvMatrix);
			
			this.blendFunc(this.ONE, this.ONE_MINUS_SRC_ALPHA);
		}
	}

	ctx.alpha = 1.0;
	var sPos = [0,0,0];
	var verts = new Array();
	verts.push([0,0,0]);
	verts.push([0,0,0]);
	verts.push([0,0,0]);
	verts.push([0,0,0]);
	ctx.drawSprite = function(sprite, frame){
		var width = sprite.width;
		var height = sprite.height;
		var sWidth = width*sprite.scaleX;
		var sHeight = height*sprite.scaleY;
		
		/*var sRadius = Math.sqrt(sWidth*sWidth+sHeight*sHeight)/2;
		//var minDis = canvas.radius+sRadius;
		var minX = canvas.width/2+sRadius;
		var minY = canvas.height/2+sRadius;
		sPos[0] = 0;
		sPos[1] = 0;
		mat4.multiplyVec3(mvMatrix, sPos);
		vec3.multiply(sPos, [(1/aspectRatio)*canvas.width, -canvas.height, 1]);
		//var dis = vec3.dist(sPos, canvas.pos);
		var xDis = Math.abs(sPos[0]-canvas.pos[0]);
		var yDis = Math.abs(sPos[1]-canvas.pos[1]);
		//println("min: "+minDis+" dis: "+dis);*/
		
		//if(dis <= minDis){
		if(true){//}!useViewCulling || (xDis <= minX && yDis <= minY)){
			var x = 0;//sprite.offsetX;
			var y = 0;//sprite.offsetY;
			
			var image = sprite.image;
			frame = frame ? Math.floor(frame) : 0;
			var frameWidth = sprite.frameWidth > 0 ? sprite.frameWidth : image.width;
			var frameHeight = sprite.frameHeight > 0 ? sprite.frameHeight : image.height;
			var multColor = sprite.multColor;
			//var alpha = sprite.alpha;
			var alpha = Math.max(0, ctx.alpha);
			var blendMode = sprite.blendMode;
			
			ctx.globalAlpha = alpha;
			ctx.globalCompositeOperation = blendMode;
			
			var renderShader = spriteShader;
			
			//If we are using webgl this sets a few uniforms and binds the sprite's texture
			if(sprite.image.texture != undefined){
				y = -y;
				
				//ctx.blendFunc(ctx[sprite.blendFunction.a], ctx[sprite.blendFunction.b]);
				ctx.blendFuncSeparate(ctx[sprite.blendFunction.a], ctx[sprite.blendFunction.b], ctx.ONE, ctx.ONE_MINUS_SRC_ALPHA);
			
				mat4.translate(mvMatrix, mvMatrix, [x*aspectRatio/canvas.width, y/canvas.height, 0.0]);
				
				//If the width or height is 0 the changes to the matrix can't be reversed
				width = Math.max(0.0000001, width);
				height = Math.max(0.0000001, height);
				mat4.scale(mvMatrix, mvMatrix, [width*aspectRatio/canvas.width, height/canvas.height, 1.0]);
				
				//renderShader = spriteShader;
				
				if(exists(sprite.shader)){
					renderShader = sprite.shader;
				}
				
				ctx.useProgram(renderShader);
				
				ctx.bindBuffer(ctx.ARRAY_BUFFER, spriteVPB);
				ctx.vertexAttribPointer(renderShader.aVertexPosition, spriteVPB.itemSize, ctx.FLOAT, false, 0, 0);
				
				ctx.bindBuffer(ctx.ARRAY_BUFFER, spriteVTB);
				ctx.vertexAttribPointer(renderShader.aTextureCoord, spriteVTB.itemSize, ctx.FLOAT, false, 0, 0);
				
				ctx.activeTexture(ctx.TEXTURE0);
				ctx.bindTexture(ctx.TEXTURE_2D, sprite.image.texture);
				ctx.uniform1i(renderShader.samplerUniform, 0);
				
				ctx.uniform3f(renderShader.multColor, multColor.r, multColor.g, multColor.b);
				ctx.uniform1f(renderShader.alpha, alpha);
			}
			
			var tilesX = sprite.tilesX;
			var tilesY = sprite.tilesY;
			var tileImage = (tilesX != undefined && tilesY != undefined);
			
			var sliceX = Math.min(Math.max(0, sprite.sliceX), frameWidth);
			var sliceY = Math.min(Math.max(0, sprite.sliceY), frameHeight);
			var sliceWidth = sprite.sliceWidth ? Math.max(0, sprite.sliceWidth) : sprite.sliceWidth;
			var sliceHeight = sprite.sliceHeight ? Math.max(0, sprite.sliceHeight) : sprite.sliceHeight;
			
			var scrollX = sprite.scrollX%(width/tilesX);
			var scrollY = sprite.scrollY%(height/tilesY);
			var scrollImage = (scrollX != undefined && scrollY != undefined && (scrollX != 0 || scrollY != 0));
			
			//New consolidated drawing code
			var frameXOff = (frame%(image.width/frameWidth))*frameWidth;
			var frameYOff = Math.floor(frame/(image.width/frameWidth))*frameHeight;
			
			frameWidth = frameWidth-sliceX;
			frameHeight = frameHeight-sliceY;
			
			frameWidth = sliceWidth ? Math.min(frameWidth, sliceWidth) : frameWidth;
			frameHeight = sliceHeight ? Math.min(frameHeight, sliceHeight) : frameHeight;
			
			//Add Slice offsets
			frameXOff += sliceX;
			frameYOff += sliceY;
			
			//2D drawing
			if(use2D){
				var tilesXcale = 1/tilesX;
				var tilesYcale = 1/tilesY;
				if(scrollImage){
					scrollX /= tilesXcale;
					scrollY /= tilesYcale;
					scrollX = scrollX%width;
					scrollY = scrollY%height;
					
					//scrollX = -scrollX;
					scrollY = -scrollY;
					if(scrollX < 0){
						scrollX = width+scrollX;
					}
					if(scrollY < 0){
						scrollY = height+scrollY;
					}
					
					adscrollX = (scrollX/width)*frameWidth;
					adscrollY = (scrollY/height)*frameHeight;
					var q0Width = frameWidth-adscrollX;
					var q0Height = frameHeight-adscrollY;
					
					var q1Width = frameWidth-q0Width;
					var q1Height = q0Height;
					
					var q2Width = q1Width;
					var q2Height = frameHeight-q0Height;
					
					var q3Width = q0Width;
					var q3Height = q2Height;
					
					this.spriteBuffer.width = width;
					this.spriteBuffer.height = height;
					
					//Draw to this buffer so we can tile the sprite lots without having to draw it four times for each tile to get the scrolling effect
					/*this.spriteBCTX.drawImage(image, frameXOff+adscrollX, frameYOff+adscrollY, q0Width, q0Height, x, y, (q0Width/frameWidth)*width, (q0Height/frameHeight)*height);
					this.spriteBCTX.drawImage(image, frameXOff, frameYOff+adscrollY, q1Width, q1Height, (x+(width-scrollX)), y, (q1Width/frameWidth)*width, (q1Height/frameHeight)*height);
					this.spriteBCTX.drawImage(image, frameXOff, frameYOff, q2Width, q2Height, (x+(width-scrollX)), (y+(height-scrollY)), (q2Width/frameWidth)*width, (q2Height/frameHeight)*height);
					this.spriteBCTX.drawImage(image, frameXOff+adscrollX, frameYOff, q3Width, q3Height, x, (y+(height-scrollY)), (q3Width/frameWidth)*width, (q3Height/frameHeight)*height);*/
					
					if(q0Width > 0 && q0Height > 0){
						this.spriteBCTX.drawImage(image, frameXOff+adscrollX, frameYOff+adscrollY, q0Width, q0Height, 0, 0, (q0Width/frameWidth)*width, (q0Height/frameHeight)*height);
					}
					if(q1Width > 0 && q1Height > 0){
						this.spriteBCTX.drawImage(image, frameXOff, frameYOff+adscrollY, q1Width, q1Height, (0+(width-scrollX)), 0, (q1Width/frameWidth)*width, (q1Height/frameHeight)*height);
					}
					if(q2Width > 0 && q2Height > 0){
						this.spriteBCTX.drawImage(image, frameXOff, frameYOff, q2Width, q2Height, (0+(width-scrollX)), (0+(height-scrollY)), (q2Width/frameWidth)*width, (q2Height/frameHeight)*height);
					}
					if(q3Width > 0 && q3Height > 0){
						this.spriteBCTX.drawImage(image, frameXOff+adscrollX, frameYOff, q3Width, q3Height, 0, (0+(height-scrollY)), (q3Width/frameWidth)*width, (q3Height/frameHeight)*height);
					}
					
					//Set the current image (not the sprite's) to the buffer we just drew to
					image = this.spriteBuffer;
				
					//Reset everything to fit the buffer's dimensions
					frameXOff = 0;
					frameYOff = 0;
					frameWidth = width;
					frameHeight = height;
				}
				
				var xOff = 0;
				var yOff = 0;
				
				//Tile image (or don't)
				for(var i = 0; i < tilesX; i++){
					for(var j = 0; j < tilesY; j++){
						this.drawImage(image, frameXOff, frameYOff, frameWidth, frameHeight, x+xOff, y+yOff, width*tilesXcale, height*tilesYcale);
						yOff += height*tilesYcale;
					}
					yOff = 0;
					xOff += width*tilesXcale;
				}
			}else{
				ctx.useProgram(renderShader);
				ctx.uniform2f(renderShader.frameOffset, frameXOff/image.width, frameYOff/image.height);
				ctx.uniform2f(renderShader.frameDims, frameWidth/image.width, frameHeight/image.height);
			}
			
			if(!use2D){
				if(tileImage){
					ctx.uniform2f(renderShader.tiles, sprite.tilesX, sprite.tilesY);
				}
				if(scrollImage){
					ctx.uniform2f(renderShader.scroll, scrollX/width, scrollY/height);
				}
			}
			
			//WebGL drawing
			if(sprite.image.texture != undefined){
				ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, spriteVIB);
				setMatrixUniforms(renderShader);
				ctx.drawElements(ctx.TRIANGLES, spriteVIB.numItems, ctx.UNSIGNED_SHORT, 0);
				
				mat4.scale(mvMatrix, mvMatrix, [1/(width*aspectRatio/canvas.width), 1/(height/canvas.height), 1.0]);
				mat4.translate(mvMatrix, mvMatrix, [-x*aspectRatio/canvas.width, -y/canvas.height, 0.0]);
				
				ctx.uniform2f(renderShader.frameOffset, 0, 0);
				ctx.uniform2f(renderShader.frameDims, 1, 1);
				ctx.uniform2f(renderShader.tiles, 1, 1);
				ctx.uniform2f(renderShader.scroll, 0, 0);
				
				ctx.uniform3f(renderShader.multColor, 1, 1, 1);
			}
			
			ctx.globalAlpha = 1.0;
			ctx.globalCompositeOperation = "source-over";
		}else{
			//println("Sprite failed broad sweep.");
		}
	}
}

/**
 * Toggles the visibility of the brineConsole.
 */
function toggleConsole(){
	if(showConsole){
		showConsole = false;
	}else{
		showConsole = true;
	}
}

/**
 * Prints the string value of the given object to the brineConsole without a new line.
 * 
 * @param {Object} value Object whose toString will be printed.
 */
function print(value){
	log.push(value);
	if(log.length > 25){
		log.remove(log.head.item);
	}
}

/**
 * Prints the string value of the given object to the brineConsole with a new line.
 * 
 * @param {Object} value Object whose toString will be printed.
 */
function println(value){
	print(value+"\n");
}

/**
 * Degrees to radians conversion.
 * 
 * @param {number} degrees Value in degrees to be comverted to radians.
 * @return {number} The radian value.
 */
function DTR(degrees){
	return degrees*Math.PI/180;
}

/**
 * Radians to degrees conversion.
 * 
 * @param {number} radians Value in radians to be comverted to degrees.
 * @return {number} The degree value.
 */
function RTD(radians){
	return radians*180/Math.PI;
}

/**
 * Convert RGB to hex string
 * 
 * @param {array} color The RGB color to be converted to a HEX string.
 * @return {string} The HEX value as a string.
 */
function rgb(color){
	return "#"+rgbComp(color[0])+rgbComp(color[1])+rgbComp(color[2]);
}

function rgbComp(value){
	var hex = (Math.round(value*255)).toString(16);
	return ((hex.length < 2) ? "0" : "")+hex;
}

/**
 * Checks to see that variable is not undefined and not null
 * 
 * @param {variable} variable The variable to check.
 * @return {bool} True if not undefined and not null.
 */
function exists(variable){
	return typeof variable != "undefined" && variable != null;
}

/**
 * Returns the sign of the number.
 */
function sign(n){
	return (n == 0) ? 1 : Math.abs(n)/n;
}

/**
 * Theoretically determines the name of the object's class. However, it is not thouroughly tested and may fail in some cases.
 * 
 * @param {Object} obj The object to find the class of.
 * @return {string} The object's class name.
 */
function getClassName(obj){
	var types = [];
	for(var prop in window){
		if(window[prop] instanceof Function){
			if(obj instanceof window[prop]){
				types.push(prop);
			}
		}
	}
	var type;
	for(var i = 0; i < types.length; i++){
		type = types[i];
		for(var j = i+1; j < types.length; j++){
			if(new window[types[j]]() instanceof window[type]){
				type = types[j];
				break;
			}
		}
	}
	return type;
}

/**
 * Creates or sets the value of a browser cookie.
 * 
 * @param {string} name The name of the cookie. Can be generic since browsers store cookies based on the page that created them.
 * @param {Object} value String or number value to store in this cookie.
 * @param {number} days How many days this cookie will last before being removed.
 */
function setCookie(name, value, days){
	var date = new Date();
	date.setDate(date.getDate() + days);
	var data = escape(value)+((days==null) ? "" : "; expires="+date.toUTCString());
	document.cookie = name+"="+data;
}

/**
 * Reads the value of a cookie.
 * @param {string} name Name of the cookie to be read.
 * @return {string} The contents of the cookie.
 */
function getCookie(name){
	var strings = document.cookie ? document.cookie.split("; ") : [];
	//println(strings.length);
	for(var i=0; i < strings.length; i++){
		var cookie = strings[i].split("=");
		//println(cookie[0]+": "+(cookie[0] == name));
		if(cookie[0] == name){
			return unescape(cookie[1]);
		}
	}
	return false;
}

/**
 * Dynamically create a new canvas object for use as a game context.
 * 
 * @param {number} width Width of the canvas.
 * @param {number} height Height of the canvas.
 * @param {string} color Background color of the canvas.
 */
function createGameCanvas(width, height, color){
	var newCanvas = document.createElement("canvas");
	newCanvas.width = width;
	newCanvas.height = height;
	//newCanvas.style.backgroundColor = color;
	newCanvas.innerHTML = "<span style=\"font: white;\">Your browser doesn't support HTML 5 Canvas.<br />You should probably switch to something a little more forward thinking.</span>";
	return newCanvas;
}

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());