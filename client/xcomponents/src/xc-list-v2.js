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