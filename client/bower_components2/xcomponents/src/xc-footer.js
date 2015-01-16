
var app = angular.module('xcontrols');

app.directive('xcFooter', function() {

	return {

		replace : true,
		restrict : 'E',
		templateUrl : 'xc-footer.html',
		transclude : true

	};

});