
xcomponents.charts = [];

//fill the chart data
xcomponents.charts['closed-sales'] = [
  {label: 'Guy Bardsley', value: 560 },
  {label: 'Adam Callahan', value: 1500 },
  {label: 'Arlo Geist', value: 3750 },
  {label: 'Sheila Hutchins', value: 3500 },
  {label: 'Jeanette Quijano', value: 1250 },
  {label: 'Simon Sweet', value: 5250 }
];

window.addEventListener('HTMLImportsLoaded', function(e){
  var app = angular.module('xcomponents');

  //extend controller
  app.controller('xcPouchCtrl', function($scope, $controller, $http, pouchDB, PouchFactory, configService) {

  	$controller('xcController', { $scope: $scope } );

      $scope.numContacts = 0;

      configService.setEndpoint( "example" );

      //get number of contacts in the local pouchdb
      PouchFactory.info().then( function(res) {
        $scope.numContacts = res.count;
      });

      $scope.loadData = function() {

        //load data from (mongo) REST API to fill local pouch db
    		var db = pouchDB('example');

    		$http.get('/api/Contacts').then( function( data ) {

          PouchFactory.insert( data.data).then( function(res) {
            PouchFactory.info().then( function(res) {
              $scope.numContacts = res.count;
            });
          });
    		 
    		});

      };

      $scope.clearData = function() {

      	var db = pouchDB('example');
      	db.destroy().then( function(res) {
      	
      		if (res.ok) {
      			$scope.numContacts = 0;
      		}

      	});
      };

  }); 

});

