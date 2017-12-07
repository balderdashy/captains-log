/**
 * Module dependencies.
 */

var util = require('util');
var _ = require('@sailshq/lodash');
var semver = require('semver');

var IS_NODE_8_OR_NEWER = semver.satisfies(semver.clean(process.version), '8');

/**
 * Build a log function which combines arguments into a string,
 * enhancing them for readability.  If specified, prefixes will be
 * added.
 *
 * @param  {Function} logFn  [log fn]
 * @param  {String} logAt    [e.g. 'silly' or 'error']
 * @param  {Dictionary} options
 *
 * @return {Function}        [enhanced log fn]
 * @api private
 */

module.exports = function(logFn, logAt, options) {
  return function _writeLogToConsole() {

    // Check `options.level` against logAt
    // to see whether to write the log.
    // ( silly = 0 | silent = highest )
    var lvlMap = options.logLevels;
    var configuredLvl = options.level;
    if (lvlMap[logAt] < lvlMap[configuredLvl]) { return; }


    var args = Array.prototype.slice.call(arguments);

    /////////////////////////////////////////////////////////////////
    // For backwards-compatibility:
    // (options.inspect should always be true going forward)
    //
    // Note that prefixes and other options will not work with
    // `inspect===false`.  New features will also not support
    // inspect:false.
    //
    // If `options.inspect` is disabled, just call the log fn normally
    if (!options.inspect) {
      return logFn.apply(logFn, args);
    }
    /////////////////////////////////////////////////////////////////

    // For reference on the following impl, see:
    // https://github.com/defunctzombie/node-util/blob/master/util.js#L22

    // Combine & pre-process the arguments passed into the log fn
    var pieces = [];
    _.each(args, function(arg) {

      // JavaScript Error instances
      // > Note that if the experimental `_dontAccessErrorStacks` option is enabled,
      // > Error stacks will never accessed.  This is useful for performance tuning,
      // > as explained in: https://github.com/balderdashy/captains-log/issues/17
      if (!options._dontAccessErrorStacks && _.isError(arg) && !arg.inspect) {
        // In Node 8, the behavior of util.inspect-ing Errors changed to include
        // their stack traces, plus additional information.  So if supported,
        // we take advange of that.
        pieces.push(IS_NODE_8_OR_NEWER ? util.inspect(arg) : arg.stack);
      }
      // Non-strings
      // (miscellaneous arrays, dictionaries, mysterious objects, etc)
      else if (!_.isString(arg)) {
        if (options.inspectOptions) {
          pieces.push(util.inspect(arg, options.inspectOptions));
        }
        else { pieces.push(util.inspect(arg)); }
        return;
      }
      // Strings
      else {
        pieces.push(arg);
      }

    });

    // Compose `str` of all the arguments
    // (include the appropriate prefix if specified)
    var prefixStr = (options.prefixes && options.prefixes[logAt]) || '';
    var str = prefixStr + util.format.apply(util, pieces);

    // Call log fn
    return logFn.apply(logFn, [str]);
  };
};
