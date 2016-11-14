(function(parent) {
	"use strict";

	parent.utils = {
		inherit: function(child, parent) {
			var F = function() {};
			F.prototype = parent.prototype;
			child.prototype = new F;
			child.prototype.constructor = child;
		},

		extend: function(dest, src) {
			var destProto = dest.prototype;
			var srcProto = src.prototype;
			for (var key in srcProto) {
				if (srcProto.hasOwnProperty(key)) {
					destProto[key] = srcProto[key];
				}
			} 
		},

		uploadImage: function(callback) {
			if (this.files && this.files[0]) {
				var reader = new FileReader();
				reader.onload = function(event) {
					var img = new Image();
					img.onload = callback;
					img.src = event.target.result;
				};
				reader.readAsDataURL(this.files[0]); 
			}
		},

		cutSlice: function(imageData, rect) {
			var data = imageData.data;
			var resImageData = this.getImageDataFromSize(rect.width, rect.height);
			var resData = resImageData.data;
			var index = (rect.x + rect.y * imageData.width) * 4;
			var i, c, j;
			for (i = 0, c = 0, j = index; i < resData.length; ) {
				
				resData[i++] = data[j++]; //r
				resData[i++] = data[j++]; //g
				resData[i++] = data[j++]; //b
				resData[i++] = data[j++]; //a

				++c;
				if (c === rect.width) {
					j = index += imageData.width * 4; // skip 4 channel 
					c = 0;
				}
			}
			return resImageData;
		},

		splitSize: function(width, height) {
			var res = [];
			var x = 0;
			var y = 0;
			var w = 128;
			var h = 128;
			var i, j;
			for (i = 0, j =0; i < 16; ++i) {
				res.push(new puzzle.core.Rect(x, y, w, h));
				x += w;
				if (++j == 4) {
					y += h;
					x = 0;
					j = 0;
				}
			}
			return res;
		},

		splitSize1: function(w, h, countW, countH) {
			var res = [];
			var i, j;
			var x = 0;
			var y = 0;
			var count = countW * countH;
			for (i = 0, j = 0; i < count; ++i) {
				res.push(new puzzle.core.Rect(x, y, w, h));
				x += w;
				if (++j == countW) {
					y += h;
					x = 0;
					j = 0;
				}
			}
			return res;
		},

		puzAlg: function(sideSize) {
			var count, tmp, puzSide;
			count = sideSize / puzzle.config.PUZZLE_MIN_SIZE;
			if(Number.isInteger(count)) {
				return [count, puzzle.config.PUZZLE_MIN_SIZE];
			}
			else {
				sideSize -= 1;
				count = parseInt(count);
				tmp = count;
				while(true) {
				  if(1 === tmp) {
				    sideSize -= 1;
				    tmp = count;
				    continue;
				  }
				  puzSide = sideSize / tmp;
				  if(Number.isInteger(puzSide)) {
				    return [tmp, puzSide];
				  }
				  else {
				    --tmp;
				  }
				}
			}
		},

		getImageDataFromSize: function(width, height) {
			var tmpCanvas = document.createElement("CANVAS");
			tmpCanvas.width = width;
			tmpCanvas.height = height;
			return tmpCanvas.getContext("2d").getImageData(0, 0, width, height);
		}, 

		getImageDataFromImage: function(image) {
			var tmpCanvas = document.createElement("CANVAS");
			tmpCanvas.width = image.width;
			tmpCanvas.height = image.height;
			var ctx = tmpCanvas.getContext("2d");
			ctx.drawImage(image, 0, 0);
			return ctx.getImageData(0, 0, image.width, image.height);
		},

		imageDataToBase64: function(imageData) {
			var tmpCanvas = document.createElement("CANVAS");
			var ctx = tmpCanvas.getContext("2d");
			tmpCanvas.width = imageData.width;
			tmpCanvas.height = imageData.height;
			ctx.putImageData(imageData, 0, 0);
			return tmpCanvas.toDataURL("image/png");
		},

		fillDataByColor: function(data, r, g, b, a) {
			for (var i = 0; i < data.length; i += 4) {
				data[i+0] = r;
				data[i+1] = g;
				data[i+2] = b;
				data[i+3] = a;
			}
		},

		onHashChange: function(callback){
			var prevHash = window.location.hash;
			setInterval(function () {
				if (window.location.hash !== prevHash) {
					prevHash = window.location.hash;
					callback(window.location.hash);
				}
			}, 100);
		},

		setHash: function(hash) {
			window.location.hash = '#' + hash;
		},

		resizeImage: function(image, newW, newH) {
			var tmpCanvas = document.createElement("CANVAS");
			tmpCanvas.width = newW;
			tmpCanvas.height = newH;
			tmpCanvas.getContext("2d").drawImage(image, 0, 0, newW, newH);
			return tmpCanvas;
		}
	};

}(puzzle.core));