function drawBarChartNav(selectData, dataSet, selectString) {
	// selectData => A unique drawing identifier that has no spaces, no "." and no "#" characters.
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
		h: Math.min(450, Math.max(hCalc * 0.45, 300)),
		m: 0
	};
	barChart.height = barChart.h - 2 * barChart.m;
	barChart.width = barChart.w - 2 * barChart.m;
	var color = d3.scale.category20().domain(d3.range(dataSet.length));
	var y = d3.scale
		.ordinal()
		.domain(d3.range(dataSet.length))
		.rangeRoundBands([0, barChart.height], 0.05);
	var x = d3.scale
		.linear()
		.domain([
			0,
			d3.max(dataSet, function(d) {
				return d.count;
			})
		])
		.range([0, barChart.width * 0.75]);

	var bchart_svg = d3
		.select(selectString)
		.append("svg")

		.attr("class", function() {
			return " bar" + selectData;
		})
		.attr("width", barChart.w)
		.attr("height", barChart.h)
		.append("g")
		.attr("transform", "translate(" + barChart.m + "," + barChart.m + ")");

	var bchart = bchart_svg
		.selectAll(".bar")
		.data(dataSet)
		.enter()
		.append("g")
		.attr("class", "bar")
		.attr("transform", function(d, i) {
			return "translate(0," + y(i) + ")";
		})
		.on("mouseover", function() {
			d3.select(this)
				.select(".count")
				.attr("fill", "#000000");
			d3.select(this)
				.select(".datalabel")
				.attr("fill", "#000000");
			d3.select(this)
				.select(".bar")
				.attr("opacity", "1");
		})
		.on("mouseout", function() {
			d3.select(this)
				.select(".count")
				.attr("fill", "#888888");
			d3.select(this)
				.select(".datalabel")
				.attr("fill", "#888888");
			d3.select(this)
				.select(".bar")
				.attr("opacity", ".75");
		});
	bchart
		.append("rect")
		.attr("id", function(d) {
			return d.classtype;
		})
		.attr("class", "bar")
		.attr("height", y.rangeBand())
		.attr("width", function(d) {
			return x(d.count);
		})
		.attr("y", "0")
		.attr("fill", function(d, i) {
			return color(i);
		})
		.attr("x", "0")
		.attr("opacity", ".75");
	bchart
		.append("text")
		.attr("class", "count font_1 font_bold")
		.attr("y", "18")
		.attr("x", function(d) {
			return x(d.count) + 4;
		})
		.attr("fill", "#888888")
		.style("font-wieght", 900)
		.style("font-family", "'SansationBold', 'trebuchet MS', Arial, sans-serif")
		.text(function(d) {
			return d.count;
		});
	bchart
		.append("text")
		.attr("class", "datalabel font_0")
		.attr("y", "34")
		.attr("fill", "#888888")
		.attr("x", function(d) {
			return x(d.count) + 7;
		})
		.text(function(d) {
			return d.type;
		});
	bchart
		.append("svg:a")
		.attr("xlink:href", "#")
		.attr("data-filter", function(d) {
			return "." + d.classtype;
		})
		.append("rect")
		.attr("height", y.rangeBand())
		.attr("width", barChart.width)
		.attr("y", "0")
		.attr("opacity", "0")
		.attr("x", "0");
}
