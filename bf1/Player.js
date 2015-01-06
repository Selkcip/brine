function Player(state){
	//Initialize sprite properties
	this.init();
	
	//Set player properties
	this.width = 36;
	this.height = 17;
	this.offsetX = -18;
	this.offsetY = -8;
	this.image = Textures.load("images/me.png");
	this.mount = new Vector(0,-8,0);
	this.state = state;
	this.health = 100;
	this.maxHealth = 100;
	this.moveSpeed = 2.5;
	this.team = 0;
	
	//Define player's bounding box, in this case a 2D rectangle
	this.bbox = new BRect(0,0,36,17);
	this.bbox.offsets.x = -18;
	this.bbox.offsets.y = -8;
	this.bbox.solid = true;
	
	this.gun = new Gun(this);
	this.gun.fireRate = 40;
	this.gun.bulletDamage = 10;
	this.addChild(this.gun);
	
	//Add booleans to input for player control
	state.input.addBool(37, "left");
	state.input.addBool(39, "right");
	state.input.addBool(38, "up");
	state.input.addBool(40, "down");
	state.input.addBool(65, "left");
	state.input.addBool(68, "right");
	state.input.addBool(87, "up");
	state.input.addBool(83, "down");
	state.input.addBool(32, "shoot");
	
	//Add the player to the world and physics system
	state.world.addChild(this);
	state.phys.push(this);
}

//Use the Sprite class as a base for the Player class
Player.prototype = new Sprite();

//Define player update function
Player.prototype.update = function(delta){
	if(this.health <= 0){
		
	}

	if(this.state.input.left){
		if(this.x+this.offsetX > 0){
			this.x -= this.moveSpeed*delta;
		}else{
			this.x = -this.offsetX*delta;
		}
	}
	if(this.state.input.right){
		if(this.x+this.offsetX+this.width < canvas.width){
			this.x += this.moveSpeed*delta;
		}else{
			this.x = canvas.width-(this.offsetX+this.width);
		}
	}
	
	if(this.state.input.up){
		if(this.y+this.offsetY > 0){
			this.y -= this.moveSpeed*delta;
		}else{
			this.y = -this.offsetY;
		}
	}
	if(this.state.input.down){
		if(this.y+this.offsetY+this.height < canvas.height){
			this.y += this.moveSpeed*delta;
		}else{
			this.y = canvas.height-(this.offsetY+this.height);
		}
	}
	
	if(game.input.shoot){
		this.gun.fire();
	}
	
	this.updateChildren(delta);
	this.bbox.pos = this.pos;
}

//Define how the player reacts to collisions
Player.prototype.collide = function(obj){
	//println("colliding");
	var norm = player.pos.sub(obj.pos).normalize().mult(5);
	if(obj instanceof Bullet){
	}else if(obj instanceof Bear){
		
	}
}
