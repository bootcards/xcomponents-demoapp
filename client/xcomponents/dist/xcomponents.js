/* xcomponents 1.0.0 2014-12-16 2:52 */
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


var app = angular.module('xcontrols');

app.directive('xcHeader', function() {

	return {

		scope : {
			title : '@'
		},

		replace : true,
		restrict : 'E',
		templateUrl : 'xcomponents/src/xc-header.html',

		controller : function($scope, xcUtils) {

			$scope.menuOptions = xcUtils.getConfig('menuOptions');
			$scope.appVersion = xcUtils.getConfig('appVersion');

			var loc = window.location.href;

			$scope.isActive = function(menuOption) {
				return (loc.indexOf(menuOption.url)> -1);
			};

		}

	};

});

var app = angular.module('xcontrols');

app.directive('xcFooter', function() {

	return {

		replace : true,
		restrict : 'E',
		templateUrl : 'xc-footer.html',
		transclude : true,

		/*controller : function() {

			console.log('controller');

		},

		link : function() {

			console.log('link');
		}*/

	};

});


var app = angular.module('xcontrols');

app.directive('xcSummary', function() {

	return {

		scope : {
			title : '@title',
		},

		replace : true,
		restrict : 'E',
		transclude : true,
		templateUrl : 'xc-summary.html',

		/*controller : function() {

			console.log('controller');

		},

		link : function() {

			console.log('link');
		}*/

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
		templateUrl : 'xc-summary-item.html',

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
var app = angular.module("xcontrols");

app.directive("xcList", function($rootScope, $resource) {

	var sortFunction = function(a,b) {
		var _a = a[xcontrols.orderBy].toLowerCase();
		var _b = b[xcontrols.orderBy].toLowerCase();
		var modifier = (xcontrols.orderReversed ? -1 : 1);
      if ( _a < _b )
         return -1 * modifier;
      if ( _a > _b )
        return 1 * modifier;
      return 0;
    };

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

	return {

		scope : {

			type : '@',				/*list type, options: flat (default), categorised, accordion*/
			listWidth : '=' ,
			summaryField : '@',
			detailsField : '@',
			allowAdd : '=',
			groupBy : '@',			/*only relevant for categorised, accordion lists*/
			url : '@',
			imageField : '@',
			imagePlaceholderIcon : '@'		/*icon to be used if no thumbnail could be found, see http://fortawesome.github.io/Font-Awesome/icons/ */

		},

		restrict : 'E',
		transclude : true,
		replace : true,
		/*templateUrl: ,*/

		templateUrl: function(elem,attrs) {
		  return 'xc-list-' + attrs.type + '.html';
		},

		link : function(scope, elem, attrs) {
	
			scope.colLeft = 'col-sm-' + attrs.listWidth;
			scope.colRight = 'col-sm-' + (12 - parseInt(attrs.listWidth, 10) );
	
			var Items = $resource(attrs.url);
			
			Items.query( function(res) {

				var numRes = res.length;

				console.log('found ' + numRes + ' items in results, showing ' + scope.itemsPerPage);

				if (scope.type == 'categorised' || scope.type=='accordion') {

					console.log('categorise: ' + scope.groupBy);

					var groups = [];

					//organise results per group
					for (var i=0; i<numRes; i++) {
						var entry = res[i];
						var entryGroup = entry[scope.groupBy];
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
				
					//sort by (1) group name and (2) order property

					var sortFunction = function(a,b) {
						
						var _a = a['name'];
						var _b = b['name'];

						if ( _a < _b )
				        	return -1;
				     	if ( _a > _b )
				        	return 1;
				     	
				     	//same group, now order
				     	var _a = a[xcontrols.orderBy].toLowerCase();
						var _b = b[xcontrols.orderBy].toLowerCase();
						var modifier = (xcontrols.orderReversed ? -1 : 1);
				      if ( _a < _b )
				         return -1 * modifier;
				      if ( _a > _b )
				        return 1 * modifier;
				      return 0;

				    };

				    groups.sort( sortFunction );

				    scope.groups = groups;

/*
					

		        	//return first page of results
					var b = [];
					for (var i=0; i<scope.itemsPerPage && i<res.length; i++) {
						b.push( res[i]);
					}

		        	scope.hasMore = b.length < res.length;

					scope.items = res;
					scope.itemsPage = b;*/
					scope.isLoading = false;


				} else {

					//sort the results
		        	res.sort( sortFunction );

		        	//return first page of results
					var b = [];
					for (var i=0; i<scope.itemsPerPage && i<res.length; i++) {
						b.push( res[i]);
					}

		        	scope.hasMore = b.length < res.length;

					scope.items = res;
					scope.itemsPage = b;
					scope.isLoading = false;

				}

	  

			});
		 

		},

		controller: function($rootScope, $scope, $resource, xcUtils) {

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
			
			$scope.toggleCategory = function(expand) {
				console.log('e: ' +expand);
				angular.forEach( $scope.groups, function(group) {
					group.collapsed = (group.name != expand.name);
					console.log(group.collapsed);
				});
			};

			//watch the filter variable for changes
			/*$scope.$watch('filter', function() {
		      $scope.items = xcUtils.query($scope.items); 
		   });*/

			$scope.select = function(item) {
				$scope.selected = item;
				$scope.$emit('selectItemEvent', item);
				window.scrollTo(0, 0);
			};

			$scope.showImage = function(item) {
				return $scope.imageField && item[$scope.imageField];
			}
			$scope.showPlaceholder = function(item) {
				return $scope.imagePlaceholderIcon && !item[$scope.imageField];
			}

			$scope.delete = function(item) {

				//remove an item
				for (var i=0; i<$scope.itemsPage.length; i++) {
					if ($scope.itemsPage[i] == item) {
						//remove from the scope list, set selected to null and let other els know
						$scope.itemsPage.splice( i, 1);
						$scope.selected = null;
						$scope.$emit('selectItemEvent', null);
						break;
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

          			$scope.items.push(res);

			        //resort
			        var ress = $scope.items;
			        ress.sort( sortFunction );

			        $scope.items = ress;

					//return first page of results
					var b = [];
					for (var i=0; i<$scope.itemsPerPage && i<ress.length; i++) {
						b.push( ress[i]);
					}

					$scope.itemsPage = b;

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
/*
 * Connect to the specified REST API, get all items and render them.
 */

var app = angular.module('xcontrols');

app.directive('xcCard', function($rootScope, $resource) {

	return {

		scope : {
			item : '=',
			url : '@',
			defaultText : '@'
		},

		replace : true,
		restrict : 'E',
		templateUrl: 'xc-card.html',

		controller : function($scope, xcUtils) {

			$scope.selectedItem = null;
			$scope.fieldsRead = xcUtils.getConfig('fieldsRead');
			$scope.fieldsEdit = xcUtils.getConfig('fieldsEdit');
			$scope.modelName = xcUtils.getConfig('modelName');

			$rootScope.$on('selectItemEvent', function(ev, item) {
				$scope.selectedItem = item;
			});

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

					console.log('updated...', res);

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