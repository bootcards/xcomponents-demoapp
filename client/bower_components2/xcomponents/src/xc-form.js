
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
			imagePlaceholderIcon : '@',		/*icon to be used if no thumbnail could be found, see http://fortawesome.github.io/Font-Awesome/icons/ */
			allowDelete : '=?',

		},

		replace : true,
		restrict : 'E',
		templateUrl: 'xc-form.html',

		controller : function($scope, $resource, xcUtils) {

			//set defaults
			$scope.allowDelete = (typeof $scope.allowDelete == 'undefined' ? true : $scope.allowDelete);
			
			// Define Card resource 
			var CardData = $resource( $scope.url,
				{ id : '@id'},
				{
			  		'exists' : { method :'GET' , url : $scope.url + '/exists'} ,
			  		'update' : { method : 'PUT', url : $scope.url.substring( 0, $scope.url.indexOf(':')-1 ) }
			  	}
			);

			$scope.selectedItem = null;
			$scope.fieldsRead = xcUtils.getConfig('fieldsRead');
			$scope.fieldsEdit = xcUtils.getConfig('fieldsEdit');
			$scope.modelName = xcUtils.getConfig('modelName');
			$scope.isNew = true;

			$rootScope.$on('selectItemEvent', function(ev, item) {
				$scope.selectedItem = item;
				$scope.isNew = false;

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

				CardData.exists( { id : $scope.itemId }).$promise
					.then( function(res) {
						
						if (res.exists) {

							//open existing data object

							$scope.isNew = false;

							CardData.get( { id : $scope.itemId }).$promise
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

								});
						} else {

							//create new object
							$scope.selectedItem = { id : $scope.itemId } ;
							$scope.isNew = true;
						}

					});
				
				
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

				CardData.update($scope.selectedItem).$promise
				.then( function(res) {

					$(modalId).modal('hide');
					$scope.isNew = false;

				})
				.catch( function(err) {
					alert("The item could not be updated: " + err.statusText);
				});

			};

			$scope.deleteItem = function() {
				
				//delete the item
				CardData.delete( { id : $scope.selectedItem.id } );

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
