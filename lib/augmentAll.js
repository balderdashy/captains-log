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
	var _CallableLogger = augment(logger.debug, options);

	// Mix-in log methods, but run `augment`
	// on their arguments to improve the readability
	// of log output.
	_CallableLogger.error = augment(logger.error, options);
	_CallableLogger.warn = augment(logger.warn, options);
	_CallableLogger.debug = augment(logger.debug, options);
	_CallableLogger.info = augment(logger.info, options);
	_CallableLogger.verbose = augment(logger.verbose, options);
	_CallableLogger.silly = augment(logger.silly, options);
	
	return _CallableLogger;
};
