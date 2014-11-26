var app = angular.module("xcontrols");

app.directive("xcList", function($rootScope, $resource) {

	return {

		scope : {

			listWidth : '=' ,
			summaryField : '@summaryfield',
			detailsField : '@detailsfield',
			allowAdd : '=',
			groupBy : '=',
			url : '@'

		},

		restrict : 'E',
		transclude : true,
		replace : true,
		templateUrl: 'xc-modules/xc-list-v2.html',

		link : function(scope, elem, attrs) {
	
			scope.colLeft = 'col-sm-' + attrs.listWidth;
			scope.colRight = 'col-sm-' + (12 - parseInt(attrs.listWidth, 10) );
	
			var Items = $resource(attrs.url);

			Items.query( function(res) {

				console.log('found ' + res.length + ' items in results, showing ' + scope.itemsPerPage);

        //sort the results
        res.sort( function(a,b) {
          if (a[xcontrols.orderBy] < b[xcontrols.orderBy])
             return -1;
          if (a[xcontrols.orderBy] > b[xcontrols.orderBy])
            return 1;
          return 0;
        });

        //return first page of results
				var b = [];
				for (var i=0; i<scope.itemsPerPage && i<res.length; i++) {
					b.push( res[i]);
				}

        scope.hasMore = b.length < res.length;

				scope.items = res;
				scope.itemsPage = b;
				scope.isLoading = false;

				//TODO: if group-by is set: group the items by that field property
				var groups = [];

			});
		 

		},

		controller: function($rootScope, $scope, $resource) {

			$scope.isLoading = true;
      $scope.hasMore = false;
			$scope.modelName = xcontrols.modelName;
      $scope.itemsPerPage = 20;

			$scope.selected = null;
			$scope.orderBy = xcontrols.orderBy;
			$scope.orderReversed = xcontrols.orderReversed;
      $scope.itemsPage = [];
      $scope.numPages = 1;

			var fields = xcontrols.fields;

			//add labels if not specified (proper cased field name)
			for (var i=0; i<fields.length; i++) {
				if ( !fields[i].hasOwnProperty('label') ) {
					fields[i].label = fields[i].field.substring(0,1).toUpperCase() + fields[i].field.substring(1);
				}
				//set 'show in read mode' property
				if ( !fields[i].hasOwnProperty('read') ) {
					fields[i].read = true;
				}
				//set 'show in edit mode' property
				if ( !fields[i].hasOwnProperty('edit') ) {
					fields[i].edit = true;
				}
			}

			$scope.newItem = {};
			$scope.fields = xcontrols.fields;
			$scope.modelName = xcontrols.modelName;

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
			 $scope.saveNewItem = function(form) {
				if (!form.$valid) { return; }

				$resource($scope.url).save($scope.newItem).$promise
				.then( function(res) {
					console.log('saved...', res);

          $scope.items.push(res);

          //resort
          $scope.items.sort( function(a,b) {
            if (a[xcontrols.orderBy] < b[xcontrols.orderBy])
               return -1;
            if (a[xcontrols.orderBy] > b[xcontrols.orderBy])
              return 1;
            return 0;
          });
/*
          //update list of items shown
          var res = [];
          for ( var i=0; i<($scope.numPages * $scope.itemsPerPage); i++) {
            res.push( $scope.items[i]);
          }
          $scope.items = res;*/

				});

	 
				$scope.newItem = {};

			};


		}

	};

});