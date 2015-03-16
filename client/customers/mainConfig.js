xcomponents.appVersion = '0.1';

xcomponents.menuAlignRight = false;

xcomponents.menuOptions = [
		
		{ label : 'Dashboard', url : 'index.html', icon : 'fa-dashboard' },
		{ label : 'Companies', url : 'companies.html', icon : 'fa-building-o' },
		{ label : 'Contacts', url : 'contacts.html', icon : 'fa-users' },
		{ label : 'Notes', url : 'notes.html', icon : 'fa-clipboard' },
		{ label : 'Charts', url : 'charts.html', icon : 'fa-bar-chart-o' },
		{ label : 'Settings', url : 'settings.html', icon : 'fa-gears' },

	];

xcomponents.footerOptions = [
		{ label : 'Dashboard', url : '/index.html', icon : 'fa-dashboard'},
		{ label : 'Contacts', url : 'contacts.html', icon : 'fa-users' }
	];

//example of setting custom headers that will be sent along with every http request
xcomponents.addCallback( function() {
		
	var app = angular.module('xcomponents');



	app.run( [ '$http', '$rootScope', function($http, $rootScope) {

		console.log('set custom headers');
		$http.defaults.headers.common['X-Custom'] = 'custom header';

	} ] );

} );