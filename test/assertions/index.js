var assert = require('assert');



/**
 * `expect`
 */
function expect () {}

/**
 * expectNumberOfWritesTo
 * 
 * @option  {String} streamId [e.g. stderr]
 * @option  {Finite} numWrites [e.g. 2]
 */
expect.numWritesToStream = function (options) {
	return function () {
		var history = this.logs[options.streamId];
		assert.equal(
			history.length,
			options.numWrites,
			'Unexpected number of writes to ' + options.streamId + ' ' +
			'(' + history.length + ' instead of ' + options.numWrites + ').' +
			'\n\tWrites::  '+ '[' + this.logs[options.streamId] + ']'
		);
	};
};


module.exports = expect;