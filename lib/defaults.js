/**
 * Implicit default options.
 * @type {Object}
 * @api private
 */

var defaults = {



	level: 'info',



	inspect: true,



	logLevels: {

		silly: 0,

		verbose: 1,

		info: 2,

		debug: 3,

		warn: 4,

		error: 5,

		// crit: 6,
		// 
		// emerg: 6,
		// 
		// fail: 6,
		
		silent: 7
	},

	prefixes: {
		silly   : 'silly   : ',
		verbose : 'verbose :',
		info    : 'info    :',
		debug   : 'debug   :',
		warn    : 'warn    :',
		error   : 'error   :',
		crit    : 'crit    :'
	}

};


// In production env, skip colors
// (to keep things as light/simple as possible.)
// TODO: allow this to be overridden as an option
if ( process.env.NODE_ENV !== 'production' ) {
	require('colors');
	defaults.prefixes = {
		silly   : defaults.prefixes.silly.pink,
		verbose : defaults.prefixes.verbose.cyan,
		info    : defaults.prefixes.info.green,
		debug   : defaults.prefixes.debug.blue,
		warn    : defaults.prefixes.warn.orange,
		error   : defaults.prefixes.error.red,
		crit    : defaults.prefixes.crit.rainbow
	};
}

module.exports = defaults;
