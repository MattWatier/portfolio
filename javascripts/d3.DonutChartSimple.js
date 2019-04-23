function drawDonutChartSimple(chartID, dataSet, selectString, dimensions) {
   // chartID => A unique drawing identifier that has no spaces, no "." and no "#" characters.
   // dataSet => Input Data for the chart, itself.
   // selectString => String that allows you to pass in
   // a D3.selectAll() string.


   var chartSize = {
      w: dimensions.w,
      h: dimensions.h,
      m: dimensions.m,
      g: dimensions.g != false ? dimensions.g : '2',
      font_small: dimensions.font_small != false ? dimensions.font_small : ".8333333333",
      font_normal: dimensions.font_normal != false ? dimensions.font_normal : "1",
      font_large: dimensions.font_large != false ? dimensions.font_large : "1.44"
   };

   var chartOffsetY = 0;
   chartSize.r = Math.min(chartSize.w - 150, chartSize.h - (chartOffsetY + chartSize.m * 2));
   chartSize.h = chartSize.r + chartSize.m * 2;
   var color = d3.scale.category20c();
   var pie = d3.layout
      .pie()
      .sort(null)
      .value(function (d) {
         return d.count;
      });
   var arc = d3.svg
      .arc()
      .outerRadius(chartSize.r * 0.5 - chartSize.m)
      .innerRadius(chartSize.r * 0.2 - chartSize.m);
   var _svg = d3
      .select(selectString)
      .append("svg")
      .attr("class", function () {
         return "pie" + chartID;
      })
      .attr("width", chartSize.w - chartSize.m * 2)
      .attr({
         "height": chartSize.h - chartSize.m * 2,
         "transform": function () {
            return "translate(" +
               chartSize.m +
               "," +
               chartSize.m +
               ")";
         }
      });






   var _arc = _svg.data([dataSet])
      .append("svg:g")
      .attr({
         "transform": function () {
            return "translate(" +
               (chartSize.r / 2) +
               "," +
               ((chartSize.r / 2) + chartOffsetY) +
               ")";
         }
      });

   _arc.selectAll("g.slice")
      .data(pie)
      .enter()
      .append("svg:g")
      .attr("class", "slice")
      .append("svg:path")
      .attr({
         "fill": function (d, i) {
            return color(d.data.type);
         },
         "class": function (d) {
            return d.data.type + " filter";
         },
         "data-filter": function (d) {
            return "." + d.data.type.replace(/\s/g, "-");
         },
         "d": arc
      });
   var legend = _svg
      .append("svg:g")
      .attr({
         "class": "legend",
         transform: function () {
            return "translate(" + (chartSize.w - (chartSize.m * 2 + chartSize.g)) + ", " +
               (chartSize.m * 2 + chartOffsetY) + ")";
         }
      })
      .selectAll(".legend")
      .data(color.domain())
      .enter()
      .append("g")
      .attr({
         "class": "legend-item",
         transform: function (d, i) {
            return "translate(0," + (i * 28) + ")";
         }

      });
   legend
      .append("rect")
      .attr("x", -24)
      .attr("y", -12)
      .attr("width", 24)
      .attr("height", 24)
      .style("fill", color);
   legend
      .append("text")
      .attr("x", -28)
      .attr("y", 0)
      .attr("dy", ".35em")
      .attr({
         "class": "font_display c_secondary-n2",
         "font-size": function () {
            return chartSize.font_normal +
               "rem";
         }
      })
      .style("text-anchor", "end")

      .text(function (d) {
         return d;
      });
}