/* 	Coordinates:
	2d Cartesian Coordinates, and some useful functions for manipulating coordinates
*/

function Coord( x, y ){
	this.x = x;
	this.y = y;
}

function dot( a, b ){
	return a.x*b.x + a.y*b.y;
}

function cross( a, b ){
	return a.x*b.y - a.y*b.x;
}

function dif( a, b ){
	return new Coord( a.x-b.x, a.y-b.y );
}

Coord.prototype.magnitude = function(){
	return Math.pow((this.x*this.x+this.y*this.y),0.5);
}

Coord.prototype.rotateNewCoord = function( axis, angle ){
	if( Coord.prototype.rotateNewCoord.angle != angle ){//Only calculate the matrix when the angle changes, eliminating excess computations
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