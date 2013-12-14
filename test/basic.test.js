var fixtures = require('./fixtures');
var expect	= require('./assertions');
var CaptainsLog = require('../');

describe('new CaptainsLog with no options', function () {
	before(fixtures.log.new);
	before(function () {
		this.stdout_logs = [];
		this.stderr_logs = [];
		this.log = new CaptainsLog();
	});

	describe('usage ::', function () {

		describe('log()', function () {
			before( fixtures.log._call() );
			before( fixtures.log._call('second thing') );
			before( fixtures.log._call('third thing') );

			it('should have written 3 times to stderr', expect.numStderrWrites(3));
			it('should write a message to the console', expect.numStdoutWrites(0));
		});


	});
});



