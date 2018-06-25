/**
 * Module dependencies.
 */

var _ = require('@sailshq/lodash');
var rc = require('rc');
var chalk = require('chalk');
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
  // console.log('overrides:',overrides);
  // console.log('DEFAULT.OVERRIDES:',DEFAULT.OVERRIDES);

  overrides = overrides || {};

  // Overrides passed in programmatically always take precedence.
  overrides = _.extend({}, DEFAULT.OVERRIDES, overrides, {

    prefixThemes: (function (){
      if (_.isObject(overrides.prefixThemes)) {
        return _.cloneDeep(overrides.prefixThemes);
      }
      else { return undefined; }
    })(),

    colors: _.extend({}, DEFAULT.OVERRIDES.colors, overrides.colors),

    logLevels: (function (){
      if (_.isObject(overrides.logLevels)) {
        return _.clone(overrides.logLevels);
      }
      else { return undefined; }
    })()
  });
  // Strip top-level undefined properties.
  _.each(_.keys(overrides), function (key) {
    if (_.isUndefined(overrides[key])) { delete overrides[key]; }
  });

  // console.log('overrides (after merge):',overrides);


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
  rconf = rconf || {};

  // console.log('\n* * * rconf:',rconf);
  // console.log('\n* * * overrides:',overrides);
  // Combine overrides and rc config into `options`
  var options = _.extend(_.clone(rconf), overrides, {

    prefixThemes: (function (){
      if (_.isUndefined(overrides.prefixThemes)) { return _.cloneDeep(rconf.prefixThemes); }
      else if (_.isObject(overrides.prefixThemes)) {
        return _.merge(_.cloneDeep(rconf.prefixThemes||{}), _.cloneDeep(overrides.prefixThemes));
      }
      else { return _.cloneDeep(overrides.prefixThemes); }
    })(),

    colors: (function (){
      if (_.isUndefined(overrides.colors)) { return _.clone(rconf.colors); }
      else if (_.isObject(overrides.colors)) { return _.extend(_.clone(rconf.colors||{}), overrides.colors); }
      else { return _.clone(overrides.colors); }
    })(),

    logLevels: (function (){
      if (_.isUndefined(overrides.logLevels)) { return _.clone(rconf.logLevels); }
      else if (_.isObject(overrides.logLevels)) { return _.extend(_.clone(rconf.logLevels||{}), overrides.logLevels); }
      else { return _.clone(overrides.logLevels); }
    })()

  });
  // Strip top-level undefined properties.
  _.each(_.keys(options), function (key) {
    if (_.isUndefined(options[key])) { delete options[key]; }
  });
  // console.log('\n* * * options (after merge):',options);


  // If `prefixes` were not explicitly set in user config,
  // and `colors` were not disabled in user config,
  // display colorized prefixes.
  if (options.prefixes === undefined && options.colors) {

    options.prefixes = {};

    // Use prefixTheme if specified
    var prefixTheme = (options.prefixTheme || DEFAULT.OPTIONS.prefixTheme);
    // console.log('PREFIX THEME:',prefixTheme);
    // console.log('DEFAULT.OPTIONS.prefixThemes:',DEFAULT.OPTIONS.prefixThemes);
    // console.log('options.prefixThemes:',options.prefixThemes);
    var prefixes = options.prefixes;
    if (prefixTheme) {
      prefixes = (options.prefixThemes || DEFAULT.OPTIONS.prefixThemes)[prefixTheme];
      if (!prefixes) {
        throw new Error('Consistency violation: prefixTheme option (`'+prefixTheme+'`) does not match any of the available themes.');
      }
    }
    // console.log('---------------\nprefixes:',prefixes);
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

      // Default prefix for each log level to whatever's in the `prefixes`
      // conf, as long as no explicit global prefix was defined.
      configuredPrefix = configuredPrefix || prefixes[logAt];

      // Add some color to this prefix:

      // Use the appropriate color for the log level.
      var colorMappings = _.isObject(options.colors) ? options.colors : {};
      var colorName = colorMappings[logAt];
      // Failsafe in case of troublesome configuration:
      if (colorName === undefined) {
        colorName = 'white';
      }

      // Get the ANSI-colorized prefix.
      var colorizedPrefix = (function _getColorizedPrefix() {

        // If this is "rainbow" or "dimrainbow", handle it as a special case.
        // (based on https://github.com/Marak/colors.js/blob/dfb15b55382772ba4fd34fc21922a2d83e9d34d3/lib/maps/rainbow.js)
        if (colorName === 'rainbow' || colorName === 'dimrainbow') {
          //RoY G BiV
          var RAINBOW_COLORS = ['red', 'yellow', 'green', 'blue', 'magenta'];
          var exploded = configuredPrefix.split('');
          var inRainbows = exploded.map(function (letter, i){
            if (letter === ' ') { return letter; }
            else {
              var chalkOfThisColor = chalk[RAINBOW_COLORS[i++ % RAINBOW_COLORS.length]];
              if (!chalkOfThisColor) { throw new Error('Consistency violation: Rainbow contains unrecognized color.'); }
              return chalkOfThisColor(letter);
            }
          });
          inRainbows = inRainbows.join('');

          // Dim rainbow, if desired.
          if (colorName === 'dimrainbow') {
            return chalk.dim(inRainbows);
          } else {
            return inRainbows;
          }
        }//•  </if "rainbow">

        // --•
        // Otherwise, this is some misc. color.
        // So attempt to get the appropriate chalk function.
        // If one exists, use it to transform the prefix.
        var chalkOfThisColor = chalk[colorName];
        if (chalkOfThisColor) {
          return chalkOfThisColor(configuredPrefix);
        }
        // Otherwise see if this is looking for a "dim" chalk,
        // and if so, tint a chalk, use it to transform the prefix,
        // and then return that.
        else if (colorName.match(/^dim/)) {
          var similarChalk = chalk[colorName.slice(3)];
          if (similarChalk) {
            return chalk.dim(similarChalk(configuredPrefix));
          }
        }

        // --•
        // But otherwise, if no such color can be found,
        // then just use the uncolored prefix.
        return configuredPrefix;

      })();//</self-calling function :: _getColorizedPrefix()>

      // Set the now-potentially-customized prefix string
      // for this particular log level.
      options.prefixes[logAt] = colorizedPrefix;

    });
  }//</if colored prefixes are enabled>

  // Then mix in the rest of the implicit default.
  // (DEFAULT.OPTIONS above)
  // console.log('options:',options);
  // console.log('DEFAULT.OPTIONS:',DEFAULT.OPTIONS);
  var finalOptions = _.extend({}, DEFAULT.OPTIONS, options, {

    prefixThemes: (function(){
      if (_.isUndefined(options.prefixThemes)) { return _.cloneDeep(DEFAULT.OPTIONS.prefixThemes); }
      else if (_.isObject(options.prefixThemes)) {
        return _.merge(_.cloneDeep(DEFAULT.OPTIONS.prefixThemes), _.cloneDeep(options.prefixThemes));
      }
      else { return _.cloneDeep(options.prefixThemes); }
    })(),

    colors: (function (){
      if (_.isUndefined(options.colors)) { return _.clone(DEFAULT.OPTIONS.colors); }
      else if (_.isObject(options.colors)) { return _.extend({}, DEFAULT.OPTIONS.colors||{}, options.colors); }
      else { return _.clone(options.colors); }
    })(),

    logLevels: (function (){
      if (_.isUndefined(options.logLevels)) { return _.clone(DEFAULT.OPTIONS.logLevels); }
      else if (_.isObject(options.logLevels)) { return _.extend({}, DEFAULT.OPTIONS.logLevels||{}, options.logLevels); }
      else { return _.clone(options.logLevels); }
    })()

  });
  // Strip top-level undefined properties.
  _.each(_.keys(finalOptions), function (key) {
    if (_.isUndefined(finalOptions[key])) { delete finalOptions[key]; }
  });
  // console.log('final options (after merge):',finalOptions);


  return finalOptions;
};
