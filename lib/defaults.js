/**
 * Implicit defaults.
 * (OPTIONS and OVERRIDES)
 *
 * @type {Dictionary}
 * @api private
 */

module.exports = {

  OPTIONS: {

    level: 'info',

    ////////////////////////////////////////////////////////////
    // Backwards compatibility:
    // (should always be true going forward)
    //
    // Whether to use additional `inspect` logic
    // (if false- just do exactly what `console.log` would do)
    inspect: true,
    ////////////////////////////////////////////////////////////

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
        silly:   '     : ',
        verbose: 'verbo: ',
        info:    ' info: ',
        blank:   '',
        debug:   'debug: ',
        warn:    ' warn: ',
        error:   'error: ',
        crit:    ' crit: '
      },
      abbreviated: {
        silly: '[~] ',
        verbose: '[v] ',
        info: '[i] ',
        blank: '',
        debug: '[d] ',
        warn: '[!] ',
        error: '[×] ',
        crit: '[Ω] '
      },
      moderate: {
        silly: '[silly] ',
        verbose: '[verbose] ',
        info: '    ',
        blank: '',
        debug: '[-] ',
        warn: '[!] ',
        error: '[err] ',
        crit: '[CRITICAL] '
      },
      aligned: {
        silly:   '   silly | ',
        verbose: ' verbose | ',
        info:    '    info | ',
        blank:   '',
        debug:   '   debug | ',
        warn:    '    warn | ',
        error:   '   error | ',
        crit:    'CRITICAL | '
      },
      minimalist: {
        silly:   ' | ',
        verbose: ' | ',
        info:    ' | ',
        blank:   '',
        debug:   ' | ',
        warn:    'warn: ',
        error:   'error: ',
        crit:    'CRITICAL: '
      },
      bubbles: {
        silly:   '   ',
        verbose: '˙˙  ',
        info:    '˙·  ',
        blank:   '',
        debug:   '•·  ',
        warn:    'warn: ',
        error:   'error: ',
        crit:    'CRITICAL: '
      },
      flowers: {
        silly:   '   ',
        verbose: '˙˘˙   ',
        info:    '~%°  ',
        blank:   '',
        debug:   '~∞%° ',
        warn:    'warn: ',
        error:   'error: ',
        crit:    'CRITICAL: '
      }
    },

    // The `prefixTheme` option is really just shorthand that allows
    // for configuring a set of log-level-specific prefix settings.
    // If specified, the following, lower-level `prefix` option overrides
    // the themes above:
    // prefix: '||| '

  },

  OVERRIDES: {
    rc: 'captainslog',
    ignoreCLIArgs: false,

    // (only used if prefixes are not explicitly set)
    colors: {
      silly:   'black',
      input:   'black',//« uncommon
      verbose: 'dimgray',
      prompt:  'gray',//« uncommon
      info:    'green',
      blank:   'white',
      data:    'gray',//« uncommon
      help:    'cyan',//« uncommon
      warn:    'yellow',
      debug:   'blue',
      error:   'red',
      crit:    'bgRed'//« uncommon
    }
  },

  // Log methods to expose
  METHODS: ['crit', 'error', 'warn', 'debug', 'info', 'blank', 'verbose', 'silly']
};
