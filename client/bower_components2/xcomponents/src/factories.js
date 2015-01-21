console.log('factories');

var app = angular.module("xc.factories", ['ngResource', 'pouchdb']);

app.factory('RESTFactory', function($http) {

	return {

		all : function(url) { 
			//url = url.replace(":id", )
			return $http.get(url).then( function(res) {
				return res.data;
			});

		}

	};


});

app.factory('PouchFactory', function(pouchDB) {

	return {

		all : function(url) { 

			var db = pouchDB(url);

			return db.allDocs({ include_docs : true}).then( function(res) {

				var queryResults = [];
	                
	            angular.forEach(res.rows, function(r) {
	            	queryResults.push(r.doc);
	            }) 
	            
				return queryResults;
			});

		}

	};


});