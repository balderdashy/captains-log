/**
 * A test fixture which is a drop-in replacement
 * for `console`.  Useful for unit tests.
 * 
 * @return console
 */


// NOTE: currently unused.

var FakeConsole = function () {

	var _stack = [];
	var _log = function () {
		_stack.push({
			args: args,
			method: 'log'
		});
	};

	this.log = function () {
		var args = Array.prototype.slice.call(arguments);
		_log.apply(this, args, 'log');
	};
	this.warn = function () {
		var args = Array.prototype.slice.call(arguments);
		_log.apply(this, args, 'warn');
	};
	this.error = function () {
		var args = Array.prototype.slice.call(arguments);
		_log.apply(this, args, 'error');
	};
};

module.exports = FakeConsole;