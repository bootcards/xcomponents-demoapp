xcomponents.appVersion = '0.2';
xcomponents.menuAlignRight = false;
xcomponents.menuOptions = [
		{ label : 'Dashboard', url : '/index.html', icon : 'fa-dashboard' },
		{ label : 'Contacts', url : 'contacts.html', icon : 'fa-users' }
	];

xcomponents.footerTitle = "XComponents | version " + xcomponents.appVersion;
xcomponents.footerOptions = xcomponents.menuOptions;
xcomponents.modelName = 'Contact';

xcomponents.fields = [
		{ label : 'First name' , field: 'firstName', required: true, read: false},
		{ label : 'Last name' , field: 'lastName', required: true, read: false},
		{ field : 'name', edit: false, formula : ['firstName', 'lastName'] },
		{ field : 'title' }, 
		{ field : 'city' },
		{ field : 'company' },
		{ field : 'country', read : false},
		{ label : 'Mobile enabled', field : 'mobileEnabled', type : 'toggle', labelTrue : 'On', labelFalse : 'Off'},
		{ field : 'devices', type : 'select-multiple', options : ['iPad 4', 'iPad Air', 'iPhone 6', 'iPhone 6 Plus', 'iPod Touch']},
		{ label : 'Email' , field:'email', type:'email', required: true},
		{ label : 'Phone', field:'phone', type: 'phone'},
		{ field : 'comments', type : 'multiline'}
	];

xcomponents.imageBase = 'http://demo.linqed.eu/unplugged/xcontrols-latest.nsf/';

xcomponents.addCallback( function() { 
  
  var app = angular.module('xcomponents');

  //extend controller
  app.controller('xcPouchCtrl', function($scope, $controller, $http, LowlaFactory) {

  	$controller('xcController', { $scope: $scope });

      $scope.numContacts = 0;
      var dbName = 'example';

      //get number of items
      LowlaFactory.info(dbName).then( function(res) {
        console.log('found ' + res.count + ' contacts', (new Date().getTime() ) );
        $scope.numContacts = res.count;
      });

      $scope.loadData = function() {

      	//load data from (mongo) REST API to fill local LowlaDB

        console.log('load data', (new Date().getTime()) );

  		  $http.get('/api/Contacts').then( function( data ) {
          console.log('data loaded - inserting into LowlaDb', (new Date().getTime()) );

          LowlaFactory.insert( dbName, data.data)
          .then( function(res) {
            console.log('data inserted - query items', (new Date().getTime() ) );
            LowlaFactory.info(dbName).then( function(res) {
              console.log('num items in lowla db: ' + res.count, (new Date().getTime() ) );
              $scope.numContacts = res.count;
              $scope.$apply();
            });
          });
    		 
    		});

      };

      $scope.clearData = function() {

        LowlaFactory.deleteAll(dbName).then( function(res) {
          $scope.numContacts = 0;
          $scope.$apply();
        });

      };

  });

});

