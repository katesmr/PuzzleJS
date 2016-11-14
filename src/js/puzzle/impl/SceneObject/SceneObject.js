(function(){
	"use strict";

	/* Abstract base-class */

	puzzle.SceneObject = function(){
		this.isVisible = true;
		puzzle.SceneObject.instances.push(this);
	};

	// Static members:
	puzzle.SceneObject.instances = [];

	puzzle.SceneObject.draw = function() {
		var i;
		var instances = puzzle.SceneObject.instances;
		for (i = 0; i < instances.length; ++i) {
			if (instances[i].isVisible) {
				instances[i].draw();
			}
		}
	};

	// Instance members:
	// for done currently of selectet obj
	puzzle.SceneObject.prototype.bubbleUp = function() {
		var instances = puzzle.SceneObject.instances;
		var zIndex = instances.indexOf(this);
		instances.splice(zIndex, 1); // delete current (this) obj 
		instances.splice(instances.length, 0, this); // push current (this) obj in end of instances' lest
	};

	// Virtual methods
	// inheretit object must initial them
	puzzle.SceneObject.prototype.draw = null;

}());