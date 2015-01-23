
var app = angular.module('xcontrols');

//extend controller
app.controller('xcPouchCtrl', function($scope, $controller, $http, LowlaFactory, configService) {

	$controller('xcController', { $scope: $scope });

    $scope.numContacts = 0;

    configService.setEndpoint( "example" );

    //get number of items
    LowlaFactory.info().then( function(res) {
      console.log('found ' + res.count + ' contacts', (new Date().getTime() ) );
      $scope.numContacts = res.count;
    });

    $scope.loadData = function() {

    	//load data from (mongo) REST API to fill local LowlaDB

      console.log('load data', (new Date().getTime()) );

		  $http.get('/api/Contacts').then( function( data ) {
        console.log('data loaded - inserting into LowlaDb', (new Date().getTime()) );

        LowlaFactory.insert( data.data)
        .then( function(res) {
          console.log('data inserted - query items', (new Date().getTime() ) );
          LowlaFactory.info().then( function(res) {
            console.log('num items in lowla db: ' + res.count, (new Date().getTime() ) );
            $scope.numContacts = res.count;
            $scope.$apply();
          });
        });
  		 
  		});

    };

    $scope.clearData = function() {

      LowlaFactory.deleteAll().then( function(res) {
        $scope.numContacts = 0;
        $scope.$apply();
      });

    };

});

