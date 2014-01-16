/**
 * Module dependencies.
 */

var _ = require('lodash')
	, util = require('util')
	, rc = require('rc')
	, augmentAll = require('./lib/augmentAll')
	, configure = require('./lib/configure')
	, logger = require('./lib/captains');



/**
 * Captains Log 
 *
 * @param {Object} overrides
 *           , {Object}  custom       : a custom logger to use, i.e. Winston
 *           , {Object}  logLevels    : optional - named log levels, defaults to npm conventions
 *           , {String}  level        : the current log level- e.g. silly, verbose, info, debug, warn, error, or silent
 *           , {Boolean} inspect      : defaults to true-- whether to make the log output more readable (combines all args into one string)
 */

module.exports = function CaptainsLog ( overrides ) {

	// Apply overrides to the default configuration
	var options = configure(overrides);

	// If a custom logger override was specified,
	// lets try to use it.
	if ( options.custom ) {
		logger = options.custom;
		
		// Make sure enough log methods exist to meet our requirements.
		//
		// We assume that at least something called
		// `logger.log` exists.
		if (!logger.log) {
			throw new Error(
				'Unsupported logger override!\n' +
				'(has no `.log()` method.)'
			);
		}

		// Fill in the gaps for the required log methods
		// if they're missing (only required method is `logger.debug`)
		logger.debug = logger.debug || logger.log;
		logger.info = logger.info || logger.log;
		logger.warn = logger.warn || logger.error || logger.log;
		logger.error = logger.error || logger.log;
		logger.verbose = logger.verbose || logger.log;
		logger.silly = logger.silly || logger.log;

		// Return enhanced (callable) version of custom logger
		return augmentAll(logger);
	}


	// No override was specified, so we'll instantiate
	// our simple core logger, `captains`, then return
	// a enhanced (callable) version of it:
	return augmentAll(logger);

};
