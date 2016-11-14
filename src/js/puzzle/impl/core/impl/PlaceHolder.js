(function() {
	"use strict";

	puzzle.core.PlaceHolder = function(x, y, width, height) {
		puzzle.core.Rect.apply(this, arguments);
		this.dataURL = null;
		this.holdedPuzzle = null;
	};

	puzzle.core.utils.inherit(puzzle.core.PlaceHolder, puzzle.core.Rect);

	puzzle.core.PlaceHolder.prototype.link = function(dataURL) {
		this.dataURL = dataURL;
	};

}());