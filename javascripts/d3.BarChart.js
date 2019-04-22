/// PAGE CHART
function drawBarChart(chartID, dataSet, selectString) {
	// chartID => A unique drawing identifier that has no spaces, no "." and no "#" characters.
	// dataSet => Input Data for the chart, itself.
	// selectString => String that allows you to pass in
	// a D3.selectAll() string.

	function domainArray(a, type) {
		var data = []; // ["Photos","Canvas","Page","Screen"];
		for (var i = 0; i < a.length; i++) {
			data.push(a[i][type]);
		}
		return unique(data);
	}
	var wCalc = $(selectString).width();
	var hCalc = Math.max(
		document.documentElement.clientHeight,
		window.innerHeight || 0
	);
	var barChart = {
		w: wCalc,
		h: Math.max(hCalc * 0.45, 300),
		m: 10
	};

	barChart.height = barChart.h;
	barChart.width = barChart.w;
	var color = d3.scale.category20().domain(d3.range(dataSet.length));
	var x = d3.scale
		.ordinal()
		.domain(0, 400)
		.rangeRoundBands([0, barChart.w]);
	var y = d3.scale
		.linear()
		.domain([
			0,
			dataSet.length
		])
		.range([0, barChart.h]);

	var bchart_svg = d3
		.select(selectString)
		.append("svg")
		.attr({
			class: function () {
				return "bar" + chartID;
			},
			width: barChart.w,
			height: barChart.h,
			transform: "translate(" + barChart.m + "," + barChart.m + ")"
		});

	var bchart = bchart_svg
		.selectAll(".bar")
		.data(dataSet)
		.enter()
		.append("g")
		.attr("class", "bar");

	bchart
		.append("svg:a")
		.attr("xlink:href", function (d) {
			return d.type;
		})
		.append("rect")
		.attr({
			class: function (d) {
				return d.type;
			},
			x: function (d, i) {
				return x(i);
			},
			y: function (d) {
				return barChart.height - y(d.count);
			},
			height: function (d) {
				return y(d.count);
			},
			width: x.rangeBand(),
			fill: function (d, i) {
				return color(i);
			}
		});
	// The "Number" count of elements in each gallery
	bchart
		.append("text")
		.text(function (d) {
			return d.count;
		})
		.attr({
			class: "count font_display font_3",
			x: function (d, i) {
				return x(i) + 5;
			},
			y: function (d) {
				return barChart.height - y(d.count) + 55;
			},
			width: x.rangeBand(),
			fill: "#ffffff"
		});
	// The "Name" of each gallery
	bchart
		.append("text")
		.text(function (d) {
			return d.type;
		})
		.attr({
			class: "label font_0",
			x: function (d, i) {
				return x(i) + 5;
			},
			y: function (d) {
				return barChart.height - y(d.count) + 20;
			},
			width: x.rangeBand(),
			fill: "#ffffff"
		});
}