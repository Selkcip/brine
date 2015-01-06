function Effect(shader){
	this.shader = shader;
}

Effect.prototype.apply = function(ctx, input){
	if(!use2D){
		var shader = this.shader;
		
		var pass = sBuffers.getBuffer();
		pass.lock();
		ctx.setBuffer(pass);
		ctx.clear(ctx.COLOR_BUFFER_BIT);
		
		ctx.useProgram(shader);
		ctx.bindTexTo(input.texture, shader.samplerUniform);
		//ctx.uniform1i(shader.dir, 0);
				
		ctx.drawScreenBuffer(shader);
		
		ctx.setBuffer(input);
		ctx.clear(ctx.COLOR_BUFFER_BIT);
		
		ctx.useProgram(shaderProgram);
		ctx.bindTexTo(pass.texture, shaderProgram.samplerUniform);
		//ctx.uniform1i(shader.dir, 1);
				
		ctx.drawScreenBuffer(shaderProgram);
		pass.unlock();
	}
}