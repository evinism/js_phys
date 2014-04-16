PhysObject.prototype = new Polygon();
PhysObject.constructor = PhysObject;

function PhysObject(){
	Polygon.call(this);
	this.mass = 0.5;
	this.density = 1;
	this.moment = 5; //To be corrected later, for sure
	this.totalForce = new Coord( 0, 0 );
	this.totalTorque = 0;
	this.totalImpulse = new Coord( 0, 0 );
	this.totalTorqueI = 0;
	this.isPhysical = true;
}

PhysObject.prototype.applyForce = function( force, position ){
	var position = position || new Coord(this.position.x - this.centroid.x, this.position.y - this.centroid.y);
	if(this.isPhysical){
		//console.log(this);
		this.totalForce.x += force.x;
		this.totalForce.y += force.y;
		var leverArm = new Coord(position.x - this.position.x + this.centroid.x, position.y - this.position.y + this.centroid.y);
		this.totalTorque += cross( leverArm, force);
	}
}

PhysObject.prototype.applyImpulse = function( impulse, position ){
	var impulse = impulse || new Coord(this.position.x - this.centroid.x, this.position.y - this.centroid.y);
	if( this.isPhysical){
		this.totalImpulse.x += impulse.x;
		this.totalImpulse.y += impulse.y;
		var leverArm = new Coord(position.x - this.position.x + this.centroid.x, position.y - this.position.y + this.centroid.y);
		this.totalTorqueI += cross( leverArm, impulse );
	}
}

PhysObject.prototype.tick = function( delta ){
	this.velocity.x += (this.totalForce.x * delta + this.totalImpulse.x)/this.mass;
	this.velocity.y += (this.totalForce.y * delta + this.totalImpulse.y)/this.mass;
	this.angularV 	+= (this.totalTorque * delta + this.totalTorqueI)/this.moment;
	this.totalImpulse.x = 0;
	this.totalImpulse.y = 0
	this.totalAngularI = 0;
	this.totalForce.x = 0;
	this.totalForce.y = 0;
	this.totalTorque = 0;
	this.position.x += this.velocity.x * delta;
	this.position.y += this.velocity.y * delta;
	this.rotation 	+= this.angularV * delta;
}