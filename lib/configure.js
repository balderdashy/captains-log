/**
 * Module dependencies.
 */

var _ = require('lodash')
	, rc = require('rc')
	, DEFAULT_OPTIONS = require('./defaults');



var DEFAULT_RC = 'captainslog';



/**
 * By default, look for options in:
 *   + `.captainlogrc` files
 *   + `CAPTAINSLOG-*` env variables
 *
 * More on `rc` conventions:
 * https://github.com/dominictarr/rc#standards
 * 
 * This behavior may be changed by specifying an override.
 * To disable completely:
 * `rc: false`
 * 
 * To use a custom `rc` "appname":
 * `rc: 'foo'`
 *
 * @api private
 */

module.exports = function ( overrides ) {

	// Options passed in programmatically are highest priority.
	if (typeof overrides !== 'object') { overrides = {}; }
	var options = _.cloneDeep(overrides);

	// Then `rc` configuration conventions.
	// (https://github.com/dominictarr/rc#standards)
	var rconf;
	if (overrides.rc === false) { rconf = {}; }
	else {
		rconf = rc(overrides.rc || DEFAULT_RC);
		rconf.level = rconf.level ||  // Accept command-line shortcuts:
		rconf.verbose ? 'verbose' :   // --verbose
		rconf.silent ? 'silent' :     // --silent
		rconf.silly ? 'silly' :       // --silly
		undefined;
	}

	// Then the implicit defaults. (DEFAULT_OPTIONS above) 
	_.defaults(options, rconf, DEFAULT_OPTIONS);

	return options;
};





