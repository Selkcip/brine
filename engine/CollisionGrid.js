/**
 * Creates an instance of CollisionGrid.
 * 
 * @class CollisionGrid is used to perform grid based collision detection. This was originally for an isometric game so it's set in the XZ plane, but it's just a 2D grid so it can be used for collisions in screen space as well.
 * @param {number} x X position of the grid in world space.
 * @param {number} z Z (Y) position of the grid in world space.
 * @param {number} width Width of the grid.
 * @param {number} depth Depth of the grid.
 * @param {number} cols	Number of horizontal cells.
 * @param {number} rows	Number of vertical cells.
 */
function CollisionGrid(x, z, width, depth, cols, rows){
	this.x = x;
	this.z = z;
	this.width = width;
	this.depth = depth;
	this.cols = cols;
	this.rows = rows;
	this.size = cols*rows;
	this.cells = new Array();
	for(var i = 0; i < this.size; i++){
		this.cells.push(new List());
	}
	this.visible = false;
}

/**
 * Resets the grid to an initial state.
 *  
 * @param {Object} x X position of the grid in world space.
 * @param {Object} z Z (Y) position of the grid in world space.
 * @param {number} width Width of the grid.
 * @param {number} depth Depth of the grid.
 * @param {number} cols	Number of horizontal cells.
 * @param {number} rows	Number of vertical cells.
 */
CollisionGrid.prototype.reset = function(x, z, width, depth, cols, rows){
	this.x = x;
	this.z = z;
	this.width = width;
	this.depth = depth;
	this.cols = cols;
	this.rows = rows;
	this.size = cols*rows;
	this.cells = new Array();
	for(var i = 0; i < this.size; i++){
		this.cells.push(new List());
	}
}

/**
 * Determines which cell in the grid a collision object is in and adds it to that cell's list of objects.
 *  
 * @param {Object} obj An object that can be checked against other objects for collisions.
 */
CollisionGrid.prototype.insert = function(obj){
	var xdiff = obj.x-this.x;
	var zdiff = obj.z-this.z;
	var x = Math.max(0, Math.min(this.cols-1, Math.floor(xdiff/(this.width/this.cols))));
	var z = Math.max(0, Math.min(this.rows-1, Math.floor(zdiff/(this.depth/this.rows))))*this.cols;
	var index = Math.max(0, Math.min(this.size-1, x+z));
	//println(index);
	this.cells[index].push(obj);
}

/**
 * Empties the cell list of all inserted objects.
 */
CollisionGrid.prototype.clear = function(){
	for(var cell in this.cells){
		this.cells[cell] = new List();
	}
}

/**
 * Function stub. 
 * @param {number} delta time since last update.
 */
CollisionGrid.prototype.update = function(delta){
}

/**
 * Function stub. 
 * @param {number} delta time since last update.
 */
CollisionGrid.prototype.transform = function(ctx){
}

/**
 * Function stub. 
 * @param {number} delta time since last update.
 */
CollisionGrid.prototype.unTransform = function(ctx){
}

/**
 * Function stub. 
 * @param {number} delta time since last update.
 */
CollisionGrid.prototype.draw = function(ctx){
}