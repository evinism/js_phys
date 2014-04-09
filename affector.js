/*	Affector:
	Will apply rules to Polygons, dynamically
	Affector is independent of Environment
	Here I am wanking to modular design.
*/


// Really, as a base class, this kind of sucks, and I'm not gonna use it until later,
// becuase affectors share only 2 things: they take polygons, and apply forces to them.
// I could modularize it better, but for right now it works.
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
// But not now. I'm tired/
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