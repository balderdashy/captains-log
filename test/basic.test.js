
var CaptainsLog = require('../');

var stdoutFixture = require('fixture-stdout');


describe('new CaptainsLog with no options', function () {

	before(function () {
		this.log = new CaptainsLog();
	});

	describe('log()', function () {

		before(function () {
			stdoutFixture.capture();
			this.log();
			stdoutFixture.release();
		});

		it('should write a message to the console', function (){

		});

	});
});