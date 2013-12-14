var fixtures = require('./fixtures');
var expect	= require('./assertions');
var CaptainsLog = require('../');

describe('new CaptainsLog with no options', function () {
	// Build interceptors
	before(function () {
		this.logs = {};
		this.interceptors = {};
	});
	var stderr = fixtures.interceptor('stderr', process.stderr);
	var stdout = fixtures.interceptor('stdout', process.stdout);
	before(stdout.new);
	before(stderr.new);
	before(function newLog() {
		this.log = new CaptainsLog();
	});



	describe('log()', function () {
		before(stderr.empty);
		before(stdout.empty);

		describe('usage ::', function () {
			it('works with no arguments', fixtures.log._call() );
			it('works with one argument', fixtures.log._call('a thing') );
			it('works with many arguments', fixtures.log._call('lots', 'of', 'things') );
		});

		describe('result ::', function () {

			// Because the basic log usage defaults to `debug`, the log should write to stderr.
			// This is because Winston writes the `debug` and `error` log levels to stderr.
			it('should have written to stderr', expect.numWritesToStream({
					streamId: 'stderr',
					numWrites: 3
				}));
			it('should NOT have written to stdout',
				expect.numWritesToStream({
					streamId: 'stdout',
					numWrites: 0
				}));
		});

	});


	describe('log.debug()', function () {
		before(stderr.empty);
		before(stdout.empty);

		describe('usage ::', function () {
			it('works with no arguments', fixtures.log.debug() );
			it('works with one argument', fixtures.log.debug('a thing') );
			it('works with many arguments', fixtures.log.debug('lots', 'of', 'things') );
		});

		describe('result ::', function () {

			// Winston writes the `debug` and `error` log levels to stderr.
			it('should have written to stderr', expect.numWritesToStream({
					streamId: 'stderr',
					numWrites: 3
				}));
			it('should NOT have written to stdout', expect.numWritesToStream({
					streamId: 'stdout',
					numWrites: 0
				}));
		});
	});
});



