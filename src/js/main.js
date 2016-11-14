(function () {
	"use strict";

	var canvas = document.querySelector(".canvas");
	var uploader = document.querySelector(".uploader");
	var activePuzzle = null;
	var isInputActive = false;
	var placeHolders = [];
	var dx = 0;
	var dy = 0;

	puzzle.core.utils.onHashChange(function(hash) {
		hash = hash.substring(1, hash.length);
		var frames = document.querySelectorAll(".frame");
		for (var i = 0; i < frames.length; ++i) {
			frames[i].classList.remove("show");
			frames[i].classList.add("hide");
		}
		var current = document.querySelector(".frame-" + hash);
		current.classList.remove("hide");
		current.classList.add("show");
		if ("game" === hash) {

		} 
		else if ("menu" === hash) {

		}
	});
	puzzle.core.utils.setHash("menu");

	puzzle.view.init(canvas);
	var timerId;
	window.addEventListener("resize", function(event){
		clearTimeout(timerId);
		timerId = setTimeout(puzzle.controller.updateCanvas, puzzle.config.UPDATE_TIME);
	}, false);

	uploader.onclick = function() {
		new puzzle.Audio("src/sounds/random1.wav").play();
	};

	canvas.addEventListener("mousedown", function(event) {
		var i;
		var instances = puzzle.SceneObject.instances;
		for (i = instances.length - 1; i >= 0; --i) {
			if (instances[i] instanceof puzzle.SceneObject.Puzzle &&
				instances[i].hasPoint(event.offsetX, event.offsetY)){
				isInputActive = true;
				activePuzzle = instances[i];
				activePuzzle.unbind();
				activePuzzle.updateMatrix({scale: puzzle.config.NORM_SCALE});
				dx = event.offsetX - activePuzzle.x;
				dy = event.offsetY - activePuzzle.y;
				activePuzzle.bubbleUp(); // done current puzzle upper layer
				puzzle.SceneObject.draw();
				break;
			}
		}
	}, false);

	canvas.addEventListener("mousemove", function(event) {
		if (isInputActive && activePuzzle) {
			// parallel translation of the start point of puzzle relative to point selected by the user
			activePuzzle.updateMatrix({
				x: event.offsetX - dx,
				y: event.offsetY - dy
			});
			puzzle.SceneObject.draw();
		}
	}, false);

	canvas.addEventListener("mouseup", mouseCansel, false);
	canvas.addEventListener("mouseout", mouseCansel, false); // processing of out of canvas

	uploader.addEventListener("change", function(event) {
		puzzle.core.utils.uploadImage.call(this, function(){
			var image = this;
			clearGame();
			if ((puzzle.config.IMAGE_MAX_SIZE >= image.width && puzzle.config.IMAGE_MAX_SIZE >= image.height) || 
				(puzzle.config.IMAGE_MIN_SIZE <= image.width && puzzle.config.IMAGE_MIN_SIZE <= image.height)) {
				var widthRes = puzzle.core.utils.puzAlg(image.width);
				var heightRes = puzzle.core.utils.puzAlg(image.height);
				var countW = widthRes[0];
				var countH = heightRes[0];
				var puzWidth = widthRes[1];
				var puzHeight = heightRes[1];
				var newWidth = countW * puzWidth;
				var newHeight = countH * puzHeight;
				image = puzzle.core.utils.resizeImage(image, newWidth, newHeight);
				var parts = puzzle.core.utils.splitSize1(puzWidth, puzHeight, countW, countH);
				startGame(image, parts);
				puzzle.core.utils.setHash("game");
			}
			else {
				alert("Change size of image!");
			}
			
		});
	}, false);

	function startGame(image, parts){
		var imageData = puzzle.core.utils.getImageDataFromImage(image);
		var tokenRect, placeHolder, puz;
		var px = (canvas.width >> 1) - (imageData.width >> 1);
		var py = (canvas.height >> 1) - (imageData.height >> 1);

		var imgData = puzzle.core.utils.getImageDataFromSize(
			imageData.width, 
			imageData.height);
		puzzle.core.utils.fillDataByColor(imgData.data, 43, 45, 51, 255);
		var bg = new puzzle.SceneObject.Texture(imgData);
		bg.updateMatrix({
			x: px,
			y: py
		});

		for (var i = 0; i < parts.length; ++i) {
			tokenRect = parts[i];
			placeHolder = new puzzle.core.PlaceHolder();
			placeHolder.copy(tokenRect);
			placeHolder.x += px;
			placeHolder.y += py;
			placeHolders.push(placeHolder);
			puz = new puzzle.SceneObject.Puzzle(puzzle.core.utils.cutSlice(
				imageData, tokenRect));

			do {
				var randomX = (Math.random() * canvas.width - puzzle.config.BORDER_MARGIN * 2) | 0;
				var randomY = (Math.random() * canvas.height - puzzle.config.BORDER_MARGIN * 2) | 0;
			} while(bg.hasPoint(randomX, randomY));

			puz.updateMatrix({
				x: randomX,
				y: randomY,
				scale: puzzle.config.MIN_SCALE
			});
			placeHolder.link(puz.base64);
		}
		puzzle.SceneObject.draw();
	};

	function clearGame() {
		puzzle.SceneObject.instances.length = 0;
		placeHolders.length = 0;
	};

	function mouseCansel(event) {
		isInputActive = false;
		var tokenPlaceHolder = null;
		var hasAnyCollizions = false;
		var holdedPuzzle;
		if (activePuzzle) {
			for (var i = 0; i < placeHolders.length; ++i) {
				tokenPlaceHolder = placeHolders[i];
				if (tokenPlaceHolder.hasPoint(
						activePuzzle.x + (activePuzzle.width >> 1),
						activePuzzle.y + (activePuzzle.height >> 1))) {
					hasAnyCollizions = true;
					/*activePuzzle.updateMatrix({
						x: tokenPlaceHolder.x,
						y: tokenPlaceHolder.y,
						scale: puzzle.config.NORM_SCALE
					});*/
					holdedPuzzle = tokenPlaceHolder.holdedPuzzle;
					if (holdedPuzzle /*&& holdedPuzzle !== activePuzzle*/) {
						/*holdedPuzzle.updateMatrix({
							x: holdedPuzzle.x + puzzle.config.PUZZLE_THROW_OFFSET,
							y: holdedPuzzle.y + puzzle.config.PUZZLE_THROW_OFFSET,
							scale: puzzle.config.MIN_SCALE
						});
						holdedPuzzle.bubbleUp();
						holdedPuzzle.placeHolder = null;*/
						// bad audio if puzzle on puzzle
						new puzzle.Audio("src/sounds/Hit_Hurt5.wav").play();
					}
					else {
						activePuzzle.updateMatrix({
							x: tokenPlaceHolder.x,
							y: tokenPlaceHolder.y,
							scale: puzzle.config.NORM_SCALE
						});
						tokenPlaceHolder.holdedPuzzle = activePuzzle;
						activePuzzle.placeHolder = tokenPlaceHolder;
						new puzzle.Audio("src/sounds/Hit_Hurt0.wav").play();
					}
					
					break;
				}
			}
			if (!hasAnyCollizions) {
				activePuzzle.updateMatrix({scale: puzzle.config.MIN_SCALE});
				activePuzzle.placeHolder = null;
			}
			puzzle.SceneObject.draw();
			if (isReady()) {
				isWictory();
			}
		}
		activePuzzle = null;
	};

	function isReady() {
		var i;
		var instances = puzzle.SceneObject.instances;
		for (i = 0; i < instances.length; ++i) {
			if (instances[i] instanceof puzzle.SceneObject.Puzzle) {
				if (instances[i].placeHolder === null) {
					return false;
				}
			}
		}
		return true;
	};

	function isWictory() {
		if (puzzle.controller.isWin()) {
			new puzzle.Audio("src/sounds/win.wav").play();
			alert("WIN! You gather the puzzle correctly (:");
		}
		else {
			new puzzle.Audio("src/sounds/loser.wav").play();
			alert("Нou have failed! Try again (:");
		}
	};

}() );