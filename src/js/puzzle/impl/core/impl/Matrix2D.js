(function(parent) {
	"use strict";

	parent.Matrix2D = function() {
		this.data = new Float32Array([
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		]);
	};

	parent.Matrix2D.prototype.clone = function() {
		var newMatrix = new parent.Matrix2D();
		newMatrix.data.set(this.data); // deep copy
		return newMatrix;
	}

	parent.Matrix2D.prototype.makeProjection = function(width, height, depth) {
		this.data[0] = 2 / width;
		this.data[5] = -2 / height;
		this.data[10] = 2 / depth;
		this.data[12] = -1;
		this.data[13] = 1;
	};

	parent.Matrix2D.prototype.makeTranslation = function(tx, ty, tz) {
		this.data[12] = tx;
		this.data[13] = ty;
		this.data[14] = tz;
	};

	parent.Matrix2D.prototype.makeScale = function(sx, sy, sz) {
		this.data[0] = sx;
		this.data[5] = sy;
    	this.data[10] = sz;
	};

	parent.Matrix2D.multiply = function(m1, m2) {
		var m100 = m1.data[0*4+0];
		var m101 = m1.data[0*4+1];
		var m102 = m1.data[0*4+2];
		var m103 = m1.data[0*4+3];
		var m110 = m1.data[1*4+0];
		var m111 = m1.data[1*4+1];
		var m112 = m1.data[1*4+2];
		var m113 = m1.data[1*4+3];
		var m120 = m1.data[2*4+0];
		var m121 = m1.data[2*4+1];
		var m122 = m1.data[2*4+2];
		var m123 = m1.data[2*4+3];
		var m130 = m1.data[3*4+0];
		var m131 = m1.data[3*4+1];
		var m132 = m1.data[3*4+2];
		var m133 = m1.data[3*4+3];
		var m200 = m2.data[0*4+0];
		var m201 = m2.data[0*4+1];
		var m202 = m2.data[0*4+2];
		var m203 = m2.data[0*4+3];
		var m210 = m2.data[1*4+0];
		var m211 = m2.data[1*4+1];
		var m212 = m2.data[1*4+2];
		var m213 = m2.data[1*4+3];
		var m220 = m2.data[2*4+0];
		var m221 = m2.data[2*4+1];
		var m222 = m2.data[2*4+2];
		var m223 = m2.data[2*4+3];
		var m230 = m2.data[3*4+0];
		var m231 = m2.data[3*4+1];
		var m232 = m2.data[3*4+2];
		var m233 = m2.data[3*4+3];
		var newMatrix = new parent.Matrix2D();
		newMatrix.data.set([m100 * m200 + m101 * m210 + m102 * m220 + m103 * m230,
				      m100 * m201 + m101 * m211 + m102 * m221 + m103 * m231,
				      m100 * m202 + m101 * m212 + m102 * m222 + m103 * m232,
				      m100 * m203 + m101 * m213 + m102 * m223 + m103 * m233,
				      m110 * m200 + m111 * m210 + m112 * m220 + m113 * m230,
				      m110 * m201 + m111 * m211 + m112 * m221 + m113 * m231,
				      m110 * m202 + m111 * m212 + m112 * m222 + m113 * m232,
				      m110 * m203 + m111 * m213 + m112 * m223 + m113 * m233,
				      m120 * m200 + m121 * m210 + m122 * m220 + m123 * m230,
				      m120 * m201 + m121 * m211 + m122 * m221 + m123 * m231,
				      m120 * m202 + m121 * m212 + m122 * m222 + m123 * m232,
				      m120 * m203 + m121 * m213 + m122 * m223 + m123 * m233,
				      m130 * m200 + m131 * m210 + m132 * m220 + m133 * m230,
				      m130 * m201 + m131 * m211 + m132 * m221 + m133 * m231,
				      m130 * m202 + m131 * m212 + m132 * m222 + m133 * m232,
				      m130 * m203 + m131 * m213 + m132 * m223 + m133 * m233]);
		return newMatrix;
	};

}(puzzle.core));