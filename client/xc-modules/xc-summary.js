

var app = angular.module('xcontrols');

app.directive('xcSummary', function() {

	return {

		scope : {
			title : '@title',
		},

		replace : true,
		restrict : 'E',
		transclude : true,
		templateUrl : 'xc-modules/xc-summary.html',

		/*controller : function() {

			console.log('controller');

		},

		link : function() {

			console.log('link');
		}*/

	};

});