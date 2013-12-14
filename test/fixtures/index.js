/**
 * Dependencies
 */
var Fixture = require('fixture-stdout');


/**
 * Fixtures to be used directly by mocha's `before`, `after`, `beforeEach`,
 * `afterEach`, and `it` methods.
 * 
 * @type {Object}
 */
module.exports = {

	log: {
		new: function () {
			this.stderr = new Fixture(process.stderr);
			this.stdout = new Fixture(process.stdout);
		},

		_call: function (data) {

			// Call the log object itself (it's a fn)
			return function () {

				var stdout_logs = this.stdout_logs;
				var stderr_logs = this.stderr_logs;
				this.stderr.capture(function intercept (string, encoding, fd) {
					stderr_logs.push(string);
					return false;
				});
				this.stdout.capture(function intercept (string, encoding, fd) {
					stdout_logs.push(string);
					return false;
				});

				// Write log
				typeof data === 'undefined' ?
					this.log() :
					this.log(data);
					
				this.stderr.release();
				this.stdout.release();
			};
		}
	}
};