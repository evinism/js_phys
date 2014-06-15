/*	Affector:
	Will apply rules to Polygons, dynamically
	Affector is independent of Environment
*/


// Really, as a base class, this kind of sucks, and I'm not gonna use it until later,
// becuase affectors share only 2 things: they take polygons, and apply forces to them.

function Affector(){
}

function Gravity( accelerationVector ){
	this.acceleration = accelerationVector;
}

Gravity.prototype.apply = function( p ){
	var scaledForce = new Coord( this.acceleration.x*p.mass, this.acceleration.y*p.mass );
	p.applyForce( scaledForce );
}


// This affector is really dumb. It's just for testing that the engine works.
// Implement integration to get any sort of accuracy.
function forceVertexWall( forceVector, normalVector ){
	this.normal = normalVector;
	this.force = forceVector;
}

forceVertexWall.prototype.apply = function( p ){
	var coord_array = p.getAbsoluteVertexArray();
	for( var i = 0; i<coord_array.length-1; i++){
		var coord_dif = dif( coord_array[i], this.normal );
		if( dot(coord_dif, this.normal) > 0 )
			p.applyForce( this.force, coord_array[i] );
	}
}

// This affector is mostly used as a test for the the impulse polygon property
// It's pretty dumb too.

function impulseVertexWall( impulseVector, normalVector ){
	this.normal = normalVector;
	this.impulse = impulseVector;
}

impulseVertexWall.prototype.apply = function( p ){
	var coord_array 	= p.getAbsoluteVertexArray();
	var velocity_array 	= p.getAbsoluteVertexVelocities();
	for( var i = 0; i<coord_array.length-1; i++){
		var coord_dif = dif( coord_array[i], this.normal );
		if( dot(coord_dif, this.normal)>0 && dot(velocity_array[i], this.normal)>0 ){
			p.applyImpulse( this.impulse, coord_array[i] );
		}
	}
}

// Another really dumb effector. This one does an impulse in a vector that's proportional the vertex's velocity.
// I guess it's not so dumb because like, it means that 

function proportionalVertexWall( k, normalVector ){
	this.normal = normalVector;
	//this.k = k;
}

proportionalVertexWall.prototype.apply = function( p ){
	var coord_array 	= p.getAbsoluteVertexArray();
	var velocity_array 	= p.getAbsoluteVertexVelocities();
	for( var i = 0; i<coord_array.length-1; i++){
		var coord_dif = dif( coord_array[i], this.normal );
		if( dot(coord_dif, this.normal)>0 && dot(velocity_array[i], this.normal)>0 && velocity_array[i].magnitude() > 1 ){
			p.applyImpulse( new Coord( -velocity_array[i].x, -velocity_array[i].y * this.k ) , coord_array[i] );
		}
	}
}