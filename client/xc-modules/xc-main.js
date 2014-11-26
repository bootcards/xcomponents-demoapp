/*
 * Define the main Angular module
 *
 * Note: we need to add all dependencies for this module here, so we can reference
 * the module using just angular.module('<modname>');
 */

var app = angular.module('xcontrols', [

	'ngResource',
	'ngAnimate'

]);

app.controller('xcController', function($scope) {
	
	//load the OS specific CSS
	var userAgent = navigator.userAgent;
	var iOS = (/(iPhone|iPad|iPod)/gi).test(userAgent);
	var css = 'bower_components/bootcards/dist/css/';

	if (iOS) {
		css += 'bootcards-ios-lite.min.css';
		$scope.iOS = true;
		$scope.Android = false;
	} else {
		css += 'bootcards-android-lite.min.css';
		$scope.iOS = false;
		$scope.Android = true;
	}
	
	var head = angular.element(document.getElementsByTagName('head')[0]);
	head.append("<link rel='stylesheet' href='" + css + "' />");

	//remove hidden class to show content
	$('body').removeClass('hidden');

});
