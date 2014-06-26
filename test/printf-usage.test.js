/**
 * Dependencies
 */
var suites = require('./suites');
var fixtures = require('./fixtures');
var CaptainsLog = require('../');


describe('printf-usage', function () {

	before(function newLog() {
		this.log = new CaptainsLog();
	});

	describe('sanity check to make sure suite/assertion is working as expected', function () {
		suites.console.checkOutputValue(function () {
			fixtures.log.debug('oh hi');
		}, 'oh hi');
	});


	describe('log.debug', function () {
		suites.console.checkOutputValue(function () {
			fixtures.log.debug('foo %d', 3);
		}, 'foo 3');
	});
	describe('log', function () {
		suites.console.checkOutputValue(function () {
			fixtures.log._call('foo %d', 3);
		}, 'foo 3');
	});


	// TODO: fix
	// This test should be failing-- the change herein causes false positive passing test cases

});