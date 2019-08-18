/**
 * Module dependencies.
 */

var util = require('util');
var _ = require('@sailshq/lodash');
var rc = require('rc');
var wrap = require('./lib/wrap');
var configure = require('./lib/configure');
var captains = require('./lib/captains');



/**
 * Captains Log
 *
 * @param {Object} overrides
 *           , {Object}  custom       : a custom logger to use, i.e. Winston
 *           , {Object}  logLevels    : optional - named log levels, defaults to npm conventions
 *           , {String}  level        : the current log level- e.g. silly, verbose, info, debug, warn, error, or silent
 *           , {Boolean} inspect      : defaults to true-- whether to make the log output more readable (combines all args into one string)
 *           , {Object}  inspectOptions : defaults to {}-- options to pass to the inspect function. One example can be {colors: true, depth:null}
 *                                        printing objects in colors. See: https://nodejs.org/api/util.html#util_util_inspect_object_options
 *
 * @return {Function{}} enhanced (callable) version of logger
 */

module.exports = function CaptainsLog(overrides) {

  // <todo>
  //
  // smart caching
  // i.e. if (process._captainslog) return process._captainslog
  // (but only if the overrides passed in are identical)
  //
  // </todo>

  // Apply overrides to the default configuration
  var options = configure(overrides);

  // If no override was specified, we'll instantiate
  // our default logger, `captains`.
  var logger = captains();

  // If a custom logger override was specified,
  // lets try to use it.
  if (options.custom) {
    logger = options.custom;

    // Make sure enough log methods exist to meet our requirements.
    //
    // We assume that at least something called
    // `logger.log` or `logger.debug` exists.
    if (!_.isObject(logger) || !_.isFunction(logger.log)) {
      throw new Error(
        'Unsupported logger override provided as `custom`!\n' +
        '(has no `.log()` or `.debug()` method.)\n'+
        'Here\'s what was passed in:\n'+util.inspect(logger,{depth:null})
      );
    }//-•

    // Fill in the gaps for the required log methods with
    // reasonable guesses if the custom logger is missing any
    // (only required method is `logger.log` or `logger.debug`)
    // If no reasonable alternative is possible, don't log

    logger.debug = logger.debug ? logger.debug.bind(logger) : _.noop;
    logger.info = logger.info ? logger.info.bind(logger) : _.noop;
    logger.error = logger.error ? logger.error.bind(logger) : _.noop;
    logger.warn = logger.warn ? logger.warn.bind(logger) : (logger.error ? logger.error.bind(logger) : _.noop);
    logger.crit = logger.crit ? logger.crit.bind(logger) : (logger.error ? logger.error.bind(logger) : _.noop);
    logger.verbose = logger.verbose ? logger.verbose.bind(logger) : _.noop;
    logger.silly = logger.silly ? logger.silly.bind(logger) : _.noop;
    logger.blank = logger.blank ? logger.blank.bind(logger) : _.noop;
  }

  // Make logger callable and stuff (wrap it)
  var callableLogger = wrap(logger, options);

  // Also expose logger on `global` if `globalizeAs` is enabled
  var GLOBAL = (typeof global !== undefined ? global : typeof window !== undefined ? window : Function);
  if (options.globalizeAs) { GLOBAL[options.globalizeAs] = callableLogger; }


  return callableLogger;

};
