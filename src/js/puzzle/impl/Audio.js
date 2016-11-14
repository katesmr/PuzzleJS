(function(){
	"use strict";

	var cache = {};

	puzzle.Audio = function(fileName) {
		if (!(fileName in cache)) {
			cache[fileName] = new Audio(fileName);
		}
		this.sound = cache[fileName]; 
	};

	puzzle.Audio.prototype.play = function() {
		this.sound.play();
	};

}());