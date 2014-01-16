/**
 * Module dependencies.
 */

var _ = require('lodash')
	, rc = require('rc')
	, DEFAULTS = require('./defaults');
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

	if (typeof overrides !== 'object') { overrides = {}; }

	// Overrides passed in programmatically always
	// take precedence.
	_.defaults(overrides, DEFAULTS.OVERRIDES);


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
	var options = _.defaults(_.cloneDeep(overrides), rconf);

	// If `prefixes` were not specified explicitly,
	// (and NODE_ENV is not set to 'production')
	// load the `colors` dependency and colorize prefixes.
	if (	options.prefixes === undefined
				&& process.env.NODE_ENV !== 'production' ) {

		require('colors').setTheme(DEFAULTS.OPTIONS.colorTheme);

		options.prefixes = {
			silly   : DEFAULTS.OPTIONS.prefixes.silly.silly,
			verbose : DEFAULTS.OPTIONS.prefixes.verbose.verbose,
			info    : DEFAULTS.OPTIONS.prefixes.info.info,
			debug   : DEFAULTS.OPTIONS.prefixes.debug.debug,
			warn    : DEFAULTS.OPTIONS.prefixes.warn.warn,
			error   : DEFAULTS.OPTIONS.prefixes.error.error,
			crit    : DEFAULTS.OPTIONS.prefixes.crit.crit
		};
	}

	// Then mix in the rest of the implicit defaults.
	// (DEFAULTS.OPTIONS above) 
	_.defaults(options, DEFAULTS.OPTIONS);

	return options;
};





