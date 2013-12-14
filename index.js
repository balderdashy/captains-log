/**
 * Module dependencies.
 */

var _ = require('lodash'),
	util = require('util'),
	winston = require('winston');


/**
 * Captains Log encapsulates Winston, a project by @indexzero,
 * the guys and gals over at Nodejitsu, and a vibrant community.
 * 
 * More info/docs on Winston:
 * https://github.com/flatiron/winston
 */

module.exports = function CaptainsLog ( options ) {
	var self = this;

	if (typeof options !== 'object') {
		options = {};
	}

	/**
	 * Options
	 *
	 * @option level		[log level]
	 * @option transports	[array of transport configs to use]
	 * @option maxSize		[]
	 * @option maxFiles		[]
	 * @option colorize		[]
	 * 
	 * @type {Object}
	 */

	// Default options
	_.defaults(options, {
		level: 'info',
		transports: [{
			transport: 'console'
		}],
		maxSize: 10000000,
		maxFiles: 10,
		json: false,
		colorize: true
	});

	

	// If filePath option is set, ALSO write log output to a flat file
	if (!_.isUndefined(options.filePath)) {
		transports.push(
			new(winston.transports.File)({
				filename: options.filePath,
				maxsize: options.maxSize,
				maxFiles: options.maxFiles,
				level: options.level,
				json: options.json,
				colorize: false,
				stripColors: true
			}));
	}


	// Winston's available transports
	var transports = [
		new(winston.transports.Console)({
			level: options.level,
			colorize: options.colorize
		})
	];

	// Winston's log levels
	var winstonLogLevels = {
	    silly: 0,
	    verbose: 1,
	    info: 2,
	    notice: 2,
	    debug: 3,
	    alert: 4,
	    warn: 4,
	    warning: 4,
	    error: 5,
	    crit: 6,
	    emerg: 6,
	    fail: 6,
	    silent: 7
	};

	// Colors to use for various log levels
	var logColors = {
	    silly: 'cyan',
	    verbose: 'cyan',
	    info: 'green',
	    notice: 'green',
	    debug: 'blue',
	    alert: 'yellow',
	    warn: 'yellow',
	    warning: 'yellow',
	    error: 'red',
	    crit: 'red',
	    emerg: 'red',
	    fail: 'red',
	    silent: 'white'
	};

	// if adapter option is set, ALSO write log output to an adapter
	if (!_.isUndefined(options.adapters)) {
		_.each(options.adapters, function(val, transport) {
			if (typeof val.module !== 'undefined') {

				// The winston module MUST be exported to a variable of same name
				var module = require(val.module)[transport];

				// Make sure it was exported correctly
				if (module) {
					transports.push(
						new(module)(val)
					);
				}
			}
		});
	}


	// Instantiate winston
	var logger = new(winston.Logger)({
		levels: winstonLogLevels,
		colors: logColors,
		transports: transports
	});



	// Make sure all supported log methods exist

	// We assume that at least something called
	// `logger.debug` or `logger.log` exists.
	if (!logger.log) {
		throw new Error(
			'Unsupported logger!\n' +
			'(has no `.log()` or `.debug()` method.)'
		);
	}

	// Fill in the gaps where they don't
	logger.debug = logger.debug || logger.log;
	logger.info = logger.info || logger.log;
	logger.warn = logger.warn || logger.error || logger.log;
	logger.error = logger.error || logger.log;
	logger.verbose = logger.verbose || logger.log;
	logger.silly = logger.verbose || logger.log;



	// Now generate the configured logging methods:

	// Supported log methods
	var log = _generateLogFn('debug');
	log.log = _generateLogFn('debug');
	log.error = _generateLogFn('error');
	log.warn = _generateLogFn('warn');
	log.debug = _generateLogFn('debug');
	log.info = _generateLogFn('info');
	log.verbose = _generateLogFn('verbose');
	log.silly = _generateLogFn('silly');

	// Export logger object
	return log;




	/**
	 * @returns a configured-level-aware log function
	 *          at the specified log level
	 */

	function _generateLogFn(level) {
		return function() {

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

			var fn = logger[level];
			fn(str);
		};
	}
};
