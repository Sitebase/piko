var Piko = require('../src/index');

var pv = new Piko({ host: 'http://piko.lan' });
pv.fetch(function( result ) {
	console.log(result);
});