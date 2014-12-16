/*
 * Connect to the specified REST API, get all items and render them.
 */

var app = angular.module('xcontrols');

app.directive('xcList', function($resource) {

  return {

    scope : {
      summaryField : '@summaryfield',
      detailsField : '@detailsfield'
    },

    replace : true,
    restrict : 'AE',
    templateUrl: 'xc-modules/xc-list.html',

    controller: function($scope) {

      $scope.selected = null;
      $scope.orderBy = xcontrols.orderBy;
      $scope.orderReversed = xcontrols.orderReversed;
      
      $scope.select = function(item) {
        $scope.selected = item;
        $scope.$emit('selectItemEvent', item);
      };

      $scope.loadMore = function() {
        console.log('load more' + $scope.items.length);

        var items = $scope.items;
        var numItems = items.length;

        for (var i=numItems; i<(numItems + 10); i++) {
          items.push( $scope.itemsAll[i] );

        }

        $scope.items = items;

      };

    },

    link : function(scope, elem, attrs) {

      var Items = $resource(attrs.url);

      Items.query( function(res) {

        console.log('found ' + res.length + ' items in results')
        var b = [];
        for (var i=0; i<30 && i<res.length; i++) {
          b.push( res[i]);
        }
        scope.itemsAll = res;
        scope.items = b;
      });

    }

  };

});



