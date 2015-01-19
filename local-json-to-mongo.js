/*
 * This script will import items from a local JSON file to a
 * (local) MongoDB database
 */

var fs 		= require('fs');
//var mongoose	= require('../node_modules/keystone/node_modules/mongoose');

//init gridfs-stream
//var Grid		= require('gridfs-stream');
//Grid.mongo 		= mongoose.mongo;

var config 			= require('./data-import/importConfig')
var importFunctions	= require('./data-import/importFunctions');

console.log(" ");
console.log("***** started Local JSON to Mongo import *****");

var numImported = 0;

readLocalJsonData();

function readLocalJsonData() {

	var dataFile = 'data-import/data.json';
	fs.readFile(dataFile, 'utf8', function (err, data) {

		if (err) {
			console.log('Error reading data file: ' + err);
			return;
		}

		try {
			var jsonContents = JSON.parse(data);
		} catch (e) {
			console.error('could not parse JSON file');
		}

		var contacts = jsonContents.contacts;
		var companies = importFunctions.sortByField( jsonContents.companies, 'name');
		var notes = jsonContents.notes;

		//store Notes in Mongo
		for (var i=0; i<notes.length; i++) {
			importFunctions.storeItemsInMongo(notes[i], config.restAPIPathNotes);
		}

		//store Companies in Mongo
		for (var i=0; i<companies.length; i++) {
			importFunctions.storeItemsInMongo(companies[i], config.restAPIPathCompanies);
		}
	
		console.log("Sample data imported. Found " + contacts.length + " contacts, " + companies.length + " companies, " + notes.length + " notes");
	});

}
