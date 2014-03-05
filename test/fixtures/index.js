/**
 * Dependencies
 */
var _ = require('lodash');



/**
 * Fixtures to be used directly by mocha's `before`, `after`, `beforeEach`,
 * `afterEach`, and `it` methods.
 * 
 * @type {Object}
 */
module.exports = {

	log: {

		silly: function () {
			var args = Array.prototype.slice.call(arguments);
			return function () {
				_recordAll(this);
				this.log.silly.apply(args);
				_pauseAll(this);
			};
		},

		verbose: function () {
			var args = Array.prototype.slice.call(arguments);
			return function () {
				_recordAll(this);
				this.log.verbose.apply(args);
				_pauseAll(this);
			};
		},

		info: function () {
			var args = Array.prototype.slice.call(arguments);
			return function () {
				_recordAll(this);
				this.log.info.apply(args);
				_pauseAll(this);
			};
		},

		blank: function () {
			var args = Array.prototype.slice.call(arguments);
			return function () {
				_recordAll(this);
				this.log.blank.apply(args);
				_pauseAll(this);
			};
		},
		
		_call: function () {
			var args = Array.prototype.slice.call(arguments);
			return function () {
				_recordAll(this);
				this.log.apply(args);				
				_pauseAll(this);
			};
		},

		debug: function () {
			var args = Array.prototype.slice.call(arguments);
			return function () {
				_recordAll(this);
				this.log.debug.apply(args);
				_pauseAll(this);
			};
		},

		warn: function () {
			var args = Array.prototype.slice.call(arguments);
			return function () {
				_recordAll(this);
				this.log.warn.apply(args);
				_pauseAll(this);
			};
		},

		error: function () {
			var args = Array.prototype.slice.call(arguments);
			return function () {
				_recordAll(this);
				this.log.error.apply(args);
				_pauseAll(this);
			};
		}
	}
};









// Helpers
// 
function _recordAll (ctx) {
	_.each(ctx.interceptors, function (interceptor, id) {
		interceptor.capture(function intercept (string, encoding, fd) {
			ctx.logs[id].push(string);
			return false;
		});
	});
}

function _pauseAll (ctx) {
	_.each(ctx.interceptors, function (interceptor, id) {
		interceptor.release();
	});
}

