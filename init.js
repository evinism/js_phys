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