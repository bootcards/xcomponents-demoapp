
var app = angular.module("xc.factories", ['ngResource', 'pouchdb']);

app.service('configService', function() {

    var endpoint = '/null';

    return {

	    setEndpoint : function(url) {
	    	this.endpoint = url;
	    },

	    endpoint : endpoint
	   
	};

});

app.factory('RESTFactory', function($http, configService) {

	return {

		all : function() { 

			var url = configService.endpoint.replace(":id", "");

			return $http.get(url).then( function(res) {
				return res.data;
			});

		},

		saveNew : function(item) {
			
			var url = configService.endpoint.replace(":id", "");

			return $http.post(url, item).then( function(res) {
				return res.data;
			});

		},

		update : function(item) {
		
			var url = configService.endpoint.replace(":id", "");

			return $http.put(url, item).then( function(res) {
				return res.data;
			});

		},

		delete : function(item) {
			var url = configService.endpoint.replace(":id", item.id);
			return $http.delete(url);
		},

		getById : function(id) {

			var url = configService.endpoint.replace(":id", id);

			return $http.get(url).then( function(res) {
				return res.data;
			});

		},

		exists : function(id) {

			var url = configService.endpoint.replace(":id", id) + '/exists';

			return $http.get(url).then( function(res) {
				return res.data;
			});
		}

	};

} );

app.factory('PouchFactory', function(pouchDB, configService) {

	return {

		all : function() { 
			
			var dbName = configService.endpoint;
			var db = pouchDB(dbName);

			return db.allDocs({ include_docs : true})
			.then( function(res) {

				var queryResults = [];
	                
	            angular.forEach(res.rows, function(r) {
	            	queryResults.push(r.doc);
	            }) 
	            
				return queryResults;
			})
			.catch( function(err) {
				console.error(err);
				return null;
			});

		},

		saveNew : function(item) {

			var dbName = configService.endpoint;
			var db = pouchDB(dbName);

			return db.post(item).then( function(res) {

				if (res.ok) {
					item.id = res.id;
					return item;
				} else {
					alert('Error while inserting in Pouch');
				}

			})
		},

		getById : function(id) {

			var dbName = configService.endpoint;
			var db = pouchDB(dbName);

			return db.get(id)
			.then( function(res) {
				return res;
			})
			.catch( function(res) {
				if (res.name != 'not_found') {
					//console.error(res);
				}
				return null;
			});

		},

		update : function(item) {

			var dbName = configService.endpoint;
			var db = pouchDB(dbName);

			return db.put(item)
			.then( function(res) {
				item._rev = res.rev;
				return item;
			})
			.catch( function(err) {
				console.error(err);
				return null;
			});
			
		},

		delete : function(item) {

			var dbName = configService.endpoint;
			var db = pouchDB(dbName);

			return db.remove(item)
			.then( function(res) {
				return null;
			})
			.catch( function(err) {
				console.error(err);
			});

		},

		exists : function(id) {
			return this.getById(id).then( function(res) {
				return {exists : (res != null)};
			});
		}

	};


});

app.factory('LowlaFactory', function(configService) {

	return {

		all : function() { 
			
			var dbName = configService.endpoint;
			var db = pouchDB(dbName);

			return db.allDocs({ include_docs : true})
			.then( function(res) {

				var queryResults = [];
	                
	            angular.forEach(res.rows, function(r) {
	            	queryResults.push(r.doc);
	            }) 
	            
				return queryResults;
			})
			.catch( function(err) {
				console.error(err);
				return null;
			});

		},

		saveNew : function(item) {

			var dbName = configService.endpoint;
			var db = pouchDB(dbName);

			return db.post(item).then( function(res) {

				if (res.ok) {
					item.id = res.id;
					return item;
				} else {
					alert('Error while inserting in Pouch');
				}

			})
		},

		getById : function(id) {

			var dbName = configService.endpoint;
			var db = pouchDB(dbName);

			return db.get(id)
			.then( function(res) {
				return res;
			})
			.catch( function(res) {
				if (res.name != 'not_found') {
					//console.error(res);
				}
				return null;
			});

		},

		update : function(item) {

			var dbName = configService.endpoint;
			var db = pouchDB(dbName);

			return db.put(item)
			.then( function(res) {
				item._rev = res.rev;
				return item;
			})
			.catch( function(err) {
				console.error(err);
				return null;
			});
			
		},

		delete : function(item) {

			var dbName = configService.endpoint;
			var db = pouchDB(dbName);

			return db.remove(item)
			.then( function(res) {
				return null;
			})
			.catch( function(err) {
				console.error(err);
			});

		},

		exists : function(id) {
			return this.getById(id).then( function(res) {
				return {exists : (res != null)};
			});
		}

	};


});