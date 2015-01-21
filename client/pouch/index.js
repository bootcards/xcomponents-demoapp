
xcontrols.charts = [];

//fill the chart data
xcontrols.charts['closed-sales'] = [
  {label: 'Guy Bardsley', value: 560 },
  {label: 'Adam Callahan', value: 1500 },
  {label: 'Arlo Geist', value: 3750 },
  {label: 'Sheila Hutchins', value: 3500 },
  {label: 'Jeanette Quijano', value: 1250 },
  {label: 'Simon Sweet', value: 5250 }
];

var app = angular.module('xcontrols');

//extend controller
app.controller('xcPouchCtrl', function($scope, $controller, $http, pouchDB) {

	$controller('xcController', { $scope: $scope });

    $scope.numContacts = 0;

    var db = pouchDB('example');

    //get number of contacts in the local pouchdb
    db.info().then( function(res) {
    	$scope.numContacts = res.doc_count;
    })

    $scope.loadPouchData = function() {

    	//load data from (mongo) REST API to fill local pouch db
		var db = pouchDB('example');

		$http.get('/api/Contacts').then( function( data ) {

			db.bulkDocs(data.data).then( function(res) { 
				$scope.numContacts = res.length;
			});
		 
		});

    };

    $scope.clearPouchData = function() {

    	var db = pouchDB('example');
    	db.destroy().then( function(res) {
    	
    		if (res.ok) {
    			$scope.numContacts = 0;
    		}

    	});
    };

});

