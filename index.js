/**
 * Module dependencies.
 */

var _ = require('lodash'),
	util = require('util'),
	rc = require('rc');


/**
 * Captains Log 
 *
 * @param {Object} overrides
 *
 * @option {Object} custom			[overrides Winston if specified]
 * @option {Array} transports		[array of already-configured&instantiated Winston transports-- overrides the defaults!!!]
 * @option {Object} logLevels		[optional - log levels object for winston.setLevels, defaults to npm conventions]
 * @option {String} level			[silly, verbose, info, debug, warn, error, or silent]
 * @option {Boolean} inspect		[defaults to true-- whether to make the log output more readable (combines all args into one string)]
 * 
 */

var DEFAULT_OPTIONS = {
	level: 'info',
	inspect: true,
	logLevels: {
		silly: 0,
		verbose: 1,
		info: 2,
		debug: 3,
		warn: 4,
		error: 5,
		// crit: 6,
		// emerg: 6,
		// fail: 6,
		silent: 7
	}
};


// By default, look for options in:
//   + `.captainlogrc` files
//   + `CAPTAINSLOG-*` env variables
//
// More on `rc` conventions:
// https://github.com/dominictarr/rc#standards
var DEFAULT_RC_NAME = 'captainslog';



/**
 *
 * Default logger = Winston
 * ====================================
 * 
 * By default, this module encapsulates Winston, a popular logger
 * by @indexzero and the gals/guys over at Nodejitsu.
 * 
 * More info/docs on Winston:
 * https://github.com/flatiron/winston
 *
 */

/**
 *
 * Using your own custom logger
 * ====================================
 * 
 * To use a library other than Winstone, `overrides.custom` must be
 * passed in with, at minimum, an n-ary `log` method, e.g.:
 *
 * var log = new CaptainsLog({}, someLogger);
 * log.log()
 * log.log('blah')
 * log.log('blah', 'foo')
 * log.log('blah', 'foo', {bar: 'baz'})
 * log.log('blah', 'foo', {bar: 'baz'}, ['a', 3], 2, false);
 * // etc.
 */

module.exports = function CaptainsLog ( overrides ) {
	var self = this;

	// Grab winston inside of the constructor just to be safe.
	// (since it seems to maintain some global state)
	var winston = require('winston');


	// Options passed in programmatically are highest priority.
	if (typeof overrides !== 'object') { overrides = {}; }
	var options = _.cloneDeep(overrides);

	// Then `rc` configuration conventions.
	// (https://github.com/dominictarr/rc#standards)
	var appName = overrides.appName || DEFAULT_RC_NAME;
	var rconf = rc(appName);
	rconf.level = rconf.level ||  // Accept command-line shortcuts:
	rconf.verbose ? 'verbose' :   // --verbose
	rconf.silent ? 'silent' :     // --silent
	rconf.silly ? 'silly' :       // --silly
	undefined;
	// Then the implicit defaults. (DEFAULT_OPTIONS above) 
	_.defaults(options, rconf, DEFAULT_OPTIONS);


	// Tranports
	// 
	// NOTE:
	// Custom transports may be registed by passing them in
	// the `options.transports` config.  However, this approach
	// will replace the built-in transports, so use w/ care.
	if (	options.transports &&
			!_.isArray(options.transports)
		) {
		throw new Error('Invalid `options.transports`.\n\n' +
			'Should be an array of instantiated Winston transports, e.g.:\n' +
			'new (winston.transports.Console)({' + '\n' + 
		    '  level: "silly",' + '\n' + 
		    '  colorize: "true",' + '\n' + 
		    '  label: "foo"' + '\n' + 
		    '}),' + '\n' + 
		    'new (winston.transports.File)({' + '\n' + 
		    '  filename: "/path/to/some/file"' + '\n' + 
		    '})'
		);
	}


	// Default transports
	if ( !options.transports ) {

		var consoleOptions = _.extend({
			json: false,
			colorize: true,
			timestamp: false
		}, options);

		// Build the transports array
		options.transports = [
			new (winston.transports.Console)(consoleOptions)
		];


		// TODO:
		// Consider adding default file log in the future.
		// (would need to figure out where to stream them)
		// 
		// file: {
		// 	json: true,
		// 	colorize: false,
		// 	timestamp: true,
		// 	maxSize: 10000000,
		// 	maxFiles: 10
		// }
	}

	
	var logger;





	// If a logger override was specified, use it.
	if ( options.custom ) {
		logger = options.custom;
		
		// Make sure all supported log methods exist

		// We assume that at least something called
		// `logger.log` exists.
		if (!logger.log) {
			throw new Error(
				'Unsupported logger override!\n' +
				'(has no `.log()` method.)'
			);
		}

		// Fill in the gaps for the log methods 
		// used by Sails core in case they're missing.
		logger.debug = logger.debug || logger.log;
		logger.info = logger.info || logger.log;
		logger.warn = logger.warn || logger.error || logger.log;
		logger.error = logger.error || logger.log;
		logger.verbose = logger.verbose || logger.log;
		logger.silly = logger.silly || logger.log;

		// Return logger
		return _buildLogger(logger);
	}



	// No override was specified, so we'll use winston.

	
	// Instantiate logger
	logger = new (winston.Logger)({
		levels: options.logLevels,
		transports: options.transports
	});
	

	// Return callable version of core logger
	return _buildLogger(logger);




	/**
	 * Return a special version of `logger` which may
	 * be called directly as a function (implicitly calls
	 * `logger.debug` behind the scenes)
	 * 
	 * @param  {Object} logger [original logger]
	 * @return {Function}      [callable logger]
	 * @api private
	 */
	function _buildLogger( logger ) {

		// Make base logger callable (debug)
		var _logger = _inspect(logger.debug);

		// Mix-in log methods, but run `_inspect`
		// on their arguments to improve the readability
		// of log output.
		_logger.error = _inspect(logger.error);
		_logger.warn = _inspect(logger.warn);
		_logger.debug = _inspect(logger.debug);
		_logger.info = _inspect(logger.info);
		_logger.verbose = _inspect(logger.verbose);
		_logger.silly = _inspect(logger.silly);
		
		return _logger;
	}



	/**
	 * Build a log function which combines arguments into a string,
	 * enhancing them for readability.
	 *
	 * TODO: make this behavior configurable in `options` 
	 * in the future (possibly on a per-transport basis)
	 * 
	 * @return {Function} [log fn]
	 * @api private
	 */
	function _inspect( logFn ) {
		return function () {
			var args = Array.prototype.slice.call(arguments);

			// If options.inspect is disabled, just call the log fn normally
			if ( ! options.inspect ) {
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
	}

};



























	// Hmm.. this approach doesn't seem to work:
	// 
	// Register available transports, adding a category called 'sails'.
	// winston.loggers.add('sails', options.transports);
	// Instantiate a logger.  We'll call it the `sails` logger.
	// logger = winston.loggers.get('sails');

	// Ensure levels on the winston logger
	// are configured to use npm conventions.

	// Here are the log levels, for reference:
	/*
	{
		silly: 0,
		verbose: 1,
		info: 2,
		debug: 3,
		warn: 4,
		error: 5
	}
	*/


	// TODO: wtf winston??? what is going on here??
	// (the built-in `npm` levels don't seem to match npm's 
	// documentation)
	// 
	// logger.setLevels(options.logLevels || winston.config.npm.levels);
	// 



	





	// new (winston.Logger)({
	// 	transports: transports
	// });

	// Now generate the configured logging methods:

	// Supported log methods
	// var log = _generateLogFn('debug');
	// log.log = _generateLogFn('debug');
	// log.error = _generateLogFn('error');
	// log.warn = _generateLogFn('warn');
	// log.debug = _generateLogFn('debug');
	// log.info = _generateLogFn('info');
	// log.verbose = _generateLogFn('verbose');
	// log.silly = _generateLogFn('silly');

	// Export logger object
	// return log;

	/**
	 * @returns a configured-level-aware log function
	 *          at the specified log level
	 */

	// function _generateLogFn(level) {
	// 	return function() {


	// 		var fn = logger[level];
	// 		fn(str);
	// 	};
	// }
	// 
	// 
	// 
	// 
	// If filePath option is set, ALSO write log output to a flat file
	// if (!_.isUndefined(options.filePath)) {
	// 	transports.push(
	// 		new(winston.transports.File)({
	// 			filename: options.filePath,
	// 			maxsize: options.maxSize,
	// 			maxFiles: options.maxFiles,
	// 			level: options.level,
	// 			json: options.json,
	// 			colorize: false,
	// 			stripColors: true
	// 		}));
	// }


	// // Winston's log levels
	// var winstonLogLevels = {
	//     silly: 0,
	//     verbose: 1,
	//     info: 2,
	//     notice: 2,
	//     debug: 3,
	//     alert: 4,
	//     warn: 4,
	//     warning: 4,
	//     error: 5,
	//     crit: 6,
	//     emerg: 6,
	//     fail: 6,
	//     silent: 7
	// };

	// // Colors to use for various log levels
	// var logColors = {
	//     silly: 'cyan',
	//     verbose: 'cyan',
	//     info: 'green',
	//     notice: 'green',
	//     debug: 'blue',
	//     alert: 'yellow',
	//     warn: 'yellow',
	//     warning: 'yellow',
	//     error: 'red',
	//     crit: 'red',
	//     emerg: 'red',
	//     fail: 'red',
	//     silent: 'white'
	// };

	// if adapter option is set, ALSO write log output to an adapter
	// if (!_.isUndefined(options.adapters)) {
	// 	_.each(options.adapters, function(val, transport) {
	// 		if (typeof val.module !== 'undefined') {

	// 			// The winston module MUST be exported to a variable of same name
	// 			var module = require(val.module)[transport];

	// 			// Make sure it was exported correctly
	// 			if (module) {
	// 				transports.push(
	// 					new(module)(val)
	// 				);
	// 			}
	// 		}
	// 	});
	// }

