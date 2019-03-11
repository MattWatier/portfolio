function drawDonutChart(chartID, dataSet, selectString) {
	// chartID => A unique drawing identifier that has no spaces, no "." and no "#" characters.
	// dataSet => Input Data for the chart, itself.
	// selectString => String that allows you to pass in
	// a D3.selectAll() string.
	var wCalc = $(selectString).width() - 40;
	var hCalc = Math.max(
		Math.max(document.documentElement.clientHeight, window.innerHeight || 0) /
			4,
		250
	);

	var donutChart = {
		w: wCalc,
		h: hCalc,
		r: Math.min((wCalc - 32) * 0.4, hCalc - 32) / 2,
		m: 16
	};
	var color = d3.scale.category20c();
	var pie = d3.layout
		.pie()
		.sort(null)
		.value(function(d) {
			return d.count;
		});
	var arc = d3.svg
		.arc()
		.outerRadius(donutChart.r - donutChart.m / 2)
		.innerRadius(donutChart.r - (donutChart.r * 2) / 3);
	var _svg = d3
		.select(selectString)
		.append("svg")
		.data([dataSet])
		.attr("class", function() {
			return "pie" + chartID;
		})
		.attr("width", donutChart.w)
		.attr("height", donutChart.h)
		.append("svg:a")
		.attr("xlink:href", chartID)
		.append("svg:g")
		.attr(
			"transform",
			"translate(" +
				(donutChart.r + donutChart.m / 2) +
				"," +
				(donutChart.h / 2 + donutChart.m) +
				")"
		);
	var _arc = _svg
		.selectAll("g.slice")
		.data(pie)
		.enter()
		.append("svg:g")
		.attr("class", "slice");
	_arc
		.append("svg:path")
		.attr("fill", function(d, i) {
			return color(d.data.type);
		})
		.attr("class", function(d) {
			return d.data.type;
		})
		.attr("d", arc);
	var legend = _svg
		.selectAll(".legend")
		.data(color.domain())
		.enter()
		.append("g")
		.attr("class", "legend")
		.attr("transform", function(d, i) {
			return (
				"translate(" +
				(donutChart.r + donutChart.m * 2) +
				"," +
				(i * 28 - donutChart.r + 10) +
				")"
			);
		});
	legend
		.append("rect")
		.attr("x", -24)
		.attr("y", -12)
		.attr("width", 24)
		.attr("height", 25)
		.style("fill", color);
	legend
		.append("text")
		.attr("x", 4)
		.attr("y", 0)
		.attr("dy", ".35em")
		.attr("class", "font_1 font_display c_secondary-n2")
		.style("text-anchor", "start")
		.text(function(d) {
			return d;
		});
}
