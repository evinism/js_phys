/*	Polygons:
	Sets of coordinates, with functions for applying forces and animating the polygons
	Physical functions change the properties of the polygon itself, nothing more.
*/

function Polygon(){
	this.vertices = Array();
	this.constraints = Array();
	this.rotation = 0; //Doing this shit in Radians because I can.
	this.position = new Coord( 0, 0 );
	this.velocity = new Coord( 0, 0 );
	this.angularV = 0;
	this.isPhysical = false;
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

Polygon.prototype.getAbsoluteVertexVelocities = function(){
	// Vertex velocities are going to be, uh, absolute velocity plus rotation * perpendicular to lever arm vector?
	velArray = new Array();
	for( var i = 0; i<this.vertices.length; i++ ){
		velArray[i] = this.vertices[i].rotateNewCoord( this.centroid, this.rotation + Math.PI/2 );//Adding 90 degrees to get phase right.
		velArray[i].x *= this.angularV;
		velArray[i].y *= this.angularV;//THE ADVANTAGE OF RADIANS BROTHERS AND SISTERS.
		velArray[i].x += this.velocity.x;
		velArray[i].y += this.velocity.y;
	}
	return velArray;
}

Polygon.prototype.setPosition = function( position ){
	this.position = position;
}

Polygon.prototype.tick = function( delta ){
	this.position.x += this.velocity.x * delta;
	this.position.y += this.velocity.y * delta;
	this.rotation 	+= this.angularV * delta;
}