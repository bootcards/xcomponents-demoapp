/*
 * This script will import documents from a Domino database to a
 * (local) MongoDB database using Domino's DDS.
 *
 * It is used to retrieve data from the XControls sampler database
 */

var https		= require('https');
//var mongoose	= require('../node_modules/keystone/node_modules/mongoose');

//init gridfs-stream
//var Grid		= require('gridfs-stream');
//Grid.mongo 		= mongoose.mongo;

var config 			= require('./data-import/importConfig')
var importFunctions	= require('./data-import/importFunctions');
var prompt			= require('prompt');

console.log(" ");
console.log("***** started Domino-to-Mongo import *****");
console.log("- using Domino API app on server " + config.dominoServerUrl + " at " + config.dominoDbPath);

var httpOptions = {
	host : config.dominoServerUrl,
	path : null,
	method : null,
	headers : null,
	rejectUnauthorized: false
};

var numImported = 0;

prompt.start();

prompt.get(['username', 'password'], function (err, result) {
    if (err) { return onErr(err); }
    console.log('Command-line input received:');
    console.log('  Username: ' + result.username, result.password);

    readDominoData( result.username, result.password);

});

function onErr(err) {
	//console.log(err);
	return 1;
}


function readDominoData(dominoUser, dominoPassword) {

	httpOptions.auth = dominoUser + ':' + dominoPassword;


	console.log("- connecting as user " + dominoUser);

	importFromView('People By Last Name');
	importFromView('Activities By Contact');
	
}

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
	console.log('full path', httpGetDominoDocs.path);

	var req = https.request( httpGetDominoDocs, function(res) {

		var body = '';
		var status = res.statusCode;

		res.on('data', function(chunk) {
			body += chunk;
		});

		res.on('end', function() {

			try {

				var items = JSON.parse(body);

				if (status != 200) {

					console.error( items.text + ': ' + items.message);

				} else {		//ok

					console.log('number of documents in response: ' + items.length);

					var totalItems = items.length;

					for( var i=0; i<totalItems && i<config.maxNumToImport; i++) {
					 	importFunctions.processDominoDoc(items[i], (i+1), totalItems);
					 	numImported++;
					 }

					//importFunctions.processMetadata(json.metadata);

					//get next set of results if there are any
					if (items.length == count && numImported < config.maxNumToImport) {	
						getNextResults(viewName, start+count, count);
					}

				}
			} catch (e) {

				console.error('could not parse:');
				console.log(body);
			}
			

		});

	});

	req.end();

	req.on('error', function(e) {
		console.error(e);
	});
}

