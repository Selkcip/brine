/**
 * Creates a new instance of Sprite.
 * 
 * @class Simplifies the process of transforming, drawing, and updating sprites. Can be used to display images for any purpose including player characters and backgrounds.
 * Allows hierarchical grouping of sprites which can be used to create complex characters or systems out of individual sprites.
 * @property {number} alpha The transparency of the sprite. 1 is fully opaque and 0 is fully transparent.
 * @property {Object} blendFunc Setter/getter for sprite.blendFunction
 * @property {Object} blendFunction Specifies how the sprite should be blended with the canvas when drawing with webGL. Most common are: BLEND_ALPHA, BLEND_ADD, and BLEND_MULTIPLY. Custom functions can be specified as {a:"SRC_ALPHA", b:"ONE_MINUS_SRC_ALPHA"}. Other possible values can be found here http://www.opengl.org/sdk/docs/man/xhtml/glBlendFunc.xml
 * @property {string} blendMode Specifies how the sprite should be blended with the canvas when drawing with the 2D canvas.
 * @property {List<Sprite>} children A list of sprites that have been made children of this sprite.
 * @property {number} frame The current frame in an animated sprite.
 * @property {number} frameCount The number of frames in an animated sprite.
 * @property {number} frameHeight The height of an individual frame in an animated sprite.
 * @property {number} frameWidth The width of an individual frame in an animated sprite.
 * @property {number} height The unscaled height of the sprite.
 * @property {Image} image The image to be used when drawing this sprite. The easiest way to set this is: sprite.image = Textures.load("sprite.png")
 * @property {number} index Used to determine the order in which sprites should be drawn. The smaller the index the closer to the front the sprite will be.
 * @property {Vector} multColor Color to multiply the sprite by when drawing with webGL, allowing tinting. The 2D canvas does not support efficient pixel manipulation including color multiplication.
 * @property {number} offsetX The x position of the sprite's origin within the sprite. By default this is the top left corner.
 * @property {number} offsetY The y position of the sprite's origin within the sprite. By default this is the top left corner.
 * @property {Sprite} parent The sprite's parent sprite.
 * @property {Vector} pos The sprite's position relative to its parent's position.
 * @property {number} rotation The rotation of the sprite in radians. Use DTR(degreees) to easily convert degrees to radians.
 * @property {number} scaleX The amount to scale the sprite along the x axis.
 * @property {number} scaleY The amount to scale the sprite along the y axis.
 * @property {number} scrollX The distance to scroll the sprite's image within its bounds along the x axis.
 * @property {number} scrollY The distance to scroll the sprite's image within its bounds along the y axis.
 * @property {Shader} shader When drawing with webGL, if set this shader will be used to draw the sprite instead of the default shader.
 * @property {number} sliceHeight The height of the slice to be sampled within the sprite's image starting from sliceY. This allows drawing only portions of the image.
 * @property {number} sliceWidth The width of the slice to be sampled within the sprite's image starting from sliceX. This allows drawing only portions of the image.
 * @property {number} sliceX The x position within the sprite's image to start sampling from. This allows drawing only portions of the image.
 * @property {number} sliceY The y position within the sprite's image to start sampling from. This allows drawing only portions of the image.
 * @property {number} tilesX The number of times to tile the sprite's image within its bounds along the x axis. Allows decimal values.
 * @property {number} tilesY The number of times to tile the sprite's image within its bounds along the y axis. Allows decimal values.
 * @property {bool} visible If false the sprite will not be drawn and neither will its children. Does not affect updating.
 * @property {number} width The unscaled width of the sprite.
 * @property {number} worldRotation Setter/getter for sprite.rotation relative to the sprite's parent's rotation.
 * @property {number} x Setter/getter for sprite.pos.x
 * @property {number} y Setter/getter for sprite.pos.y
 * @property {number} z Setter/getter for sprite.pos.z
 */
function Sprite(){
	this.children = new List();
	this.image = new Image();
	this.pos = new Vector(0,0,0);
	this.index = 0;
	this.blendFunction = {a:"SRC_ALPHA", b:"ONE_MINUS_SRC_ALPHA"};
	this.multColor = new Vector(1,1,1);
	this.parent = null;
	this.animations = new Array();
}

Sprite.prototype = {
	get x(){
		return this.pos.x;
	},
	set x(val){
		this.pos.x = val;
	},
	
	get y(){
		return this.pos.y;
	},
	set y(val){
		this.pos.y = val;
	},
	
	get z(){
		return this.pos.z;
	},
	set z(val){
		this.pos.z = val;
	},
	
	get wx(){
		return this.getWorldPos()[0];
	},
	set wx(val){
		this.x = exists(this.parent) ? this.parent.worldToLocal(val,0)[0] : val;
	},
	
	get wy(){
		return this.getWorldPos()[1];
	},
	set wy(val){
		this.y = exists(this.parent) ? this.parent.worldToLocal(0,val)[1] : val;
	},
	
	get wz(){
		return this.getWorldPos()[2];
	},
	set wz(val){
		this.z = exists(this.parent) ? this.parent.worldToLocal(0,0)[2] : val;
	},
	
	get degRotation(){
		return RTD(this.rotation);
	},
	set degRotation(val){
		this.rotation = DTR(val);
	},
	
	get worldRotation(){
		var sSign = (this.getScaleX()/Math.abs(this.getScaleX()))*this.getScaleY()/Math.abs(this.getScaleY());
		return exists(this.parent) ? this.parent.worldRotation+this.rotation*sSign : this.rotation*sSign;
	},
	set worldRotation(val){
		var sSign = (this.getScaleX()/Math.abs(this.getScaleX()))*this.getScaleY()/Math.abs(this.getScaleY());
		this.rotation = exists(this.parent) ? (val*sSign)-this.parent.worldRotation : val*sSign;
	},
	
	get degWorldRotation(){
		return RTD(this.worldRotation);
	},
	set degWorldRotation(val){
		this.worldRotation = DTR(val);
	},
	
	get originX(){
		return -this.offsetX;
	},
	set originX(val){
		this.offsetX = -val;
	},
	
	get originY(){
		return -this.offsetY;
	},
	set originY(val){
		this.offsetY = -val;
	},
	
	get blendFunc(){
		return this.blendFunction;
	},
	set blendFunc(func){
		this.blendFunction.a = func.a;
		this.blendFunction.b = func.b;
	},
}

Sprite.prototype.width = 100;
Sprite.prototype.height = 100;
Sprite.prototype.offsetX = 0;
Sprite.prototype.offsetY = 0;
Sprite.prototype.scaleX = 1.0;
Sprite.prototype.scaleY = 1.0;
Sprite.prototype.rotation = 0;
Sprite.prototype.frameCount = 1;
Sprite.prototype.frameWidth = -1;
Sprite.prototype.frameHeight = -1;
Sprite.prototype.frame = 0;
Sprite.prototype.frameRate = 30;
Sprite.prototype.tilesX = 1;
Sprite.prototype.tilesY = 1;
Sprite.prototype.scrollX = 0;
Sprite.prototype.scrollY = 0;
Sprite.prototype.sliceX = 0;
Sprite.prototype.sliceY = 0;
Sprite.prototype.sliceWidth = undefined;
Sprite.prototype.sliceHeight = undefined;
Sprite.prototype.visible = true;
Sprite.prototype.alpha = 1.0;
Sprite.prototype.preAlpha = 1.0;
Sprite.prototype.blendMode = "source-over";
//Sprite.prototype.parent = new Sprite();
Sprite.prototype.childindex = 0;
Sprite.prototype.index = 0;
Sprite.prototype.children = new List();
Sprite.prototype.shader = null;
Sprite.prototype.animations = new Array();
Sprite.prototype.animation = null;

//When inheriting from sprite, call this in the new object's constructor
/**
 * This function is needed to prevent sprites from sharing the same property references.
 * @deprecated Use Sprite.call(this) instead.
 */
Sprite.prototype.init = function(){
	this.children = new List();
	this.image = new Image();
	this.pos = new Vector(0,0,0);
	this.multColor = new Vector(1,1,1);
}

/**
 * Adds the given sprite as a child of this one.
 * 
 * @param {Sprite} child The sprite to make a child.
 */
Sprite.prototype.addChild = function(child){
	//child.childindex = this.children.length;
	this.children.push(child);
	child.parent = this;
}

/**
 * Removes the given child from this sprite's children.
 * 
 * @param {Sprite} child The sprite to be removed.
 */
Sprite.prototype.removeChild = function(child){
	this.children.remove(child);
}

/**
 * Called before drawing to apply the sprite's transformations.
 * 
 * @param {Drawing Context} ctx
 */
Sprite.prototype.transform = function(ctx){
	ctx.save();
	this.preAlpha = ctx.alpha;
	ctx.alpha *= this.alpha;

	var xpos = this.x;
	var ypos = this.y;
	
	var scaleX = this.scaleX == 0 ? 0.0000001 : this.scaleX;
	var scaleY = this.scaleY == 0 ? 0.0000001 : this.scaleY;
	
	ctx.translate(xpos,ypos);
	ctx.rotate(this.rotation);
	ctx.scale(scaleX,scaleY);
	ctx.translate(this.offsetX,this.offsetY);
}

/**
 * Draws the sprite to the given drawing context. This can be overidden for custom drawing, just make sure to call this.drawChildren(ctx); at the end of the custom function.
 * 
 * @param {Drawing Context} ctx
 */
Sprite.prototype.draw = function(ctx){
	if(this.image != undefined && this.image != null){
		try{
			ctx.drawSprite(this, this.frame);
			/*if(this.frameCount <= 1){
				ctx.drawSprite(this);
			}else{
				ctx.drawSprite(this, this.frame);
				this.frame = (this.frame+1)%this.frameCount;
			}*/
		}catch(e){
			//println("image isn't loaded");
		}
	}
	this.drawChildren(ctx);
}

/**
 * Calls transform, draw, and unTransform on the sprites children.
 * 
 * @param {Object} ctx
 */
Sprite.prototype.drawChildren = function(ctx){
	var sprites = new Array();
	for(var child = this.children.head; child !== null; child = child.link){
		var sprite = child.item;
		if(sprite instanceof Sprite && sprite.visible){
			sprites.push(sprite);
		}
	}
	sprites.sort(sortByZ);
	for(var i=0; i < sprites.length; i++){
		sprites[i].transform(ctx);
		sprites[i].draw(ctx);
		sprites[i].unTransform(ctx);
	}
}

/**
 * Called after drawing to unapply the sprite's transformations.
 * 
 * @param {Object} ctx
 */
Sprite.prototype.unTransform = function(ctx){
	ctx.restore();
	/*var xpos = this.x;
	var ypos = this.y;
	
	var scaleX = this.scaleX == 0 ? 0.0000001 : this.scaleX;
	var scaleY = this.scaleY == 0 ? 0.0000001 : this.scaleY;
	
	ctx.translate(-this.offsetX,-this.offsetY);
	ctx.scale(1/scaleX,1/scaleY);
	ctx.rotate(-this.rotation);
	ctx.translate(-xpos,-ypos);*/
	
	ctx.alpha = this.preAlpha;
}

//If overriding update make sure to call either Sprite.update.call(this, ctx) or this.__proto__.update.call(this, ctx) or just call updateChildren(ctx)
/**
 * The default update function called every update. Does nothing by default except call updateChildren. When overriding make sure to call Sprite.update.call(this, ctx), this.__proto__.update.call(this, ctx), or this.updateChildren(ctx).
 * 
 * @param {number} delta Time since the last update.
 */
Sprite.prototype.update = function(delta){
	this.updateChildren(delta);
}

/**
 * Calls update on the sprite's children.
 *  
 * @param {number} delta Time since the last update.
 */
Sprite.prototype.updateChildren = function(delta){
	this.children.foreach(this.updateChild, {delta:delta});
}

Sprite.prototype.updateChild = function(child, params){
	if(child.animate != undefined && child.animate != null){
		child.animate(params.delta);
	}
	if(child.update != undefined && child.update != null){
		child.update(params.delta);
	}
}

/**
 * Adds a new animation that is a range of frames in the sprite's spritesheet.
 * 
 * @param {string} name The name of the animation.
 * @param {number} first The first frame of the animation. 
 * @param {number} length The length of the animation
 */
Sprite.prototype.addAnimation = function(name, first, length){
	this.animations[name] = {first:first, last:Math.max(0, first+length-1)};
}

/**
 * Removes an animation.
 * 
 * @param {string} name The name of the animation.
 */
Sprite.prototype.removeAnimation = function(name){
	this.animations[name] = null;
}

/**
 * Automatically associates frames with animations
 * 
 * @param {Array<string>} names An array of the names of the animations.
 * @param {Array<number>} lengths An array of the lengths of each animation.
 */
Sprite.prototype.addAnimations = function(names, lengths){
	var first = 0;
	for(var i = 0; i < names.length; i++){
		this.animations[names[i]] = {first:first, last:first+lengths[i]-1};
		first = first+lengths[i];
	}
}


/**
 * Increments the sprite's frame according to the specified frameRate
 *  
 * @param {number} delta Time since the last update.
 */
Sprite.prototype.animate = function(d){
	this.frame = this.frame+(this.frameRate/FPS)*d;
	if(this.frame != 0){
		this.frame = (this.frame/Math.abs(this.frame))*(Math.abs(this.frame)%this.frameCount);
	}
	if(this.frame < 0){
		this.frame += this.frameCount;
	}
	
	if(exists(this.animation)){
		var animation = this.animations[this.animation];
		if(exists(animation)){
			var first = animation.first;
			var last = animation.last;
			if(this.frame > last){
				this.frame = first;
			}else if(this.frame < first){
				this.frame = last;
			}
		}
	}
}

/**
 * Returns the x scale relative to the sprite's parent's scale.
 * 
 * @return {number} The world x scale.
 */
Sprite.prototype.getScaleX = function(){
	if(exists(this.parent)){
		return this.parent.getScaleX()*this.scaleX;
	}
	return this.scaleX;
}

/**
 * Returns the y scale relative to the sprite's parent's scale.
 * 
 * @return {number} The world y scale.
 */
Sprite.prototype.getScaleY = function(){
	if(exists(this.parent)){
		return this.parent.getScaleY()*this.scaleY;
	}
	return this.scaleY;
}

/**
 * Returns a transformation matrix for the sprite's transformation in world space.
 * 
 * @return {mat4} Transformation matrix giving this sprite's position in world space.
 */
Sprite.prototype.getWorldMatrix = function(){
	var mat = mat4.create();
	mat4.identity(mat);
	if(exists(this.parent)){
		mat = this.parent.getWorldMatrix();
	}
	mat4.translate(mat, mat, [this.x,this.y, this.z]);
	mat4.rotateZ(mat, mat, this.rotation);
	mat4.scale(mat, mat, [this.scaleX,this.scaleY, 1.0]);
	mat4.translate(mat, mat, [this.offsetX,this.offsetY, 0]);
	return mat;
}

/**
 * Returns the sprite's position in world space.
 * 
 * @return {Array} The position vector as an array of length 3.
 */
Sprite.prototype.getWorldPos = function(){
	var mat = this.getWorldMatrix();
	mat4.translate(mat, mat, [-this.offsetX,-this.offsetY, 0]);
	var out = [0,0,0];
	//return mat4.multiplyVec3(mat, [0,0,0]);
	return vec3.transformMat4(out,out,mat)
}

/**
 * Returns the world position of a local point.
 * 
 * @param {number} x The x coordinate within the sprite.
 * @param {number} y The y coordinate within the sprite.
 * @return {Array} The position vector as an array of length 3.
 */
Sprite.prototype.localToWorld = function(x,y){
	var out = [x,y,0];
	//return mat4.multiplyVec3(this.getWorldMatrix(), [x,y,0]);
	return vec3.transformMat4(out, out, this.getWorldMatrix());
}

/**
 * Returns the given world position as a point within the sprite.
 * 
 * @param {number} x The x coordinate in world space.
 * @param {number} y The y coordinate in world space.
 * @return {Array} The position vector as an array of length 3.
 */
Sprite.prototype.worldToLocal = function(x,y){
	/*var pos = vec3.subtract([x,y,0], this.getWorldPos());
	var scaleX = this.scaleX == 0 ? 0.0000001 : this.scaleX;
	var scaleY = this.scaleY == 0 ? 0.0000001 : this.scaleY;
	var mat = mat4.scale(mat4.rotateZ(mat4.identity(mat4.create()), -this.worldRotation), [this.getScaleX(),this.getScaleY(), 1.0]);
	mat4.translate(mat,[-this.offsetX,-this.offsetY, 0]);
	return mat4.multiplyVec3(mat, pos);*/
	
	var out = [x,y,0];
	
	//return mat4.multiplyVec3(mat4.inverse(this.getWorldMatrix()), [x,y,0]);
	var mat = this.getWorldMatrix();
	return vec3.transformMat4(out, out, mat4.invert(mat,mat));
}

Sprite.prototype.setLocalToWorld = function(x,y){
	var pos = exists(this.parent) ? this.parent.worldToLocal(x,y) : [this.x,this.y,0];
	this.x = pos[0];
	this.y = pos[1];
}

Sprite.prototype.pointsInside = function(points){
	var minX = 0;
	var maxX = this.width;
	var minY = 0;
	var maxY = this.height;
	var x = 0;
	var y = 0;
	
	var results = [];
	var result = null;
	
	var worldMat = this.getWorldMatrix();
	for(var point in  points){
		point = points[point];
		//point = mat4.multiplyVec3(mat4.inverse(worldMat), [point[0],point[1],0]);
		point = [point[0],point[1],0];
		point = vec3.transformMat4(point, point, mat4.inverse(worldMat));
		
		x = point[0];
		y = point[1];
		
		result = {};
		result.minX = x >= minX;
		result.maxX = x <= maxX;
		result.minY= y >= minY;
		result.maxY = y <= maxY;
		
		results.push(result);
	}
	
	return results;
}

Sprite.prototype.checkPoint = function(x,y){
	var result = this.pointsInside([[x,y]])[0];
	return result.minX && result.maxX && result.minY && result.maxY;
}

/**
 * Calls remove on all of the sprite's children and removes itself from its parent's list of children.
 */
Sprite.prototype.remove = function(){
	for(var child = this.children.head; child !== null; child = child.link){
		child.item.remove();
	}
	if(exists(this.parent)){
		this.parent.removeChild(this);
	}
}

function sortByZ(a,b){
	return b.index-a.index;
}