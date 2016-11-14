(function() {
	"use strict";

	puzzle.SceneObject.Puzzle = function(imageData) {
		puzzle.SceneObject.Texture.call(this, imageData);
		this.base64 = puzzle.core.utils.imageDataToBase64(imageData);
		this.placeHolder = null;
	};

	puzzle.core.utils.inherit(puzzle.SceneObject.Puzzle, puzzle.SceneObject.Texture);

	puzzle.SceneObject.Puzzle.prototype.unbind = function() {
		if (this.placeHolder) {
			this.placeHolder.holdedPuzzle = null;
		}		
		this.placeHolder = null;
	}

}());