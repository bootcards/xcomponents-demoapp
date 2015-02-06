var app = angular.module("xcontrols");

app.directive('xcList', 
	['$rootScope', '$filter', 'xcUtils', 'RESTFactory', 'PouchFactory', 'LowlaFactory', 'configService', 
	function($rootScope, $filter, xcUtils, RESTFactory, PouchFactory, LowlaFactory, configService) {

	return {

		scope : {

			title : '@',			/*title of the list*/
			type : '@',				/*list type, options: flat (default), categorised, accordion*/
			listWidth : '=' ,		/*width of the list (nr 1..11)*/
			summaryField : '@',		/*name of the field used as a summary field*/
			detailsField : '@',     
			detailsFieldType : '@',		/*text or date*/
			detailsFieldSubTop : '@',
			detailsFieldSubBottom : '@',
			allowSearch : '=?',
			autoloadFirst : '=?',
			allowAdd : '=',
			groupBy : '@',			/*only relevant for categorised, accordion lists*/
			filterBy : '@',			
			filterValue : '@',		
			orderBy : '@',
			orderReversed : '@',
			url : '@',
			srcData : '@',
			imageField : '@',		/*image*/
			iconField : '@',		/*icon*/ 
			imagePlaceholderIcon : '@',		/*icon to be used if no thumbnail could be found, see http://fortawesome.github.io/Font-Awesome/icons/ */
			datastoreType : '@',
			infiniteScroll : '@'

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
				switch( attrs.datastoreType) {
					case 'pouch':
						f=PouchFactory; break;
					case 'lowla':
						f=LowlaFactory; break;
					default:
						f=RESTFactory; break;
				}
			
				f.all().then( function(res) {
					
					var numRes = res.length;

					if (scope.filterBy && scope.filterValue) {
						//filter the result set
						
						var filteredRes = [];

						angular.forEach( res, function(entry, idx) {

							if (entry[scope.filterBy] == scope.filterValue) {
								filteredRes.push( entry);
							}
						});

						res = filteredRes;

					}
					
					if (scope.type == 'categorised' || scope.type=='accordion') {

						scope.groups = xcUtils.getGroups( res, scope.groupBy, scope.orderBy, orderReversed );
						scope.isLoading = false;
						
						//auto load first entry in the first group
						if (scope.autoloadFirst && !scope.selected && !bootcards.isXS() ) {
							scope.select( scope.groups[0].entries[0] );
							if (scope.type == 'accordion') {		//auto expand first group
								scope.groups[0].collapsed = false;
							}
						}
			
					} else {			//flat or detailed

						//sort the results
						res.sort( xcUtils.getSortByFunction( scope.orderBy, orderReversed ) );

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

		controller: function($rootScope, $scope, $modal, $filter, xcUtils) {

			$scope.hideList = false;

			//set defaults
			$scope.allowSearch = (typeof $scope.allowSearch == 'undefined' ? true : $scope.allowSearch);
			$scope.autoloadFirst = (typeof $scope.autoloadFirst == 'undefined' ? false : $scope.autoloadFirst);
			$scope.infiniteScroll = (typeof $scope.infiniteScroll == 'undefined' ? false : $scope.infiniteScroll);
			$scope.detailsFieldType = (typeof $scope.detailsFieldType == 'undefined' ? 'text' : $scope.detailsFieldType);

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
			
			//custom list entries
			if ($scope.srcData) {
				$scope.srcDataEntries = xcUtils.getConfig( $scope.srcData);
			}

			$scope.addNewItem = function() {
				$scope.modalInstance = $modal.open({
					templateUrl: 'xc-form-modal-edit.html',
					controller: 'UpdateItemInstanceCtrl',
					backdrop : true,
					resolve: {
						selectedItem : function () {
							return null;
						},
						fieldsEdit : function() {
							return $scope.fieldsEdit;
						},
						modelName : function() {
							return $scope.modelName;
						},
						isNew : function() {
							return true;
						},
						allowDelete : function() {
							return false;
						},
						items : function() {
							return $scope.items;
						},
						scope : function() {
							return $scope;
						}
					}
				});
			};

			//bind events for infinite scroll
			if ($scope.infiniteScroll) {

				try {
					pullUpEl = document.getElementById('pullUp');
					pullUpOffset = pullUpEl.offsetHeight;
				} catch (e) {
				}

				if ($rootScope.iOS || $rootScope.Android ) {
					$('.bootcards-list').scroll(
						function() {
							if ($(this)[0].scrollHeight - $(this).scrollTop() == $(this).outerHeight()) {
								$scope.flatViewScroll();
							}
						});
				} else {
					$(window).bind('scroll',
						function() {
							if ($(document).height() <= ($(window).height() + $(window).scrollTop() + 200)) {
								$scope.flatViewScroll();
							}
						});
				}

			}

			$scope.flatViewScroll = function() {
				$("#btnLoadMore").click();
			};

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

		    	var start = $scope.itemsPage.length;
		        var end = Math.min(start + $scope.itemsPerPage, $scope.items.length);
				
				if (start < end) {
				 
			        $scope.isLoading = true;
			        $scope.numPages++;
			        
			        for ( var i=start; i<end; i++) {
			          $scope.itemsPage.push( $scope.items[i]);
			        }

			        $scope.isLoading = false;
			        $scope.hasMore = $scope.itemsPage.length < $scope.totalNumItems;
			    }
		    };

		    $scope.convert = function(item) {
		    	
		    	if ($scope.detailsFieldType == 'date') {
		    		return $filter('date')(item[$scope.detailsField]);
		    	} else {
		    		return item[$scope.detailsField];
		
		    	}

		  
		    };

		}

	};

}]);
