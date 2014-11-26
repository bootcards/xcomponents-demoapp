/*
 * Connect to the specified REST API, get all items and render them.
 */

var app = angular.module('xcontrols');

app.directive('xcCard', function($rootScope, $resource) {

  return {

    scope : {
      item : '=',
      url : '@'
    },

    replace : true,
    restrict : 'AE',
    templateUrl: 'xc-modules/xc-card.html',

    controller : function($scope) {

      console.log('card scope');

      $scope.selectedItem = {};
      $scope.isNew = true;

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

      $scope.fields = xcontrols.fields;
      $scope.modelName = xcontrols.modelName;

      $rootScope.$on('selectItemEvent', function(ev, item) {
        $scope.isNew = (item === null ? true : false);
        $scope.selectedItem = (item === null ? {} : item);
      });

      $scope.saveItem = function(form) {
        if (!form.$valid) { return; }

        var Card = $resource($scope.url, 
          {
            id:$scope.selectedItem.id
          },
          {
            update : {
              method: 'PUT'
            }
          }
         );

        Card.update($scope.selectedItem);

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
