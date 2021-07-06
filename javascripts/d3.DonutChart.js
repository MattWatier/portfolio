function drawDonutChart(chartID, dataSet, selectString, dimensions) {
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


	var chartOffsetY = (((chartSize.font_large + chartSize.font_normal) * 16) + (chartSize.g * 2));
	chartSize.r = Math.min(chartSize.w - 150, chartSize.h - (chartOffsetY + chartSize.m * 2));
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
			return "svg pie" + chartID;
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

	// Append The title
	_svg.append('text')
		.text('Categories')
		.style("font-family", "'SansationBold', 'trebuchet MS', Arial, sans-serif")
		.attr({
			class: "font_display",
			'font-size': function () {
				return chartSize.font_large + "rem";
			},
			x: 0,
			y: chartSize.g,
			'alignment-baseline': 'hanging',
			fill: "#222"
		});
	// Append the Fragment Count
	_svg.append('text')
		.text('FRAGMENTS')
		.style("font-family", "'SansationBold', 'trebuchet MS', Arial, sans-serif")
		.attr({
			class: "font_copy font_bold c_secondary-1",
			'font-size': function () {
				return chartSize.font_normal + "rem";
			},
			x: 0,
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
				return d.data.type + " filter opacity_7 hover:opacity";
			},
			"data-filter": function (d) {
				return "." + d.data.type.replace(/\s/g, "-");
			},
			"d": arc
		}).on('click', function (d) {

			_svg.select("#fragCount").remove();
			_svg.append('svg:text')
				.text(d.data.count)
				.attr({
					id: "fragCount",
					class: "font_display font_bold c_accent",
					'font-size': function () {
						return chartSize.font_normal + "rem";
					},
					x: 105,
					y: chartSize.font_large * 16 + chartSize.g,
					'alignment-baseline': 'hanging',
					fill: "#ff7f0e",
				});
			_svg.select("#selectionName").remove();
			_svg.append('svg:text')
				.text(d.data.type)
				.attr({
					id: "selectionName",
					class: "font_display font_bold c_accent text-right",
					'font-size': function () {
						return chartSize.font_normal + "rem";
					},
					x: chartSize.w - (chartSize.m * 2) - 60,
					y: chartSize.font_large * 16 + chartSize.g,
					'alignment-baseline': 'hanging',
					fill: "#ff7f0e",

				}).style("text-anchor", "end");

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
				return chartSize.font_small +
					"rem";
			}
		})
		.style("text-anchor", "end")

		.text(function (d) {
			return d;
		});

	_svg.on('clearFilter', function () {
		_svg.select("#selectionName").remove();
		_svg.select("#fragCount").remove();
	});
}