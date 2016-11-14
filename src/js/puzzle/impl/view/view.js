(function() {
	"use strict";

	var gl = null;
	var programs = {
		"tex": null,
		"pos": null
	};

	puzzle.view = {
		init: function(element){
			var vertices;

			gl = element.getContext("webgl");
			if (gl){
				this.updateSize();
				programs.tex = getProgram(gl, "#shader-vs-tex", "#shader-fs-tex");
				vertices = new Float32Array([
					0, 0,
					0, 1,
					1, 0,
					1, 0,
					0, 1,
					1, 1
				]);
				initAttribBuffer(gl, gl.ARRAY_BUFFER, gl.getAttribLocation(programs.tex, "a_position"), 2, vertices);
				initAttribBuffer(gl, gl.ARRAY_BUFFER, gl.getAttribLocation(programs.tex, "a_texcoord"), 2, vertices);
			
				programs.pos = getProgram(gl, "#shader-vs-pos", "#shader-fs-pos");
			} else{
				console.error("Can't get the WebGL context");
			}
		},

		drawPoly: function(polyList, r, g, b, a) {
			gl.useProgram(programs.pos);

			initAttribBuffer(gl, gl.ARRAY_BUFFER, gl.getAttribLocation(programs.pos, "a_coords"), 2, new Float32Array(polyList));
			gl.uniform4f(gl.getUniformLocation(programs.pos, "u_color"), r, g, b, a);
			gl.drawArrays(gl.LINES, 0, polyList.length >>> 1);
		},

		drawTexture: function(texture) {
			gl.useProgram(programs.tex);

			var matrixLocation = gl.getUniformLocation(programs.tex, "u_matrix");

			void this.createTexture(texture.imageData);

			// Set the matrix.
			gl.uniformMatrix4fv(matrixLocation, false, texture.matrix.data);

			//gl.disable(gl.SCISSOR_TEST);

			// set the scissor rectangle
			//gl.scissor(texture.getX(), texture.getY(), texture.getWidth(), texture.getHeight());

			gl.drawArrays(gl.TRIANGLES, 0, 6);
			gl.bindTexture(gl.TEXTURE_2D, null);

			// turn on scissor test again
			//gl.enable(gl.SCISSOR_TEST);
		},

		updateSize: function() {
			var canvasElement = gl.canvas;
			canvasElement.width = document.body.clientWidth;
			canvasElement.height = document.body.clientHeight;
			gl.viewport(0.0, 0.0, canvasElement.width, canvasElement.height);
		},

		getWidth: function() {
			return gl.canvas.width;
		},

		getHeight: function() {
			return gl.canvas.height;
		},

		createTexture: function(image) {
			var tex = gl.createTexture();
			gl.bindTexture(gl.TEXTURE_2D, tex);

			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

	    	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

			return tex;
		},

		clearColor: function(r, g, b, a){
			gl.clearColor(r, g, b, a);
			gl.clear(gl.COLOR_BUFFER_BIT);
		}
	};

	function getCodeFromTag(tag){
		var shaderSource = "";
		var textLine = tag.firstChild;
		while(textLine){
			if (textLine.nodeType === 3){
				shaderSource += textLine.textContent;
			}
			textLine = textLine.nextSibling;		
		}
		return shaderSource;
	};

	function compileShader(gl, code, type){
		var shader = gl.createShader(type);
		gl.shaderSource(shader, code); // load source code
		gl.compileShader(shader);
		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
			console.error("Can't compile " + type + "! ", gl.getShaderInfoLog(shader));
		}
		return shader;
	};

	function build(gl, vertexShader, fragmentShader){
		var program = gl.createProgram();
		gl.attachShader(program, vertexShader);
		gl.attachShader(program, fragmentShader);
		gl.linkProgram(program);
		if (!gl.getProgramParameter(program, gl.LINK_STATUS)){
			console.error("Cant link program! ", gl.getProgramInfoLog(program));
		}

		gl.validateProgram(program);
		if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)){
			console.error("Cant validate program! ", gl.getProgramInfoLog(program));
		}

		gl.useProgram(program);
		
		gl.deleteShader(vertexShader);
		gl.deleteShader(fragmentShader);

		return program;
	};

	function initAttribBuffer(gl, glFLAG, attr, size, data) {
		var buffer = gl.createBuffer();
		gl.bindBuffer(glFLAG, buffer);
		gl.enableVertexAttribArray(attr);
		gl.vertexAttribPointer(attr, size, gl.FLOAT, gl.FALSE, 0, 0);
		gl.bufferData(glFLAG, data, gl.STATIC_DRAW);
		gl.bindBuffer(glFLAG, null);
	};

	function getProgram(gl, vertexId, fragmentId){
		var fragmentCode = getCodeFromTag(document.querySelector(fragmentId));
		var vertexCode = getCodeFromTag(document.querySelector(vertexId));

		var fragmentShader = compileShader(gl, fragmentCode, gl.FRAGMENT_SHADER);
		var vertexShader = compileShader(gl, vertexCode, gl.VERTEX_SHADER);

		return build(gl, vertexShader, fragmentShader);
	};

}());