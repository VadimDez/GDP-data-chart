/**
 * Created by vadimdez on 06/01/16.
 */

'use strict';
(function () {
  (function () {
    var url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json';
    d3.json(url, function (err, json) {
      if (err) {
        return console.warn(err);
      }

      createChart(json.data);
    });
  }());

  function createChart(data) {
    var margin = {top: 20, right: 30, bottom: 30, left: 40};
    var containerWidth = 960;
    var containerHeight = 500;
    var width = containerWidth - margin.left - margin.right;
    var height = containerHeight - margin.top - margin.bottom;

    var barWidth = width / data.length;
    var max = d3.max(data, function (array) {
      return array[1];
    });
    var scaleY = d3.scale.linear()
      .domain([0, max])
      .range([height, 0]);

    var scaleX = d3.scale.ordinal()
      .rangeRoundBands([0, width], .1)
      .domain(data.map(function (d) {
        return d[0];
      }));

    var $chart = d3.select('.chart')
      .attr("width", containerWidth)
      .attr("height", containerHeight)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var xAxis = d3.svg.axis()
      .scale(scaleX)
      .tickFormat(function (d) {
        return d.substr(0, 4);
      })
      .tickSize(10)
      .orient("bottom");

    var yAxis = d3.svg.axis()
      .scale(scaleY)
      .orient("left");

    $chart.append('g')
      .attr('class', 'axis x-axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis);

    $chart.append('g')
      .attr('class', 'axis y-axis')
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Billions of Dollars");

    var $bar = $chart.selectAll('.bar').data(data);

    $bar.enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) {
        return scaleX(d[0]);
      })
      .attr("y", function(d) {
        return scaleY(d[1]);
      })
      .attr("height", function(d) {
        return height - scaleY(d[1]);
      })
      .attr("width", scaleX.rangeBand());

    $bar.exit().remove();
  }
}());