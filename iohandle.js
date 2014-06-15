function IoHandle(){
	this.environments = new Array();
	this.views = new Array();
	this.renderIntervalObject = setInterval(this.render(), 50)
}

IoHandle.prototype.addView = function( view ){
	this.views[this.views.length] = view;
}

IoHandle.prototype.render = function(){
	for( var i=0; i<this.views.length; i++){
		this.views[i].render();
	}
}

IoHandle.prototype.setRenderInterval = function( delta ){
	clearInterval(this.renderIntervalObject);
	this.renderIntervalObject = setInterval(function(io){
		return function(){
			io.render();
		}
	}(this), delta);
}

