/*	Polygons:
	Sets of coordinates, with functions for applying forces and animating the polygons
	Physical functions change the properties of the polygon itself, nothing more.
*/

function Polygon(){
	this.vertices = Array();
	this.constraints = Array();
	this.rotation = 0; //Doing this shit in Radians because I can.
	this.mass = 0.5;
	this.density = 1;
	this.moment = 2; //To be corrected later, for sure
	this.isPhysical = false;
	
	this.position = new Coord( 0, 0 );
	this.velocity = new Coord( 0, 0 );
	this.angularV = 0;
	this.totalForce = new Coord( 0, 0 );
	this.totalTorque = 0;
	this.isInit = false;
}

Polygon.prototype.init = function(){//A pseudo-private method? This seems kind of like the wrong way to do this.
	if( !this.isInit ){
		//Repeat last coordinate to make loops easier
		this.vertices[this.vertices.length] = this.vertices[0];
		var Cx = 0;
		var Cy = 0;
		var Ca = 0;
		for( var i = 0; i<this.vertices.length-1; i++){//But we don't actually need it to get the centroid
			Cx += (this.vertices[i].x + this.vertices[i+1].x)*(this.vertices[i].x*this.vertices[i+1].y-this.vertices[i+1].x*this.vertices[i].y);
			Cy += (this.vertices[i].y + this.vertices[i+1].y)*(this.vertices[i].x*this.vertices[i+1].y-this.vertices[i+1].x*this.vertices[i].y);
			Ca += (this.vertices[i].x*this.vertices[i+1].y-this.vertices[i+1].x*this.vertices[i].y);
		}
		this.area = Ca/2;
		var x = Cx/(6*this.area);
		var y = Cy/(6*this.area);
		this.isInit = true;
		this.mass = -(this.area * this.density);
		this.centroid = new Coord( x, y);
		//We need to provide a method by which to normalize the 
	}
}

Polygon.prototype.addVertex = function( vertex ){
	//assert( typeof vertex!='Coord', "Polygon.addVertex expects an array" );
	//For ease of use, we really want to only add one vertex at a time.
	var ind = this.vertices.length;
	if( ind>0 ){
		//If we put another vertex colinearly, then just replace the last vertex
		var c = cross(vertex - this.vertices[ind-1], this.vertices[ind-1]-this.vertices[ind-2]);
		//assert( c>=0, "Polygon.addVertex expects convex positively-oriented polygons")
		if( c == 0 ){
			ind--;
		}
		this.vertices[ind] = vertex;
		// (ind) x (ind-1) should be positive, but no need to check, else we can just assert it.
	}else{
		this.vertices[0] = vertex;
	}
}

Polygon.prototype.getAbsoluteVertexArray = function(){//Rotating around Centroid, because whatever.
	var rotArray = new Array();
	for( var i = 0; i<this.vertices.length; i++ ){
		rotArray[i] = this.vertices[i].rotateNewCoord( this.centroid, this.rotation );
		rotArray[i].x += this.position.x;
		rotArray[i].y += this.position.y;
	}
	return rotArray;
}

Polygon.prototype.setPosition = function( position ){
	this.position = position;
}

Polygon.prototype.applyForce = function( force, position ){
	var position = position || new Coord(this.position.x - this.centroid.x, this.position.y - this.centroid.y);
	if(this.isPhysical){
		//console.log(this);
		this.totalForce.x += force.x;
		this.totalForce.y += force.y;
		var leverArm = new Coord(position.x - this.position.x + this.centroid.x, position.y - this.position.y + this.centroid.y);
		this.totalTorque += cross( leverArm, force);
	}
}

Polygon.prototype.tick = function( delta ){
	if(this.isPhysical){
		this.velocity.x += (this.totalForce.x/this.mass) * delta;
		this.velocity.y += (this.totalForce.y/this.mass) * delta;
		this.angularV 	+= (this.totalTorque/this.moment)* delta;
		this.totalForce.x = 0;
		this.totalForce.y = 0;
		this.totalTorque = 0;
	}
	this.position.x += this.velocity.x * delta;
	this.position.y += this.velocity.y * delta;
	this.rotation 	+= this.angularV * delta;
}