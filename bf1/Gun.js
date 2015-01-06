//Gun
function Gun(owner){
	this.init();
	this.owner = owner;
	this.visible = false;
}

Gun.prototype = new Sprite();

Gun.prototype.fireRate = 10;
Gun.prototype.charge = 10;
Gun.prototype.bulletSpeed = 2.5;
Gun.prototype.bulletDamage = 2;
Gun.prototype.bulletImage = Textures.load("images/point.png");

Gun.prototype.gunInit = function(){
	this.init();
}

Sounds.load("sounds/smg.wav");
Gun.prototype.fire = function(){
	if(this.charge >= this.fireRate){
		Sounds.play("sounds/smg.wav").volume = 0.25;
		this.charge = 0;
		var bullet = new Bullet(this.owner, this.x, this.y, this.rotation, this.bulletSpeed);
		bullet.image = this.bulletImage;
		bullet.damage = this.bulletDamage;
		this.owner.state.world.addChild(bullet);
		this.owner.state.phys.push(bullet);
		this.owner.state.bullets.push(bullet);
	}
}

Gun.prototype.update = function(delta){
	this.charge++;
	
	this.x = this.owner.x+this.owner.mount.x;
	this.y = this.owner.y+this.owner.mount.y;
}

//Bullet
Textures.load("images/point.png");
function Bullet(owner,x,y,rot,speed){
	this.init();
	this.owner = owner;
	this.image = Textures.load("images/point.png");
	this.width = 20;
	this.height = 5;
	this.offsetX = -this.width/2;
	this.offsetY = -this.height/2;
	this.blendMode = "lighter";
	this.blendFunc = BLEND_ADD;
	
	this.x = x;
	this.y = y;
	this.rotation = rot;
	this.speed = speed;
	this.vel = new Vector(Math.cos(rot)*speed,Math.sin(rot)*speed,0);
	this.life = 150;
	this.bbox = new BRect(0,0,5,5);
	this.bbox.offsets.x = -this.bbox.dims.x/2;
	this.bbox.offsets.y = -this.bbox.dims.y/2;
}

Bullet.prototype = new Sprite();
Bullet.prototype.damage = 2;

Bullet.prototype.update = function(delta){
	this.life--;
	if(this.life <= 0){
		this.kill();
	}
	this.x += this.vel.x*delta;
	this.y += this.vel.y*delta;
	this.bbox.pos = this.pos;
}

Bullet.prototype.collide = function(obj){
	if(obj != this.owner && obj.team != this.owner.team){
		if(obj.health != undefined){
			obj.health -= this.damage;
		}
		this.kill();
	}else{
	}
}

Bullet.prototype.kill = function(){
	this.parent.removeChild(this);
	this.owner.state.phys.remove(this);
	this.dead = true;
	this.die();
}

Bullet.prototype.die = function(){
	
}