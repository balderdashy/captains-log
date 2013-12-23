/**
 * Dependencies
 */
var StreamObserver = require('fixture-stdout');
var expect	= require('../assertions');


// Prepare suites of tests
module.exports = {


	console: {

		/**
		 * Ensure total number of writes is correct.
		 * 
		 * @param  {[type]} logFn             [description]
		 * @param  {[type]} numWritesExpected [description]
		 * @return {[type]}                   [description]
		 */
		countWrites: function ( logFn, numWritesExpected ) {
			before(function emptyLogsAndInterceptors () {
				this.logs = {};
				this.interceptors = {};
				this.interceptors.stderr = new StreamObserver(process.stderr);
				this.interceptors.stdout = new StreamObserver(process.stdout);
				this.logs.stderr = [];
				this.logs.stdout = [];
			});

			it('works with no arguments', logFn() );
			it('works with one argument', logFn('a thing') );
			it('works with many arguments', logFn('lots', 'of', 'things') );
			it('should have written ' + numWritesExpected + ' things', expect.numWrites({
				numWrites: numWritesExpected
			}));
		},

		/**
		 * Ensure console output is written to the proper streams.
		 * 
		 * @param  {[type]} logFn              [description]
		 * @param  {[type]} outputExpectations [description]
		 * @return {[type]}                    [description]
		 */
		countWritesToSpecificStreams: function ( logFn, outputExpectations ) {
			before(function emptyLogsAndInterceptors () {
				this.logs = {};
				this.interceptors = {};
				this.interceptors.stderr = new StreamObserver(process.stderr);
				this.interceptors.stdout = new StreamObserver(process.stdout);
				this.logs.stderr = [];
				this.logs.stdout = [];
			});

			describe('::', function () {
				it('works with no arguments', logFn() );
				it('works with one argument', logFn('a thing') );
				it('works with many arguments', logFn('lots', 'of', 'things') );
			});
			describe('::', function () {
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
	}

};
