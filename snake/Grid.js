function Grid(cols, rows, cellSize){
	Sprite.call(this);
	
	this.cols = cols;
	this.rows = rows;
	this.cellSize = cellSize;
	
	this.image = Textures.load("images/wall.png");
	this.width = cols*cellSize;
	this.height = rows*cellSize;
	
	var cells = new Array();
	for(var i = 0; i < cols; i++){
		cells.push(new Array());
		for(var j = 0; j < rows; j++){
			cells[i].push(null);
		}
	}
	this.cells = cells;
}

Grid.prototype = new Sprite();

Grid.prototype.pushCell = function(x, y, obj){
	if(x >= 0 && x < this.cols && y >= 0 && y < this.rows){
		return this.cells[y][x] = obj;
	}
	return false;
}

Grid.prototype.peekCell = function(x, y){
	var cell = "empty";
	if(x >= 0 && x < this.cols && y >= 0 && y < this.rows){
		cell = this.cells[y][x];
	}
	return cell;
}

Grid.prototype.popCell = function(x, y){
	var cell = "empty";
	if(x >= 0 && x < this.cols && y >= 0 && y < this.rows){
		cell = this.cells[y][x];
		this.cells[y][x] = null;
	}
	return cell;
}
