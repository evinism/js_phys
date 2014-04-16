/*	View:
	Object that handles the rendering of the image onto the canvas, can be modded heavily
	This prototype sucks, and I'm going to rewrite it soon.
	Bound to a specific environment, which will be changed in future versions(via the creation of another object constructor.
	Has no affect on the environment, other than the environment calling its render function.
*/

function View( parent_env, canvas, center, scale ){
	this.canvas 	= canvas;
	this.center 	= center || new Coord(0,0);
	this.scale 		= scale || 10;
	this.parent_env = parent_env;
	this.ctx		= this.canvas.getContext('2d');
	this.bindCoord( new Coord(0,0) );
	this.setCameraStyle("track-single", this.scale);
}

//Render function of View object, does the actual printing to the screen.
//Improve this when you need efficiency.
View.prototype.render = function(){
	// If a polygon is outside the scope, we need a way to ignore it.
	// Until then, let's just go through every polygon
	this.track(); //Change the camera position, based on the bindings given.
	this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	
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

View.prototype.bindCoord = function(){
	this.coordinateArray = Array.prototype.slice.call(arguments, 0);
}

View.prototype.setCameraStyle = function( style, scale ){
	this.baseScale = scale;
	if( style=="track-single" ){
		this.track = function(){
			this.center = this.coordinateArray[0];
			this.scale = this.baseScale;
		}
	}else if( style=="track-all" ){
		this.track = function(){
		}
	}else{
		this.setCameraStyle("track-single");
	}
}