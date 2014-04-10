/*	Environment:
	
*/

function Environment(){
	this.views = new Array();
	this.polygons = new Array();
	this.globalAffectors = new Array();
}

// Both add the object to the environment and return it.
// It will be mutable in 2 scopes, ugly, but very useful in this case
Environment.prototype.addView = function( canvas, center, scale ){
	var center = center || new Coord(0,0);
	var scale = scale || 10;
	var len = this.views.length;
	this.views[len] = new View( this, canvas, center, scale );
	return this.views[len];
}

Environment.prototype.addPolygon = function( polygon, position ){
	var position = position || new Coord(0,0);
	polygon.init();
	polygon.setPosition( position );
	this.polygons[this.polygons.length] = polygon;
}

Environment.prototype.addAffector = function( affector ){
	this.globalAffectors[this.globalAffectors.length] = affector;
}

Environment.prototype.render = function(){
	for( i=0; i<this.views.length; i++ ){
		this.views[i].render();
	}
}

Environment.prototype.run = function(){
	setInterval( function(env){
		return function(){
			env.tick( 50 );
			env.render();
		}
	}(this), 20);
}

//----TICK FUNCTION
// Your runtime function baby
Environment.prototype.tick = function( delta ){//This is the shit that actually iterates stuff, basically where the Physics engine will be written.
	delta = delta*0.001;//Turn it into units of seconds, to match setInteral
	gravity = new Coord( 0, -1 );
	buoyancy = new Coord( 0, 4 );
	coord_array = this.polygons[0].getAbsoluteVertexArray();
	/*for( var i = 0; i<coord_array.length-1; i++){
		if(coord_array[i].y<-2)
			this.polygons[0].applyForce( buoyancy, coord_array[i] );
	}*/
	this.polygons.forEach( function(env){
		return function(p){
			if(p.isPhysical){
				env.globalAffectors.forEach( function(a){a.apply(p)} );
			}
		}
	}(this) );
	//this.polygons[0].applyForce( gravity );
	this.polygons.forEach( function(p){p.tick(delta)} );
}