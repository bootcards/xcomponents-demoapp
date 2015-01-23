
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
app.controller('xcCustomersCtrl', function($scope, $controller, RESTFactory, configService) {

	$controller('xcController', { $scope: $scope });

    $scope.numContacts = 0;
    $scope.numCompanies = 0;
    $scope.numNotes = 0;

	configService.setEndpoint( "/api/Contacts/:id" );
    RESTFactory.info().then( function(res) {
    	$scope.numContacts = res.count;
    });

    configService.setEndpoint( "/api/Companies/:id" );
    RESTFactory.info().then( function(res) {
    	$scope.numCompanies = res.count;
    });

    configService.setEndpoint( "/api/Notes/:id" );
    RESTFactory.info().then( function(res) {
    	$scope.numNotes = res.count;
    });


});

