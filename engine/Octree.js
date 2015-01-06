function OctNode(x, y, z, width, height, depth, level){
	this.bbox = new BBox(x,y,z,width,height,depth);
	this.children = new Array();
	this.content = new List();
	this.contains = 0;
	this.level = level;
	this.visible = true;
}

OctNode.prototype = {
	get x(){
		return this.bbox.pos.x;
	},
	set x(val){
		this.bbox.pos.x = val;
	},
	
	get y(){
		return this.bbox.pos.y;
	},
	set y(val){
		this.bbox.pos.y = val;
	},
	
	get z(){
		return this.bbox.pos.z;
	},
	set z(val){
		this.bbox.pos.z = val;
	},
	
	get width(){
		return this.bbox.dims.x;
	},
	set width(val){
		this.bbox.dims.x = val;
	},
	
	get height(){
		return this.bbox.dims.y;
	},
	set height(val){
		this.bbox.dims.y = val;
	},
	
	get depth(){
		return this.bbox.dims.z;
	},
	set depth(val){
		this.bbox.dims.z = val;
	},
}

OctNode.prototype.insert = function(obj){
	//if(this.bbox.chechPoint(obj.pos)){
	this.split();
	if(this.children.length > 0){
		 var diff = obj.pos.sub(this.bbox.pos).add(this.bbox.dims.div(2));
		var x = Math.max(0, Math.min(1, Math.round(diff.x/this.width)));
		var y = Math.max(0, Math.min(1, Math.round(diff.y/this.height)))*4;
		var z = Math.max(0, Math.min(1, Math.round(diff.z/this.depth)))*2;
		var index = x+y+z;
		if(index > 3){
			index -= 4;
		}
		this.children[index].insert(obj);
	}else{
		this.content.push(obj);
	}
	//}
}

OctNode.prototype.update = function(){
	var reinsert = this.updateNode();
	for(var obj in reinsert){
		this.insert(reinsert[obj]);
	}
}

OctNode.prototype.updateNode = function(){
	var reinsert = new Array();
	//println(this.content.length);
	//for(var i = 0; i < this.content.length; i++){
	for(var node = this.content.head; node !== null; node = node.link){
		//println("length: "+this.content.length);
		var obj = node.item;
		//println(this.content.length);
		if(!this.bbox.checkPoint(obj.pos)){
			this.content.remove(obj);
			if(!obj.dead){
				reinsert.push(obj);
			}
		}
	}
	for(var child in this.children){
		reinsert = reinsert.concat(this.children[child].updateNode());
	}
	if(this.count() == 0){
		this.join();
	}
	return reinsert;
}

OctNode.prototype.count = function(){
	var numItems = this.content.length;
	for(var child in this.children){
		numItems += this.children[child].count();
	}
	return numItems;
}

OctNode.prototype.getRegion = function(x, y, z, width, height, depth){
	var region = new BBox(x,y,z,width,height,depth);
	return this.checkRegion(region);
}

OctNode.prototype.checkRegion = function(region){
	var items = new Array();
	if(this.bbox.intersect(region)){
		for(var node = this.content.head; node !== null; node = node.link){
			var obj = node.item;
			items.push(obj);
		}
		for(var child in this.children){
			items = items.concat(this.children[child].checkRegion(region));
		}
	}
	return items;
}

OctNode.prototype.transform = function(){
}

OctNode.prototype.unTransform = function(){
}

OctNode.prototype.draw = function(ctx){
	/*var dot = new IsoSprite();
	dot.width = this.width*2;
	dot.height = this.height*2;
	dot.offsetX = -dot.width/2;
	dot.offsetY = -dot.height/2;
	dot.image = textures.load("mats/diffuse/crate_wire.png");
	
	dot.x = this.bbox.x;
	dot.y = this.bbox.y;
	dot.z = this.bbox.z;
	
	dot.transform(ctx);
	dot.draw(ctx);
	dot.unTransform(ctx);
	
	for(var child in this.children){
		//println(child+": "+this.children[child].bbox.pos);
		this.children[child].draw(ctx);
	}*/
}

OctNode.prototype.split = function(){
	if(this.level > 0){
		while(this.children.length < 4){
			var index = this.children.length;
			var x = index%2;
			var y = Math.floor(index/4);
			var z = Math.floor((index-4*y)/2);
			var xpos = this.bbox.x-this.bbox.width/4+(x*this.bbox.width/2);
			var ypos = this.bbox.y-this.bbox.height/4+(y*this.bbox.height/2);
			var zpos = this.bbox.z-this.bbox.depth/4+(z*this.bbox.depth/2);
			var newNode = new OctNode(xpos, ypos, zpos, this.bbox.width/2, this.bbox.height/2, this.bbox.depth/2, this.level-1);
			this.children.push(newNode);
		}
	}
}

OctNode.prototype.join = function(){
	this.children = new Array();
}

OctNode.prototype.clear = function(){
	for(var child in this.children){
		this.children[child].join();
	}
}