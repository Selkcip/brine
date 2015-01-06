/**
 * Creates a new instance of Vector.
 * 
 * @class A simple mathematical vector that can be used for position, color, or anything else that can take advantage of a 4 float vector. Although it has 4 floats it can be used as a 2 or 3 float vector.
 * @param {number} x The initial x value.
 * @param {number} y The initial y value.
 * @param {number} z Optional: The initial z value.
 * @property {number} x The x value.
 * @property {number} y The y value.
 * @property {number} z The z value.
 * @property {number} w The w value.
 * @property {number} r An alias for x.
 * @property {number} g An alias for y.
 * @property {number} b An alias for z.
 * @property {number} a An alias for w.
 * @property {number} length The length of the vector.
 */
function Vector(x, y, z){
	this.x = x;
	this.y = y;
	this.z = z ? z : 0;
	this.w = 0;
}
Vector.prototype.x = 0;
Vector.prototype.y = 0;
Vector.prototype.z = 0;
Vector.prototype.w = 0;
Vector.prototype.r = 0;
Vector.prototype.g = 0;
Vector.prototype.b = 0;
Vector.prototype.a = 0;
Vector.prototype.length = 0;

Vector.prototype = {
	get r(){
		return this.x;
	},
	set r(val){
		this.x = val;
	},

	get g(){
		return this.y;
	},
	set g(val){
		this.y = val;
	},
	
	get b(){
		return this.z;
	},
	set b(val){
		this.z = val;
	},
	
	get a(){
		return this.w;
	},
	set a(val){
		this.w = val;
	},
	
	get length(){
		return Math.sqrt((this.x*this.x)+(this.y*this.y)+(this.z*this.z)+(this.w*this.w));
	},
	
	get vec2(){
		return [this.x,this.y];
	},
	
	get vec3(){
		return [this.x,this.y,this.z];
	},
	
	get vec4(){
		return [this.x,this.y,this.z,this.w];
	},
}

/**
 * Adds the given vector to the calling vector and returns a new vector.
 * 
 * @param {Vector} val The vector to add to the caller.
 * @return {Vector} The result.
 */
Vector.prototype.add = function(val){
	var temp = new Vector(0,0,0);
	temp.x = this.x+val.x;
	temp.y = this.y+val.y;
	temp.z = this.z+val.z;
	temp.w = this.w+val.w;
	return temp;
}

/**
 * Subtracts the given vector from the calling vector and returns a new vector.
 * 
 * @param {Vector} val The vector to subtract from the caller.
 * @return {Vector} The result.
 */
Vector.prototype.sub = function(val){
	var temp = new Vector(0,0,0);
	temp.x = this.x-val.x;
	temp.y = this.y-val.y;
	temp.z = this.z-val.z;
	temp.w = this.w-val.w;
	return temp;
}

/**
 * Multiplies the components of given vector with those of the calling vector and returns a new vector.
 * OR
 * Scales the calling vector by the given scalar.
 * 
 * @param {Vector or number} val The vector or scalar to multiply the caller by.
 * @return {Vector} The result.
 */
Vector.prototype.mult = function(val){
	var temp = new Vector(0,0,0);
	if(val instanceof Vector){
		temp.x = this.x*val.x;
		temp.y = this.y*val.y;
		temp.z = this.z*val.z;
		temp.w = this.w*val.w;
	}else{
		temp.x = this.x*val;
		temp.y = this.y*val;
		temp.z = this.z*val;
		temp.w = this.w*val;
	}
	return temp;
}

/**
 * Divides the components of given vector with those of the calling vector and returns a new vector.
 * OR
 * Divides the calling vector by the given scalar.
 * 
 * @param {Vector or number} val The vector or scalar to divide the caller by.
 * @return {Vector} The result.
 */
Vector.prototype.div = function(val){
	var temp = new Vector(0,0,0);
	if(val instanceof Vector){
		temp.x = this.x/val.x;
		temp.y = this.y/val.y;
		temp.z = this.z/val.z;
		temp.w = this.w/val.w;
	}else{
		temp.x = this.x/val;
		temp.y = this.y/val;
		temp.z = this.z/val;
		temp.w = this.w/val;
	}
	return temp;
}

/**
 * Negates the calling vector and returns a new vector.
 * 
 * @return {Vector} The result.
 */
Vector.prototype.neg = function(){
	var temp = new Vector(0,0,0);
	temp.x = -this.x;
	temp.y = -this.y;
	temp.z = -this.z;
	temp.w = -this.w;
	return temp;
}

/**
 * Compares the components of the caller to the given vector to determine if they are equal.
 * 
 * @param {Vector} val The vector to compare the caller to.
 * @return {Vector} The result.
 */
Vector.prototype.equals = function(val){
	if(this.x != val.x){
		return false;
	}
	if(this.y != val.y){
		return false;
	}
	if(this.z != val.z){
		return false;
	}
	if(this.w != val.w){
		return false;
	}
	return true;
}

/**
 * Calculates the cross product between the caller and the given vector. callerXval
 * 
 * @param {Vector} val The vector to cross the caller with.
 * @return {Vector} The result.
 */
Vector.prototype.cross = function(val){
	var temp = new Vector(0,0,0);
	temp.x = this.y*val.z-this.z*val.y;
	temp.y = this.z*val.x-this.x*val.z;
	temp.z = this.x*val.y-this.y*val.x;
	return temp;
}

/**
 * Calculates the dot product between the caller and the given vector.
 * 
 * @param {Vector} val The vector to dot with the caller.
 * @return {number} The result.
 */
Vector.prototype.dot = function(val){
	return this.x*val.x+this.y*val.y+this.z*val.z+this.w*val.w;
}

/**
 * Returns a normalized vector.
 * 
 * @return {Vector} The normalized result.
 */
Vector.prototype.normalize = function(){
	var length = this.length;
	var temp = new Vector(0,0,0);
	temp.x = this.x/length;
	temp.y = this.y/length;
	temp.z = this.z/length;
	temp.w = this.w/length;
	return temp;
}

/**
 * Joins the vector into a debug string.
 * 
 * @return {string} Vector as a string.
 */
Vector.prototype.toString = function(){
	return "["+this.x+","+this.y+","+this.z+","+this.w+"]";
}

/**
 * Creates a Vector from a vector represented by an array.
 * 
 * @param {Array} arr
 * @return {Vector} A new vector.
 */
Vector.arrayVector = function(arr){
//function arrayVector(arr){
	var vec = new Vector(arr[0],arr[1], arr[2] ? arr[2] : 0);
	vec.w = arr[3] ? arr[3] : 0;
	return vec;
}
