
var app = angular.module('xcontrols');

app.directive('xcChart', function() {

	return {

		scope : {
			title : '@',
			chartId : '@',
			chartType : '@',
			valuePrefix : '@'
		},

		replace : true,
		restrict : 'E',
		templateUrl : 'xc-chart.html',

		controller : function($scope, xcUtils) {

			var charts = xcUtils.getConfig('charts');

			$scope.chartData = charts[$scope.chartId];

			$scope.chartTotal = 0;
			for (var i=0; i<$scope.chartData.length; i++) {
				$scope.chartTotal += $scope.chartData[i].value;
			}

			drawDonutChart($scope.chartData, $scope.valuePrefix);

		},

		link : function() {
		}

	};

});





/*
 * Clear the target DOM element and draw the sample charts
 * Samples come from the morris.js site at http://www.oesmith.co.uk/morris.js/
 */
var closedSalesChart = null;

var drawDonutChart = function(chartData, valuePrefix) {

	$("#chartClosedSales").empty();

	//create custom Donut function with click event on the segments
	var myDonut = Morris.Donut;

	myDonut.prototype.redraw = function() {

		var C, cx, cy, i, idx, last, max_value, min, next, seg, total, value, w, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _results;
      this.raphael.clear();
      cx = this.el.width() / 2;
      cy = this.el.height() / 2;
      w = (Math.min(cx, cy) - 10) / 3;
      total = 0;
      _ref = this.values;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        value = _ref[_i];
        total += value;
      }
      min = 5 / (2 * w);
      C = 1.9999 * Math.PI - min * this.data.length;
      last = 0;
      idx = 0;
      this.segments = [];
      _ref1 = this.values;
      for (i = _j = 0, _len1 = _ref1.length; _j < _len1; i = ++_j) {
        value = _ref1[i];
        next = last + min + C * (value / total);
        seg = new Morris.DonutSegment(cx, cy, w * 2, w, last, next, this.data[i].color || this.options.colors[idx % this.options.colors.length], this.options.backgroundColor, idx, this.raphael);
        seg.render();
        this.segments.push(seg);
        seg.on('hover', this.select);
        seg.on('click', this.select);
        last = next;
        idx += 1;
      }
      this.text1 = this.drawEmptyDonutLabel(cx, cy - 10, this.options.labelColor, 15, 800);
      this.text2 = this.drawEmptyDonutLabel(cx, cy + 10, this.options.labelColor, 14);
      max_value = Math.max.apply(Math, this.values);
      idx = 0;
      _ref2 = this.values;
      _results = [];
      for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
        value = _ref2[_k];
        if (value === max_value) {
          this.select(idx);
          break;
        }
        _results.push(idx += 1);
      }
      return _results;
	};

	closedSalesChart = myDonut({
	    element: 'chartClosedSales',
	    data: chartData,
	    formatter: function (y, data) { 
	    	//prefixes the values by an $ sign, adds thousands seperators
			nStr = y + '';
			x = nStr.split('.');
			x1 = x[0];
			x2 = x.length > 1 ? '.' + x[1] : '';
			var rgx = /(\d+)(\d{3})/;
			while (rgx.test(x1)) {
				x1 = x1.replace(rgx, '$1' + ',' + '$2');
			}
			return valuePrefix + ' ' + x1 + x2;
	    }
	  });

};

//on resize of the page: redraw the charts
$(window)
	.on('resize', function() {
		window.setTimeout( function() {
			if (closedSalesChart !== null) { closedSalesChart.redraw(); }
		}, 250);
	});


//TODO: move to scope
/* toggle between the chart and data */
function toggleChartData(event, chart) {

	var $ev = $(event.target);
	var $chart = $ev.parents('.bootcards-chart');

	if ($chart.length>0) {

		$chart.fadeOut( 'fast', function()  {
			$chart
				.siblings('.bootcards-table')
					.fadeIn('fast');
		});

	} else {
		
		var $data = $ev.parents('.bootcards-table');
		$data.fadeOut( 'fast', function()  {
			$data
				.siblings('.bootcards-chart')
					.fadeIn('fast', function() {
						if (typeof chart != 'undefined' && chart != null) { chart.redraw();}
					});
		});

	}
			
}