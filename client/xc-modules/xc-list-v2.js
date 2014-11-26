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

			listWidth : '=' ,
			summaryField : '@',
			detailsField : '@',
			allowAdd : '=',
			groupBy : '@',			/*only relevant for categorised, accordion lists*/
			url : '@',
			imageField : '@',
			type : '@'				/*flat (default), categorised, accordion*/

		},

		restrict : 'E',
		transclude : true,
		replace : true,
		/*templateUrl: ,*/

		templateUrl: function(elem,attrs) {
		  return 'xc-modules/xc-list-' + (attrs.type=='categorised' ? 'categorised' : 'flat')  + '.html';
		},


		link : function(scope, elem, attrs) {
	
			scope.colLeft = 'col-sm-' + attrs.listWidth;
			scope.colRight = 'col-sm-' + (12 - parseInt(attrs.listWidth, 10) );
	
			var Items = $resource(attrs.url);

			Items.query( function(res) {

				console.log('found ' + res.length + ' items in results, showing ' + scope.itemsPerPage);

				if (scope.type == 'categorised') {

					console.log('categorise: ' + scope.groupBy);

					var groups = [];

					var groupFunction = function(a,b) {
						var _a = a[scope.groupBy];
						var _b = b[scope.groupBy];
						if ( _a < _b )
				         return -1;
				      if ( _a > _b )
				        return 1;

				     	if (_a == null) { _a = "(none)"; }

				    	 groups.push(_a);

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

					//categorise the results
					res.sort( groupFunction );

					//get unique group values
					scope.groups = getUnique(groups).sort();

		        	//return first page of results
					var b = [];
					for (var i=0; i<scope.itemsPerPage && i<res.length; i++) {
						b.push( res[i]);
					}

		        	scope.hasMore = b.length < res.length;

					scope.items = res;
					scope.itemsPage = b;
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
			

			//watch the filter variable for changes
			/*$scope.$watch('filter', function() {
		      $scope.items = xcUtils.query($scope.items); 
		   });*/

			$scope.select = function(item) {
				$scope.selected = item;
				$scope.$emit('selectItemEvent', item);
			};

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

					console.log('saved...', res);

          			$scope.items.push(res);

			        //resort
			        var ress = $scope.items;
			        ress.sort( sortFunction );

			        $scope.items = ress;

				})
				.catch( function(err) {
					alert("The item could not be saved: " + err.statusText);
				});
	 
				$scope.newItem = {};		//clear new item

			};


		}

	};

});