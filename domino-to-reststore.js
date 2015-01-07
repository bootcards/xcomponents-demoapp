/*
 * This script will import documents from a Domino database to a
 * (local) MongoDB database using Domino's DDS.
 *
 * It is/ was used to retrieve data from the XControls sampler database
 */

var https		= require('https');
//var mongoose	= require('../node_modules/keystone/node_modules/mongoose');

//init gridfs-stream
//var Grid		= require('gridfs-stream');
//Grid.mongo 		= mongoose.mongo;

var config 			= require('./scripts/importConfig')
var importFunctions	= require('./scripts/importFunctions');

console.log(" ");
console.log("***** started Domino-to-Mongo import *****");

console.log("- using Domino API app on server " + config.dominoServerUrl + " at " + config.dominoDbPath);

var httpOptions = {
	host : config.dominoServerUrl,
	path : null,
	method : null,
	headers : null,
	rejectUnauthorized: false,
	auth : config.dominoUser + ':' + config.dominoPassword
};

console.log("- connecting as user " + config.dominoUser);

var numImported = 0;

importFromView('People By Last Name');
importFromView('Activities By Contact');
	
function importFromView(viewName) {
	
	var count = 50;		//items per request
	var start = 0;
	var numImported = 0;

	getNextResults(viewName, start, count);

}

function parseRangeHeader( rangeHeader ) {

	var range = {
		"total" : 0,
		"from" : 0,
		"to" : 0
	};

	var comps = rangeHeader.split('/');
	range.total = parseInt( comps[1]);

	var fromTo = comps[0].substring( comps[0].indexOf(' ')).split('-');
	range.from = parseInt(fromTo[0] );
	range.to = parseInt( fromTo[1] );

	return range;
}

function getNextResults( viewName, start, count ) {

	var httpGetDominoDocs = httpOptions;
	httpGetDominoDocs.method = 'GET';
	httpGetDominoDocs.path = config.dominoDbPath + '/api/data/collections/name/' + encodeURIComponent(viewName) + 
		'?start='  + start + 
		'&count='  + count +
		'&entrycount=false';

	console.log('get from '  + start + ' to '  + count + ', view: ' + viewName);

	var req = https.request( httpGetDominoDocs, function(res) {

		var body = '';
		var status = res.statusCode;

		//var contentRange = res.headers['content-range'];
		
		//if (contentRange) {
		//	var range = parseRangeHeader( contentRange);
		//	console.log('total: ' + range.total + '/'  + range.from + '/'  + range.to);

			/*var split = contentRange.split('/');
			var totalItems = parseInt(split[1]);
			var range = 
			var from = split[0]*/

		//}

		res.on('data', function(chunk) {
			body += chunk;
		});

		res.on('end', function() {

			//items 0-9/503
			
			var items = JSON.parse(body);

			if (status != 200) {

				console.error( items.text + ': ' + items.message);

			} else {		//ok

				console.log('number of documents in response: ' + items.length);

				var totalItems = items.length;

				for( var i=0; i<totalItems && i<config.maxNumToImport; i++) {
				 	importFunctions.processDoc(items[i], (i+1), totalItems);
				 	numImported++;
				 }

				//importFunctions.processMetadata(json.metadata);

				//get next set of results if there are any
				if (items.length == count && numImported < config.maxNumToImport) {	
					getNextResults(viewName, start+count, count);
				}
			}

		});

	});

	req.end();

	req.on('error', function(e) {
		console.error(e);
	});
}

function isArray(what) {
    return Object.prototype.toString.call(what) === '[object Array]';
}