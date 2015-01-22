Piko Inverter
=============
A NodeJS package that makes it possible to fetch information from a Piko Inverter from Kostal.

Basic usage
-----------

	var Piko = require('piko');
	var pv = new Piko({ host: 'http://piko.lan' });
	pv.fetch(function( result ) {
		console.log(result);
	});

Result will look like this object:

	{ 
		totalEnery: 15635,
		dayEnergy: 1,
		currentEnergy: 0,
		active: false 
	}

Unit test
---------

	npm test

