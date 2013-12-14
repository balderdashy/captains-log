/**
 * Dependencies
 */
var StreamObserver = require('fixture-stdout');
var expect	= require('../assertions');


// Prepare suites of tests
module.exports = {

	usage: function ( logFn, outputExpectations ) {
		before(function emptyLogsAndInterceptors () {
			this.logs = {};
			this.interceptors = {};
			this.interceptors.stderr = new StreamObserver(process.stderr);
			this.interceptors.stdout = new StreamObserver(process.stdout);
			this.logs.stderr = [];
			this.logs.stdout = [];
		});

		describe('usage ::', function () {
			it('works with no arguments', logFn() );
			it('works with one argument', logFn('a thing') );
			it('works with many arguments', logFn('lots', 'of', 'things') );
		});
		describe('usage results ::', function () {
			it('should have written to stderr', expect.numWritesToStream({
					streamId: 'stderr',
					numWrites: outputExpectations.stderr
				}));
			it('should NOT have written to stdout', expect.numWritesToStream({
					streamId: 'stdout',
					numWrites: outputExpectations.stdout
				}));
		});
	}
};
