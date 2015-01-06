//BPoly
function BPoly(x,y){
	this.pos = new Vector(x,y,0);
	this.dims = new Vector(0,0,0);
	this.offsets = new Vector(0,0,0);
	this.vel = new Vector(0,0,0);
	this.solid = false;
	this.verts = new Array();
	this.rotation = 0;
}

BPoly.prototype = new BBox();

BPoly.prototype.checkPoint = function(point){
	var verts = this.getPoints();
	var up = new Vector(0,0,1);
	for(var i = 0; i < verts.length; i++){
		var cur = verts[i];
		var next = verts[(i+1)%verts.length];
		var edge = next.sub(cur);
		var normal = edge.cross(up).normalize();
		var rpos = point.sub(cur);
		var ang = signedXYAngle(edge, rpos);
		//println(cur);
		if(ang < 0){
			return false;
		}
	}
	return true;
}

BPoly.prototype.checkBBox = function(bbox){
	var col = {occurred:false};
	//if(bbox.vel.length > 0){
		var points = bbox.getPoints();
		var verts = this.getPoints();
		var up = new Vector(0,0,1);
		for(var i = 0; i < verts.length; i++){
			var cur = verts[i];
			var next = verts[(i+1)%verts.length];
			var edge = next.sub(cur);
			var normal = edge.cross(up).normalize();
			var vel = bbox.vel.sub(this.vel);
			var normDotVel = normal.dot(vel.normalize());
			//println(normal);
			for(var point in points){
				point = points[point];
				//var pos = ball->getPos()+glm::normalize(vel)*ball->getRadius();
				//distance to the intersection
				var dis = cur.sub(point).dot(normal)/normDotVel;
				//closestPointDis = glm::dot((cur-pos), normal)/glm::dot(normal, -normal);
				//var dis = cur.sub(point).dot(normal)/normal.dot(normal.neg());
				if(Math.abs(dis) <= vel.length){
				//if(dis <= vel.length){
					if(this.checkPoint(point.add(vel))){
					//if(this.checkPoint(point.add(vel.normalize().mult(Math.abs(dis))))){
						col.occurred = true;
						col.normal = normal;
						//println(dis);
						col.pos = bbox.pos.add(vel.normalize().mult(dis));
						return col;
					}
				}
			}
		}
	/*}else{
		var points = bbox.getPoints();
		for(var point in points){
			if(this.checkPoint(points[point])){
				return true;
			}
		}
		return false;
	}*/
	return col;
}

BPoly.prototype.getPoints = function(){
	var points = new Array();
	var dis,ang,x, y;
	for(var vert in this.verts){
		vert = this.verts[vert];
		dis = vert.length;
		ang = Math.atan2(vert.y,vert.x);
		x = this.pos.x+Math.cos(this.rotation+ang)*dis;
		y = this.pos.y+Math.sin(this.rotation+ang)*dis;
		points.push(new Vector(x,y,0));
		//println(this.pos);
	}
	return points;
}

function signedXYAngle(a, b)
{
	var perpDot = a.x * b.y - a.y * b.x;
	return Math.atan2(perpDot, a.dot(b));
}