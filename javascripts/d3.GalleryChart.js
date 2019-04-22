// Content Filter Nav

function drawBarChartNav(selectData, dataSet, selectString, dimensions) {
	// selectData => A unique drawing identifier that has no spaces, no "." and no "#" characters.
	// dataSet => Input Data for the chart, itself.
	// selectString => String that allows you to pass in
	// a D3.selectAll() string.
	console.log(dataSet.length + " Tag Filter Chart" + JSON.stringify(dataSet));
	var chartSize = {
		w: dimensions.w,
		h: dimensions.h,
		m: dimensions.m,
		font_small:
			dimensions.font_small != false ? dimensions.font_small : ".8333333333",
		font_normal: dimensions.font_normal != false ? dimensions.font_normal : "1",
		font_large: dimensions.font_large != false ? dimensions.font_large : "1.44"
	};
	var maxCount = Math.max.apply(
		Math,
		dataSet.map(function(o) {
			return o.count;
		})
	);

	var color = d3.scale.category20().domain(d3.range(dataSet.length));
	var y = d3.scale
		.ordinal()
		.domain(d3.range(dataSet.length))
		.rangeRoundBands([0, chartSize.h], 0.05);
	var x = d3.scale
		.linear()
		.domain([0, maxCount])
		.range([10, chartSize.w * 0.75]);

	var bchart_svg = d3
		.select(selectString)
		.append("svg")

		.attr("class", function() {
			return " bar" + selectData;
		})
		.attr("width", chartSize.w)
		.attr("height", chartSize.h)
		.append("g")
		.attr("transform", "translate(" + chartSize.m + "," + chartSize.m + ")");

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
		.attr({
			opacity: ".75",
			"data-filter": function(d, i) {
				return d.name;
			}
		});
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
			return d.name;
		});
	bchart
		.append("svg:a")
		.attr("xlink:href", "#")
		.attr("data-filter", function(d) {
			return "." + d.name.replace(/\s/g, "-");
		})
		.append("rect")
		.attr("height", y.rangeBand())
		.attr("width", chartSize.w)
		.attr("y", "0")
		.attr("opacity", "0")
		.attr("x", "0");
}
