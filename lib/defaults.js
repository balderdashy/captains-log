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
			debug: 3,
			warn: 4,
			error: 5,
			crit: 6,
			silent: 7
		},

		prefixes: {
			silly   : '| silly   | ',
			verbose : '| verbose | ',
			info    : '| info    | ',
			debug   : '| debug   | ',
			warn    : '| warning | ',
			error   : '| error   | ',
			crit    : '| critical| '
		},

		prefix: '| '

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
			data   : 'grey',
			help   : 'cyan',
			warn   : 'yellow',
			debug  : 'blue',
			error  : 'red',
			crit   : 'red'
		}
	},

	// Log methods to expose
	METHODS: ['crit', 'error', 'warn', 'debug', 'info', 'verbose', 'silly']
};


module.exports = DEFAULTS;
