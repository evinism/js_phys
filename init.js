/*
Physics Engine: 2014 Evin Sellin
Written as an example that I can do OO design.
Even though JS isn't REALLY an OO language, it's got similar properties,
and has a lot of the same principles, such as information hiding, the works.
*/

function init_canvas(){
	var canvas 	 = document.getElementById("main");
	var canvas_2 = document.getElementById("second");
	var env 	 = new Environment();
	env.setTimeScale( 0.7 );//Percent of real time.
	env.setTickInterval( 30 );

	gravity 		= new Gravity( new Coord( 0, -10 ));	
	//groundBounce 	= new forceVertexWall( new Coord( 0, 0.3 ), new Coord( 0, -2) );
	ground 			= new forceVertexWall( new Coord( 0, 100), new Coord( 0, -2 ) );
	env.addAffector( gravity );
	env.addAffector( ground );
	//env.addAffector( groundBounce );
	
	var p = new PhysObject();
	p.addVertex(new Coord( -1, 1));
	p.addVertex(new Coord( 1, 1 ));
	p.addVertex(new Coord( 2, -1 ));
	p.addVertex(new Coord( -2, -1 ));
	p.rotation = -1;
	p.angularV = 0.5;

	env.addPolygon( p, new Coord( 0, 5 ) );
	
	var q = new Polygon();
	q.addVertex(new Coord( 2, 2));
	q.addVertex(new Coord( 2, -2));
	q.addVertex(new Coord( -2, -2));
	q.addVertex(new Coord( -2, 2));
	q.angularV = 1;
	//env.addPolygon( q );
	
	var groundLine = new Polygon();
	groundLine.addVertex(new Coord( -100, 0));
	groundLine.addVertex(new Coord( 100, 0));
	groundLine.addVertex(new Coord( 100, -100));
	groundLine.addVertex(new Coord( -100, -100));
	env.addPolygon( groundLine, new Coord( 0, -2 ) );
	
	var view 	 = new View( env, canvas );
	var view2 	 = new View( env, canvas_2 );
	view.bindCoord( p.position );
	view.setCameraStyle( "track-single", 15 );
	
	iohandle = new IoHandle();
	iohandle.addView( view );
	iohandle.addView( view2 );
	iohandle.setRenderInterval( 20 );
	env.run();
}