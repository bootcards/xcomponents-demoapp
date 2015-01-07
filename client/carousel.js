var app = angular.module('xcontrols');

app.controller('xcCarouselCtrl', function($scope) {

	$scope.slides = [
		{image:"images/11800666-communication-needs-and-the-business-world.jpg", 
			"text" : "Praesent eros lectus, imperdiet id vestibulum laoreet, malesuada ac elit. Quisque egestas dolor sit amet mi euismod, at sodales elit auctor. Etiam feugiat nibh sed metus laoreet, in consequat lectus ullamcorper."},
		{image:"images/j0407031.jpg", 
			"text" : "Etiam in dignissim erat. Nulla condimentum lectus orci, et dignissim augue suscipit ac. Sed mollis porttitor ornare. Fusce vel efficitur est. Praesent eros lectus, imperdiet id vestibulum laoreet, malesuada ac elit."},
		{image : "images/fog.jpeg", "text" : "Fog"},
		{image : "images/mountain.jpeg", "text" : "Mountain"},
		{image : "images/bike.jpeg", "text" : "Bike"}
		];

});
