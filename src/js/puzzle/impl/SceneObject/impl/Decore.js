(function() {
	"use strict";

	puzzle.SceneObject.Decore = function() {
		puzzle.SceneObject.call(this);
		this.polyLine = [];
	};

	puzzle.core.utils.inherit(puzzle.SceneObject.Decore, puzzle.SceneObject);

}());