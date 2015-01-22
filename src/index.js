/* 
 * Piko Node
 *
 * Copyright (c) 2014 Sitebase (Wim Mostmans) and project contributors.
 *
 * piko-node's license follows:
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge, 
 * publish, distribute, sublicense, and/or sell copies of the Software, 
 * and to permit persons to whom the Software is furnished to do so, 
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS 
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * 
 * This license applies to all parts of piko-node that are not externally
 * maintained libraries.
 */
var cheerio = require('cheerio'),
	request = require('request');

function Piko( options )
{
	this._source = null;
	this._options = {
		host: options.host || null,
		username: options.username || 'pvserver',
		password: options.password || 'pvwr'
	};
}

/**
 * Start fetching the Piko page and parse it
 * @param  {Function} callback 
 * @return {void}            
 */
Piko.prototype.fetch = function( callback )
{
	var self = this;
	if( this._options.host )
		this.getSource( this._options.host, this._options.username, this._options.password, function( html ) {
			this._source = html;
			var result = self.parse( this._source );
			callback( result );
		});
}

/**
 * Fetch the HTML source of the Piko page
 * @param  {string}   host     
 * @param  {string}   username 
 * @param  {string}   password 
 * @param  {Function} callback
 * @return {void}       
 */
Piko.prototype.getSource = function( host, username, password, callback )
{
	var options = {
		url : host,
		path : '/',
		method : 'GET',
		port: 80,
		auth : {
			username: username,
			password: password
		}
	}

	request( options, function(err, res, html){
		
		if( err )
			throw new Error( err );

		if( html.indexOf('Unauthorized') > -1 )
			throw new Error('Username and/or password seems to be wrong!');

		callback( html );
	});
}

/**
 * Parse the HTML and fetch the different values 
 * using CSS selectors
 * @param  {string} source HTML source of the Piko page
 * @return {object}        
 */
Piko.prototype.parse = function( source )
{
	$ = cheerio.load(source);
	var totalEnergy = this.standardizeValue( $('body > form > font > table:nth-child(2) > tr:nth-child(4) > td:nth-child(6)').html() );
	var dayEnergy = this.standardizeValue( $('body > form > font > table:nth-child(2) > tr:nth-child(6) > td:nth-child(6)').html().trim() );
	var status = $('body > form > font > table:nth-child(2) > tr:nth-child(8) > td:nth-child(3)').html().trim();
	var currentEnergy = this.standardizeValue( $('body > form > font > table:nth-child(2) > tr:nth-child(4) > td:nth-child(3)').html().trim() );
	var active = status === 'off' ? false : true;
	
	return {
		totalEnergy: { value: totalEnergy, unit: 'kWh' },
		dayEnergy: { value: dayEnergy, unit: 'kWh' },
		currentEnergy: { value: currentEnergy, unit: 'W' },
		active: active
	}
}

/**
 * For one or another good reason the developers of the
 * Piko thought it would be cool to represent a zero as "x x x "
 * This function will replace it with a real 0 value
 * It will also cast the numeric strings to integers
 * @param  {[type]} value [description]
 * @return {[type]}       [description]
 */
Piko.prototype.standardizeValue = function( value )
{
	if( typeof value === 'string' )
		value = value.trim();

	if( value === 'x x x&#xA0;' )
		return 0;

	return parseInt(value, 10);
}

module.exports = Piko;