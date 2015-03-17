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

	//example: setup a custom filter
	app.filter('notesname', function() {

		return function(input) {

		    if (!input){
		      return "";
		    }
		  	try{
		      input = JSON.parse(input);
		    }catch(e){
		      input = [input];
		    }
		    var out = [];
		    for (var i=0; i<input.length; i++){
		      var name = input[i];
		      if (name.indexOf("CN=") > -1){
		        name = name.replace("CN=", "");
		        name = name.replace("OU=", "");
		        name = name.replace("O=", "");
		      }
		      out.push(name);
		    }
		    return out.join(",");
		};
	});



	app.run( [ '$http', '$rootScope', function($http, $rootScope) {

		console.log('set custom headers');
		$http.defaults.headers.common['X-Custom'] = 'custom header';

	} ] );

} );