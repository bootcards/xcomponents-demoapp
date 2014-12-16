
var app = angular.module('xcontrols');

app.directive('xcHeader', function() {

	return {

		scope : {
			title : '@'
		},

		replace : true,
		restrict : 'E',
		templateUrl : 'xcomponents/src/xc-header.html',

		controller : function($scope, xcUtils) {

			$scope.menuOptions = xcUtils.getConfig('menuOptions');
			$scope.appVersion = xcUtils.getConfig('appVersion');

			var loc = window.location.href;

			$scope.isActive = function(menuOption) {
				return (loc.indexOf(menuOption.url)> -1);
			};

		}

	};

});