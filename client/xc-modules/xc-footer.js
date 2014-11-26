
var app = angular.module('xcontrols');

app.directive('xcFooter', function() {

	return {

		replace : true,
		restrict : 'E',
		templateUrl : 'xc-modules/xc-footer.html',
		transclude : true,

		/*controller : function() {

			console.log('controller');

		},

		link : function() {

			console.log('link');
		}*/

	};

});