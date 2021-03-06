
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
  app.controller('xcCustomersCtrl', function($scope, $controller, RESTFactory) {

  	$controller('xcController', { $scope: $scope });

      $scope.numContacts = 0;
      $scope.numCompanies = 0;
      $scope.numNotes = 0;

      RESTFactory.info("/api/Contacts/:id").then( function(res) {
      	$scope.numContacts = res.count;
      });

      RESTFactory.info("/api/Companies/:id").then( function(res) {
      	$scope.numCompanies = res.count;
      });

      RESTFactory.info("/api/Notes/:id").then( function(res) {
      	$scope.numNotes = res.count;
      });

  
  });

});

