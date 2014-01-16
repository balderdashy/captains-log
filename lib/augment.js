/**
 * Module dependencies.
 */

var _ = require('lodash'),
	util = require('util');



/**
 * Build a log function which combines arguments into a string,
 * enhancing them for readability.  If specified, prefixes will be
 * added.
 *
 * @param  {Function} [log fn]
 * @param  {Object}
 * @return {Function} [enhanced log fn]
 * @api private
 */

module.exports = function (logFn, options) {
	return function _writeLogToConsole() {

		// Add prefixes
		if (options.prefixes) {
			// TODO
		}

		
		var args = Array.prototype.slice.call(arguments);

		// If `options.inspect` is disabled, just call the log fn normally
		if (!options.inspect) {
			return logFn.apply(logFn, args);
		}

		// Compose `str` of all the arguments
		var pieces = [];
		var str = '';
		_.each(arguments, function(arg) {
			if (typeof arg === 'object') {
				if (arg instanceof Error) {
					pieces.push(arg.stack);
					return;
				}
				pieces.push(util.inspect(arg));
				return;
			}

			if (typeof arg === 'function') {
				pieces.push(arg.valueOf());
				return;
			}

			pieces.push(arg);
		});
		str = pieces.join(' ');

		// Call log fn
		return logFn.apply(logFn, [str]);
	};
};
