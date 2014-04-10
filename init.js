function init_canvas(){
	var canvas 	 = document.getElementById("main");
	var canvas_2 = document.getElementById("second");
	var env 	 = new Environment();

	gravity 		= new Gravity( new Coord( 0, -0.5 ));	
	//groundBounce 	= new forceVertexWall( new Coord( 0, 0.3 ), new Coord( 0, -2) );
	ground 			= new forceVertexWall( new Coord( 0, 5), new Coord( 0, -2 ) );
	env.addAffector( gravity );
	env.addAffector( ground );
	//env.addAffector( groundBounce );
	
	var p = new Polygon();
	p.addVertex(new Coord( -1, 1));
	p.addVertex(new Coord( 1, 1 ));
	p.addVertex(new Coord( 2, -1 ));
	p.addVertex(new Coord( -2, -1 ));
	p.rotation = -1;

	p.isPhysical = true;
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

	var view 	 = env.addView( canvas );
	var view2 	 = env.addView( canvas_2 );
	view.bindCoord( p.position );
	view.setCameraStyle( "track-single", 15 );
	
	//iohandle = view.Iohandle();
	env.run();
}