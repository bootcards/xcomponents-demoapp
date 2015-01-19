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
			thumbnailShowWith : '@',
			iconField : '@',				/*icon*/ 
			imagePlaceholderIcon : '@'		/*icon to be used if no thumbnail could be found, see http://fortawesome.github.io/Font-Awesome/icons/ */

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
			};

			$scope.showImage = function() {
				return $scope.selectedItem && $scope.thumbnailField && $scope.selectedItem[$scope.thumbnailField];
			}
			$scope.showPlaceholder = function() {
				return $scope.selectedItem && $scope.selectedItem && $scope.imagePlaceholderIcon && !$scope.selectedItem[$scope.thumbnailField];
			}
			$scope.showIcon = function() {
				return $scope.selectedItem && $scope.iconField && $scope.selectedItem[$scope.iconField];
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
