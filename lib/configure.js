/**
 * Module dependencies.
 */

var _ = require('lodash')
	, rc = require('rc')
	, DEFAULT = require('./defaults');
_.defaults = require('merge-defaults');



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

module.exports = function ( overrides ) {

	// Overrides passed in programmatically always
	// take precedence.
	overrides = _.defaults({}, overrides || {}, DEFAULT.OVERRIDES);


	// Then `rc` configuration conventions.
	// (https://github.com/dominictarr/rc#standards)
	var rconf;
	if (overrides.rc === false) { rconf = {}; }
	else {
		rconf = rc(overrides.rc);

		if ( ! overrides.ignoreCLIArgs ) {
			rconf.level = rconf.level ||  // Accept command-line shortcuts:
			rconf.verbose ? 'verbose' :   // --verbose
			rconf.silent ? 'silent' :     // --silent
			rconf.silly ? 'silly' :       // --silly
			undefined;
		}
	}

	// Combine overrides and rc config into `options`
	var options = _.defaults(overrides, rconf);

	// If `prefixes` were not explicitly set in user config,
	// and `colors` were not disabled in user config,
	// and NODE_ENV is not set to 'production,
	// load the `colors` dependency and colorize prefixes.
	if (	options.prefixes === undefined && options.colors
				&& process.env.NODE_ENV !== 'production' ) {

		// Ensure `options.colors` is valid
		var theme = _.isObject(options.colors) ? options.colors : {};
		try {
			require('colors').setTheme(theme);
		}
		catch (e) {
			// If any errors arise using colors, ignore them.
		}

		options.prefixes = {};

		// Use prefixTheme if specified
		var prefixTheme = (options.prefixTheme || DEFAULT.OPTIONS.prefixTheme);
		var prefixes = DEFAULT.OPTIONS.prefixes;
		if (prefixTheme) {
			prefixes = (options.prefixThemes || DEFAULT.OPTIONS.prefixThemes)[prefixTheme];
		}
		DEFAULT.METHODS.forEach(function (logAt) {
			
			var prefix = prefixes[logAt];

			// If a `prefix` was specified, use it instead
			// (keep in mind this is only if the user didn't define `prefixes`)
			var configuredPrefix = (options.prefix || DEFAULT.OPTIONS.prefix);
			if (configuredPrefix) {
				prefix = configuredPrefix;
			}

			// Add some color
			var colorizedPrefix = prefix[logAt];
			options.prefixes[logAt] = colorizedPrefix;
		});
	}

	// Then mix in the rest of the implicit default.
	// (DEFAULT.OPTIONS above) 
	_.defaults(options, DEFAULT.OPTIONS);




	return options;
};





