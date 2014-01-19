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

		require('colors').setTheme(options.colors);

		// Colorize default prefixes
		options.prefixes = {};
		DEFAULT.METHODS.forEach(function (logAt) {
			var prefix = DEFAULT.OPTIONS.prefixes[logAt];

			// If prefix was specified, use it instead
			// (keep in mind this is only if the user didn't define `prefixes`)
			var configuredPrefix = (options.prefix || DEFAULT.OPTIONS.prefix);
			if (configuredPrefix) {
				prefix = configuredPrefix;
			}

			var colorizedPrefix = prefix[logAt];

			options.prefixes[logAt] = colorizedPrefix;
		});
	}

	// Then mix in the rest of the implicit default.
	// (DEFAULT.OPTIONS above) 
	_.defaults(options, DEFAULT.OPTIONS);

	return options;
};





