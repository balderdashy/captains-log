/**
 * Module dependencies.
 */

var _ = require('lodash');
var rc = require('rc');
var DEFAULT = require('./defaults');



/**
 * By default, look for configuration in:
 *   + `.captainslogrc` files
 *   + `CAPTAINSLOG-*` env variables
 *
 * More on `rc` conventions:
 * https://github.com/dominictarr/rc#standards
 *
 * Special overrides:
 *    + overrides.ignoreCLIArgs
 *      -> ignore --verbose, --silent, and --silly
 *    + overrides.rc
 *      -> custom rc prefix to use
 *         (or `false` to disable rc conf completely)
 *      -> defaults to 'captainslog'
 *
 * @api private
 */

module.exports = function(overrides) {
  console.log('overrides:',overrides);
  console.log('DEFAULT.OVERRIDES:',DEFAULT.OVERRIDES);

  // Overrides passed in programmatically always take precedence.
  overrides = _.extend({}, DEFAULT.OVERRIDES, overrides||{}, {
    prefixThemes: _.merge(_.cloneDeep(DEFAULT.OVERRIDES.prefixThemes||{}), (overrides||{}).prefixThemes||{}),
    colors: _.extend({}, DEFAULT.OVERRIDES.colors, (overrides||{}).colors||{}),
    logLevels: _.extend({}, DEFAULT.OVERRIDES.logLevels, (overrides||{}).logLevels||{})
  });

  console.log('overrides (after merge):',overrides);


  // Then `rc` configuration conventions.
  // (https://github.com/dominictarr/rc#standards)
  var rconf;
  if (overrides.rc === false) {
    rconf = {};
  } else {
    rconf = rc(overrides.rc);

    if (!overrides.ignoreCLIArgs) {
      rconf.level = rconf.level || // Accept command-line shortcuts:
        rconf.verbose ? 'verbose' : // --verbose
        rconf.silent ? 'silent' : // --silent
        rconf.silly ? 'silly' : // --silly
        undefined;
    }
  }

  console.log('rconf:',rconf);
  // Combine overrides and rc config into `options`
  var options = _.extend({}, rconf||{}, overrides||{}, {
    prefixThemes: _.merge(
      rconf.prefixThemes ? _.cloneDeep(rconf.prefixThemes) : undefined,
      overrides.prefixThemes
    ),
    colors: rconf.colors || overrides.colors ? _.extend({}, rconf.colors, overrides.colors) : undefined,
    logLevels: rconf.logLevels || overrides.logLevels ? _.extend({}, rconf.logLevels, overrides.logLevels) : undefined
  });
  console.log('options (after merge):',options);


  // If `prefixes` were not explicitly set in user config,
  // and `colors` were not disabled in user config,
  // and NODE_ENV is not set to 'production,
  // load the `colors` dependency and colorize prefixes.
  if (options.prefixes === undefined && options.colors && process.env.NODE_ENV !== 'production') {

    // Ensure `options.colors` is valid, and try to enable the `colors`
    // module if possible, and configured to do so.
    try {
      require('colors')
        .setTheme(
          _.isObject(options.colors) ? options.colors : {}
        );
    } catch (e) {
      // If any errors arise using/requiring colors, ignore them.
    }

    options.prefixes = {};

    // Use prefixTheme if specified
    var prefixTheme = (options.prefixTheme || DEFAULT.OPTIONS.prefixTheme);
    console.log('PREFIX THEME:',prefixTheme);
    console.log('DEFAULT.OPTIONS.prefixThemes:',DEFAULT.OPTIONS.prefixThemes);
    console.log('options.prefixThemes:',options.prefixThemes);
    var prefixes = options.prefixes;
    if (prefixTheme) {
      prefixes = (options.prefixThemes || DEFAULT.OPTIONS.prefixThemes)[prefixTheme];
      if (!prefixes) {
        throw new Error('Consistency violation: prefixTheme option (`'+prefixTheme+'`) does not match any of the available themes.');
      }
    }
    console.log('---------------\nprefixes:',prefixes);
    DEFAULT.METHODS.forEach(function(logAt) {

      var prefix = prefixes[logAt];

      // If a `prefix` was specified, use it instead
      // (keep in mind this is only if the user didn't define `prefixes`)
      var configuredPrefix = (options.prefix || DEFAULT.OPTIONS.prefix);

      // If `prefix` is explicitly set to `false` or `null`,
      // disable prefixes altogether.
      if (options.prefix === false || options.prefix === null) {
        configuredPrefix = '';
      }

      // Default prefix for each log level to whatever's in the `prefixes conf,
      // as long as no explicit global prefix was defined.
      configuredPrefix = configuredPrefix || prefixes[logAt];

      // Add some color
      var colorizedPrefix = (function() {
        try {
          // defaults to the color of the log level
          // e.g. 'foobar.info'
          return configuredPrefix[logAt];
        } catch (e) { /* ignore */ }
      })();

      options.prefixes[logAt] = colorizedPrefix;
    });
  }

  // Then mix in the rest of the implicit default.
  // (DEFAULT.OPTIONS above)
  console.log('options:',options);
  console.log('DEFAULT.OPTIONS:',DEFAULT.OPTIONS);
  var finalOptions = _.extend({}, DEFAULT.OPTIONS, options, {
    prefixThemes: _.merge(_.cloneDeep(DEFAULT.OPTIONS.prefixThemes||{}), options.prefixThemes||{}),
    colors: _.extend({}, DEFAULT.OPTIONS.colors||{}, options.colors||{}),
    logLevels: _.extend({}, DEFAULT.OPTIONS.logLevels||{}, options.logLevels||{})
  });
  console.log('final options (after merge):',finalOptions);


  return finalOptions;
};
