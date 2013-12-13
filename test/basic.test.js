
var CaptainsLog = require('../');
var StdOutFixture = require('fixture-stdout');

describe('new CaptainsLog with no options', function () {

	before(function () {
		this.log = new CaptainsLog();
		this.stdout = new StdOutFixture();
	});

	describe('log()', function () {

		before(function () {
			this.stdout.capture();
			this.log();
		});

		after(function () {
			this.stdout.release();
		});

		it('should write a message to the console', function (){
			
		});

	});
});