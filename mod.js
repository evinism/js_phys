// COPYDICK(c) EVIN SELLIN 2014
// GPL v3.0 GOES HERE

function Coord( x, y ){
	this.x = x;
	this.y = y;
}

function cross( a, b ){
	return a.x*b.y - a.y*b.x;
}

function dif( a, b ){
	return new Coord( a.x-b.x, a.y-b.y );
}

Coord.prototype.rotateNewCoord = function( axis, angle ){
	if( Coord.prototype.rotateNewCoord.angle != angle ){//Only calculate the matrix when the angle changes, eliminating excess computations.
		var matr = Array();
		var sinAngle = Math.sin( angle );
		var cosAngle = Math.cos( angle );
		matr[0] = cosAngle;
		matr[1] = -sinAngle;
		matr[2] = sinAngle;
		matr[3] = cosAngle;
		Coord.prototype.rotateNewCoord.matr = matr;
	}else{
		var matr = Coord.prototype.rotateNewCoord.matr;
	}
	var difference = dif( this, axis );
	var rotated = new Coord( matr[0]*difference.x + matr[1]*difference.y, matr[2]*difference.x + matr[3]*difference.y );
	rotated.x += axis.x;
	rotated.y += axis.y;
	return rotated;
}

Coord.prototype.magnitude = function(){
	return Math.pow((this.x*this.x+this.y*this.y),0.5);
}

function Polygon(){
	this.vertices = Array();
	this.constraints = Array();
	this.rotation = 0; //Doing this shit in Radians because I can.
	this.mass = 0.5;
	this.density = 1;
	this.moment = 2;
	this.isPhysical = false;
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
		this.position = new Coord( 0, 0 );
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
		this.position.x += this.velocity.x * delta;
		this.position.y += this.velocity.y * delta;
		this.rotation 	+= this.angularV * delta;
		this.totalForce.x = 0;
		this.totalForce.y = 0;
		this.totalTorque = 0;
	}
}

function Environment(){
	this.views = new Array();
	this.polygons = new Array();
	this.globalconstraints = new Array();
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

Environment.prototype.render = function(){
	for( i=0; i<this.views.length; i++ ){
		this.views[i].render();
	}
}

Environment.prototype.run = function(){
	setInterval( function(env){
		return function(){
			env.tick( 80 );
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
	this.polygons[1].rotation -= 1*delta;// Therefore, any of these will be in meters per second.
	coord_array = this.polygons[0].getAbsoluteVertexArray();
	for( var i = 0; i<coord_array.length-1; i++){
		if(coord_array[i].y<-2)
			this.polygons[0].applyForce( buoyancy, coord_array[i] );
	}
	this.polygons[0].applyForce( gravity );
	this.polygons[0].tick(delta);
	this.views[0].scale = this.polygons[0].velocity.magnitude() + 20;
	this.views[0].center = this.polygons[0].position;
}

//--- End tick function

function View( parent_env, canvas, center, scale ){
	this.canvas 	= canvas;
	this.center 	= center;
	this.scale 		= scale;
	this.parent_env = parent_env;
	this.ctx		= this.canvas.getContext('2d');
}

//Render function of View object, does the actual printing to the screen.
//Improve this when you need efficiency.
View.prototype.render = function(){
	// If a polygon is outside the scope, we need a way to ignore it.
	// Until then, let's just go through every polygon
	this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	
	//--For the hell of it, draw a horizontal line at -2
	this.ctx.beginPath();
	var a = toCanvasCoords.call(this, new Coord(-100, -2));
	var b = toCanvasCoords.call(this, new Coord(100, -2));
	this.ctx.moveTo( a.x, a.y );
	this.ctx.lineTo( b.x, b.y );
	this.ctx.stroke();
	//-- 
	
	for( var i = 0; i<this.parent_env.polygons.length; i++ ){
		var coord_array = this.parent_env.polygons[i].getAbsoluteVertexArray();
		//toCanvasCoords.polygon_position = this.parent_env.polygons[i].position;// Set the center of the Polygon.
		this.ctx.beginPath();
		var canv_pos = toCanvasCoords.call( this, coord_array[0] );
		this.ctx.moveTo( canv_pos.x, canv_pos.y );
		//Since last coord is repeated, it auto-goes back to the start.
		for( var j=0; j<coord_array.length; j++){
			//Optimization possible (memory tradeoff), calculate canvas offset on polygon move, rather than render
			canv_pos = toCanvasCoords.call( this, coord_array[j]);
			this.ctx.lineTo( canv_pos.x, canv_pos.y );
		}
		this.ctx.stroke();
	}
	function toCanvasCoords( a ){//Easiest to do it w/o other function calls, for sake of GC
		//Center camera on screen;
		var new_x = (a.x - this.center.x )*this.scale + this.canvas.offsetWidth/2;
		var new_y = -(a.y - this.center.y )*this.scale + this.canvas.offsetHeight/2;
		return new Coord( new_x, new_y );
	}
}

function init_canvas(){
	var canvas 	 = document.getElementById("main");
	var canvas_2 = document.getElementById("second");
	var env 	 = new Environment();
	var view 	 = env.addView( canvas );
	var view2 	 = env.addView( canvas_2, new Coord( 2, 2 ), 20 );
	
	var p = new Polygon();
	p.addVertex(new Coord( 0, 1));
	p.addVertex(new Coord( 1, -1.1));
	p.addVertex(new Coord( -1, -1));
	p.isPhysical = true;
	env.addPolygon( p );
	p.setPosition(new Coord( 0, 5 ));
	
	var q = new Polygon();
	q.addVertex(new Coord( 2, 2));
	q.addVertex(new Coord( 2, -2));
	q.addVertex(new Coord( -2, -2));
	q.addVertex(new Coord( -2, 2));
	env.addPolygon( q );
	//iohandle = view.Iohandle();
	env.run();
}
