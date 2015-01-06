function Blur(size){
	if(!use2D){
		this.shader = createShaderProgram(this.shaderSrc);
		this.shader.dir = ctx.getUniformLocation(this.shader, "dir");
		this.shader.stepSize = ctx.getUniformLocation(this.shader, "stepSize");
		this.size = size ? size : 0.001;
		
		this.enabled = true;
	}
}

Blur.prototype.apply = function(ctx, input){
	if(!use2D && this.enabled){
		var shader = this.shader;
		
		var hblur = sBuffers.getBuffer();
		//println(hblur);
		hblur.lock();
		ctx.setBuffer(hblur);
		ctx.clear(ctx.COLOR_BUFFER_BIT);
		
		ctx.useProgram(shader);
		ctx.bindTexTo(input.texture, shader.samplerUniform);
		ctx.uniform1i(shader.dir, 0);
		ctx.uniform1f(shader.stepSize, this.size);
				
		ctx.drawScreenBuffer(shader);
		
		//var vblur = sBuffers.getBuffer();
		//vblur.lock();
		ctx.setBuffer(input);
		ctx.clear(ctx.COLOR_BUFFER_BIT);
		
		//ctx.useProgram(shader);
		ctx.bindTexTo(hblur.texture, shader.samplerUniform);
		ctx.uniform1i(shader.dir, 1);
				
		ctx.drawScreenBuffer(shader);
		hblur.unlock();
	}
}

Blur.prototype.shaderSrc = new Object();
Blur.prototype.shaderSrc.code = "precision mediump float; varying vec2 vTextureCoord; uniform sampler2D colorMap; uniform bool dir; uniform float stepSize; void main(void){ float step = stepSize; vec4 color = vec4(0,0,0,0); for(float i=0.0; i<5.0; i++){ float offset = (-2.0*step)+step*i; if(!dir){ color += texture2D(colorMap, vec2(vTextureCoord.x+offset, vTextureCoord.y)); }else{ color += texture2D(colorMap, vec2(vTextureCoord.x, vTextureCoord.y+offset)); } } color /= 5.0; gl_FragColor = color; }";
Blur.prototype.shaderSrc.type = "frag";

//Blur.prototype.shaderSrc.code = "precision mediump float; varying vec2 vTextureCoord; uniform sampler2D colorMap; uniform bool dir; uniform float stepSize; void main(void){ float step = stepSize; vec4 color = vec4(0,0,0,0); vec4 sample = vec4(0,0,0,0); float count = 0.0; for(float i=0.0; i<5.0; i++){ float offset = (-2.0*step)+step*i; if(!dir){ sample = texture2D(colorMap, vec2(vTextureCoord.x+offset, vTextureCoord.y)); if(sample.a > 0.0){ color += sample; count++; } }else{ sample = texture2D(colorMap, vec2(vTextureCoord.x, vTextureCoord.y+offset)); if(sample.a > 0.0){ color += sample; count++; } } } color /= count; gl_FragColor = color; }";