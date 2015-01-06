function Segment(x, y){
	this.x = x;
	this.y = y;
}

function Snake(grid){
	Sprite.call(this);
	
	this.grid = grid;
	this.size = grid.cellSize;
	
	var seg = new Sprite();
	seg.image = Textures.load("images/bear.png");
	seg.width = this.size;
	seg.height = this.size;
	seg.offsetX = -seg.width/2;
	seg.offsetY = -seg.height/2;
	this.seg = seg;
	this.addChild(seg);
	
	this.body = new List();
	this.body.push(new Segment(grid.cols/2,grid.rows/2));
}

Snake.prototype = new Sprite();
Snake.prototype.speed = 0.1;
Snake.prototype.time = 0;
Snake.prototype.moveTime = 15;
Snake.prototype.dir = 0;
Snake.prototype.currenDir = 0;
Snake.prototype.dead = false;

//Adds some boolean values to the global input
gInput.addBool(39, "right");
gInput.addBool(40, "down");
gInput.addBool(37, "left");
gInput.addBool(38, "up");

Snake.prototype.draw = function(ctx){
	var prev = null;
	for(var node = this.body.head; node != null; node = node.link){
		var current = node.item;
		this.seg.x = current.x*this.size;
		this.seg.y = current.y*this.size;
		
		if(prev == null){
			this.seg.rotation = DTR(this.currentDir*90);
		}else{
			var xd = prev.x-current.x;
			var yd = prev.y-current.y;
			var ang = Math.atan2(yd,xd);
			this.seg.rotation = ang;
		}
		prev = current;
		
		this.drawChildren(ctx);
	}
}

Snake.prototype.update = function(d){
	if(gInput.right){
		if(this.currentDir != 2){
			this.dir = 0;
		}
	}
	if(gInput.down){
		if(this.currentDir != 3){
			this.dir = 1;
		}
	}
	if(gInput.left){
		if(this.currentDir != 0){
			this.dir = 2;
		}
	}
	if(gInput.up){
		if(this.currentDir != 1){
			this.dir = 3;
		}
	}
	
	if(!this.dead){
		this.time++;
		if(this.time%this.moveTime == 0){
			this.move();
		}
	}
}

Snake.prototype.move = function(){
	//console.log("moving");
	var head = this.body.head.item;
	
	var headX = head.x;
	var headY = head.y;
	if(this.dir == 0){
		headX += 1;
	}else if(this.dir == 1){
		headY += 1;
	}else if(this.dir == 2){
		headX -= 1;
	}else if(this.dir == 3){
		headY -= 1;
	}
	
	var newCell = this.grid.popCell(headX, headY);
	if(newCell != "empty"){
		if(newCell instanceof Food){
			var newTail = new Segment(0,0);
			this.body.push(newTail);
			this.grid.pushCell(0, 0);
			newCell.reposition();
		}else if(newCell instanceof Segment){
			this.dead = true;
		}
	}else{
		this.dead = true;
	}
	
	var tail = this.body.tail.item;
	this.body.remove(tail);
	this.grid.popCell(tail.x, tail.y);
	
	this.body.push_front(tail);
	
	tail.x = headX;
	tail.y = headY;
	
	this.grid.pushCell(headX, headY, tail);
	
	this.currentDir = this.dir;
}