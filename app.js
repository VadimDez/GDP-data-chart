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
    var margin = {top: 20, right: 30, bottom: 30, left: 50};
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

    var scaleX = d3.time.scale()
      .rangeRound([0, width])
      .domain([new Date(data[0][0]), d3.time.year.offset(new Date(data[data.length - 1][0]), 1)]);

    var $chart = d3.select('.chart')
      .attr("width", containerWidth)
      .attr("height", containerHeight)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var xAxis = d3.svg.axis()
      .scale(scaleX)
      .tickFormat(d3.time.format('%Y'))
      .tickSize(5)
      .tickPadding(6)
      .orient("bottom");

    var yAxis = d3.svg.axis()
      .scale(scaleY)
      .orient("left");

    var $tooltip = d3.select('.tooltip');

    $chart.append('g')
      .attr('class', 'axis x-axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis)
      .append('text')
      .attr('x', 0)
      .attr('y', 18)
      .text('Year');

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
        return scaleX(new Date(d[0]));
      })
      .attr("y", function(d) {
        return scaleY(d[1]);
      })
      .attr("height", function(d) {
        return height - scaleY(d[1]);
      })
      .attr("width", barWidth + 1)
      .on('mouseover', function (d) {
        return $tooltip.style('visibility', 'visible');
      })
      .on('mousemove', function (data) {
        d3.select(this).classed('active', true);
        $tooltip.select('.date').text(data[0]);
        $tooltip.select('.value').text(data[1]);

        return $tooltip.style('top', (event.pageY) + 'px')
          .style('left', (event.pageX + 10) + 'px');
      })
      .on('mouseleave', function () {
        d3.select(this).classed('active', false);
        return $tooltip.style('visibility', 'hidden');
      });

    $bar.exit().remove();
  }
}());