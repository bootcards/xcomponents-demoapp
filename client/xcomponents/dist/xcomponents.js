/*
 * Main XComponents module
 *
 * Note: we need to add all dependencies for this module here, so we can reference
 * the module using just angular.module('<modname>');
 */

var app = angular.module('xcontrols', [
	'templates-main',
	'ngResource',
	'ngAnimate',
	'ngSanitize',
	'ui.bootstrap'
]);

app.controller('xcController', function($rootScope, $scope, $timeout) {
	
	$scope.menuOptions = [];

	//load the OS specific CSS
	var userAgent = navigator.userAgent;
	$scope.iOS = (/(iPhone|iPad|iPod)/gi).test(userAgent);
	$scope.Android = (/(Android)/gi).test(userAgent);
	var css = 'xcomponents/bower_components/bootcards/dist/css/';

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

/* xcomponents 1.0.0 2015-01-06 8:13 */

var app = angular.module('xcontrols');

app.directive('xcBase', function() {

	return {

		scope : {
			title : '@',
			footerText : '@'
		},

		replace : true,
		restrict : 'E',
		transclude : true,
		templateUrl : 'xc-base.html'

	};

});

var app = angular.module('xcontrols');

app.directive('xcChart', function() {

	return {

		scope : {
			title : '@',
			chartId : '@',
			chartType : '@',
			valuePrefix : '@'
		},

		replace : true,
		restrict : 'E',
		templateUrl : 'xc-chart.html',

		controller : function($scope, xcUtils) {

			var charts = xcUtils.getConfig('charts');

			if (typeof $scope.chartId == "undefined") {
				console.error("Chart: missing chart id, e.g. chart-id=\"closed-sales\";");
			}

			$scope.chartData = charts[$scope.chartId];

			$scope.chartTotal = 0;
			for (var i=0; i<$scope.chartData.length; i++) {
				$scope.chartTotal += $scope.chartData[i].value;
			}

			drawDonutChart($scope.chartData, $scope.valuePrefix);

		},

		link : function() {
		}

	};

});





/*
 * Clear the target DOM element and draw the sample charts
 * Samples come from the morris.js site at http://www.oesmith.co.uk/morris.js/
 */
var closedSalesChart = null;

var drawDonutChart = function(chartData, valuePrefix) {

	$("#chartClosedSales").empty();

	//create custom Donut function with click event on the segments
	var myDonut = Morris.Donut;

	myDonut.prototype.redraw = function() {

		var C, cx, cy, i, idx, last, max_value, min, next, seg, total, value, w, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _results;
      this.raphael.clear();
      cx = this.el.width() / 2;
      cy = this.el.height() / 2;
      w = (Math.min(cx, cy) - 10) / 3;
      total = 0;
      _ref = this.values;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        value = _ref[_i];
        total += value;
      }
      min = 5 / (2 * w);
      C = 1.9999 * Math.PI - min * this.data.length;
      last = 0;
      idx = 0;
      this.segments = [];
      _ref1 = this.values;
      for (i = _j = 0, _len1 = _ref1.length; _j < _len1; i = ++_j) {
        value = _ref1[i];
        next = last + min + C * (value / total);
        seg = new Morris.DonutSegment(cx, cy, w * 2, w, last, next, this.data[i].color || this.options.colors[idx % this.options.colors.length], this.options.backgroundColor, idx, this.raphael);
        seg.render();
        this.segments.push(seg);
        seg.on('hover', this.select);
        seg.on('click', this.select);
        last = next;
        idx += 1;
      }
      this.text1 = this.drawEmptyDonutLabel(cx, cy - 10, this.options.labelColor, 15, 800);
      this.text2 = this.drawEmptyDonutLabel(cx, cy + 10, this.options.labelColor, 14);
      max_value = Math.max.apply(Math, this.values);
      idx = 0;
      _ref2 = this.values;
      _results = [];
      for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
        value = _ref2[_k];
        if (value === max_value) {
          this.select(idx);
          break;
        }
        _results.push(idx += 1);
      }
      return _results;
	};

	closedSalesChart = myDonut({
	    element: 'chartClosedSales',
	    data: chartData,
	    formatter: function (y, data) { 
	    	//prefixes the values by an $ sign, adds thousands seperators
			nStr = y + '';
			x = nStr.split('.');
			x1 = x[0];
			x2 = x.length > 1 ? '.' + x[1] : '';
			var rgx = /(\d+)(\d{3})/;
			while (rgx.test(x1)) {
				x1 = x1.replace(rgx, '$1' + ',' + '$2');
			}
			return valuePrefix + ' ' + x1 + x2;
	    }
	  });

};

//on resize of the page: redraw the charts
$(window)
	.on('resize', function() {
		window.setTimeout( function() {
			if (closedSalesChart !== null) { closedSalesChart.redraw(); }
		}, 250);
	});


//TODO: move to scope
/* toggle between the chart and data */
function toggleChartData(event, chart) {

	var $ev = $(event.target);
	var $chart = $ev.parents('.bootcards-chart');

	if ($chart.length>0) {

		$chart.fadeOut( 'fast', function()  {
			$chart
				.siblings('.bootcards-table')
					.fadeIn('fast');
		});

	} else {
		
		var $data = $ev.parents('.bootcards-table');
		$data.fadeOut( 'fast', function()  {
			$data
				.siblings('.bootcards-chart')
					.fadeIn('fast', function() {
						if (typeof chart != 'undefined' && chart != null) { chart.redraw();}
					});
		});

	}
			
}

var app = angular.module('xcontrols');

app.directive('xcFile', function() {

	return {

		scope : {
			title : '@',
			fileName : '@',
			fileType : '@',
			fileSize : '@',
			summary : '@',
			description : '@',
			previewUrl : '@',
			url : '@',
			allowFavorite : '=',
			allowEmail : '='
			
		},

		replace : true,
		restrict : 'E',
		transclude : true,
		templateUrl : 'xc-file.html'

	};

});

var app = angular.module('xcontrols');

app.directive('xcFooter', function() {

	return {

		replace : true,
		restrict : 'E',
		templateUrl : 'xc-footer.html',
		transclude : true

	};

});
/*
 * Connect to the specified REST API, get all items and render them.
 */

var app = angular.module('xcontrols');

app.directive('xcForm', function($rootScope, $resource) {

	return {

		scope : {
			item : '=',
			itemId : '@',
			url : '@',
			defaultText : '@',
			thumbnailField : '@',
			thumbnailShowWith : '@'
		},

		replace : true,
		restrict : 'E',
		templateUrl: 'xc-form.html',

		controller : function($scope, $resource, xcUtils) {

			$scope.selectedItem = null;
			$scope.fieldsRead = xcUtils.getConfig('fieldsRead');
			$scope.fieldsEdit = xcUtils.getConfig('fieldsEdit');
			$scope.modelName = xcUtils.getConfig('modelName');

			$rootScope.$on('selectItemEvent', function(ev, item) {
				$scope.selectedItem = item;

				if (item == null) {

					$scope.thumbnailSrc==null;
					
				} else {

					if ( $scope.thumbnailField != null && $scope.thumbnailField.length > 0) {
						$scope.thumbnailSrc = xcUtils.getConfig('imageBase') + item[$scope.thumbnailField];
					}

					angular.forEach($scope.fieldsEdit, function(fld) {
						//convert date fields (stored as strings) to JS date objects
						if (fld.type == 'date') {
							$scope.selectedItem[fld.field] = new Date( $scope.selectedItem[fld.field]);
						}
					});
				}

			});

			//load specified entry 
			if (typeof $scope.itemId != 'undefined' ) {
				var Card = $resource($scope.url,  { id : $scope.itemId } );

				Card.get().$promise
				.then( function(item) {
					$scope.selectedItem = item;

					if ( $scope.thumbnailField != null && $scope.thumbnailField.length > 0) {
						$scope.thumbnailSrc = xcUtils.getConfig('imageBase') + item[$scope.thumbnailField];
					}

					angular.forEach($scope.fieldsEdit, function(fld) {
						//convert date fields (stored as strings) to JS date objects
						if (fld.type == 'date') {
							$scope.selectedItem[fld.field] = new Date( $scope.selectedItem[fld.field]);
						}
					});

				})
			}


			$scope.clear = function(fld) {
				/*clear a field*/
				$scope.selectedItem[fld] = "";
			}

			$scope.saveItem = function(form, modalId) {

				if (!form.$valid) { alert('Please fill in all required fields'); return; }

				xcUtils.calculateFormFields($scope.selectedItem);

				var Card = $resource($scope.url, 
					{
						id : $scope.selectedItem.id
					},
					{
						update : {
							method: 'PUT'
						}
					}
				 );

				Card.update($scope.selectedItem).$promise
				.then( function(res) {

					$(modalId).modal('hide');

				})
				.catch( function(err) {
					alert("The item could not be updated: " + err.statusText);
				});

			};

			$scope.deleteItem = function() {
				
				//delete the item
				var Card = $resource($scope.url,  { id : $scope.selectedItem.id } );
				Card.delete();

				$scope.$emit('deleteItemEvent', $scope.selectedItem);

				//remove the selected item 
				$scope.selectedItem = null;

			};

		},

		link : function(scope, elem, attrs) {

			//var Items = $resource(attrs.url);

			//Items.query( function(res) {
			 // scope.items = res;
			//});

		}

	};

});

app.directive('animateOnChange', function($animate) {
	return function(scope, elem, attr) {
			scope.$watch(attr.animateOnChange, function(nv,ov) {
				if (nv!=ov) {
					var c = nv > ov?'change-up':'change';
					$animate.addClass(elem,c, function() {
						$animate.removeClass(elem,c);
					});
				}
			})  
	}  
})


var app = angular.module('xcontrols');

app.directive('xcHeader', function() {

	return {

		scope : {
			title : '@'
		},

		replace : true,
		restrict : 'E',
		templateUrl : 'xc-header.html',

		controller : function($rootScope, $scope, xcUtils, $timeout) {

			$scope.showBackButton = false;

			$scope.menuOptions = xcUtils.getConfig('menuOptions');
			$scope.appVersion = xcUtils.getConfig('appVersion');

			var loc = window.location.href;

			$scope.isActive = function(menuOption) {
				return (loc.indexOf(menuOption.url)> -1);
			};

			$scope.hasSubmenu = function(menuOption) {
				return (menuOption.hasOwnProperty('menuOptions') && menuOption.menuOptions.length>0);
			};

			//add handlers to show the collapsed/ expanded icon on lists with sub-options
			$timeout(function(){

		        $('.offcanvas li')
		        .on('shown.bs.dropdown', function() {
					var a = $(event.srcElement);
					var i = a.children("i");
					i.addClass("fa-chevron-circle-down").removeClass("fa-chevron-circle-right");
				})
				  .on('hidden.bs.dropdown', function() {
					var a = $(event.srcElement);
					var i = a.children("i");
					i.addClass("fa-chevron-circle-right").removeClass("fa-chevron-circle-down");
				});
		    }); 

			$scope.goBack = function() {
				$scope.$emit('selectItemEvent', null);
				$rootScope.hideList = false;
			};
   
		}

	};

});

var app = angular.module('xcontrols');

app.directive('xcImage', function() {

	return {

		scope : {
			title : '@',
			sourceField : '@'
		},

		restrict : 'E',
		replace : true,
		templateUrl: 'xc-image.html',

		controller : function($scope, $rootScope, xcUtils) {

			$scope.imageSrc = null;

			$rootScope.$on('selectItemEvent', function(ev, item) {
				
				$scope.imageSrc = null;

				if ( item[$scope.sourceField] != null && item[$scope.sourceField].length > 0) {
			
					$scope.imageSrc = xcUtils.getConfig('imageBase') + item[$scope.sourceField];

				}
	
			});

		}

	};

});
var app = angular.module("xcontrols");

app.directive("xcList", function($rootScope, $resource) {

   var getUnique = function(arr) {
	   var u = {}, a = [];
	   for(var i = 0, l = arr.length; i < l; ++i){
	      if(u.hasOwnProperty(arr[i])) {
	         continue;
	      }
	      a.push(arr[i]);
	      u[arr[i]] = 1;
	   }
	   return a;
	};

	var sortBy = function(orderBy, orderReversed) {

		return function(a,b) {

			var _a = a[orderBy].toLowerCase();
			var _b = b[orderBy].toLowerCase();
			var modifier = (orderReversed ? -1 : 1);
			if ( _a < _b )
				return -1 * modifier;
			if ( _a > _b )
				return 1 * modifier;
			return 0;
		};

	};

	//group an array by a property of the objects in that array
	//returns an array containing the grouped entries
	var getGroups = function(entries, groupBy, orderBy, orderReversed) {

		var groups = [];
		var numEntries = entries.length;

		//organise results per group
		for (var i=0; i<numEntries; i++) {
			var entry = entries[i];
			var entryGroup = entry[groupBy];
			if (!entryGroup) entryGroup="(none)";

			var added = false;
		   	for (var g in groups) {
		     if (groups[g].name == entryGroup) {
		        groups[g].entries.push( entry);
		        added = true;
		        break;
		     }
		   	}

			if (!added) {
				groups.push({"name": entryGroup, "collapsed" : true, "entries" : [entry] });
			}
		}

	    //sort groups by group name
    	groups.sort( function(a,b) {	
			var _n1 = a['name'];
			var _n2 = b['name'];

			return ( _n1 < _n2 ? -1 : (_n1>_n2 ? 1 : 0));
    	} );

    	//now sort the entries in the group
    	angular.forEach(groups, function(group) {
    		group.entries.sort( sortBy( orderBy, orderReversed));
    	});

		return groups;

	};

	return {

		scope : {

			title : '@',
			type : '@',				/*list type, options: flat (default), categorised, accordion*/
			listWidth : '=' ,
			summaryField : '@',
			detailsField : '@',
			allowSearch : '=?',
			autoloadFirst : '=?',
			allowAdd : '=',
			groupBy : '@',			/*only relevant for categorised, accordion lists*/
			orderBy : '@',
			orderReversed : '@',
			url : '@',
			srcData : '@',
			imageField : '@',		/*image*/
			iconField : '@',		/*icon*/ 
			imagePlaceholderIcon : '@'		/*icon to be used if no thumbnail could be found, see http://fortawesome.github.io/Font-Awesome/icons/ */

		},

		restrict : 'E',
		transclude : true,
		replace : true,
		
		templateUrl: function(elem,attrs) {
			//calculate the template to use
			return 'xc-list-' + attrs.type + '.html';
		},

		link : function(scope, elem, attrs) {

			scope.colLeft = 'col-sm-' + attrs.listWidth;
			scope.colRight = 'col-sm-' + (12 - parseInt(attrs.listWidth, 10) );
			
			var orderReversed = scope.$eval(attrs.orderReversed);		//for booleans

			if ( scope.srcDataEntries) {

				scope.isLoading = false;
				scope.hasMore = false;
				scope.items = scope.srcDataEntries;
				scope.itemsPage = scope.items;
				
			} else {

		
				var Items = $resource(attrs.url);
				
				Items.query( function(res) {

					var numRes = res.length;

					if (scope.type == 'categorised' || scope.type=='accordion') {

						scope.groups = getGroups( res, scope.groupBy, scope.orderBy, orderReversed );
						scope.isLoading = false;
						
						//auto load first entry in the first group
						if (scope.autoloadFirst && !scope.selected && !bootcards.isXS() ) {
							scope.select( scope.groups[0].entries[0] );
						}

					} else {

						//sort the results
						res.sort( sortBy( scope.orderBy, orderReversed ) );

			        	//return first page of results
						var b = [];
						for (var i=0; i<scope.itemsPerPage && i<res.length; i++) {
							b.push( res[i] );
						}

			        	scope.hasMore = b.length < res.length;

						scope.items = res;
						scope.itemsPage = b;
						scope.isLoading = false;

						//auto load first entry in the list
						if (scope.autoloadFirst && !scope.selected && !bootcards.isXS() ) {
							scope.select( res[0] );
						}

					}

				});

			}

		},

		controller: function($rootScope, $scope, $resource, xcUtils) {

			$scope.hideList = false;

			//set defaults
			$scope.allowSearch = (typeof $scope.allowSearch == 'undefined' ? true : $scope.allowSearch);
			$scope.autoloadFirst = (typeof $scope.autoloadFirst == 'undefined' ? false : $scope.autoloadFirst);

			$scope.isLoading = true;
      		$scope.hasMore = false;

			$scope.itemsPerPage = 20;
			$scope.selected = null;
			$scope.itemsPage = [];
      		$scope.numPages = 1;
			
			$scope.modelName = xcUtils.getConfig('modelName');
      		$scope.fieldsRead = xcUtils.getConfig('fieldsRead');
			$scope.fieldsEdit = xcUtils.getConfig('fieldsEdit');
			$scope.imageBase = xcUtils.getConfig('imageBase');
			
			$scope.newItem = {};		//default object for new items

			//custom list entries
			if ($scope.srcData) {
				$scope.srcDataEntries = xcUtils.getConfig( $scope.srcData);
			}

			$scope.toggleCategory = function(expand) {
				angular.forEach( $scope.groups, function(group) {
					if (group.name == expand.name) {
						group.collapsed = !expand.collapsed;
					} else {
						group.collapsed = true;
					}
				});
			};

			$scope.select = function(item) {
		
				$scope.selected = item;

				$scope.$emit('selectItemEvent', item);
				
				if (bootcards.isXS() ) {
					$rootScope.hideList = (item != null);
				} else {
					window.scrollTo(0, 0);
				}
			};

			$scope.showImage = function(item) {
				return $scope.imageField && item[$scope.imageField];
			}
			$scope.showPlaceholder = function(item) {
				return $scope.imagePlaceholderIcon && !item[$scope.imageField];
			}
			$scope.showIcon = function(item) {
				return $scope.iconField && item[$scope.iconField];
			}

			$scope.delete = function(item) {

				//remove an item
				if ($scope.itemsPage) {
					for (var i=0; i<$scope.itemsPage.length; i++) {
						if ($scope.itemsPage[i] == item) {
							//remove from the scope list, set selected to null
							$scope.itemsPage.splice( i, 1);
							$scope.selected = null;
							$scope.$emit('selectItemEvent', null);
							break;
						}
					}
				}
				if ($scope.groups) {
					for( i=$scope.groups.length-1; i>=0; i--) {
						var e = $scope.groups[i].entries;
						for (j=e.length-1; j>=0; j--) {
							if (e[j] == item) {
								$scope.groups[i].entries.splice(j, 1);
								break;
							}
						}
					}
				}
				
			};

			$rootScope.$on('deleteItemEvent', function(ev, item) {
				$scope.delete(item);
				
			});

		    //load more items
		    $scope.loadMore = function() {

		        $scope.isLoading = true;
		        $scope.numPages++;

		        var start = $scope.itemsPage.length;
		        var end = Math.min(start + $scope.itemsPerPage, $scope.items.length);
		        
		        for ( var i=start; i<end; i++) {
		          $scope.itemsPage.push( $scope.items[i]);
		        }

		        $scope.isLoading = false;

		    };

			//save a new item
			$scope.saveNewItem = function(form, modalId) {
		
				if (!form.$valid) { alert('Please fill in all required fields'); return; }

				xcUtils.calculateFormFields($scope.newItem);

				$resource($scope.url).save($scope.newItem).$promise
				.then( function(res) {

					$(modalId).modal('hide');

					var orderReversed = $scope.$eval($scope.orderReversed);		//for booleans
			        var orderBy = $scope.orderBy;

					if ($scope.type == 'categorised' || $scope.type=='accordion') {

						scope.groups = getGroups( res, scope.groupBy, scope.orderBy, orderReversed );

					} else {

						$scope.items.push(res);

				        //resort
				        var ress = $scope.items;

				        ress.sort( sortBy( $scope.orderBy, orderReversed ) );

				        $scope.items = ress;

						//return first page of results
						var b = [];
						for (var i=0; i<$scope.itemsPerPage && i<ress.length; i++) {
							b.push( ress[i]);
						}

						$scope.itemsPage = b;

					}				
     

				})
				.catch( function(err) {
					alert("The item could not be saved: " + err.statusText);
				});
	 
				$scope.newItem = {};		//clear new item

			};


		}

	};

});

var app = angular.module('xcontrols');

app.directive('xcLogin', function() {

	return {

		scope : {
		},

		replace : true,
		restrict : 'E',
		templateUrl : 'xc-login.html',

		controller : function($scope) {

			$scope.isSignedIn = false;

			$scope.login = function(form, modalId) {

				if (!form.$valid) { alert('Please fill in all required fields'); return; }

				$(modalId).modal('hide');

				console.log('sing in');

			};

		}
		/*

		link : function() {

			console.log('link');
		}*/

	};

});

var app = angular.module('xcontrols');

app.directive('xcReading', function() {

	return {

		scope : {
			title : '@',
			footerText : '@'
		},

		replace : true,
		restrict : 'E',
		transclude : true,
		templateUrl : 'xc-reading.html',

		controller : function($scope) {

			$scope.increaseFontSize = function() {
				$(".typographyreadcontent").find("*").each(
					function() {
						$(this).css("font-size",
								(parseInt($(this).css("font-size"), 10) + 2) + "px");
						if (parseInt($(this).css("line-height"), 10) <= parseInt(
								$(this).css("font-size"), 10)) {
							$(this).css(
									"line-height",
									(parseInt($(this).css("line-height"), 10) + 2)
											+ "px");
						}
					});
			};

			$scope.decreaseFontSize = function() {
				$(".typographyreadcontent").find("*").each(
					function() {
						var tagName = $(this).prop("tagName");
						var fontSize = parseInt($(this).css("font-size"), 10);
						var minFontSize = 4;
						if (tagName == "H1") {
							minFontSize = 28;
						} else if (tagName == "H2") {
							minFontSize = 24;
						} else if (tagName == "H3") {
							minFontSize = 18;
						} else if (tagName == "H4") {
							minFontSize = 12;
						} else if (tagName == "H5") {
							minFontSize = 8;
						}
						if (fontSize - 2 >= minFontSize) {
							$(this).css("font-size", (fontSize - 2) + "px");
							if (parseInt($(this).css("line-height"), 10) > 24) {
								$(this).css(
										"line-height",
										(parseInt($(this).css("line-height"), 10) - 2)
												+ "px");
							}
						}
					});
			}


		}

	};

});


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
		templateUrl : 'xc-summary-item.html'

	};

});

var app = angular.module('xcontrols');

app.directive('xcSummary', function() {

	return {

		scope : {
			title : '@',
			footerText : '@'
		},

		replace : true,
		restrict : 'E',
		transclude : true,
		templateUrl : 'xc-summary.html'

	};

});

var app = angular.module('xcontrols');

app.directive('xcToggle', function() {

	return {

		replace : true,
		restrict : 'E',

		scope : {
			value: '=ngModel'
		},

		template : '<div class="bootcards-toggle"><div class="bootcards-toggle-handle"></div></div>',

		link : function (scope, element, attrs) {
            element.bind('click', function () {
            	if (element.hasClass('active')) {
             		scope.value = 'false';
             		element.removeClass('active');
             	} else {
             		scope.value = 'true';
             		element.addClass('active');
             	}
            });

            if (scope.value == 'true') {
            	element.addClass('active');
            }

        }

	};

});

var app = angular.module('xcontrols');

app.directive('xcUpload', function() {

	return {

		scope : {
			title : '@'
		},

		replace : true,
		restrict : 'E',
		transclude : true,
		templateUrl : 'xc-upload.html',

		controller : function($scope) {

			$scope.targetWidth = 0;
			$scope.targetHeight = 0;
			$scope.doCrop = false;
			$scope.customSelect = null;
			$scope.orientation = 0;
		
			$scope.init = function() {
				
				this.customSelect = $('.js-custom-select-var').text();
				
				if (this.customSelect != null && this.customSelect.length>0) {
				
					// move the 'photo select' button to a custom location
					var move = $('.js-photouploader-upload');
					var to = $(this.customSelect);
					
					if (move.length==1 && to.length==1) {
						move.appendTo(to);
						
						// hide the default photo select
						$('.js-photouploader .photoUpload').hide();

					}
				}
			};
	
			$scope.loadImage = function( file) {
				
				loadImage(
			        file,
			        function (canvas) {
			        	
			        	// clean up
			            $('.js-photouploader-preview img, .js-photouploader canvas').remove();
			            
			            canvas.id = 'photoUploadCanvas';
			     
			        	$('.js-photouploader-preview').append(canvas);
			        	$('.js-photouploader-rotate').removeClass('hidden');
			        	$('.js-photouploader-preview .fa').addClass('hidden');
			        },
			        {
			        	maxWidth : $scope.targetWidth,
			        	maxHeight : $scope.targetHeight,
			        	crop : $scope.doCrop,
			        	canvas : true,
			        	orientation : $scope.orientation
			        }
				);

			};
				
			$scope.rotateImage = function(clockWise) {
				
				var $resizeFileUpload = $('.js-photouploader-upload');
				
				if ( $resizeFileUpload[0].files.length === 0) {
					return;
				}
				var file = $resizeFileUpload[0].files[0];

				if ($scope.orientation == 0) {
					$scope.orientation = (clockWise ? 6 : 8);
				} else if ($scope.orientation == 6) {
					$scope.orientation = (clockWise ? 3 : 0);
				} else if ($scope.orientation == 3) {
					$scope.orientation = (clockWise ? 8 : 6);
				} else if ($scope.orientation == 8) {
					$scope.orientation = (clockWise ? 0 : 3);
				}
				
				$scope.loadImage(file);
			};

		}

	};

});
angular.module('templates-main', ['xc-base.html', 'xc-chart.html', 'xc-file.html', 'xc-footer.html', 'xc-form.html', 'xc-header.html', 'xc-image.html', 'xc-list-accordion.html', 'xc-list-categorised.html', 'xc-list-flat.html', 'xc-list-heading.html', 'xc-login.html', 'xc-reading.html', 'xc-summary-item.html', 'xc-summary.html', 'xc-upload.html']);

angular.module("xc-base.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("xc-base.html",
    "<div class=\"panel panel-default\"> \n" +
    "  <div class=\"panel-heading clearfix\">\n" +
    "    <h3 class=\"panel-title pull-left\">{{::title}}</h3>\n" +
    "      <a class=\"btn btn-primary pull-right\" href=\"#\" onclick=\"alert('This button is disabled')\">\n" +
    "        <i class=\"fa fa-pencil\"></i>Edit\n" +
    "      </a>\n" +
    "    </div>\n" +
    "    <div class=\"list-group\">\n" +
    "      <ng-transclude></ng-transclude>\n" +
    "    </div>\n" +
    "  <div class=\"panel-footer\">\n" +
    "    <small class=\"pull-left\">{{footerText}}</small>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("xc-chart.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("xc-chart.html",
    "<div>\n" +
    "\n" +
    "	<div class=\"panel panel-default bootcards-chart\">\n" +
    "		\n" +
    "		<div class=\"panel-heading\">\n" +
    "			<h3 class=\"panel-title\">{{title}}</h3>					\n" +
    "		</div>\n" +
    "\n" +
    "		<div>\n" +
    "\n" +
    "			<!--bar chart-->\n" +
    "			<div id=\"chartClosedSales\"></div>\n" +
    "\n" +
    "			<div class=\"panel-footer\">\n" +
    "				<button class=\"btn btn-default btn-block\"\n" +
    "					onClick=\"toggleChartData(event)\">\n" +
    "					<i class=\"fa fa-table\"></i>\n" +
    "					Show Data\n" +
    "				</button>				\n" +
    "			</div>\n" +
    "		</div>\n" +
    "		\n" +
    "		<div class=\"panel-footer\">\n" +
    "			<small class=\"pull-left\">Built with Bootcards - Chart Card</small>\n" +
    "		</div>					\n" +
    "\n" +
    "	</div>		\n" +
    "\n" +
    "	<!-- Table Card data -->\n" +
    "	<div class=\"panel panel-default bootcards-table\" style=\"display:none\">\n" +
    "		<div class=\"panel-heading\">\n" +
    "			<h3 class=\"panel-title\">{{title}}</h3>							\n" +
    "		</div>	\n" +
    "		<table class=\"table table-hover\">\n" +
    "			<thead>				\n" +
    "				<tr class=\"active\"><th>Name</th><th class=\"text-right\">Sales value</th></tr>\n" +
    "			</thead>\n" +
    "			<tbody>\n" +
    "				<tr ng-repeat=\"row in chartData\">\n" +
    "					<td>{{row.label}}</td><td class=\"text-right\">{{valuePrefix}} {{row.value | number : 0}}</td>\n" +
    "				<tr>\n" +
    "					<td><strong>Total</strong></td><td class=\"text-right\"><strong>{{valuePrefix}} {{chartTotal | number : 0}}</strong></td></tr>\n" +
    "			</tbody>\n" +
    "		</table>\n" +
    "		<div class=\"panel-footer\">\n" +
    "			<button class=\"btn btn-default btn-block\" onClick=\"toggleChartData(event, closedSalesChart)\">\n" +
    "				<i class=\"fa fa-bar-chart-o\"></i>\n" +
    "				Show Chart\n" +
    "			</button>				\n" +
    "		</div>\n" +
    "		<div class=\"panel-footer\">\n" +
    "			<small class=\"pull-left\">Built with Bootcards - Table Card</small>\n" +
    "			<a class=\"btn btn-link btn-xs pull-right\"\n" +
    "							href=\"/snippets/table\"\n" +
    "							data-toggle=\"modal\"\n" +
    "							data-target=\"#docsModal\">\n" +
    "							View Source</a>\n" +
    "		</div>													\n" +
    "	</div>\n" +
    "\n" +
    "</div>\n" +
    "");
}]);

angular.module("xc-file.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("xc-file.html",
    "<div class=\"panel panel-default bootcards-file\">\n" +
    "\n" +
    "  <div class=\"panel-heading\">\n" +
    "    <h3 class=\"panel-title\">{{::title}}</h3>\n" +
    "  </div>\n" +
    "  <div class=\"list-group\">\n" +
    "    <div class=\"list-group-item\" ng-if=\"fileName.length>0\">\n" +
    "      <a ng-href=\"{{url}}\" class=\"img-rounded pull-left\">\n" +
    "        <i class=\"fa fa-2x fa-file-pdf-o\"></i>\n" +
    "      </a>\n" +
    "      <h4 class=\"list-group-item-heading\">\n" +
    "        <a ng-href=\"{{url}}\">{{::fileName}}</a>\n" +
    "      </h4>\n" +
    "      <p class=\"list-group-item-text\"><strong>{{::fileType}}</strong></p>\n" +
    "      <p class=\"list-group-item-text\"><strong>{{::fileSize}}</strong></p>\n" +
    "    </div>\n" +
    "    <div class=\"list-group-item\" ng-if=\"summary.length>0\">\n" +
    "      <p class=\"list-group-item-text\"><strong>{{::summary}}</strong></p>\n" +
    "    </div>\n" +
    "    \n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"panel-body\">\n" +
    "{{::description}}\n" +
    "  </div>\n" +
    "\n" +
    "  <img ng-src=\"{{previewUrl}}\" class=\"img-responsive\">\n" +
    "\n" +
    "  <div class=\"panel-footer\">\n" +
    "\n" +
    "    <div class=\"btn-group btn-group-justified\">\n" +
    "      <div class=\"btn-group\">\n" +
    "        <a class=\"btn btn-default\" ng-href=\"{{url}}\" onclick=\"alert('This button is disabled')\">\n" +
    "          <i class=\"fa fa-arrow-down\"></i>\n" +
    "          Download\n" +
    "        </a>\n" +
    "      </div>\n" +
    "      <div class=\"btn-group\" ng-if=\"allowFavorite\">\n" +
    "        <a class=\"btn btn-default\" href=\"#\" onclick=\"alert('This button is disabled')\">\n" +
    "          <i class=\"fa fa-star\"></i>\n" +
    "          Favorite\n" +
    "        </a>\n" +
    "      </div>\n" +
    "      <div class=\"btn-group\" ng-show=\"allowEmail\">\n" +
    "        <a class=\"btn btn-default\" href=\"#\" onclick=\"alert('This button is disabled')\">\n" +
    "          <i class=\"fa fa-envelope\"></i>\n" +
    "          Email\n" +
    "        </a>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "</div>");
}]);

angular.module("xc-footer.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("xc-footer.html",
    "<div class=\"navbar navbar-default navbar-fixed-bottom\">\n" +
    "		<div class=\"container\">\n" +
    "			\n" +
    "			<div class=\"bootcards-desktop-footer clearfix\">\n" +
    "				<p class=\"pull-left\">XComponents | version 0.1</p>\n" +
    "			</div>\n" +
    "\n" +
    "			<div class=\"btn-group\">\n" +
    "				<ng-transclude></ng-transclude>     \n" +
    "			</div>\n" +
    "		</div>\n" +
    "	</div>");
}]);

angular.module("xc-form.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("xc-form.html",
    "<div>\n" +
    "\n" +
    "	<!-- text if no item is selected -->\n" +
    "	<div ng-class=\"{'panel panel-default' : true , 'hidden' : selectedItem || !defaultText }\">\n" +
    "		<div class=\"list-group\">\n" +
    "			<div class=\"list-group-item\">\n" +
    "				{{defaultText}}\n" +
    "			</div>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "\n" +
    "	<!-- card (read) -->\n" +
    "	<div ng-class=\"{'panel panel-default' : true , 'hidden' : !selectedItem}\">\n" +
    "\n" +
    "		<div class=\"panel-heading clearfix\">\n" +
    "			<h3 class=\"panel-title pull-left\">{{modelName}}</h3>\n" +
    "			<a class=\"btn btn-primary pull-right\" data-toggle=\"modal\" data-target=\"#editModal\">\n" +
    "				<i class=\"fa fa-pencil\"></i><span>Edit</span>\n" +
    "			</a>\n" +
    "\n" +
    "		</div>\n" +
    "\n" +
    "		<div class=\"list-group\">\n" +
    "\n" +
    "			<div ng-repeat=\"field in fieldsRead\">\n" +
    "\n" +
    "				<div class=\"list-group-item\" ng-if=\"field.type=='text'\">\n" +
    "					<img ng-if=\"field.field == thumbnailShowWith\" class=\"img-rounded pull-left\"\n" +
    "					ng-src=\"{{thumbnailSrc}}\" />\n" +
    "					<label>{{field.label}}</label>\n" +
    "					<h4 class=\"list-group-item-heading\">{{selectedItem[field.field]}}</h4>\n" +
    "				</div>\n" +
    "				<div class=\"list-group-item\" ng-if=\"field.type=='date'\">\n" +
    "					<label>{{field.label}}</label>\n" +
    "					<h4 class=\"list-group-item-heading\">{{selectedItem[field.field] | date}}</h4>\n" +
    "				</div>\n" +
    "				<div class=\"list-group-item\" ng-if=\"field.type=='select'\">\n" +
    "					<label>{{field.label}}</label>\n" +
    "					<h4 class=\"list-group-item-heading\">{{selectedItem[field.field]}}</h4>\n" +
    "				</div>\n" +
    "				<div class=\"list-group-item\" ng-if=\"field.type=='multiline'\">\n" +
    "					<img ng-if=\"field.field == thumbnailShowWith\" class=\"img-rounded pull-left\"\n" +
    "					ng-src=\"{{thumbnailSrc}}\" />\n" +
    "					<label>{{field.label}}</label>\n" +
    "					<h4 class=\"list-group-item-heading\" ng-bind-html=\"selectedItem[field.field]\"></h4>\n" +
    "				</div>\n" +
    "				<a href=\"mailto:{{selectedItem[field.field]}}\" class=\"list-group-item\" \n" +
    "					ng-if=\"field.type=='email'\">\n" +
    "					<img ng-if=\"field.field == thumbnailShowWith\" class=\"img-rounded pull-left\"\n" +
    "					ng-src=\"{{thumbnailSrc}}\" />\n" +
    "					<label>{{field.label}}</label>\n" +
    "					<h4 class=\"list-group-item-heading\">{{selectedItem[field.field]}}</h4>\n" +
    "				</a>\n" +
    "				<a href=\"tel:{{selectedItem[field.field]}}\" class=\"list-group-item\" \n" +
    "					ng-if=\"field.type=='phone'\">\n" +
    "					<img ng-if=\"field.field == thumbnailShowWith\" class=\"img-rounded pull-left\"\n" +
    "					ng-src=\"{{thumbnailSrc}}\" />\n" +
    "					<label>{{field.label}}</label>\n" +
    "					<h4 class=\"list-group-item-heading\">{{selectedItem[field.field]}}</h4>\n" +
    "				</a>\n" +
    "\n" +
    "			<div>\n" +
    "		</div>\n" +
    "\n" +
    "	</div>\n" +
    "\n" +
    "	<!--modal to edit details-->\n" +
    "	<form class=\"form-horizontal\" name=\"cardForm\" role=\"form\">\n" +
    "	<div class=\"modal fade\" id=\"editModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"editModal\" aria-hidden=\"true\">\n" +
    "		<div class=\"modal-dialog\">\n" +
    "			<div class=\"modal-content\">\n" +
    "			\n" +
    "				<div class=\"modal-header\">\n" +
    "\n" +
    "					<div class=\"btn-group pull-left\">\n" +
    "						<button class=\"btn btn-danger\" data-dismiss=\"modal\" type=\"button\">\n" +
    "							<i class=\"fa fa-times\"></i>Cancel\n" +
    "						</button>\n" +
    "					</div>\n" +
    "				\n" +
    "					<div class=\"btn-group pull-right\">\n" +
    "						<button class=\"btn btn-success\" type=\"button\" ng-click=\"saveItem(cardForm, '#editModal')\">\n" +
    "							<i class=\"fa fa-check\"></i>Save\n" +
    "						</button>\n" +
    "					</div>\n" +
    "					<h4 class=\"modal-title\">Edit {{modelName}}</h4>		\n" +
    "				</div>\n" +
    "				\n" +
    "				<div class=\"modal-body\">\n" +
    "\n" +
    "					<div class=\"form-group\" ng-repeat=\"field in fieldsEdit\" ng-class=\"{ 'has-error': cardForm[field.field].$invalid }\">\n" +
    "						<label class=\"col-xs-3 control-label\">{{field.label}}</label>\n" +
    "						<div class=\"col-xs-9\" ng-if=\"field.type=='text' || field.type=='email' || field.type=='phone'\">\n" +
    "							<input class=\"form-control\" name=\"{{field.field}}\" ng-model=\"selectedItem[field.field]\" ng-required=\"field.required\"  />\n" +
    "							<a class=\"fa fa-times-circle fa-lg clearer\" ng-click=\"clear(field.field)\"></a>\n" +
    "						</div>\n" +
    "						<div class=\"col-xs-9\" ng-if=\"field.type=='date'\">\n" +
    "							<input class=\"form-control\" type=\"date\" name=\"{{field.field}}\" ng-model=\"selectedItem[field.field]\" ng-required=\"field.required\"  />\n" +
    "						</div>\n" +
    "						<div class=\"col-xs-9\" ng-if=\"field.type=='multiline'\">\n" +
    "							<textarea class=\"form-control\" name=\"{{field.field}}\" ng-model=\"selectedItem[field.field]\" ng-required=\"field.required\" />\n" +
    "							<a class=\"fa fa-times-circle fa-lg clearer\" ng-click=\"clear(field.field)\"></a>\n" +
    "						</div>\n" +
    "						<div class=\"col-xs-9\" ng-if=\"field.type=='select'\">\n" +
    "							<select class=\"form-control\" name=\"{{field.field}}\" ng-model=\"selectedItem[field.field]\" ng-required=\"field.required\">\n" +
    "								<option ng-repeat=\"o in field.options\" value=\"{{o}}\">{{o}}</option>\n" +
    "							</select>\n" +
    "						</div>\n" +
    "						<div class=\"col-xs-9\" ng-if=\"field.type=='select-multiple'\">\n" +
    "							<select class=\"form-control\" multiple name=\"{{field.field}}\" ng-model=\"selectedItem[field.field]\" ng-required=\"field.required\" >\n" +
    "								<option ng-repeat=\"o in field.options\" value=\"{{o}}\">{{o}}</option>\n" +
    "							</select>\n" +
    "						</div>\n" +
    "						<div class=\"col-xs-9\" ng-if=\"field.type=='toggle'\">	\n" +
    "							<xc-toggle ng-model=\"selectedItem[field.field]\"></xc-toggle>\n" +
    "						</div>\n" +
    "					</div>\n" +
    "\n" +
    "				</div>\n" +
    "\n" +
    "				<div class=\"modal-footer\">\n" +
    "					<button type=\"button\" class=\"btn btn-danger btn-block\" ng-click=\"deleteItem()\" data-dismiss=\"modal\">\n" +
    "						<i class=\"fa fa-trash-o\"></i>\n" +
    "						Delete Contact\n" +
    "					</button>		\n" +
    "				</div>\n" +
    "\n" +
    "\n" +
    "			</div>\n" +
    "		</div>\n" +
    "	</div>	\n" +
    "	</form>\n" +
    "\n" +
    "</div>");
}]);

angular.module("xc-header.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("xc-header.html",
    "<div>\n" +
    "\n" +
    "<div class=\"navbar navbar-default navbar-fixed-top\" role=\"navigation\">\n" +
    "\n" +
    "	<div class=\"container\">\n" +
    "\n" +
    "		<div class=\"navbar-header\">\n" +
    "\n" +
    "			<a class=\"navbar-brand\">{{::title}}</a>	\n" +
    "\n" +
    "      <button class=\"navbar-toggle\" data-target=\".navbar-collapse\" data-toggle=\"collapse\" type=\"button\">\n" +
    "        <span class=\"sr-only\">Toggle menu</span>\n" +
    "        <span class=\"icon-bar\"></span>\n" +
    "        <span class=\"icon-bar\"></span>\n" +
    "        <span class=\"icon-bar\"></span>\n" +
    "      </button>\n" +
    "\n" +
    "		</div>\n" +
    "\n" +
    "    <!--back button for small displays-->\n" +
    "    <button class=\"btn btn-default btn-back pull-left\" ng-click=\"goBack()\" type=\"button\" ng-show=\"$root.hideList\">\n" +
    "      <i class=\"fa fa-lg fa-chevron-left\"></i><span>Back</span>\n" +
    "    </button>\n" +
    "\n" +
    "		<!--slide-in menu button-->\n" +
    "		<button type=\"button\" class=\"btn btn-default btn-menu pull-left offCanvasToggle\" data-toggle=\"offcanvas\" ng-show=\"!$root.hideList\">\n" +
    "	   <i class=\"fa fa-lg fa-bars\"></i><span>Menu</span>\n" +
    "	   </button>\n" +
    "\n" +
    "    <div class=\"navbar-collapse collapse\">\n" +
    "      <!-- menu options (desktop) -->\n" +
    "      <ul class=\"nav navbar-nav\">\n" +
    "\n" +
    "        <li ng-repeat=\"o in ::menuOptions\" ng-class=\"{'active' : isActive(o), 'dropdown' : hasSubmenu(o)}\">\n" +
    "\n" +
    "          <!--basic option-->\n" +
    "          <a href=\"{{o.url}}\" ng-if=\"!hasSubmenu(o)\">\n" +
    "            <i class=\"fa\" ng-class=\"o.icon ? o.icon : null\"></i>\n" +
    "            {{o.label}}\n" +
    "          </a>\n" +
    "\n" +
    "          <!--dropdown-->\n" +
    "          <a href=\"#\" ng-if=\"hasSubmenu(o)\" class=\"dropdown-toggle\" data-toggle=\"dropdown\">\n" +
    "            <i class=\"fa\" ng-class=\"o.icon ? o.icon : null\"></i>\n" +
    "            {{::o.label}} <span class=\"caret\"></span>\n" +
    "\n" +
    "            <ul class=\"dropdown-menu\">\n" +
    "              <li ng-repeat=\"so in ::o.menuOptions\"  ng-class=\"{'active' : isActive(so)}\">\n" +
    "                <a href=\"{{::so.url}}\">\n" +
    "                  <i class=\"fa fa-fw\" ng-class=\"so.icon ? so.icon : null\"></i>\n" +
    "                  {{::so.label}}\n" +
    "                </a>\n" +
    "              </li>\n" +
    "            </ul>\n" +
    "          </a>\n" +
    "        </li>\n" +
    "      </ul>\n" +
    "    </div>\n" +
    "	</div>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<!--slide in menu-->\n" +
    "  <nav id=\"offCanvasMenu\" class=\"navmenu offcanvas offcanvas-left\">\n" +
    "    <ul class=\"nav\">\n" +
    "      <li ng-repeat=\"o in ::menuOptions\" ng-class=\"{'active' : isActive(o)}\">\n" +
    "\n" +
    "        <!--basic option-->\n" +
    "        <a href=\"{{::o.url}}\" ng-show=\"!hasSubmenu(o)\">\n" +
    "          <i class=\"fa fa-lg\" ng-class=\"o.icon ? o.icon : null\"></i>\n" +
    "          {{::o.label}}\n" +
    "        </a>\n" +
    "\n" +
    "        <!--option with submenu-->\n" +
    "        <a href=\"#\" ng-show=\"hasSubmenu(o)\" class=\"dropdown-toggle\" data-toggle=\"dropdown\">\n" +
    "            <i class=\"fa fa-chevron-circle-right\"></i>\n" +
    "            {{::o.label}}\n" +
    "\n" +
    "            <ul class=\"list-unstyled\">\n" +
    "              <li ng-repeat=\"so in ::o.menuOptions\"  ng-class=\"{'active' : isActive(so)}\">\n" +
    "                <a href=\"{{so.url}}\">\n" +
    "                  <i class=\"fa fa-fw\" ng-class=\"so.icon ? so.icon : null\"></i>\n" +
    "                  {{::so.label}}\n" +
    "                </a>\n" +
    "              </li>\n" +
    "            </ul>\n" +
    "          </a>\n" +
    "      </li>\n" +
    "    </ul>\n" +
    "\n" +
    "    <div ng-show=\"{{appVersion}}\" style=\"margin-top:20px; padding-left: 20px; font-size: 12px; color: #777\">{{appVersion}}</div>\n" +
    "  </nav>\n" +
    "\n" +
    "</div>");
}]);

angular.module("xc-image.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("xc-image.html",
    "<div class=\"panel panel-default bootcards-media\" ng-class=\"{'hidden' : !imageSrc}\">\n" +
    "\n" +
    "	<div ng-show=\"title\" class=\"panel-heading\" ng-class=\"{'hidden' : !title}\">\n" +
    "		<h3 class=\"panel-title\">{{title}}</h3>\n" +
    "	</div>\n" +
    "	<!-- <div class=\"panel-body\">\n" +
    "		description\n" +
    "	</div> -->\n" +
    "	\n" +
    "	<img ng-src=\"{{imageSrc}}\" class=\"img-responsive\" />\n" +
    "\n" +
    "</div>\n" +
    "");
}]);

angular.module("xc-list-accordion.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("xc-list-accordion.html",
    "<div class=\"container bootcards-container\">\n" +
    "\n" +
    " <div class=\"row\">\n" +
    "\n" +
    " 	<div class=\"bootcards-list {{colLeft}}\">\n" +
    "\n" +
    "		<div class=\"panel panel-default\">\n" +
    "\n" +
    "			<ng-include src=\"'xc-list-heading.html'\"></ng-include>\n" +
    "\n" +
    "			<div class=\"list-group\">\n" +
    "\n" +
    "				<div ng-repeat=\"group in groups\" class=\"animate-repeat\">\n" +
    "					<a ng-class=\"{'collapsed' : group.collapsed}\" class=\"list-group-item bootcards-list-subheading\" ng-click=\"toggleCategory(group)\">\n" +
    "						{{group.name}}\n" +
    "					</a>\n" +
    "				\n" +
    "					<a class=\"list-group-item\" ng-show=\"!group.collapsed\" ng-repeat=\"item in group.entries | filter : filter\" ng-click=\"select(item)\"\n" +
    "						ng-class=\"{'active' : selected == item}\">\n" +
    "\n" +
    "						<!--(placeholder) icon-->\n" +
    "						<i ng-if=\"showPlaceholder(item)\" class=\"fa fa-3x pull-left\" ng-class=\"'fa-' + imagePlaceholderIcon\"></i>\n" +
    "						<i ng-if=\"showIcon(item)\" class=\"fa fa-3x pull-left\" ng-class=\"'fa-' + item[iconField]\"></i>\n" +
    "					\n" +
    "						<!--image-->\n" +
    "						<img \n" +
    "						ng-if=\"showImage(item)\"\n" +
    "						class=\"img-rounded pull-left\" \n" +
    "						ng-src=\"{{ imageBase + item[imageField] }}\" />\n" +
    "\n" +
    "						<h4 class=\"list-group-item-heading\">{{item[summaryField]}}</h4>\n" +
    "\n" +
    "						<p class=\"list-group-item-text\">{{item[detailsField]}}</p>\n" +
    "						\n" +
    "					</a>\n" +
    "\n" +
    "					\n" +
    "				</div>\n" +
    "\n" +
    "				<div class=\"list-group-item\" ng-show=\"isLoading\">\n" +
    "					<i class=\"fa fa-spinner fa-spin fa-fw\" style=\"margin-right:0; opacity: 1;\"></i>Loading...\n" +
    "				</div>\n" +
    "\n" +
    "				<div class=\"list-group-item\" ng-show=\"!isLoading && hasMore\" ng-click=\"loadMore()\">\n" +
    "					Load more...\n" +
    "				</div>\n" +
    "\n" +
    "			</div>\n" +
    "\n" +
    "		</div>\n" +
    "\n" +
    "	</div>\n" +
    "\n" +
    "	<div class='bootcards-cards {{colRight}}'>\n" +
    "\n" +
    "		<ng-transclude></ng-transclude>\n" +
    "\n" +
    "	</div>\n" +
    "\n" +
    " </div>\n" +
    "\n" +
    "<!--modal to add details-->\n" +
    "<form class=\"form-horizontal\" name=\"cardNewForm\" role=\"form\">\n" +
    "	<div class=\"modal fade\" id=\"addModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"addModal\" aria-hidden=\"true\">\n" +
    "		<div class=\"modal-dialog\">\n" +
    "			<div class=\"modal-content\">\n" +
    "			\n" +
    "				<div class=\"modal-header\">\n" +
    "\n" +
    "					<div class=\"btn-group pull-left\">\n" +
    "						<button class=\"btn btn-danger\" data-dismiss=\"modal\" type=\"button\">\n" +
    "							Cancel\n" +
    "						</button>\n" +
    "					</div>\n" +
    "				\n" +
    "					<div class=\"btn-group pull-right\">\n" +
    "						<button class=\"btn btn-success\" type=\"button\" ng-click=\"saveNewItem(cardNewForm, '#addModal')\">\n" +
    "							Save\n" +
    "						</button>\n" +
    "					</div>\n" +
    "					<h4 class=\"modal-title\">Add {{modelName}}</h4>		\n" +
    "				</div>\n" +
    "				\n" +
    "				<div class=\"modal-body\">\n" +
    "\n" +
    "					<div class=\"form-group\" ng-repeat=\"field in fieldsEdit\" ng-class=\"{ 'has-error': cardNewForm[field.field].$invalid }\">\n" +
    "						<label class=\"col-xs-3 control-label\">{{field.label}}</label>\n" +
    "						<div class=\"col-xs-9\" ng-if=\"field.type=='text' || field.type=='email' || field.type=='phone'\">\n" +
    "							<input class=\"form-control\" name=\"{{field.field}}\" ng-model=\"newItem[field.field]\" ng-required=\"field.required\"  />\n" +
    "							<a class=\"fa fa-times-circle fa-lg clearer\" ng-click=\"clear(field.field)\"></a>\n" +
    "						</div>\n" +
    "						<div class=\"col-xs-9\" ng-if=\"field.type=='date'\">\n" +
    "							<input class=\"form-control\" type=\"date\" name=\"{{field.field}}\" ng-model=\"newItem[field.field]\" ng-required=\"field.required\"  />\n" +
    "						</div>\n" +
    "						<div class=\"col-xs-9\" ng-if=\"field.type=='multiline'\">\n" +
    "							<textarea class=\"form-control\" name=\"{{field.field}}\" ng-model=\"newItem[field.field]\" ng-required=\"field.required\" />\n" +
    "							<a class=\"fa fa-times-circle fa-lg clearer\" ng-click=\"clear(field.field)\"></a>\n" +
    "						</div>\n" +
    "						<div class=\"col-xs-9\" ng-if=\"field.type=='select'\">\n" +
    "							<select class=\"form-control\" name=\"{{field.field}}\" ng-model=\"newItem[field.field]\" ng-required=\"field.required\">\n" +
    "								<option ng-repeat=\"o in field.options\" value=\"{{o}}\">{{o}}</option>\n" +
    "							</select>\n" +
    "						</div>\n" +
    "						<div class=\"col-xs-9\" ng-if=\"field.type=='select-multiple'\">\n" +
    "							<select class=\"form-control\" multiple name=\"{{field.field}}\" ng-model=\"newItem[field.field]\" ng-required=\"field.required\" >\n" +
    "								<option ng-repeat=\"o in field.options\" value=\"{{o}}\">{{o}}</option>\n" +
    "							</select>\n" +
    "						</div>\n" +
    "						<div class=\"col-xs-9\" ng-if=\"field.type=='toggle'\">	\n" +
    "							<xc-toggle ng-model=\"newItem[field.field]\"></xc-toggle>\n" +
    "						</div>\n" +
    "					</div>\n" +
    "\n" +
    "				</div>\n" +
    "\n" +
    "			</div>\n" +
    "		</div>\n" +
    "	</div>	\n" +
    "</form>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("xc-list-categorised.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("xc-list-categorised.html",
    "<div class='container bootcards-container'>\n" +
    "\n" +
    " <div class='row'>\n" +
    "\n" +
    " 	<div class=\"bootcards-list {{colLeft}}\" ng-show=\"!$root.hideList\">\n" +
    "\n" +
    "		<div class=\"panel panel-default\">\n" +
    "\n" +
    "			<ng-include src=\"'xc-list-heading.html'\"></ng-include>\n" +
    "\n" +
    "			<div class=\"list-group\">\n" +
    "\n" +
    "				<div ng-repeat=\"group in groups | filter : filter\" class=\"animate-repeat\">\n" +
    "					<div class=\"list-group-item bootcards-list-subheading\" >\n" +
    "						{{group.name}}\n" +
    "					</div>\n" +
    "				\n" +
    "					<a class=\"list-group-item\" ng-repeat=\"item in group.entries | filter : filter\" ng-click=\"select(item)\"\n" +
    "						ng-class=\"{'active' : selected == item}\">\n" +
    "\n" +
    "						<!--(placeholder) icon-->\n" +
    "						<i ng-if=\"showPlaceholder(item)\" class=\"fa fa-3x pull-left\" ng-class=\"'fa-' + imagePlaceholderIcon\"></i>\n" +
    "						<i ng-if=\"showIcon(item)\" class=\"fa fa-3x pull-left\" ng-class=\"'fa-' + item[iconField]\"></i>\n" +
    "					\n" +
    "						<!--image-->\n" +
    "						<img \n" +
    "						ng-show=\"showImage(item)\"\n" +
    "						class=\"img-rounded pull-left\" \n" +
    "						ng-src=\"{{ imageBase + item[imageField] }}\" />\n" +
    "\n" +
    "						<h4 class=\"list-group-item-heading\">{{item[summaryField]}}</h4>\n" +
    "\n" +
    "						<p class=\"list-group-item-text\">{{item[detailsField]}}</p>\n" +
    "						\n" +
    "					</a>\n" +
    "\n" +
    "				</div>\n" +
    "\n" +
    "				<div class=\"list-group-item\" ng-show=\"isLoading\">\n" +
    "					<i class=\"fa fa-spinner fa-spin fa-fw\" style=\"margin-right:0; opacity: 1;\"></i>Loading...\n" +
    "				</div>\n" +
    "\n" +
    "				<div class=\"list-group-item\" ng-show=\"!isLoading && hasMore\" ng-click=\"loadMore()\">\n" +
    "					Load more...\n" +
    "				</div>\n" +
    "\n" +
    "			</div>\n" +
    "\n" +
    "		</div>\n" +
    "\n" +
    "	</div>\n" +
    "\n" +
    "	<div class='bootcards-cards {{colRight}}'>\n" +
    "\n" +
    "		<ng-transclude></ng-transclude>\n" +
    "\n" +
    "	</div>\n" +
    "\n" +
    " </div>\n" +
    "\n" +
    "<!--modal to add details-->\n" +
    "<form class=\"form-horizontal\" name=\"cardNewForm\" role=\"form\">\n" +
    "	<div class=\"modal fade\" id=\"addModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"addModal\" aria-hidden=\"true\">\n" +
    "		<div class=\"modal-dialog\">\n" +
    "			<div class=\"modal-content\">\n" +
    "			\n" +
    "				<div class=\"modal-header\">\n" +
    "\n" +
    "					<div class=\"btn-group pull-left\">\n" +
    "						<button class=\"btn btn-danger\" data-dismiss=\"modal\" type=\"button\">\n" +
    "							Cancel\n" +
    "						</button>\n" +
    "					</div>\n" +
    "				\n" +
    "					<div class=\"btn-group pull-right\">\n" +
    "						<button class=\"btn btn-success\" type=\"button\" ng-click=\"saveNewItem(cardNewForm, '#addModal')\">\n" +
    "							Save\n" +
    "						</button>\n" +
    "					</div>\n" +
    "					<h4 class=\"modal-title\">Add {{modelName}}</h4>		\n" +
    "				</div>\n" +
    "				\n" +
    "				<div class=\"modal-body\">\n" +
    "\n" +
    "					<div class=\"form-group\" ng-repeat=\"field in fieldsEdit\" ng-class=\"{ 'has-error': cardNewForm[field.field].$invalid }\">\n" +
    "						<label class=\"col-xs-3 control-label\">{{field.label}}</label>\n" +
    "						<div class=\"col-xs-9\" ng-if=\"field.type=='text' || field.type=='email' || field.type=='phone'\">\n" +
    "							<input class=\"form-control\" name=\"{{field.field}}\" ng-model=\"newItem[field.field]\" ng-required=\"field.required\"  />\n" +
    "							<a class=\"fa fa-times-circle fa-lg clearer\" ng-click=\"clear(field.field)\"></a>\n" +
    "						</div>\n" +
    "						<div class=\"col-xs-9\" ng-if=\"field.type=='date'\">\n" +
    "							<input class=\"form-control\" type=\"date\" name=\"{{field.field}}\" ng-model=\"newItem[field.field]\" ng-required=\"field.required\"  />\n" +
    "						</div>\n" +
    "						<div class=\"col-xs-9\" ng-if=\"field.type=='multiline'\">\n" +
    "							<textarea class=\"form-control\" name=\"{{field.field}}\" ng-model=\"newItem[field.field]\" ng-required=\"field.required\" />\n" +
    "							<a class=\"fa fa-times-circle fa-lg clearer\" ng-click=\"clear(field.field)\"></a>\n" +
    "						</div>\n" +
    "						<div class=\"col-xs-9\" ng-if=\"field.type=='select'\">\n" +
    "							<select class=\"form-control\" name=\"{{field.field}}\" ng-model=\"newItem[field.field]\" ng-required=\"field.required\">\n" +
    "								<option ng-repeat=\"o in field.options\" value=\"{{o}}\">{{o}}</option>\n" +
    "							</select>\n" +
    "						</div>\n" +
    "						<div class=\"col-xs-9\" ng-if=\"field.type=='select-multiple'\">\n" +
    "							<select class=\"form-control\" multiple name=\"{{field.field}}\" ng-model=\"newItem[field.field]\" ng-required=\"field.required\" >\n" +
    "								<option ng-repeat=\"o in field.options\" value=\"{{o}}\">{{o}}</option>\n" +
    "							</select>\n" +
    "						</div>\n" +
    "						<div class=\"col-xs-9\" ng-if=\"field.type=='toggle'\">	\n" +
    "							<xc-toggle ng-model=\"newItem[field.field]\"></xc-toggle>\n" +
    "						</div>\n" +
    "					</div>\n" +
    "\n" +
    "				</div>\n" +
    "\n" +
    "			</div>\n" +
    "		</div>\n" +
    "	</div>	\n" +
    "</form>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("xc-list-flat.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("xc-list-flat.html",
    "<div class='container bootcards-container'>\n" +
    "\n" +
    " <div class='row'>\n" +
    "\n" +
    " 	<div class=\"bootcards-list {{colLeft}}\" ng-show=\"!$root.hideList\">\n" +
    "\n" +
    "		<div class=\"panel panel-default\">\n" +
    "\n" +
    "			<ng-include src=\"'xc-list-heading.html'\"></ng-include>\n" +
    "\n" +
    "			<div class=\"list-group\">\n" +
    "				\n" +
    "				<a class=\"list-group-item animate-repeat\" ng-repeat=\"item in itemsPage | filter : filter track by item.id\"  ng-click=\"select(item)\"\n" +
    "					ng-class=\"{'active' : selected == item}\">\n" +
    "\n" +
    "					<!--(placeholder) icon-->\n" +
    "					<i ng-if=\"showPlaceholder(item)\" class=\"fa fa-3x pull-left\" ng-class=\"'fa-' + imagePlaceholderIcon\"></i>\n" +
    "					<i ng-if=\"showIcon(item)\" class=\"fa fa-3x pull-left\" ng-class=\"'fa-' + item[iconField]\"></i>\n" +
    "					\n" +
    "					<!--image-->\n" +
    "					<img \n" +
    "						ng-if=\"showImage(item)\"\n" +
    "						class=\"img-rounded pull-left\" \n" +
    "						ng-src=\"{{ imageBase + item[imageField] }}\" />\n" +
    "\n" +
    "					<h4 class=\"list-group-item-heading\">{{item[summaryField]}}</h4>\n" +
    "\n" +
    "					<p class=\"list-group-item-text\">{{item[detailsField]}}</p>\n" +
    "					\n" +
    "				</a>\n" +
    "\n" +
    "				<div class=\"list-group-item\" ng-show=\"isLoading\">\n" +
    "					<i class=\"fa fa-spinner fa-spin fa-fw\" style=\"margin-right:0; opacity: 1;\"></i>Loading...\n" +
    "				</div>\n" +
    "\n" +
    "				<div class=\"list-group-item\" ng-show=\"!isLoading && hasMore\" ng-click=\"loadMore()\">\n" +
    "					Load more...\n" +
    "				</div>\n" +
    "\n" +
    "			</div>\n" +
    "\n" +
    "		</div>\n" +
    "\n" +
    "	</div>\n" +
    "\n" +
    "	<div class='bootcards-cards {{colRight}}'>\n" +
    "\n" +
    "		<ng-transclude></ng-transclude>\n" +
    "\n" +
    "	</div>\n" +
    "\n" +
    " </div>\n" +
    "\n" +
    "<!--modal to add details-->\n" +
    "<form class=\"form-horizontal\" name=\"cardNewForm\" role=\"form\">\n" +
    "	<div class=\"modal fade\" id=\"addModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"addModal\" aria-hidden=\"true\">\n" +
    "		<div class=\"modal-dialog\">\n" +
    "			<div class=\"modal-content\">\n" +
    "			\n" +
    "				<div class=\"modal-header\">\n" +
    "\n" +
    "					<div class=\"btn-group pull-left\">\n" +
    "						<button class=\"btn btn-danger\" data-dismiss=\"modal\" type=\"button\">\n" +
    "							<i class=\"fa fa-times\"></i>\n" +
    "							Cancel\n" +
    "						</button>\n" +
    "					</div>\n" +
    "				\n" +
    "					<div class=\"btn-group pull-right\">\n" +
    "						<button class=\"btn btn-success\" type=\"button\" ng-click=\"saveNewItem(cardNewForm, '#addModal')\">\n" +
    "							<i class=\"fa fa-check\"></i>\n" +
    "							Save\n" +
    "						</button>\n" +
    "					</div>\n" +
    "					<h4 class=\"modal-title\">Add {{modelName}}</h4>		\n" +
    "				</div>\n" +
    "				\n" +
    "				<div class=\"modal-body\">\n" +
    "\n" +
    "					<div class=\"form-group\" ng-repeat=\"field in fieldsEdit\" ng-class=\"{ 'has-error': cardNewForm[field.field].$invalid }\">\n" +
    "						<label class=\"col-xs-3 control-label\">{{field.label}}</label>\n" +
    "						<div class=\"col-xs-9\" ng-if=\"field.type=='text' || field.type=='email' || field.type=='phone'\">\n" +
    "							<input class=\"form-control\" name=\"{{field.field}}\" ng-model=\"newItem[field.field]\" ng-required=\"field.required\"  />\n" +
    "							<a class=\"fa fa-times-circle fa-lg clearer\" ng-click=\"clear(field.field)\"></a>\n" +
    "						</div>\n" +
    "						<div class=\"col-xs-9\" ng-if=\"field.type=='date'\">\n" +
    "							<input class=\"form-control\" type=\"date\" name=\"{{field.field}}\" ng-model=\"newItem[field.field]\" ng-required=\"field.required\"  />\n" +
    "						</div>\n" +
    "						<div class=\"col-xs-9\" ng-if=\"field.type=='multiline'\">\n" +
    "							<textarea class=\"form-control\" name=\"{{field.field}}\" ng-model=\"newItem[field.field]\" ng-required=\"field.required\" />\n" +
    "							<a class=\"fa fa-times-circle fa-lg clearer\" ng-click=\"clear(field.field)\"></a>\n" +
    "						</div>\n" +
    "						<div class=\"col-xs-9\" ng-if=\"field.type=='select'\">\n" +
    "							<select class=\"form-control\" name=\"{{field.field}}\" ng-model=\"newItem[field.field]\" ng-required=\"field.required\">\n" +
    "								<option ng-repeat=\"o in field.options\" value=\"{{o}}\">{{o}}</option>\n" +
    "							</select>\n" +
    "						</div>\n" +
    "						<div class=\"col-xs-9\" ng-if=\"field.type=='select-multiple'\">\n" +
    "							<select class=\"form-control\" multiple name=\"{{field.field}}\" ng-model=\"newItem[field.field]\" ng-required=\"field.required\" >\n" +
    "								<option ng-repeat=\"o in field.options\" value=\"{{o}}\">{{o}}</option>\n" +
    "							</select>\n" +
    "						</div>\n" +
    "						<div class=\"col-xs-9\" ng-if=\"field.type=='toggle'\">	\n" +
    "							<xc-toggle ng-model=\"newItem[field.field]\"></xc-toggle>\n" +
    "						</div>\n" +
    "					</div>\n" +
    "\n" +
    "				</div>\n" +
    "\n" +
    "			</div>\n" +
    "		</div>\n" +
    "	</div>	\n" +
    "</form>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("xc-list-heading.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("xc-list-heading.html",
    "<div>\n" +
    "\n" +
    "	<div class=\"panel-heading\">\n" +
    "\n" +
    "		<div class=\"row\">\n" +
    "\n" +
    "			<div class=\"col-xs-8\">\n" +
    "				<h3 class=\"panel-title\">{{::title}}</h3>\n" +
    "			</div>\n" +
    "\n" +
    "			<div class=\"col-xs-4\" ng-if=\"allowAdd\">\n" +
    "\n" +
    "				<a class=\"btn btn-primary btn-block\" href=\"#\" data-toggle=\"modal\" data-target=\"#addModal\">\n" +
    "					<i class=\"fa fa-plus\"></i> \n" +
    "					<span>Add</span>\n" +
    "				</a>\n" +
    "				\n" +
    "			</div>\n" +
    "\n" +
    "		</div>\n" +
    "\n" +
    "	</div>\n" +
    "\n" +
    "	<div class=\"panel-body\" ng-show=\"allowSearch\">\n" +
    "\n" +
    "		<!--add a new item-->\n" +
    "		<div class=\"search-form\">\n" +
    "			<div class=\"row\">\n" +
    "			    <div class=\"col-xs-9\">\n" +
    "			      <div class=\"form-group\">\n" +
    "				      <input type=\"text\" class=\"form-control\" ng-model=\"$parent.filter\" placeholder=\"Search {{::modelName}}...\">\n" +
    "				      <i class=\"fa fa-search\"></i>\n" +
    "			      </div>\n" +
    "			    </div>\n" +
    "			    <div class=\"col-xs-3\">\n" +
    "					\n" +
    "			    </div>\n" +
    "			</div>						    \n" +
    "		</div>				\n" +
    "\n" +
    "\n" +
    "	</div>		\n" +
    "\n" +
    "</div>");
}]);

angular.module("xc-login.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("xc-login.html",
    "<div>\n" +
    "\n" +
    "	<div ng-show=\"!isSignedIn\">\n" +
    "\n" +
    "		You're not signed in yet.\n" +
    "		<a class=\"btn btn-primary\" data-toggle=\"modal\" data-target=\"#loginModal\">Sign in</a>\n" +
    "\n" +
    "	</div>\n" +
    "\n" +
    "	<!--modal to sign in-->\n" +
    "	<form class=\"form-horizontal\" name=\"loginForm\" role=\"form\">\n" +
    "	<div class=\"modal fade\" id=\"loginModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"loginModal\" aria-hidden=\"true\">\n" +
    "		<div class=\"modal-dialog\">\n" +
    "			<div class=\"modal-content\">\n" +
    "			\n" +
    "				<div class=\"modal-header\">\n" +
    "\n" +
    "					<div class=\"btn-group pull-left\">\n" +
    "						<button class=\"btn btn-danger\" data-dismiss=\"modal\" type=\"button\">\n" +
    "							Cancel\n" +
    "						</button>\n" +
    "					</div>\n" +
    "				\n" +
    "					<div class=\"btn-group pull-right\">\n" +
    "						<button class=\"btn btn-success\" type=\"button\" ng-click=\"login(loginForm, '#loginModal')\">\n" +
    "							Login\n" +
    "						</button>\n" +
    "					</div>\n" +
    "					<h4 class=\"modal-title\">Sign In</h4>		\n" +
    "				</div>\n" +
    "				\n" +
    "				<div class=\"modal-body\">\n" +
    "\n" +
    "					<div class=\"form-group\" ng-class=\"{ 'has-error': loginForm.username.$invalid }\">\n" +
    "\n" +
    "						<label class=\"col-xs-3 control-label\">Username</label>\n" +
    "						<div class=\"col-xs-9\">\n" +
    "							<input class=\"form-control\" name=\"username\" ng-model=\"username\" ng-required=\"true\" />\n" +
    "						</div>\n" +
    "\n" +
    "					</div>\n" +
    "\n" +
    "					<div class=\"form-group\" ng-class=\"{ 'has-error': loginForm.password.$invalid }\">\n" +
    "\n" +
    "						<label class=\"col-xs-3 control-label\">Password</label>\n" +
    "						<div class=\"col-xs-9\">\n" +
    "							<input class=\"form-control\" name=\"password\" ng-model=\"password\" ng-required=\"true\" />\n" +
    "						</div>\n" +
    "\n" +
    "					</div>\n" +
    "\n" +
    "				</div>\n" +
    "\n" +
    "			</div>\n" +
    "		</div>\n" +
    "	</div>	\n" +
    "	</form>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "	<div ng-show=\"isSignedIn\">You're signed in and good to go!</div>\n" +
    "\n" +
    "</div>");
}]);

angular.module("xc-reading.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("xc-reading.html",
    "<div class=\"panel panel-default bootcards-richtext\"> \n" +
    "  <div class=\"panel-heading clearfix\">\n" +
    "    <h3 class=\"panel-title pull-left\">{{::title}}</h3>\n" +
    "      \n" +
    "    <div class=\"btn-group pull-right\">\n" +
    "      <a class=\"btn btn-primary icon-only\" href=\"#\" ng-click=\"increaseFontSize()\">\n" +
    "        <i class=\"fa fa-lg fa-search-plus\"></i></a>\n" +
    "        <a class=\"btn btn-primary icon-only\" href=\"#\" ng-click=\"decreaseFontSize()\">\n" +
    "        <i class=\"fa fa-lg fa-search-minus\"></i></a>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "    <div class=\"panel-body typographyreadcontent\">\n" +
    "      <ng-transclude></ng-transclude>\n" +
    "    </div>\n" +
    "  <div class=\"panel-footer\">\n" +
    "    <small class=\"pull-left\">{{footerText}}</small>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("xc-summary-item.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("xc-summary-item.html",
    "<div class=\"col-xs-6 col-sm-4  col-md-6\">\n" +
    "	<a class=\"bootcards-summary-item\" \n" +
    "		href=\"{{target}}\"\n" +
    "		style=\"padding-top:20px;\">\n" +
    "		<i class=\"fa fa-3x {{icon}}\"></i>\n" +
    "		<h4>\n" +
    "			{{title}}\n" +
    "			<span class=\"label label-info\">{{count}}</span>\n" +
    "		</h4>\n" +
    "	</a>\n" +
    "</div>\n" +
    "");
}]);

angular.module("xc-summary.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("xc-summary.html",
    "<div class=\"panel panel-default bootcards-summary\">\n" +
    "	\n" +
    "	<div class=\"panel-heading\">\n" +
    "		<h3 class=\"panel-title\">{{::title}}</h3>\n" +
    "	</div>\n" +
    "\n" +
    "	<div class=\"panel-body\">\n" +
    "		<div class=\"row\">\n" +
    "			<ng-transclude></ng-transclude>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "	\n" +
    "	<div class=\"panel-footer\" ng-show=\"footerText\">\n" +
    "		<small class=\"pull-left\">\n" +
    "			{{footerText}}\n" +
    "		</small>\n" +
    "	</div>\n" +
    "	\n" +
    "</div>");
}]);

angular.module("xc-upload.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("xc-upload.html",
    "<div class=\"panel panel-default boorcards-media\"> \n" +
    "\n" +
    "  <div class=\"panel-heading clearfix\">\n" +
    "    <h class=\"panel-title pull-left\">{{::title}}</h3>  \n" +
    "  </div>\n" +
    "    \n" +
    "  <div class=\"panel-body\">\n" +
    "    Tap 'Select' to take a new photo or select from your Photos library, then tap 'Upload'.\n" +
    "\n" +
    "    <div style=\"margin-top:15px; text-align: center;\">\n" +
    "      <div class=\"js-photouploader\">\n" +
    "        <div class=\"photoUpload btn btn-primary\" style=\"display: none;\">\n" +
    "          <span id=\"view:_id1:_id173:_id181:computedField1\">Select photo</span>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"js-photouploader-preview\">\n" +
    "          <span style=\"font-size: 200px; color: #bbb;\" class=\"fa fa-2x fa-camera\"></span>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <span class=\"js-custom-select-var hidden\">.js-custom-photo-select</span>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"panel-footer\">\n" +
    "    <div class=\"btn-group btn-group-justified\">\n" +
    "      <div class=\"btn-group\">\n" +
    "        <div class=\"js-custom-photo-select photoUpload btn btn-default\"><i class=\"fa fa-camera\"></i>Select\n" +
    "          <input type=\"file\" class=\"js-photouploader-upload\" accept=\"image/*\" onchange=\"targetWidth = 1024;\n" +
    "          targetHeight = 768;\n" +
    "          doCrop = false;\n" +
    "          var file = event.target.files[0];\n" +
    "          orientation = 0;  \n" +
    "          angular.element(this).scope().loadImage(file);\">\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <div class=\"btn-group\">\n" +
    "        <button class=\"btn btn-default\" ng-click=\"rotateImage(true)\" type=\"button\"><i class=\"fa fa-rotate-right\"></i>Rotate</button>\n" +
    "      </div>\n" +
    "      <div class=\"btn-group\">\n" +
    "        <button class=\"hidden\" type=\"button\">save</button>\n" +
    "        <button type=\"button\" ng-click=\"savePhoto(this, 'view:_id1:_id173:button1')\" class=\"btn btn-default uploadphotobutton\">\n" +
    "          <i class=\"fa fa-upload\"></i>Upload</button></div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>");
}]);
