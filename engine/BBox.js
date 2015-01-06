/**
 * Creates a new instance of BBox.
 * 
 * @class BBox is a bounding volume for simple 3D collision detection.
 * @param {number} x The initial x position of the BBox.
 * @param {number} y The initial y position of the BBox.
 * @param {number} z The initial z position of the BBox.
 * @param {number} width The width of the BBox.
 * @param {number} height The height of the BBox.
 * @param {number} depth The depth of the BBox.
 * 
 * @property {number} x The x position of the BBox.
 * @property {number} y The y position of the BBox.
 * @property {number} z The z position of the BBox.
 * @property {number} width The width of the BBox.
 * @property {number} height The height of the BBox.
 * @property {number} depth The depth of the BBox.
 */
function BBox(x,y,z,width,height,depth){
	this.pos = new Vector(x,y,z);
	this.dims = new Vector(width,height,depth);
	this.offsets = new Vector(0,0,0);
	this.vel = new Vector(0,0,0);
	this.solid = false;
}

BBox.prototype = {
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
	
	get width(){
		return this.dims.x;
	},
	set width(val){
		this.dims.x = val;
	},
	
	get height(){
		return this.dims.y;
	},
	set height(val){
		this.dims.y = val;
	},
	
	get depth(){
		return this.dims.z;
	},
	set depth(val){
		this.dims.z = val;
	},
}

/**
 * Checks to if the given point is within the bounding volume. 
 * 
 * @param {Vector} point The point to check against the bounding volume.
 * @return {bool} True if the point is in the BBox, false otherwise.
 */
BBox.prototype.checkPoint = function(point){
	var xpos = this.pos.x+this.offsets.x;
	var ypos = this.pos.y+this.offsets.y;
	var zpos = this.pos.z+this.offsets.z;
	var minx = xpos-this.dims.x/2;
	var maxx =xpos+this.dims.x/2;
	var minz = zpos-this.dims.z/2;
	var maxz = zpos+this.dims.z/2;
	var miny = ypos-this.dims.y/2;
	var maxy = ypos+this.dims.y/2;
	if(point.x >= minx && point.x <= maxx && point.z >= minz && point.z <= maxz && point.y >= miny && point.y <= maxy){
		return true;
	}
	return false;
}

/**
 * Checks for intersections between the given and testing BBoxs. This function is incomplete as it really should return more useful imformation.
 * 
 * @param {BBox} bbox The BBox to check for intersextions with.
 * @return {Object} Collision object with the boolean property occurred. If occurred is true it will also have the property normal which is useless as it always return (0,0,1).
 */
BBox.prototype.checkBBox = function(bbox){
	var col = {occurred:false};
	var points = bbox.getPoints();
	for(var point in points){
		if(this.checkPoint(points[point])){
			col.occurred = true;
			col.normal = new Vector(0,0,1);
			return col;
		}
	}
	return col;
}

/**
 * Checks for intersections between the given and testing BBoxs. This function is incomplete as it really should return more useful imformation. Unlike checkBBox, this function checks the volumes against each other.
 * 
 * @param {BBox} bbox The BBox to check for intersextions with.
 * @return {Object} Collision object with the boolean property occurred. If occurred is true it will also have the property normal which is useless as it always return (0,0,1).
 */
BBox.prototype.intersect = function(bbox){
	var col = {occurred:false};
	var points = bbox.getPoints();
	for(var point in points){
		if(this.checkPoint(points[point])){
			col.occurred = true;
			col.normal = new Vector(0,0,1);
			return col;
		}
	}
	points = this.getPoints();
	for(var point in points){
		if(bbox.checkPoint(points[point])){
			col.occurred = true;
			col.normal = new Vector(0,0,1);
			return col;
		}
	}
	return col;
}

/**
 * Returns the eight points that define the volume relative to the BBox's position
 * 
 * @return {Array<Vector>} An array of eight points defining the volume.
 */
BBox.prototype.getPoints = function(){
	var points = new Array();
	var point = this.pos.add(this.offsets).add(this.dims.div(2));
	points.push(point);
	point = this.pos.add(this.offsets).add(this.dims.div(-2));
	points.push(point);
	
	point = this.pos.add(this.offsets).add(this.dims.div(new Vector(2,2,-2)));
	points.push(point);
	point = this.pos.add(this.offsets).add(this.dims.div(new Vector(-2,2,2)));
	points.push(point);
	point = this.pos.add(this.offsets).add(this.dims.div(new Vector(-2,2,-2)));
	points.push(point);
	
	point = this.pos.add(this.offsets).add(this.dims.div(new Vector(2,-2,2)));
	points.push(point);
	point = this.pos.add(this.offsets).add(this.dims.div(new Vector(-2,-2,2)));
	points.push(point);
	point = this.pos.add(this.offsets).add(this.dims.div(new Vector(2,-2,-2)));
	points.push(point);
	return points;
}

/**
 * Creates an instance of BRect.
 * 
 * @class BRect is a bounding area for simple 2D collision detection.
 * @param {number} x The initial x position of the BRect.
 * @param {number} y The initial y position of the BRect.
 * @param {number} width The width of the BRect.
 * @param {number} height The height of the BRect.
 * 
 * @property {number} x The x position of the BBox.
 * @property {number} y The y position of the BBox.
 * @property {number} width The width of the BBox.
 * @property {number} height The height of the BBox.
 */
function BRect(x,y,width,height){
	this.pos = new Vector(x,y,0);
	this.dims = new Vector(width,height,0);
	this.offsets = new Vector(0,0,0);
	this.solid = false;
}

BRect.prototype = new BBox();

/**
 * Checks to see if a point is within the bounding area. 
 * 
 * @param {Vector} point The point to check against the bounding area.
 * @return {bool} True if the point is in the BRect, false otherwise.
 */
BRect.prototype.checkPoint = function(point){
	var xpos = this.pos.x+this.offsets.x;
	var ypos = this.pos.y+this.offsets.y;
	var minx = xpos;//-this.dims.x/2;
	var maxx = xpos+this.dims.x;//+this.dims.x/2;
	var miny = ypos;//-this.dims.y/2;
	var maxy = ypos+this.dims.y;//+this.dims.y/2;
	if(point.x >= minx && point.x <= maxx && point.y >= miny && point.y <= maxy){
		return true;
	}
	return false;
}

/**
 * Returns the four points that define the volume relative to the BBox's position
 * 
 * @return {Array<Vector>} An array of four points defining the volume. 
 */
BRect.prototype.getPoints = function(){
	var points = new Array();
	var point = this.pos.add(this.offsets);//.add(this.dims.div(2));
	points.push(point);
	point = this.pos.add(this.offsets).add(this.dims);
	points.push(point);
	
	point = this.pos.add(this.offsets).add(new Vector(this.dims.x,0,0));
	points.push(point);
	point = this.pos.add(this.offsets).add(new Vector(0,this.dims.y,0));
	points.push(point);
	return points;
}