xcomponents.appVersion = '0.2';

xcomponents.menuAlignRight = false;

xcomponents.menuOptions = [
		
		{ label : 'Dashboard', url : 'index.html', icon : 'fa-dashboard' },
		{ label : 'Companies', url : 'companies.html', icon : 'fa-building-o' },
		{ label : 'Contacts', url : 'contacts.html', icon : 'fa-users' },
		{ label : 'Notes', url : 'notes.html', icon : 'fa-clipboard' },
		{ label : 'Charts', url : 'charts.html', icon : 'fa-bar-chart-o' },
		{ label : 'Settings', url : 'settings.html', icon : 'fa-gears' },

	];

xcomponents.footerTitle = "XComponents | version " + xcomponents.appVersion;
xcomponents.footerOptions = [
		{ label : 'Dashboard', url : '/index.html', icon : 'fa-dashboard'},
		{ label : 'Contacts', url : 'contacts.html', icon : 'fa-users' }
	];

//set up models
xcomponents.models['contact'] = {
	name : 'Contact',
	fields : [
		{ label : 'First name' , field: 'firstName', required: true, read: false},
		{ label : 'Last name' , field: 'lastName', required: true, read: false},
		{ field : 'name', edit: false, formula : ['firstName', 'lastName'] },
		{ field : 'title' }, 
		{ field : 'city' },
		{ field : 'company' },
		{ field : 'country', read : false},
		{ label : 'Mobile enabled', field : 'mobileEnabled', type : 'toggle', labelTrue : 'On', labelFalse : 'Off'},
		{ label : 'Device (local)', field : 'devicesPersonal', type : 'select', options : ['iPad 4', 'iPad Air', 'iPhone 6', 'iPhone 6 Plus', 'iPod Touch']},
		{ label : 'Devices (remote)', field : 'devicesBusiness', type : 'select-multiple', options : { endpoint:'/api/Devices', label : 'name', value : 'id'} },
		{ label : 'Email' , field:'email', type:'email', required: true},
		{ label : 'Phone', field:'phone', type: 'phone'},
		{ field : 'comments', type : 'multiline'}
	],
	imageBase : 'http://demo.linqed.eu/unplugged/xcontrols-latest.nsf/'
};

xcomponents.models['company'] = {
	name : 'Company',
	fields : [
		{ field : 'name', required : true},
		{ field : 'city' },
		{ field : 'country', read : false},
		{ field : 'type', read : false, type : 'select', options:['Prospect', 'Customer', 'Inactive'] },
		{ field : 'website', type : 'link' },
		{ field : 'phone', type :'phone' }
	],
	imageBase : 'http://demo.linqed.eu/unplugged/xcontrolssampler_v1_2.nsf/'
};

xcomponents.models['note'] = {
	name : 'Note',
	fields : [
		{ field : 'subject', required : true, filter : 'notesname' }, 
		{ field : 'date', type :'date', required : true, 'default' : 'now' },
		{ field : 'details', type : 'html', label : null }
	],
	imageBase : 'http://demo.linqed.eu/unplugged/xcontrols-latest.nsf/'
};

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

	app.config(['$routeProvider', function($routeProvider) {

console.log('set up router');

		  $routeProvider
			 .when('/login', {
			        templateUrl: 'partials/test.html',
			        controller: 'PhoneListCtrl'
			      })

		    .otherwise({
		      redirectTo: '/home'
		    });
		}]);
	
	
	app.run(function($rootScope, $location, $cookieStore) {
		  // register listener to watch route changes
		  
			if ($rootScope.apikey == null) {
		  		$location.path("/login");
		    }

		  $rootScope.$on("$routeChangeStart", function(event, next, current) {
		  	console.log('rcs');
		    if ($cookieStore.get('apikey')){
		      $rootScope.apikey = $cookieStore.get('apikey');
		      $rootScope.user = $cookieStore.get('user');
		    }
		    if ($rootScope.apikey == null) {
		      // no logged user, we should be going to #login
		      if (next.templateUrl == "/login/login.html") {
		        // already going to #login, no redirect needed
		      } else {
		        // not going to #login, we should redirect now
		        $location.path("/login");
		      }
		    }
		  });
		});


	app.run( [ '$http', '$rootScope', function($http, $rootScope) {

		//inject custom headers for $http calls
		$http.defaults.headers.common['X-Custom'] = 'custom header';

	} ] );

} );