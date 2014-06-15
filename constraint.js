// Constraint Constructor
// A constraint modifies the values of the forces and torques on polygons given certain conditions.
function Constraint( type ){
	this.members = new Array();
	this.type = type || "";
	this.satisfied = false;
}

Constraint.prototype.satisfy = function(){
	if( !this.satisfied ){
		switch( this.type ){
			case "weld":
				this.satisfyWeld();
			break;
			case "":
			break;
		}
		this.satisfied = true;
	}
}

Constraint.prototype.tick = function(){
	this.satisfied = false;
}

//------------------

//Now, specific constraints. 

Constraint.prototype.satisfyWeld = function(){
	attrib = {
		mass: 0;
		pos: new Coord(0,0);
		ang: 0;
		moment: 0;
	};
	len = this.members.length();
	for( obj in this.members ){
		mass += obj.mass;
		attrib.pos.x += obj.position.x*obj.mass;
		attrib.pos.y += obj.position.y*obj.mass;
	}
	attrib.pos.x = pos.x/mass;
	attrib.pos.y = pos.y/mass;
	for( obj in this.members ){
		d = diff( attrib.pos, obj.position ).magnitude();
		attrib.moment += d*d*obj.mass;
	}
}