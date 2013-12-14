/**
 * Module dependencies.
 */

var _ = require('lodash'),
	util = require('util');


/**
 * Captains Log 
 *
 * @param {Object} options
 * @param {Object} loggerOverride	[overrides Winston if specified]
 */

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
 *
 * Using your own custom logger
 * ====================================
 * 
 * To use a library other than Winstone, a `logger` must be
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

module.exports = function CaptainsLog ( options, loggerOverride ) {
	var self = this;


	/**
	 * Options
	 *
	 * @option level		[current log level for the console transport]
	 * @option logLevels	[optional - log levels object for winston.setLevels, defaults to npm conventions]
	 * @option transports	[array of transport configs to use (overrides default)]
	 * @option colorize		[]
	 * @option json			[]
	 * 
	 * @type {Object}
	 */
	if (typeof options !== 'object') {
		options = {};
	}


	
	var logger;



	// If a logger override was specified, use it.
	if ( loggerOverride ) {
		logger = loggerOverride;
		
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
	var winston = require('winston');



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

	// Default log level is `debug`
	var defaultLogLevel = 'debug';

	// Default transports
	if ( !options.transports ) {

		var genericOptions = _.cloneDeep(options);
		_.defaults(genericOptions, {
			level: defaultLogLevel
		});

		// Build the transports array
		options.transports = [
			new (winston.transports.Console)(_.extend({
				json: false,
				colorize: true,
				timestamp: false
			}, genericOptions))
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


	// Default log levels
	options.logLevels = _.defaults(options.logLevels || {}, {
		silly: 0,
		verbose: 1,
		info: 2,
		// notice: 2,
		debug: 3,
		// alert: 4,
		warn: 4,
		// warning: 4,
		error: 5,
		// crit: 6,
		// emerg: 6,
		// fail: 6,
		silent: 7
	});


	// Instantiate logger
	logger = new (winston.Logger)({
		levels: options.logLevels,
		transports: options.transports
	});
	
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
		var _logger = function () {
			logger.debug.call(logger, arguments);
		};

		// Mix-in log methods, but run `_inspect`
		// on their arguments to improve the readability
		// of log output.
		// 
		// TODO: make this behavior configurable in `options`
		// (possibly on a per-transport basis)
		_logger.error = function () { return logger.error(_inspect.call(arguments)); };
		_logger.warn = function () { return logger.warn(_inspect.call(arguments)); };
		_logger.debug = function () { return logger.debug(_inspect.call(arguments)); };
		_logger.info = function () { return logger.info(_inspect.call(arguments)); };
		_logger.verbose = function () { return logger.verbose(_inspect.call(arguments)); };
		_logger.silly = function () { return logger.silly(_inspect.call(arguments)); };
		
		return _logger;
	}



	/**
	 * Combine arguments into a string
	 * @return {String} [a mashup of all arguments]
	 * @api private
	 */
	function _inspect() {

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
		return str;
	}

};








	
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

