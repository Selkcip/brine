//Based on the tutorials found here: http://learningwebgl.com/blog/?page_id=1217

//This has a lot of redundent code and needs to be cleaned up

//Global matrices
var mvMatrix = mat4.create();
var pMatrix = mat4.create();

//Default shader
var shaderProgram;
var vertShader;
var fragShader;
//Pointer to the current sprite shader, allows custom effects when drawing sprites (normal mapping)
var spriteShader;

//Sprite vertex buffers
var spriteVPB;
var spriteVTB;
var spriteVIB;

//Default draw buffers
var colorBuffer;
var stateBuffer;

//Holds a pool of screen buffers for use with screen shaders
var sBuffers = new Object();

//Define some global blending modes
BLEND_ALPHA = {a:"SRC_ALPHA", b:"ONE_MINUS_SRC_ALPHA"};
BLEND_ADD = {a:"SRC_ALPHA", b:"ONE"};
BLEND_MULTIPLY = {a:"DST_COLOR", b:"ZERO"};

//Initializes some WebGL stuff
function initGL(canvas){
	try{
		ctx.viewportWidth = canvas.width;
		ctx.viewportHeight = canvas.height;
		initBuffers(ctx);
		
		//Initialize default shader
		fragShader = compileShader(ctx, defaultFragSrc);
		vertShader = compileShader(ctx, defaultVertSrc);
		shaderProgram = createShaderProgram();
		setupSpriteShader(shaderProgram);
		spriteShader = shaderProgram;
		
		colorBuffer = createRenderTarget(ctx, canvas.width, canvas.height);
		stateBuffer = createRenderTarget(ctx, canvas.width, canvas.height);
		
		ctx.clearColor(0.0, 0.0, 0.0, 1.0);
		
		ctx.blendFunc(ctx.SRC_ALPHA, ctx.ONE_MINUS_SRC_ALPHA);
		ctx.enable(ctx.BLEND);
	}catch(e){
	}
}

//Pushes the current matrices to the given vertex shader
function setMatrixUniforms(program){
	ctx.uniformMatrix4fv(program.uPMatrix, false, pMatrix);
	ctx.uniformMatrix4fv(program.uMVMatrix, false, mvMatrix);
}

//Pulls the shader source from the given embedded shader
function getShaderSrc(id){
	if(!use2D){
		var shaderScript = document.getElementById(id);
		if(!shaderScript){
			return null;
		}
		
		var code = "";
		var k = shaderScript.firstChild;
		while(k){
			if(k.nodeType == 3){
				code += k.textContent;
			}
			k = k.nextSibling;
		}
		var type;
		if(shaderScript.type == "x-shader/x-fragment"){
			type = "frag";
		}else if(shaderScript.type == "x-shader/x-vertex"){
			type = "vert";
		}else{
			return null;
		}
		
		return {code: code, type:type};
	}
	return null;
}

//Compiles a shader from the given source
function compileShader(gl, source){
	if(!use2D){
		if(!source){
			println("no src");
			return null;
		}
		
		var shader;
		if(source.type == "frag"){
			shader = gl.createShader(gl.FRAGMENT_SHADER);
		}else if(source.type == "vert"){
			shader = gl.createShader(gl.VERTEX_SHADER);
		}else{
			println("no type: "+source.type);
			return null;
		}
		
		gl.shaderSource(shader, source.code);
		gl.compileShader(shader);
		
		if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
			console.log(gl.getShaderInfoLog(shader));
			return null;
		}
		
		return shader;
	}
	return null;
}

//Creates a shader program
function createShaderProgram(fragSrc, vertSrc){
	if(!use2D){
		var frag;
		var vert;
		var attribCount = 0;
		
		fragSrc = fragSrc ? fragSrc : defaultFragSrc;
		frag = compileShader(ctx, fragSrc);
		
		vertSrc = vertSrc ? vertSrc : defaultVertSrc;
		vert = compileShader(ctx, vertSrc);
		
		var newProgram = ctx.createProgram();
		ctx.attachShader(newProgram, vert);
		ctx.attachShader(newProgram, frag);
		ctx.linkProgram(newProgram);
		newProgram.attribCount = attribCount;
		
		if(!ctx.getProgramParameter(newProgram, ctx.LINK_STATUS)){
			console.log("Could not initiate shaders");
		}else{
			
			/*//This may need to be uncommented for legacy code
			newProgram.vertexPositionAttribute = ctx.getAttribLocation(newProgram, "aVertexPosition");
			//println(newProgram.vertexPositionAttribute);
			//ctx.bindAttribLocation(newProgram, 0, "aVertexPosition");
			ctx.enableVertexAttribArray(newProgram.vertexPositionAttribute);
			
			newProgram.textureCoordAttribute = ctx.getAttribLocation(newProgram, "aTextureCoord");
			ctx.enableVertexAttribArray(newProgram.textureCoordAttribute);
			
			newProgram.pMatrixUniform = ctx.getUniformLocation(newProgram, "uPMatrix");
			newProgram.mvMatrixUniform = ctx.getUniformLocation(newProgram, "uMVMatrix");
			
			newProgram.aspect = ctx.getUniformLocation(newProgram, "aspect");*/
			
			if(exists(fragSrc)){
				fragSrc.code = fragSrc.code.replace(new RegExp("; ", "g"), ";\n");
				var lines = fragSrc.code.split("\n");
				for(var line in lines){
					line = lines[line].split(" ");
					if(line[0] == "uniform"){
						var uName = line[2];
						var bIndex = uName.indexOf("[");
						bIndex = bIndex > 0 ? bIndex : uName.indexOf(";");
						uName = uName.substring(0, bIndex);
						if(!exists(newProgram[uName])){
							newProgram[uName] = ctx.getUniformLocation(newProgram, uName);
						}
					}
				}
			}
			
			if(exists(vertSrc)){
				vertSrc.code = vertSrc.code.replace(new RegExp("; ", "g"), ";\n");
				var lines = vertSrc.code.split("\n");
				for(var line in lines){
					line = lines[line].split(" ");
					if(line[0] == "uniform" || line[0] == "attribute"){
						var uName = line[2];
						var bIndex = uName.indexOf("[");
						bIndex = bIndex > 0 ? bIndex : uName.indexOf(";");
						uName = uName.substring(0, bIndex);
						if(!exists(newProgram[uName])){
							if(line[0] == "uniform"){
								newProgram[uName] = ctx.getUniformLocation(newProgram, uName);
							}else if(line[0] == "varying"){
								//Do nothing
							}else{
								console.log(uName);
								newProgram[uName] = ctx.getAttribLocation(newProgram, uName);
								ctx.enableVertexAttribArray(newProgram[uName]);
								newProgram.attribCount++;
							}
						}
					}
				}
			}
			
			return newProgram;
		}
	}
	return null;
}

//Set up sprite shader helpers
function setupSpriteShader(program){
	if(!use2D){
		program.aVertexPosition = ctx.getAttribLocation(program, "aVertexPosition");
		ctx.enableVertexAttribArray(program.aVertexPosition);
		
		program.aTextureCoord = ctx.getAttribLocation(program, "aTextureCoord");
		ctx.enableVertexAttribArray(program.aTextureCoord);
		
		program.attribCount = 2;
		
		program.uPMatrix = ctx.getUniformLocation(program, "uPMatrix");
		program.uMVMatrix = ctx.getUniformLocation(program, "uMVMatrix");
		
		program.frameOffset = ctx.getUniformLocation(program, "frameOffset");
		program.frameDims = ctx.getUniformLocation(program, "frameDims");
		
		program.tiles = ctx.getUniformLocation(program, "tiles");
		program.scroll = ctx.getUniformLocation(program, "scroll");
		
		//shaderProgram.alphaMap = ctx.getUniformLocation(shaderProgram, "alphaMap");
		program.multColor = ctx.getUniformLocation(program, "multColor");
		program.alpha = ctx.getUniformLocation(program, "alpha");
	}
}

//Initializes the sprite vertex buffers
function initBuffers(gl){
	//Sprite
	spriteVPB = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, spriteVPB);
	var vertices = [
		0, -1, 0,
		1, -1, 0,
		1, 0, 0,
		0, 0, 0,
	];
	
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	spriteVPB.itemSize = 3;
	spriteVPB.numItems = 4;
	
	spriteVTB = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, spriteVTB);
	var texCoords = [
		0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0
	];
	
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
	spriteVTB.itemSize = 2;
	spriteVTB.numItems = 4;
	
	spriteVIB = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, spriteVIB);
	var spriteVertexIndices = [0, 1, 2,		0, 2, 3];
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(spriteVertexIndices), gl.STATIC_DRAW);
	spriteVIB.itemSize = 1;
	spriteVIB.numItems = 6;
}

//Creates a new render target, returns a screen buffer with a texture property
function createRenderTarget(gl, width, height){
	var rtBuffer = gl.createFramebuffer();
	gl.bindFramebuffer(gl.FRAMEBUFFER, rtBuffer);
	rtBuffer.width = width;
	rtBuffer.height = height;
	
	var rtTexture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, rtTexture);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    //gl.generateMipmap(gl.TEXTURE_2D);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
	
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, rtTexture, 0);
	
	var depthBuffer = gl.createRenderbuffer();
	gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
	gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
	
	gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);
	
	/*if(!gl.getExtension("WEBKIT_WEBGL_depth_texture")){
		gl.getExtension("MOZ_OES_depth_texture");
	}
	
	var depthTexture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, depthTexture);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    //gl.generateMipmap(gl.TEXTURE_2D);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT, width, height, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_SHORT, null);
	
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, depthTexture, 0);*/
	
	rtBuffer.texture = rtTexture;
	rtBuffer.depthBuffer = depthBuffer;
    
	gl.bindTexture(gl.TEXTURE_2D, null);
	gl.bindRenderbuffer(gl.RENDERBUFFER, null);
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	
	return rtBuffer;
}

function updateRenderTarget(gl, rtBuffer, width, height){
	gl.bindFramebuffer(gl.FRAMEBUFFER, rtBuffer);
	rtBuffer.width = width;
	rtBuffer.height = height;
	
	var rtTexture = rtBuffer.texture;
	gl.bindTexture(gl.TEXTURE_2D, rtTexture);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    //gl.generateMipmap(gl.TEXTURE_2D);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
	
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, rtTexture, 0);
	
	var depthBuffer = rtBuffer.depthBuffer;
	gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
	gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
	
	gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);
	
	rtBuffer.texture = rtTexture;
    
	gl.bindTexture(gl.TEXTURE_2D, null);
	gl.bindRenderbuffer(gl.RENDERBUFFER, null);
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	
	return rtBuffer;
}

function createCubeMapRenderTarget(gl, size){
	var cubeBuffer = {};
	cubeBuffer.buffers = [];
	cubeBuffer.width = size;
	cubeBuffer.height = size;
	
	var rtTexture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_CUBE_MAP, rtTexture);
	gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	for(var i = 0; i < 6; i++){
		gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X+i, 0, gl.RGBA, size, size, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
	}
	cubeBuffer.texture = rtTexture;
	
	var depthBuffer = gl.createRenderbuffer();
	gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
	gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, size, size);
	
	for(var i = 0; i < 6; i++){
		var buffer = gl.createFramebuffer();
		gl.bindFramebuffer(gl.FRAMEBUFFER, buffer);
		buffer.width = size;
		buffer.height = size;
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_X+i, rtTexture, 0);
		
		gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);
		
		cubeBuffer.buffers.push(buffer);
	}
    
	gl.bindTexture(gl.TEXTURE_2D, null);
	gl.bindRenderbuffer(gl.RENDERBUFFER, null);
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	
	return cubeBuffer;
}

//Sets up a pool of screen buffers
sBuffers.buffers = new Array();

//Returns either the first unlocked buffer in the array or creates a new one, pushes it into the array, and returns it.
sBuffers.getBuffer = function(bwidth, bheight){
	var width = bwidth ? bwidth : canvas.width;
	var height = bheight ? bheight : canvas.height;
	for(var i=0; i < this.buffers.length; i++){
		var buffer = this.buffers[i]
		if(!buffer.locked){
			if(buffer.width != width || buffer.height != height){
				//console.log("updating: ", buffer.width, width)
				updateRenderTarget(ctx, buffer, width, height);
			}
			//this.buffers[buf].locked = true;
			return buffer;
		}
	}
	var newBuffer = createRenderTarget(ctx, width, height);
	newBuffer.locked = false;
	newBuffer.lock = function(){
		this.locked = true;
	}
	newBuffer.unlock = function(){
		this.locked = false;
	}
	this.buffers.push(newBuffer);
	return newBuffer;
}

var defaultVertSrc = new Object();
defaultVertSrc.code = "attribute vec3 aVertexPosition; attribute vec2 aTextureCoord; uniform mat4 uMVMatrix; uniform mat4 uPMatrix; varying vec2 vTextureCoord; void main(void){ gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0); vTextureCoord = aTextureCoord; }";
defaultVertSrc.type = "vert";

var defaultFragSrc = new Object();
defaultFragSrc.code = "precision mediump float; varying vec2 vTextureCoord; uniform sampler2D uSampler; uniform vec2 frameOffset; uniform vec2 frameDims; uniform vec2 tiles; uniform vec2 scroll; uniform vec3 multColor; uniform float alpha; void main(void){ vec2 pos = mod((vTextureCoord+scroll)*tiles+vec2(0, 1.0-tiles.y),vec2(1.0,1.0)); pos = pos*frameDims; pos.y += (1.0-frameDims.y); pos.y -= frameOffset.y; pos.x += frameOffset.x; vec4 color = texture2D(uSampler, pos); gl_FragColor.rgb = color.rgb*multColor; gl_FragColor.a = color.a*alpha; }";
//defaultFragSrc.code = "precision mediump float; varying vec2 vTextureCoord; void main(void){ gl_FragColor = vec4(1.0,1.0,1.0,1.0); }";
defaultFragSrc.type = "frag";