function Chromatic(offset){
	if(!use2D){
		this.shader = createShaderProgram(this.shaderSrc);
		//this.shader.offset = ctx.getUniformLocation(this.shader, "offset");
		this.offset = offset ? offset : 0.0075;
		
		this.enabled = true;
	}
}

Chromatic.prototype.apply = function(ctx, input){
	if(!use2D && this.enabled){
		var shader = this.shader;
		
		var pass = sBuffers.getBuffer();
		pass.lock();
		ctx.setBuffer(pass);
		ctx.clear(ctx.COLOR_BUFFER_BIT);
		
		ctx.useProgram(shader);
		ctx.bindTexTo(input.texture, shader.uSampler);
		ctx.uniform1f(shader.offset, this.offset);
				
		ctx.drawScreenBuffer(shader);
		
		ctx.setBuffer(input);
		ctx.clear(ctx.COLOR_BUFFER_BIT);
		
		ctx.useProgram(shaderProgram);
		ctx.bindTexTo(pass.texture, shaderProgram.uSampler);
				
		ctx.drawScreenBuffer(shaderProgram);
		pass.unlock();
	}
}

Chromatic.prototype.shaderSrc = new Object();
Chromatic.prototype.shaderSrc.code = "precision mediump float; varying vec2 vTextureCoord; uniform sampler2D uSampler; uniform float offset; void main(void){ float offsetX = (vTextureCoord.x-0.5)*offset; float offsetY = (vTextureCoord.y-0.5)*offset; vec4 red = texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y)); vec4 green = texture2D(uSampler, vec2(vTextureCoord.x+offsetX, vTextureCoord.y+offsetY)); vec4 blue = texture2D(uSampler, vec2(vTextureCoord.x-offsetX, vTextureCoord.y-offsetY)); gl_FragColor.r = red.r; gl_FragColor.g = green.g; gl_FragColor.b = blue.b; gl_FragColor.a = (red.a+green.a+blue.a)/3.0; }";
Chromatic.prototype.shaderSrc.type = "frag";