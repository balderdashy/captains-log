/**
 * Implicit defaults.
 * (OPTIONS and OVERRIDES)
 *
 * @type {Object}
 * @api private
 */

var DEFAULTS = {

	OPTIONS: {

		level: 'info',

		inspect: true,

		logLevels: {

			silly: 0,
			verbose: 1,
			info: 2,
			blank: 2,
			debug: 3,
			warn: 4,
			error: 5,
			crit: 6,
			silent: 7
		},

		globalizeAs: false,


		// If defined, uses a prefixTheme as default
		prefixTheme: 'traditional',


		// Different built-in prefix themes:
		prefixThemes: {
			traditional: {
				silly   : 'silly: ',
				verbose : 'verbose: ',
				info    : 'info: ',
				blank   : '',
				debug   : 'debug: ',
				warn    : 'warn: ',
				error   : 'error: ',
				crit    : 'CRITICAL: '
			},
			abbreviated: {
				silly   : '[~] ',
				verbose : '[v] ',
				info    : '[i] ',
				blank   : '',
				debug   : '[d] ',
				warn    : '[!] ',
				error   : '[!] ',
				crit    : '[CRITICAL] '
			},
			moderate: {
				silly   : '[silly] ',
				verbose : '[verbose] ',
				info    : '    ',
				blank   : '',
				debug   : '[-] ',
				warn    : '[!] ',
				error   : '[err] ',
				crit    : '[CRITICAL] '
			},
			aligned: {
				silly   : 'silly   | ',
				verbose : 'verbose | ',
				info    : 'info    | ',
				blank   : '',
				debug   : 'debug   | ',
				warn    : 'warning | ',
				error   : 'error   | ',
				crit    : 'CRITICAL| '
			}
		},

		// (if specified in defaults, overrides the prefixes above)
		// prefix: '||| '

	},

	OVERRIDES: {
		rc            : 'captainslog',
		ignoreCLIArgs : false,

		// (only used if prefixes are not explicitly set)
		colors: {
			silly  : 'rainbow',
			input  : 'black',
			verbose: 'cyan',
			prompt : 'grey',
			info   : 'green',
			blank  : 'white',
			data   : 'grey',
			help   : 'cyan',
			warn   : 'yellow',
			debug  : 'blue',
			error  : 'red',
			crit   : 'red'
		}
	},

	// Log methods to expose
	METHODS: ['crit', 'error', 'warn', 'debug', 'info', 'blank', 'verbose', 'silly']
};


module.exports = DEFAULTS;
