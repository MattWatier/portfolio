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
		g: dimensions.g != false ? dimensions.g : '2',
		font_small: dimensions.font_small != false ? dimensions.font_small : ".8333333333",
		font_normal: dimensions.font_normal != false ? dimensions.font_normal : "1",
		font_large: dimensions.font_large != false ? dimensions.font_large : "1.44"
	};
	var maxTagPerColumn = 6;
	var minWidthForDoubleColumn = 700;
	var columnMode = (dataSet.length > maxTagPerColumn && minWidthForDoubleColumn < chartSize.w) ? true : false;
	var color = d3.scale.category20().domain(d3.range(dataSet.length));

	var chartOffsetY = (((chartSize.font_large + chartSize.font_normal) * 16) + (chartSize.g * 2));
	// divide up the space to fill the bars properly
	// Need to split this into a stack of two when screen can allow. medium break space.
	var y = d3.scale
		.ordinal()
		.domain(d3.range(dataSet.length))
		.rangeRoundBands([0, (chartSize.h - (chartOffsetY + (chartSize.m * 2)))], 0.05);
	//Getting max width of the space so it can be split into a stack of two.
	var x = d3.scale
		.linear()
		.domain([0, Math.max.apply(
			Math,
			dataSet.map(function (o) {
				return o.count;
			})
		)])
		.range([10, chartSize.w * 0.75]);
	if (columnMode) {
		console.log();
		var dataSetLength = dataSet.length;
		y = d3.scale
			.ordinal()
			.domain(d3.range(0, dataSet.length / 2, 1))
			.rangeRoundBands([0, (chartSize.h - (chartOffsetY + (chartSize.m * 2)))], 0.05);
		x = d3.scale
			.linear()
			.domain([0, Math.max.apply(
				Math,
				dataSet.map(function (o) {
					return o.count;
				})
			)])
			.range([10, chartSize.w * 0.40]);
	}
	// Construction of the holder of the svg and the margin bump holder to make alignment easier.
	var _svg = d3
		.select(selectString)
		.append("svg")
		.attr({
			"class": function () {
				return " bar" + selectData;
			},
			"width": chartSize.w,
			"height": chartSize.h,
		})
		.append("g")
		.attr({
			"transform": function () {
				return "translate(" + chartSize.m + "," + chartSize.m + ")";
			},
			width: chartSize.w - (chartSize.m * 2),
			height: chartSize.h - (chartSize.m * 2)
		});
	// Append The title
	_svg.append('text')
		.text('Image Tags').style("font-family", "'SansationBold', 'trebuchet MS', Arial, sans-serif")
		.attr({
			class: "font_display",
			'font-size': function () {
				return chartSize.font_large + "rem";
			},
			x: 0,
			y: 0,
			'alignment-baseline': 'hanging',
			fill: "#222"
		});
	// Append the Fragment Count
	_svg.append('text')
		.text('FRAGMENTS')
		.attr({
			class: "font_display font_bold c_secondary-1",
			'font-size': function () {
				return chartSize.font_normal + "rem";
			},
			x: chartSize.g,
			y: chartSize.font_large * 16 + chartSize.g,
			'alignment-baseline': 'hanging',
			fill: "#888"
		});
	// Append the Selection Inicator
	_svg.append('text')
		.text('FILTER')
		.style("font-family", "'SansationBold', 'trebuchet MS', Arial, sans-serif")
		.attr({
			class: "font_copy font_bold c_secondary-1 text-right",
			'text-anchor': 'end',
			'font-size': function () {
				return chartSize.font_normal + "rem";
			},
			x: chartSize.w - chartSize.m * 2,
			y: chartSize.font_large * 16 + chartSize.g,
			'alignment-baseline': 'hanging',
			fill: "#888"
		});


	var bchart = _svg
		.append("g").attr({
			transform: function () {
				return "translate(0, " + chartOffsetY + ")";
			}
		})
		.selectAll(".bar")
		.data(dataSet)
		.enter()
		.append("g")
		.attr({
			"class": "bar filter",
			"data-filter": function (d) {
				return "." + d.name.replace(/\s/g, "-");
			},
			transform: function (d, i) {
				var xOffset = (columnMode && i >= dataSet.length / 2) ? (chartSize.w - chartSize.m * 2) / 2 : 0;
				return "translate(" + xOffset + "," + y(i) + ")";
			}
		})
		.on("mouseover", function () {
			d3.select(this)
				.select(".count")
				.attr("fill", "#000000");
			d3.select(this)
				.select(".tag-label")
				.attr("fill", "#000000");
			d3.select(this)
				.select(".bar")
				.attr("opacity", "1");
		})
		.on("mouseout", function () {
			d3.select(this)
				.select(".count")
				.attr("fill", "#888888");
			d3.select(this)
				.select(".tag-label")
				.attr("fill", "#888888");
			d3.select(this)
				.select(".bar")
				.attr("opacity", ".75");
		});
	bchart
		.append("rect")
		.attr({
			y: 0,
			x: 0,
			"id": function (d) {
				return d.classtype;
			},
			"class": function () {
				return "bar filter";
			},
			height: y.rangeBand(),
			width: function (d) {
				return x(d.count);
			},
			"fill": function (d, i) {
				return color(i);
			},
			opacity: ".75"

		});
	// bchart
	// 	.append("text")
	// 	.attr({
	// 		"class": "count font_bold"})
	// 	.attr("y", "18")
	// 	.attr("x", function (d) {
	// 		return x(d.count) + 4;
	// 	})
	// 	.attr("fill", "#888888")
	// 	.style("font-wieght", 900)
	// 	.style("font-family", "'SansationBold', 'trebuchet MS', Arial, sans-serif")
	// 	.text(function (d) {
	// 		return d.count;
	// 	});

	// Add label
	bchart
		.append("text")
		.attr({
			"class": "tag-label font_copy",
			y: y.rangeBand() / 2,
			x: function (d) {
				return x(d.count) + 8;
			},
			height: y.rangeBand(),
			"font-size": function () {
				return chartSize.font_small + "rem";
			},
			"fill": "#888888",
			'alignment-baseline': 'central'
		})
		.text(function (d) {
			return d.name;
		});
}