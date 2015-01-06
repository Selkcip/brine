Textures.load("images/bear.png");
Textures.load("images/pointgreen.png");
function Bear(state){
	Sprite.call(this);
	this.width = 25;
	this.height = 38;
	this.offsetX = -12;
	//this.offsetY = -19;
	this.offsetY = -34;
	this.image = Textures.load("images/bear.png");
	this.mount = new Vector(0,20,0);
	this.state = state;
	this.health = 10;
	this.moveSpeed = 1;
	this.scoreValue = 1;
	this.damage = 10;
	this.team = 1;
	
	//Define bear's bounding box, in this case a 2D rectangle
	this.bbox = new BRect(0,0,25,38);
	this.bbox.offsets.x = -12;
	//this.bbox.offsets.y = -19;
	this.bbox.offsets.y = this.offsetY;
	this.bbox.solid = false;
	
	this.gun = new Gun(this);
	this.gun.bulletImage = Textures.load("images/pointgreen.png");
	this.addChild(this.gun);
	
	//Add the player to the world and physics system
	state.world.addChild(this);
	state.phys.push(this);
}

Bear.prototype = new Sprite();
Bear.prototype.moveFunction = function(delta){
	this.y += this.moveSpeed*delta;
}

Bear.prototype.action = function(delta){
	this.y += this.moveSpeed*delta;
}

Bear.prototype.update = function(delta){
	if(this.health <= 0){
		this.state.score += this.scoreValue;
		this.kill();
	}
	if(this.y-this.height > canvas.height){
		this.kill();
	}
	if(this.y > 0){
		this.bbox.solid = true;
	}
	
	/*this.moveFunction();
	
	if(this.gun != null){
		this.gun.fire();
	}*/
	this.action(delta);
	
	this.bbox.pos = this.pos;
	
	this.updateChildren(delta);
}

//Define how the bear reacts to collisions
Bear.prototype.collide = function(obj){
	//println("colliding");
	var norm = player.pos.sub(obj.pos).normalize().mult(5);
	if(obj instanceof Player){
		obj.health -= this.damage;
		this.kill();
	}
}

Bear.prototype.kill = function(){
	this.parent.removeChild(this);
	this.state.phys.remove(this);
	this.dead = true;
}