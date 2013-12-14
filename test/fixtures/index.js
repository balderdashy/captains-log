/**
 * Dependencies
 */
var Fixture = require('fixture-stdout');
var _ = require('lodash');



/**
 * Fixtures to be used directly by mocha's `before`, `after`, `beforeEach`,
 * `afterEach`, and `it` methods.
 * 
 * @type {Object}
 */
module.exports = {

	interceptor: function ( id, stream ) {
		return {
			new: function () {
				this.interceptors[id] = new Fixture(stream);
				this.logs[id] = [];
			},
			empty: function () {
				this.logs[id] = [];
			}
			// record: function ( ) {
			// 	var self = this;
			// 	this.interceptors[id].capture(function intercept (string, encoding, fd) {
			// 		self.logs[id].push(string);
			// 		return false;
			// 	});
			// },
			// pause: function ( ) {
			// 	this.interceptors[id].release();
			// }
		};
	},





	log: {
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
				this.log.apply(args);
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

