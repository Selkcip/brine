function Shader(fragPath, vertPath){
	this.loaded = 2;
	var shader = this;
	
	var loadedFunc = function(file){
		shader.loaded--;
		if(shader.loaded <= 0){
			//console.log(shader);
			//var frag = {code:shader.fragSource.text, type:"frag"};
			//var vert = exists(shader.vertSource) ? {code:shader.vertSource.text, type:"vert"} : undefined;
			//var stuff = createShaderProgram(frag, vert);
			shader.replace({stuff:"hello"});
			//console.log(shader);
		}
	}
	
	this.vertSource;
	if(exists(vertPath)){
		this.vertSource = Files.load(vertPath, loadedFunc);
	}else{
		this.loaded--;
		console.log(this.loaded)
	}
	this.fragSource = Files.load(fragPath, loadedFunc);
}

Shader.prototype.replace = function(shader){
	//this = shader;
	console.log("Shader.prototype.replace is being called, but it doesn't actually do anything and should be replaced");
}
