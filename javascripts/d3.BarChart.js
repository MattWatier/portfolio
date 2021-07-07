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
	var wCalc = $(selectString).width() - 32;
	var hCalc =  $(selectString).height()- 32;
	var barChart = {
		w: wCalc,
		h: hCalc,
		m: 16
	};

	barChart.height = barChart.h;
	barChart.width = barChart.w;
	var color = d3.scale.category20().domain(d3.range(dataSet.length));
	var x = d3.scale
		.ordinal()
		.domain(d3.range(dataSet.length))
		.rangeRoundBands([0, barChart.width], 0.05);
	var y = d3.scale
		.linear()
		.domain([
			0,
			d3.max(dataSet, function (d) {
				return d.count;
			})
		])
		.range([0, barChart.height], 0);

	var bchart_svg = d3
		.select(selectString)
		.append("svg")
		.attr("viewBox", '0 0 ' + barChart.w+ ' '+ barChart.h+'')
		.attr({
			class: function () {
				return "bar" + chartID;
			}
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
			class: "count font_display font_3:lg font_2:md font_1",
			x: function (d, i) {
				return x(i) + 8;
			},
			y: function (d) {
				return barChart.height - y(d.count) + 65;
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
			class: "label font_0 uppercase font_xbold font_display",
			x: function (d, i) {
				return x(i) + 8;
			},
			y: function (d) {
				return barChart.height - y(d.count) + 18;
			},
			width: x.rangeBand(),
			fill: "#ffffff"
		});
}