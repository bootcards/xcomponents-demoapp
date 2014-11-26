

var app = angular.module('xcontrols');

app.directive('xcSummaryItem', function() {

	return {

		scope : {
			title : '@title',
			target : '@target',
			icon : '@icon',
			count : '@count'
		},

		replace : true,
		restrict : 'E',
		templateUrl : 'xc-modules/xc-summary-item.html',

		/*controller : function() {

			console.log('controller');

		},

		link : function() {

			console.log('link');
		}*/

	};

});