var Piko = require('../src/index');

var pv = new Piko({ host: 'http://192.168.1.127' });
pv.fetch(function( result ) {
	console.log(result);
});
