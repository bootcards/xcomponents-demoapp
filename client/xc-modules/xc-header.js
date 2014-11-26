
var app = angular.module('xcontrols');

app.directive('xcHeader', function() {

	return {

		scope : {
			title : '@title'
		},

		replace : true,
		restrict : 'AE',
		templateUrl : 'xc-modules/xc-header.html',

		/*controller : function() {

			console.log('controller');

		},

		link : function() {

			console.log('link');
		}*/

	};

});