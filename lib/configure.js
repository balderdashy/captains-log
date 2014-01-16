/**
 * Module dependencies.
 */

var _ = require('lodash')
	, rc = require('rc')
	, DEFAULT_OPTIONS = require('./defaults');



var DEFAULT_OVERRIDES = {
	rc            : 'captainslog',
	ignoreCLIArgs : false
};


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
	_.defaults(overrides, DEFAULT_OVERRIDES);

	var options = _.cloneDeep(overrides);

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

	// Then the implicit defaults. (DEFAULT_OPTIONS above) 
	_.defaults(options, rconf, DEFAULT_OPTIONS);

	return options;
};





