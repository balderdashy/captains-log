var assert = require('assert');



/**
 * expectThis('varName')
 * 
 * Examine the specified `varName` in the mocha test context (i.e. `this[varName]`)
 * and return a set of assertions for a test user to run.
 */
function expectThis(varName) {
	return {
		 numWrites: function ( expectedNumWrites ) {
			return function () {
				assert.equal(
					this[varName].length,
					expectedNumWrites,
					'Unexpected number of writes to ' + varName + ' ' +
					'(' + this[varName].length + ' instead of ' + expectedNumWrites + ').');
			};
		}
	};
}



/**
 * `expect`
 */
function expect () {}
expect.numStderrWrites = expectThis('stderr_logs').numWrites;
expect.numStdoutWrites = expectThis('stdout_logs').numWrites;


module.exports = expect;
