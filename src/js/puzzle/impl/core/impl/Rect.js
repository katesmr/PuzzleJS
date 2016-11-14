(function(parent) {
	"use strict";

	parent.Rect = function(x, y, width, height) {
		this.x = +x;
		this.y = +y;
		this.width = +width;
		this.height = +height;
	};

	parent.Rect.prototype.hasPoint = function(x, y) {
		return ((x >= this.x && x < this.x + this.width) && 
				(y >= this.y && y < this.y + this.height));
	};

	parent.Rect.prototype.copy = function(other) {
		this.x = other.x;
		this.y = other.y;
		this.width = other.width;
		this.height = other.height;
	};

}(puzzle.core));