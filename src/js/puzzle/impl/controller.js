(function() {
	"use strict";

	puzzle.controller = {
		updateCanvas: function() {
			puzzle.view.updateSize();
			var i;
			var instances = puzzle.SceneObject.instances;
			for (i = 0; i < instances.length; ++i) {
				instances[i].updateMatrix({});
			}
			puzzle.SceneObject.draw();
		},

		isWin: function() {
			var i, inst;
			var instances = puzzle.SceneObject.instances;
			for (i = 0; i < instances.length; ++i) {
				inst = instances[i];
				if (inst instanceof puzzle.SceneObject.Puzzle){
					if (!inst.placeHolder || inst.base64 !== inst.placeHolder.dataURL) {
						return false;
					}
				}
			}
			return true;
		}
	}

}());