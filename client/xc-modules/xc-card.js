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
		templateUrl: 'xc-modules/xc-card.html',

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
