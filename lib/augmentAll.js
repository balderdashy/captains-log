/**
 * Module dependencies.
 */

var augment = require('./augment');


/**
 * Return a special version of `logger` which may
 * be called directly as a function (implicitly calls
 * `logger.debug` behind the scenes)
 * 
 * @param  {Object} logger [original logger]
 * @return {Function}      [callable Logger]
 * @api private
 */

module.exports = function _makeCallable ( logger, options ) {

	// Make base logger callable (debug)
	var _CallableLogger = augment(logger.debug, 'debug', options);

	// Mix-in log methods, but run `augment`
	// on their arguments to improve the readability
	// of log output.
	['crit', 'error', 'warn', 'debug', 'info', 'verbose', 'silly']
	.forEach(function (logAt) {
		_CallableLogger[logAt] = augment(logger[logAt], logAt, options);
	});

	return _CallableLogger;
};
