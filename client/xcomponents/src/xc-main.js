/*
 * Main XComponents module
 *
 * Note: we need to add all dependencies for this module here, so we can reference
 * the module using just angular.module('<modname>');
 */

var app = angular.module('xcontrols', [
	'templates-main',
	'ngResource',
	'ngAnimate'
]);

app.controller('xcController', function($rootScope, $scope, $timeout) {
	
	$scope.menuOptions = [];

	//load the OS specific CSS
	var userAgent = navigator.userAgent;
	$scope.iOS = (/(iPhone|iPad|iPod)/gi).test(userAgent);
	$scope.Android = (/(Android)/gi).test(userAgent);
	var css = 'bower_components/bootcards/dist/css/';

	if ($scope.iOS) {
		css += 'bootcards-ios-lite.min.css';
	} else if ($scope.Android) {
		css += 'bootcards-android-lite.min.css';
	} else {
		css += 'bootcards-desktop-lite.min.css';
	}
	
	var head = angular.element(document.getElementsByTagName('head')[0]);
	head.append("<link rel='stylesheet' href='" + css + "' />");

	//remove hidden class from body to show content
	$('body').removeClass('hidden');

	if (typeof xcontrols != 'undefined') {

		console.log('set XComponents config');

		var config = xcontrols;

		if (config.fields) {
			console.log('got fields')

			config.fieldsRead = [];		//list of fields in read mode
			config.fieldsEdit = [];		//list of fields in edit mode
			config.fieldsFormula = [];	//list of field formulas

			//add labels if not specified (proper cased field name)
			for (var i=0; i<config.fields.length; i++) {
				var f = config.fields[i];

				if (!f.type) {
					f.type = 'text';		//default type=text
				}

				if ( !f.hasOwnProperty('label') ) {
					f.label = f.field.substring(0,1).toUpperCase() + f.field.substring(1);
				}
				//set 'show in read mode' property
				if ( !f.read ) {
					f.read = true;
				}
				//set 'show in edit mode' property
				if ( !f.edit ) {
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
		}

		$rootScope.config = xcontrols;

	}

	$timeout( function() {
		//console.log($('[data-toggle=offcanvas]').length );
		bootcards.init( {
	        offCanvasHideOnMainClick : true,
	        offCanvasBackdrop : false,
	        enableTabletPortraitMode : true,
	        disableRubberBanding : true,
	        disableBreakoutSelector : 'a.no-break-out'
	      });
	}, 500);



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

app.run( function() {
	FastClick.attach(document.body);

});


// Production steps of ECMA-262, Edition 5, 15.4.4.14
// Reference: http://es5.github.io/#x15.4.4.14
if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function(searchElement, fromIndex) {

    var k;

    // 1. Let O be the result of calling ToObject passing
    //    the this value as the argument.
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }

    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get
    //    internal method of O with the argument "length".
    // 3. Let len be ToUint32(lenValue).
    var len = O.length >>> 0;

    // 4. If len is 0, return -1.
    if (len === 0) {
      return -1;
    }

    // 5. If argument fromIndex was passed let n be
    //    ToInteger(fromIndex); else let n be 0.
    var n = +fromIndex || 0;

    if (Math.abs(n) === Infinity) {
      n = 0;
    }

    // 6. If n >= len, return -1.
    if (n >= len) {
      return -1;
    }

    // 7. If n >= 0, then Let k be n.
    // 8. Else, n<0, Let k be len - abs(n).
    //    If k is less than 0, then let k be 0.
    k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

    // 9. Repeat, while k < len
    while (k < len) {
      // a. Let Pk be ToString(k).
      //   This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the
      //    HasProperty internal method of O with argument Pk.
      //   This step can be combined with c
      // c. If kPresent is true, then
      //    i.  Let elementK be the result of calling the Get
      //        internal method of O with the argument ToString(k).
      //   ii.  Let same be the result of applying the
      //        Strict Equality Comparison Algorithm to
      //        searchElement and elementK.
      //  iii.  If same is true, return k.
      if (k in O && O[k] === searchElement) {
        return k;
      }
      k++;
    }
    return -1;
  };
}
