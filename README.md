Piko Inverter [![Build Status](https://travis-ci.org/Sitebase/piko.svg?branch=master)](https://travis-ci.org/Sitebase/piko)
=============
A NodeJS package that makes it possible to fetch information from a Piko Inverter from Kostal.

Tested on
---------
* Piko 5.5

Usage
-----

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

