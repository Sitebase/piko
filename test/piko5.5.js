var assert = require('assert'),
	fs = require('fs'),
	Piko = require('../src/index.js');

var html = fs.readFileSync( process.cwd() + '/test/piko5.5.html' );

describe('Piko 5.5',function(){

	it('Parse content', function() {
		var result = Piko.prototype.parse( html.toString() );

		assert.equal(15635, result.totalEnergy.value);
		assert.equal(1, result.dayEnergy.value);
		assert.equal(0, result.currentEnergy.value);
		assert.equal(false, result.active);
	});

	it('Should standardize values', function() {
		assert.strictEqual(15, Piko.prototype.standardizeValue('15'));
		assert.strictEqual(15, Piko.prototype.standardizeValue(' 15 '));
		assert.strictEqual(0, Piko.prototype.standardizeValue('x x x&#xA0;'));
		assert.strictEqual(15, Piko.prototype.standardizeValue(15));
	});

});