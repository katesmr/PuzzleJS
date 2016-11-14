(function() {
	"use strict";

	puzzle.SceneObject.Texture = function(imageData) {
		puzzle.SceneObject.call(this);
		puzzle.core.Rect.call(this, 0, 0, imageData.width, imageData.height);

		this.imageData = imageData;
		this.matrix = new puzzle.core.Matrix2D();
		this.scale = 1;
	};

	puzzle.core.utils.inherit(puzzle.SceneObject.Texture, puzzle.SceneObject);
	puzzle.core.utils.extend(puzzle.SceneObject.Texture, puzzle.core.Rect);

	puzzle.SceneObject.Texture.prototype.draw = function() {
		puzzle.view.drawTexture(this);
	};

	puzzle.SceneObject.Texture.prototype.updateMatrix = function(options) {
		var projectionMatrix = new puzzle.core.Matrix2D();
		// need to put width and height of canvas
		var canvasHeight = puzzle.view.getHeight();
		var canvasWidth = puzzle.view.getWidth();

		projectionMatrix.makeProjection(canvasWidth, canvasHeight, 1);
		// this matirx will convert from pixels to clip space
		// this matrix will scale our 1 unit quad
		// from 1 unit to texWidth, texHeight units
		var scaleMatrix = new puzzle.core.Matrix2D();
		// var aspect = canvasWidth > canvasHeight ? canvasHeight / canvasWidth : canvasWidth / canvasHeight;
		// The isFinite() function determines whether a number is a finite, legal number
		if (isFinite(options.scale)) {
			this.scale = +options.scale;
			this.width = this.imageData.width * this.scale;
			this.height = this.imageData.height * this.scale;
		}
		scaleMatrix.makeScale(this.width, this.height, 1);

		var translationMatrix = new puzzle.core.Matrix2D();
		// change current coord
		if (isFinite(options.x)) {
			this.x = +options.x;
		}
		if (isFinite(options.y)) {
			this.y = +options.y;
		}
		translationMatrix.makeTranslation(this.x, this.y, 0);

		// multiply them all togehter
		this.matrix = puzzle.core.Matrix2D.multiply(scaleMatrix, translationMatrix);
		this.matrix = puzzle.core.Matrix2D.multiply(this.matrix, projectionMatrix);
	};

}());