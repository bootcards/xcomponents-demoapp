
var app = angular.module('xcontrols');

app.directive('xcLogin', function() {

	return {

		scope : {
		},

		replace : true,
		restrict : 'E',
		templateUrl : 'xc-login.html',

		controller : function($scope) {

			$scope.isSignedIn = false;

			$scope.login = function(form, modalId) {

				if (!form.$valid) { alert('Please fill in all required fields'); return; }

				$(modalId).modal('hide');

				console.log('sing in');

			};

		}
		/*

		link : function() {

			console.log('link');
		}*/

	};

});