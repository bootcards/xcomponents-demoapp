/*var Item		= require('./server/models/item.js');
var Member		= require('./server/models/member.js');
var Metadata	= require('./server/models/metadata.js');*/

/*var mongoose	= require('mongoose');
var request 	= require('request');
var fs 			= require('fs');*/

var http		= require('http');
var config		= require('./importConfig');

module.exports = {
/*
	processMetadata : function(metadata) {
		console.log('processing metadata for teamroom ' + metadata.name);

		Metadata.find( {}, function( err, mds)  {

			if (mds.length === 0 ) {

				var md = new Metadata();
				md.name = metadata.name;
				md.purpose = metadata.purpose;

				md.save( function(err, md) {
					if (err) console.error(err);
					console.log('> metadata stored in Mongo' );
				});

			}

		});

		for (var i=0; i<metadata.members.length; i++) {

			console.log("> process member: " + metadata.members[i].name);

			processMember( metadata.members[i] );

		}

	},*/
	

	processDominoDoc : function(doc, thisIdx, total) {

		try {

			if ( doc['@category'] == true) {
				console.log('skip category...');
				return;
			}

			console.log('processing ' + doc['@unid'] + '/' + doc['@form']);

			var data = {};
			var path = '';

			switch (doc['@form']) {

				case 'Person':

					path = config.restAPIPathContacts;

					data = {
						"lastName" : doc.LastName,
						"firstName": doc.FirstName,
						"name" : doc.FirstName + " " + doc.LastName,
						"email" : doc.Email,
						"company" : doc.Company,

						"streetAddress" : doc.StreetAddress,
						"zipCode": doc.ZipCode,
						"city": doc.City,
						"country" : doc.Country,
						"phone" : doc.Phone,
						"thumbnailUrl" : doc["$0"],
						"title" : doc.Title,
						"id" : doc['@unid']
					};
					
					break;

				case 'Activity':

					path = config.restAPIPathActivities;

					data = {
						'contact' : doc.Contact,
						'title' : doc.Title,
						'detail' : doc.Body,
						'assignedTo' : doc['$12'],
						'date' : doc.Date,
						'company' : doc.COMPANY,
						'type' : doc.Type,
						'id' : doc['@unid']

					};

					break;

			}

			this.storeItemsInMongo(data, path);

		} catch (e) {

			console.error('error in processDominoDoc');
			console.log(e);
		}

	},

	//send items to Mongo REST API
	storeItemsInMongo : function(data, path) {

		var dataString = JSON.stringify(data);

		var headers = {
		  'Content-Type': 'application/json',
		  'Content-Length': dataString.length
		};

		var httpOptions = {
			host : config.restAPIHost,
			port : config.restAPIPort,
			path : path,
			method : 'PUT',
			headers : headers,
			rejectUnauthorized: false
		};

		var req = http.request( httpOptions, function(res) {

			var body = '';
			
			res.on('data', function(chunk) {
				body += chunk;
			});

			res.on('end', function() {

				var res = JSON.parse(body);
				console.log('> added ' + (res.name || res.title) + ' (' + res.id +')');

			});

		});
		
		req.write( dataString );
		req.end();

		req.on('error', function(e) {
			console.error(e);
		});

	},

	sortByField : function(data, field) {

		return data.sort(

			function(a,b) {
				return ( (a[field] > b[field]) ? 1 : ((a[field] < b[field]) ? -1 : 0));
			}

		);

	}

};



/*
 * This function will retrieve any attached files from the documents in Teamroom
 * and store them directly in Mongo's GridFS using the gridfs-stream plugin
 */
function processFiles(parentId, files) {

	for (var i=0; i<files.length; i++) {

		console.log('  - storing file: ' + files[i].name + ' with parentId ' + parentId);

		//open up a new writestream, store the parent document's id in the file metadata
		var writeStream = gfs.createWriteStream({
				filename : files[i].name,
				metadata : {
					'parentId' : parentId
				}
			});

		//retrieve the file from Teamroom and send it to Mongo
		request.get( {
			uri : 'https://' + config.dominoServerUrl + files[i].href,
			strictSSL : false 
		})
			.auth( config.user, config.password)
			.pipe( writeStream );

	}


}

function processMember(member) {

	Member.find( { "name" : member.name}, function(err, members) {

		if (members.length===0) {

			var m = new Member();
			m.name = member.name;
			m.email = member.email;

			var thumbnailUrl = member.thumbnailUrl;

			m.save( function(err, m) {
				
				if (err) console.error(err);

				console.log('> member created: '  + m.name);

				//process thumbnail 
				if (thumbnailUrl !== null && thumbnailUrl.length>0) {
					console.log('  - retrieve thumbnail ' + thumbnailUrl);

					//open up a new writestream, store the parent document's id in the file metadata
					var writeStream = gfs.createWriteStream({
							filename : thumbnailUrl,
							metadata : {
								'parentId' : m.id
							}
						});

					//retrieve the file from Teamroom and store it to Mongo
					request.get( {
						uri : 'https://' + config.dominoServerUrl + thumbnailUrl,
						strictSSL : false 
					})
						.auth( config.user, config.password)
						.pipe( writeStream );
				}

			});


		}


	});
}