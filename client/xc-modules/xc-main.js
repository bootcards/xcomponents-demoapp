/*
 * Main XComponents module
 *
 * Note: we need to add all dependencies for this module here, so we can reference
 * the module using just angular.module('<modname>');
 */

var app = angular.module('xcontrols', [

	'ngResource',
	'ngAnimate'

]);

app.controller('xcController', function($rootScope, $scope) {
	
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

	//remove hidden class from body to show content
	$('body').removeClass('hidden');

	if (typeof xcontrols != 'undefined') {

		console.log('set XComponents config');

		var config = xcontrols;

		config.fieldsRead = [];		//list of fields in read mode
		config.fieldsEdit = [];		//list of fields in edit mode
		config.fieldsFormula = [];	//list of field formulas

		//add labels if not specified (proper cased field name)
		for (var i=0; i<config.fields.length; i++) {
			var f = config.fields[i];
			if ( !f.hasOwnProperty('label') ) {
				f.label = f.field.substring(0,1).toUpperCase() + f.field.substring(1);
			}
			//set 'show in read mode' property
			if ( !f.hasOwnProperty('read') ) {
				f.read = true;
			}
			//set 'show in edit mode' property
			if ( !f.hasOwnProperty('edit') ) {
				f.edit = true;
			}

			if (f.read) {
				config.fieldsRead.push(f);
			}

			if (f.edit) {
				config.fieldsEdit.push(f);
			}
			if ( f.hasOwnProperty('formula') && f.formula != null ) {
				config.fieldsFormula.push(f);
			}
			if (f.isSummary) {
				config.summaryField = f.field;
			}
			if (f.isDetail) {
				config.detailField = f.field;
			}
		}

		$rootScope.config = xcontrols;
	}

});

app.factory('xcUtils', function($rootScope) {

	return {

		getConfig : function(param) {
			if ($rootScope.config) {
				return $rootScope.config[param];
			}
		},

		calculateFormFields : function(form) {

			//add computed fields: get the list of fields that need to be computed
			var f = $rootScope.config['fieldsFormula'];

			for (var i=0; i<f.length; i++) {
				
				var fieldName = f[i].field;
				var fields = f[i].formula;
				var _res = [];

				for (var j=0; j<fields.length; j++) {
					_res.push( form[ fields[j] ] );
				}

				form[fieldName] = _res.join(' ');

			}
		}
		/*

		query : function(list, filter) {

			var results = [];
			var len = list.length;

			for (var i=0; i<len; i++) {
				var it = list[i];

				if (it.firstName.indexOf(filter)>-1 ||) {
					results.push(it);
				}

			}


			return results;

		}*/

	};

});