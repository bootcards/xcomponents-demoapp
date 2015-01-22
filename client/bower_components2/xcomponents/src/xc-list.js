var app = angular.module("xcontrols");

app.directive('xcList', 
	['$rootScope', 'RESTFactory', 'PouchFactory', 'LowlaFactory', 'configService', 
	function($rootScope, RESTFactory, PouchFactory, LowlaFactory, configService) {

	//function to sort an array of objects on a specific property and order
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
			detailsFieldSubTop : '@',
			detailsFieldSubBottom : '@',
			allowSearch : '=?',
			autoloadFirst : '=?',
			allowAdd : '=',
			groupBy : '@',			/*only relevant for categorised, accordion lists*/
			filterBy : '@',			/*only relevant for flat lists*/
			filterValue : '@',		/*only relevant for flat lists*/
			orderBy : '@',
			orderReversed : '@',
			url : '@',
			srcData : '@',
			imageField : '@',		/*image*/
			iconField : '@',		/*icon*/ 
			imagePlaceholderIcon : '@',		/*icon to be used if no thumbnail could be found, see http://fortawesome.github.io/Font-Awesome/icons/ */
			datastoreType : '@'

		},

		restrict : 'E',
		transclude : true,
		replace : true,
		
		templateUrl: function(elem,attrs) {
			//calculate the template to use
			return 'xc-list-' + attrs.type + '.html';
		},

		link : function(scope, elem, attrs) {

			configService.setEndpoint( attrs.url);

			scope.colLeft = 'col-sm-' + attrs.listWidth;
			scope.colRight = 'col-sm-' + (12 - parseInt(attrs.listWidth, 10) );
			
			var orderReversed = scope.$eval(attrs.orderReversed);		//for booleans

			if ( scope.srcDataEntries) {

				scope.isLoading = false;
				scope.hasMore = false;
				scope.items = scope.srcDataEntries;
				scope.itemsPage = scope.items;
				scope.totalNumItems = scope.items.length;
				
			} else {

				var f = null;
				if (attrs.datastoreType=='pouch') {
					f=PouchFactory;
				} else {
					f=RESTFactory;
				}
			
				f.all().then( function(res) {
		
					var numRes = res.length;

					if (scope.type == 'categorised' || scope.type=='accordion') {

						scope.groups = getGroups( res, scope.groupBy, scope.orderBy, orderReversed );
						scope.isLoading = false;
						
						//auto load first entry in the first group
						if (scope.autoloadFirst && !scope.selected && !bootcards.isXS() ) {
							scope.select( scope.groups[0].entries[0] );
						}

					} else {			//flat or detailed


						if (scope.filterBy && scope.filterValue) {
							//filter the resultset
							
							var filteredRes = [];

							angular.forEach( res, function(entry, idx) {

								if (entry[scope.filterBy] == scope.filterValue) {
									filteredRes.push( entry);
								}
							});

							res = filteredRes;

						}

						//sort the results
						res.sort( sortBy( scope.orderBy, orderReversed ) );

			        	//return first page of results
						var b = [];
						for (var i=0; i<scope.itemsPerPage && i<res.length; i++) {
							b.push( res[i] );
						}

			        	scope.items = res;
						scope.itemsPage = b;
						scope.isLoading = false;
						scope.totalNumItems = res.length;

						scope.hasMore = scope.itemsPage.length < scope.totalNumItems;

						//auto load first entry in the list
						if (scope.autoloadFirst && !scope.selected && !bootcards.isXS() ) {
							scope.select( res[0] );
						}

					}

				});

			}

		},

		controller: function($rootScope, $scope, xcUtils) {

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
					$rootScope.showCards = (item != null);
				} else {
					$rootScope.showCards = true;
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
		        $scope.hasMore = $scope.itemsPage.length < $scope.totalNumItems;

		    };

			//save a new item
			$scope.saveNewItem = function(form, modalId) {
		
				if (!form.$valid) { alert('Please fill in all required fields'); return; }

				xcUtils.calculateFormFields($scope.newItem);

				var f = null;
				if ($scope.datastoreType=='pouch') {
					f=PouchFactory;
				} else {
					f=RESTFactory;
				}

				f.saveNew( $scope.newItem )
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

}]);
