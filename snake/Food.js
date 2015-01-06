function Food(grid){
	Sprite.call(this);
	
	this.grid = grid;
	
	this.image = Textures.load("images/glow.png");
	this.blendMode = "lighter";
	this.width = 75;
	this.height = 75;
	this.offsetX = -this.width/2;
	this.offsetY = -this.height/2;
	
	var me = new Sprite();
	me.image = Textures.load("images/me.png");
	//me.blendMode = "lighter";
	me.width = 17;
	me.height = 36;
	me.offsetX = -me.width/2;
	me.offsetY = -me.height/2;
	me.x = this.width/2;
	me.y = this.height/2;
	this.addChild(me);
	
	this.gridX = 0;
	this.gridY = 0;
	
	this.wobble = 0;
	this.wobbleSpeed = 0.01;
	
	this.reposition();
}

Food.prototype = new Sprite();

Food.prototype.update = function(d){
	this.wobble += this.wobbleSpeed*d;
	this.rotation = Math.sin(this.wobble);
	
	this.x = this.gridX*this.grid.cellSize;
	this.y = this.gridY*this.grid.cellSize;
}

Food.prototype.reposition = function(){
	var cell = "stuff";
	while(cell != null){
		this.gridX = Math.round(Math.random()*this.grid.cols);
		this.gridY = Math.round(Math.random()*this.grid.rows);
		cell = this.grid.peekCell(this.gridX, this.gridY);
	}
	this.grid.pushCell(this.gridX, this.gridY, this);
}
