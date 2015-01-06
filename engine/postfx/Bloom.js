//var thresh

function Bloom(level, size, intense){
	if(!use2D){
		this.thresh = createShaderProgram(this.threshSrc);
		this.thresh.thresh = ctx.getUniformLocation(this.thresh, "threshhold");
		
		this.blur = createShaderProgram(this.blurSrc);
		this.blur.dir = ctx.getUniformLocation(this.blur, "dir");
		this.blur.stepSize = ctx.getUniformLocation(this.blur, "stepSize");
		
		this.mix = createShaderProgram(this.mixSrc);
		this.mix.blur = ctx.getUniformLocation(this.mix, "blur");
		this.mix.intense = ctx.getUniformLocation(this.mix, "intense");
		
		this.level = level;// ? level : 0.9;
		this.size = size;// ? size : 0.0025;
		this.intense = intense;// ? intense : 0.5;
		
		this.enabled = true;
	}
}

Bloom.prototype.apply = function(ctx, input){
	if(!use2D && this.enabled){
		var thresh = this.thresh;
		var blur = this.blur;
		var mix = this.mix;
		
		//Threshhold pass
		var pass0 = sBuffers.getBuffer();
		pass0.lock();
		ctx.setBuffer(pass0);
		ctx.clearColor(0,0,0,0);
		ctx.clear(ctx.COLOR_BUFFER_BIT);
		
		ctx.useProgram(thresh);
		ctx.bindTexTo(input.texture, thresh.uSampler);
		ctx.uniform1f(thresh.thresh, this.level);	
		ctx.drawScreenBuffer(thresh);
		
		//Horizontal blur pass
		var pass1 = sBuffers.getBuffer();
		pass1.lock();
		ctx.setBuffer(pass1);
		ctx.clear(ctx.COLOR_BUFFER_BIT);
		
		ctx.useProgram(blur);
		ctx.bindTexTo(pass0.texture, blur.uSampler);
		ctx.uniform1i(blur.dir, 0);
		ctx.uniform1f(blur.stepSize, this.size);
		ctx.uniform1f(blur.aspect, aspectRatio);
		ctx.drawScreenBuffer(blur);
		
		//Vertical blur pass
		var pass2 = sBuffers.getBuffer();
		pass2.lock();
		ctx.setBuffer(pass2);
		ctx.clear(ctx.COLOR_BUFFER_BIT);
		
		ctx.useProgram(blur);
		ctx.bindTexTo(pass1.texture, blur.uSampler);
		ctx.uniform1i(blur.dir, 1);
		ctx.uniform1f(blur.stepSize, this.size);
		ctx.uniform1f(blur.aspect, aspectRatio);
		ctx.drawScreenBuffer(blur);
		
		//Mix pass
		var pass3= sBuffers.getBuffer();
		pass3.lock();
		ctx.setBuffer(pass3);
		ctx.clear(ctx.COLOR_BUFFER_BIT);
		
		ctx.useProgram(mix);
		ctx.bindTexTo(input.texture, mix.uSampler);
		ctx.bindTexTo(pass2.texture, mix.blur, 1);
		ctx.uniform1f(mix.intense, this.intense);
		ctx.drawScreenBuffer(mix);
		
		//Draw back to input
		ctx.setBuffer(input);
		ctx.clear(ctx.COLOR_BUFFER_BIT);
		
		ctx.useProgram(shaderProgram);
		ctx.bindTexTo(pass3.texture, shaderProgram.uSampler);
		//ctx.bindTexTo(pass0.texture, shaderProgram.samplerUniform);
		//ctx.uniform1i(shader.dir, 1);
		ctx.drawScreenBuffer(shaderProgram);
		
		pass0.unlock();
		pass1.unlock();
		pass2.unlock();
		pass3.unlock();
	}
}

Bloom.prototype.threshSrc = new Object();
Bloom.prototype.threshSrc.code = "precision mediump float; varying vec2 vTextureCoord; uniform sampler2D colorMap; uniform float threshhold; void main(void){ float thresh = threshhold-0.5; vec4 color = texture2D(colorMap, vTextureCoord); float level = ceil(((color.r+color.g+color.b)/3.0)-threshhold); gl_FragColor = color*level; gl_FragColor.a = color.a; }";
//Bloom.prototype.threshSrc.code = "precision mediump float; varying vec2 vTextureCoord; uniform sampler2D colorMap; uniform float threshhold; void main(void){ float thresh = threshhold-0.5; vec4 color = texture2D(colorMap, vTextureCoord); float level = floor(((color.r+color.g+color.b)/3.0)-thresh+0.5); gl_FragColor = color*level; }";
Bloom.prototype.threshSrc.type = "frag";

Bloom.prototype.blurSrc = new Object();
//Bloom.prototype.blurSrc.code = "precision mediump float; varying vec2 vTextureCoord; uniform sampler2D colorMap; uniform bool dir; uniform float stepSize; uniform float aspect; void main(void){ float step = stepSize; vec4 color = vec4(0,0,0,0); for(float i=0.0; i<5.0; i++){ float offset = (-2.0*step)+step*i; if(!dir){ color += texture2D(colorMap, vec2(vTextureCoord.x+offset/aspect, vTextureCoord.y)); }else{ color += texture2D(colorMap, vec2(vTextureCoord.x, vTextureCoord.y+offset)); } } color /= 5.0; gl_FragColor = color; }";
Bloom.prototype.blurSrc.code = "precision mediump float; varying vec2 vTextureCoord; uniform sampler2D colorMap; uniform bool dir; uniform float stepSize; uniform float aspect; void main(void){ float step = stepSize; float e = 2.71828; vec4 color = vec4(0.0,0.0,0.0,0.0); vec4 sample; float samples = 0.0; for(float i=-3.0; i<4.0; i++){ float offset = step*i; if(!dir){ sample = texture2D(colorMap, vec2(vTextureCoord.x+offset, vTextureCoord.y)); }else{ sample = texture2D(colorMap, vec2(vTextureCoord.x, vTextureCoord.y+offset*aspect)); } float exp = -pow(i/2.0, 2.0); float gauss = pow(e,exp); sample *= gauss; samples += gauss; color += sample; } color /= samples; gl_FragColor = color; }";
Bloom.prototype.blurSrc.type = "frag";

Bloom.prototype.mixSrc = new Object();
Bloom.prototype.mixSrc.code = "precision mediump float; varying vec2 vTextureCoord; uniform sampler2D colorMap; uniform sampler2D blur; uniform float intense; void main(void){ vec4 color = texture2D(colorMap, vTextureCoord); vec4 glow = texture2D(blur, vTextureCoord); gl_FragColor = color+glow*intense; }";
Bloom.prototype.mixSrc.type = "frag";