var suites = require('./suites');
var fixtures = require('./fixtures');
var CaptainsLog = require('../');


describe('new CaptainsLog with no options', function () {
	before(function newLog() {
		this.log = new CaptainsLog();
	});

	// Winston writes the `debug` and `error` log levels to stderr.
	describe('log.debug()', function () {
		suites.console.countWritesToSpecificStreams(fixtures.log.debug,
			{ stderr: 3, stdout: 0 });
	});
	// Because the basic log usage defaults to `debug`, the log should write to stdout.
	describe('log()', function () {
		suites.console.countWritesToSpecificStreams(fixtures.log._call,
			{ stderr: 3, stdout: 0 });
	});
	describe('log.error()', function () {
		suites.console.countWritesToSpecificStreams(fixtures.log.error,
			{ stderr: 3, stdout: 0 });
	});

	// Winston writes the rest of its logging methods to stdout
	describe('log.info()', function () {
		suites.console.countWritesToSpecificStreams(fixtures.log.info,
			{ stderr: 0, stdout: 0 });
	});
	describe('log.verbose()', function () {
		suites.console.countWritesToSpecificStreams(fixtures.log.verbose,
			{ stderr: 0, stdout: 0 });
	});
	describe('log.silly()', function () {
		suites.console.countWritesToSpecificStreams(fixtures.log.silly,
			{ stderr: 0, stdout: 0 });
	});
	describe('log.warn()', function () {
		suites.console.countWritesToSpecificStreams(fixtures.log.warn,
			{ stderr: 0, stdout: 3 });
	});
});




