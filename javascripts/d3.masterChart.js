function masterChart(DOMSelector, dset, dimensions, _svg) {
	var chartSize = {
		w: dimensions.w,
		m: dimensions.m,
		g: dimensions.g != false ? dimensions.g : "2",
		font_small:
			dimensions.font_small != false ? dimensions.font_small : ".8333333333",
		font_normal: dimensions.font_normal != false ? dimensions.font_normal : "1",
		font_large: dimensions.font_large != false ? dimensions.font_large : "1.44"
	};

	var baseFontSize = 16,
		stackedColorData = dset.colorData,
		barTagData = dset.tagData,
		pieCatData = dset.catData,
		bp_md = 700,
		bp_lg = 1024,
		maxTagPerColumn = 6,
		accumulatedXPos = 0;

	// Need to calc these dimensions.

	chartSize.stackedColorW = chartSize.w;
	chartSize.pieCatW =
		chartSize.w < bp_md
			? dimensions.w - dimensions.m * 2
			: chartSize.w < bp_lg
			? dimensions.w * 0.4 - dimensions.m * 2
			: dimensions.w * 0.3 - dimensions.m * 2;
	chartSize.pieCatH =
		chartSize.w < bp_md
			? dimensions.w - dimensions.m * 2
			: chartSize.w < bp_lg
			? dimensions.w * 0.4 - dimensions.m * 2
			: dimensions.w * 0.3 - dimensions.m * 2;
	chartSize.barTagW =
		chartSize.w < bp_md
			? dimensions.w
			: chartSize.w < bp_lg
			? dimensions.w * 0.6 - dimensions.m
			: dimensions.w * 0.7 - dimensions.m;
	var barTagPos = {
		x:
			chartSize.w > bp_md
				? chartSize.w - chartSize.barTagW + chartSize.m
				: chartSize.m,
		y: 90 + chartSize.m
	};
	var columnMode =
		barTagData.length > maxTagPerColumn && chartSize.barTagW > bp_md
			? true
			: false;
	var chartOffsetY =
		(chartSize.font_large + chartSize.font_normal) * baseFontSize +
		chartSize.m +
		chartSize.g * 2;
	chartSize.barTagH =
		chartSize.w > bp_md ? 300 : 29 * barTagData.length + chartOffsetY;
	chartSize.r = Math.min(chartSize.pieCatW - 150, 250);
	chartSize.pieCatH = chartSize.r + chartOffsetY;
	chartSize.h =
		chartSize.w > bp_md
			? 97 + Math.max(chartSize.pieCatH, chartSize.barTagH)
			: chartSize.pieCatH + chartSize.barTagH + 97;
	var colors = d3.scale.category20();
	// Color Bar
	var rainbow = d3.scale
		.ordinal()
		.domain([
			"black",
			"brown",
			"grey",
			"white",
			"red",
			"orange",
			"yellow",
			"green",
			"blue",
			"purple"
		])
		.range([
			"#111111",
			"#5D3A18",
			"#aaaaaa",
			"#dfdfdf",
			"#EB1313",
			"#E75516",
			"#FDE93A",
			"#5DD245",
			"#448BD2",
			"#6E4ACB"
		]);
	var barTagX = d3.scale
		.linear()
		.domain([
			0,
			Math.max.apply(
				Math,
				barTagData.map(function(d) {
					return d.count;
				})
			)
		])
		.range([10, chartSize.barTagW * 0.75]);
	var barTagY = d3.scale
		.ordinal()
		.domain(d3.range(barTagData.length))
		.rangeRoundBands(
			[0, chartSize.barTagH - (chartOffsetY + chartSize.m * 2)],
			0.05
		);
	if (columnMode) {
		barTagY = d3.scale
			.ordinal()
			.domain(d3.range(0, barTagData.length / 2, 1))
			.rangeRoundBands(
				[0, chartSize.barTagH - (chartOffsetY + chartSize.m * 2)],
				0.05
			);
		barTagX = d3.scale
			.linear()
			.domain([
				0,
				Math.max.apply(
					Math,
					barTagData.map(function(o) {
						return o.count;
					})
				)
			])
			.range([10, chartSize.barTagW * 0.4]);
	}
	stackedColorX = d3.scale
		.linear()
		.domain([
			0,
			stackedColorData.reduce(function(accumulator, currentValue) {
				return Number(accumulator) + Number(currentValue.count);
			}, 0)
		])
		.range([0, dimensions.w - dimensions.m * 2])
		.interpolate(d3.interpolateRound);
	_svg.attr({
		class: "svg",
		width: chartSize.w,
		height: chartSize.h,
		transform: "translate(0, 0)"
	});
	var _stackedColor = _svg.append("g").attr({
		id: "colorBlockChart",
		width: chartSize.stackedColorW,
		height: function() {
			return (
				(chartSize.font_large + chartSize.font_normal) * baseFontSize +
				chartSize.m * 2 +
				chartSize.g * 2 +
				29
			);
		},
		transform: "translate(0, 0)"
	});
	// Append The title
	_stackedColor
		.append("text")
		.text("Colors")
		.style("font-family", "'SansationBold', 'trebuchet MS', Arial, sans-serif")
		.attr({
			class: "font_display",
			"font-size": function() {
				return chartSize.font_large + "rem";
			},
			x: chartSize.m,
			y: chartSize.m,
			"alignment-baseline": "hanging",
			fill: "#222"
		});
	_stackedColor
		.append("text")
		.text("")
		.style("cursor", "pointer")
		.attr({
			class:
				"font_display font_bold  text-right underline h:black filter clearFilter",
			"text-anchor": "end",
			"data-filter": "*",
			"font-size": function() {
				return chartSize.font_small + "rem";
			},
			x: chartSize.stackedColorW - chartSize.m,
			y:
				(chartSize.font_large - chartSize.font_small) * baseFontSize +
				chartSize.m,
			"alignment-baseline": "hanging",
			fill: "#3182bd"
		})
		.on("click", function() {
			clearFilterButton();
		});
	// Append the Fragment Count
	_stackedColor
		.append("text")
		.text("FRAGMENTS")
		.style("font-family", "'SansationBold', 'trebuchet MS', Arial, sans-serif")
		.attr({
			class: "font_copy font_bold c_secondary-1",
			"font-size": function() {
				return chartSize.font_normal + "rem";
			},
			x: chartSize.m,
			y: chartSize.font_large * baseFontSize + chartSize.g + chartSize.m,
			"alignment-baseline": "hanging",
			fill: "#888"
		});
	// Append the Selection Inicator
	_stackedColor
		.append("text")
		.text("FILTER")
		.style("font-family", "'SansationBold', 'trebuchet MS', Arial, sans-serif")
		.attr({
			class: "font_copy font_bold c_secondary-1 text-right",
			"text-anchor": "end",
			"font-size": function() {
				return chartSize.font_normal + "rem";
			},
			x: chartSize.stackedColorW - chartSize.m,
			y: chartSize.font_large * baseFontSize + chartSize.g + chartSize.m,
			"alignment-baseline": "hanging",
			fill: "#888"
		});
	_stackedColor
		.append("text")
		.text("all")
		.attr({
			class: "font_display font_bold text-right filterFragmentLabel",
			"text-anchor": "end",
			"font-size": function() {
				return chartSize.font_normal + "rem";
			},
			x: chartSize.stackedColorW - chartSize.m - 57,
			y: chartSize.font_large * baseFontSize + chartSize.g + chartSize.m,
			"alignment-baseline": "hanging",
			fill: "#ff7f0e"
		});
	_stackedColor
		.append("text")
		.text("none")
		.attr({
			class: "font_display font_bold filterFragmentCount",
			"text-anchor": "start",
			"font-size": function() {
				return chartSize.font_normal + "rem";
			},
			x: 102 + chartSize.m,
			y: chartSize.font_large * baseFontSize + chartSize.g + chartSize.m,
			"alignment-baseline": "hanging",
			fill: "#ff7f0e"
		});
	var singleStackedBlock = _stackedColor
		.append("g")
		.attr("id", "blockChart")
		.attr({
			width: chartSize.w - chartSize.m * 2,
			height: function() {
				return chartSize.w < 1024 ? 29 : 10;
			},
			transform: function() {
				return "translate(" + chartSize.m + "," + chartOffsetY + ")";
			}
		})
		.selectAll(".block")
		.data(stackedColorData)
		.enter()
		.append("rect")
		.attr({
			class: function(d) {
				return d.name + " block filter";
			},
			stroke: "#fff",
			"stroke-width": 1,
			height: function() {
				return chartSize.w < bp_md ? 29 : 10;
			},
			width: function(d) {
				return stackedColorX(d.count);
			},
			fill: function(d) {
				return rainbow(d.name);
			},
			transform: function(d, i) {
				return "translate(" + blockPosition(d) + ")";
			},
			"data-filter": function(d, i) {
				return ".color-" + d.name;
			}
		})
		.on("click", function(d, i) {
			console.log(d);
			setFilterData(d, i);
		});
	singleStackedBlock
		.on("mouseover", function() {
			d3.select(this).attr({
				height: 35
			});
		})
		.on("mouseout", function() {
			d3.select(this).attr({
				height: function() {
					return chartSize.w < bp_md ? 29 : 10;
				}
			});
		});

	function blockPosition(d) {
		var xpos, ypos;
		xpos = accumulatedXPos;
		ypos = 0;
		accumulatedXPos += stackedColorX(Number(d.count));
		return xpos + "," + ypos;
	}

	var _barTagContainer = _svg.append("g").attr({
		id: "barTagChart",
		width: chartSize.barTagW,
		height: chartSize.barTagH,
		transform: function() {
			return "translate(" + barTagPos.x + "," + barTagPos.y + ")";
		}
	});
	// Append The title
	_barTagContainer
		.append("text")
		.text("Image Tags")
		.style("font-family", "'SansationBold', 'trebuchet MS', Arial, sans-serif")
		.attr({
			class: "font_display",
			"font-size": function() {
				return chartSize.font_large + "rem";
			},
			x: 0,
			y: 0,
			"alignment-baseline": "hanging",
			fill: "#222"
		});
	_barTagContainer
		.append("text")
		.text("")
		.style("cursor", "pointer")
		.attr({
			class:
				"font_display font_bold  text-right underline h:black filter clearFilter",
			"text-anchor": "end",
			"data-filter": "*",
			"font-size": function() {
				return chartSize.font_small + "rem";
			},
			x: chartSize.barTagW - chartSize.m * 2,
			y: (chartSize.font_large - chartSize.font_small) * baseFontSize,
			"alignment-baseline": "hanging",
			fill: "#3182bd"
		})
		.on("click", function() {
			clearFilterButton();
		});
	// Append the Fragment Count
	_barTagContainer
		.append("text")
		.text("FRAGMENTS")
		.attr({
			class: "font_display font_bold c_secondary-1",
			"font-size": function() {
				return chartSize.font_normal + "rem";
			},
			x: chartSize.g,
			y: chartSize.font_large * baseFontSize + chartSize.g,
			"alignment-baseline": "hanging",
			fill: "#888"
		});
	// Append the Selection Inicator
	_barTagContainer
		.append("text")
		.text("FILTER")
		.style("font-family", "'SansationBold', 'trebuchet MS', Arial, sans-serif")
		.attr({
			class: "font_copy font_bold c_secondary-1 text-right",
			"text-anchor": "end",
			"font-size": function() {
				return chartSize.font_normal + "rem";
			},
			x: chartSize.barTagW - chartSize.m * 2,
			y: chartSize.font_large * baseFontSize + chartSize.g,
			"alignment-baseline": "hanging",
			fill: "#888"
		});
	_barTagContainer
		.append("text")
		.text("all")
		.attr({
			class: "font_display font_bold text-right filterFragmentLabel",
			"text-anchor": "end",
			"font-size": function() {
				return chartSize.font_normal + "rem";
			},
			x: chartSize.barTagW - 57 - chartSize.m * 2,
			y: chartSize.font_large * baseFontSize + chartSize.g,
			"alignment-baseline": "hanging",
			fill: "#ff7f0e"
		});
	_barTagContainer
		.append("text")
		.text("none")
		.attr({
			class: "font_display font_bold filterFragmentCount",
			"text-anchor": "start",
			"font-size": function() {
				return chartSize.font_normal + "rem";
			},
			x: 102,
			y: chartSize.font_large * baseFontSize + chartSize.g,
			"alignment-baseline": "hanging",
			fill: "#ff7f0e"
		});
	var _barTagChart = _barTagContainer.append("g").attr({
		class: "barChart",
		transform: function() {
			return "translate(0," + chartOffsetY + ")";
		}
	});
	var _barTagBlock = _barTagChart
		.selectAll(".bar")
		.data(barTagData)
		.enter()
		.append("g")
		.attr({
			class: "bar filter",
			"data-filter": function(d) {
				return "." + d.name.replace(/\s/g, "-");
			},
			transform: function(d, i) {
				var xOffset =
					columnMode && i >= barTagData.length / 2
						? (chartSize.w - chartSize.m * 2) / 2
						: 0;
				return "translate(" + xOffset + "," + barTagY(i) + ")";
			}
		})
		.on("click", function(d, i) {
			console.log(d);
			setFilterData(d, i);
		})
		.on("mouseover", function() {
			d3.select(this)
				.select(".tag-label")
				.attr("fill", "#000000");
			d3.select(this)
				.select(".bar")
				.attr("opacity", "1");
		})
		.on("mouseout", function() {
			d3.select(this)
				.select(".tag-label")
				.attr("fill", "#888888");
			d3.select(this)
				.select(".bar")
				.attr("opacity", ".75");
		});
	_barTagBlock.append("rect").attr({
		y: 0,
		x: 0,
		class: function() {
			return "bar filter";
		},
		height: barTagY.rangeBand(),
		width: function(d) {
			return barTagX(d.count);
		},
		fill: function(d, i) {
			return colors(i);
		},
		opacity: ".75"
	});
	_barTagBlock
		.append("text")
		.attr({
			class: "tag-label font_copy",
			y: barTagY.rangeBand() / 2,
			x: function(d) {
				return barTagX(d.count) + 8;
			},
			height: barTagY.rangeBand(),
			"font-size": function() {
				return chartSize.font_small + "rem";
			},
			fill: "#888888",
			"alignment-baseline": "central"
		})
		.text(function(d) {
			return d.name;
		});

	// PIE
	var pieChartPos = {
		x: chartSize.m,
		y:
			chartSize.w > bp_md
				? 90 + chartSize.m
				: 90 + chartSize.m + chartSize.barTagH
	};

	var pie = d3.layout
		.pie()
		.sort(null)
		.value(function(d) {
			return d.count;
		});
	var arc = d3.svg
		.arc()
		.outerRadius(chartSize.r * 0.5 - chartSize.m)
		.innerRadius(chartSize.r * 0.2 - chartSize.m);
	var _pieCatContainer = _svg.append("g").attr({
		id: "catPieChart",
		width: chartSize.pieCatW,
		height: chartSize.pieCatH,
		transform: function() {
			return "translate(" + pieChartPos.x + "," + pieChartPos.y + ")";
		}
	});
	_pieCatContainer
		.append("text")
		.text("Categories")
		.style("font-family", "'SansationBold', 'trebuchet MS', Arial, sans-serif")
		.attr({
			class: "font_display",
			"font-size": function() {
				return chartSize.font_large + "rem";
			},
			x: 0,
			y: chartSize.g,
			"alignment-baseline": "hanging",
			fill: "#222"
		});
	// Append the Fragment Count
	_pieCatContainer
		.append("text")
		.text("FRAGMENTS")
		.style("font-family", "'SansationBold', 'trebuchet MS', Arial, sans-serif")
		.attr({
			class: "font_display font_bold c_secondary-1",
			"font-size": function() {
				return chartSize.font_normal + "rem";
			},
			x: 0,
			y: chartSize.font_large * baseFontSize + chartSize.g,
			"alignment-baseline": "hanging",
			fill: "#888"
		});

	// Append the Selection Inicator
	_pieCatContainer
		.append("text")
		.text("FILTER")
		.style("font-family", "'SansationBold', 'trebuchet MS', Arial, sans-serif")
		.attr({
			class: "font_display font_bold c_secondary-1 text-right",
			"text-anchor": "end",
			"font-size": function() {
				return chartSize.font_normal + "rem";
			},
			x: chartSize.pieCatW,
			y: chartSize.font_large * baseFontSize + chartSize.g,
			"alignment-baseline": "hanging",
			fill: "#888"
		});
	_pieCatContainer
		.append("text")
		.text("")
		.style("cursor", "pointer")
		.attr({
			class:
				"font_display font_bold  text-right underline h:black filter clearFilter",
			"text-anchor": "end",
			"data-filter": "*",
			"font-size": function() {
				return chartSize.font_small + "rem";
			},
			x: chartSize.pieCatW,
			y: (chartSize.font_large - chartSize.font_small) * baseFontSize,
			"alignment-baseline": "hanging",
			fill: "#3182bd"
		})
		.on("click", function() {
			clearFilterButton();
		});
	_pieCatContainer
		.append("text")
		.text("all")
		.attr({
			class: "font_display font_bold text-right filterFragmentLabel",
			"text-anchor": "end",
			"font-size": function() {
				return chartSize.font_normal + "rem";
			},
			x: chartSize.pieCatW - 57,
			y: chartSize.font_large * baseFontSize + chartSize.g,
			"alignment-baseline": "hanging",
			fill: "#ff7f0e"
		});
	_pieCatContainer
		.append("text")
		.text("none")
		.attr({
			class: "font_display font_bold filterFragmentCount",
			"text-anchor": "start",
			"font-size": function() {
				return chartSize.font_normal + "rem";
			},
			x: 102,
			y: chartSize.font_large * baseFontSize + chartSize.g,
			"alignment-baseline": "hanging",
			fill: "#ff7f0e"
		});

	var _pieChart = _pieCatContainer
		//	.data([pieCatData])
		.append("svg:g")
		.attr({
			transform: function() {
				return (
					"translate(" +
					chartSize.r / 2 +
					"," +
					(chartSize.r / 2 + chartOffsetY) +
					")"
				);
			}
		});
	var _arc = _pieChart
		.selectAll("g.slice")
		.data(pie(pieCatData))
		.enter()
		.append("svg:g")
		.attr({
			class: function(d) {
				console.log(JSON.stringify(d));
				return d.data.name + " filter opacity_7 hover:opacity";
			},
			"data-filter": function(d) {
				return "." + d.data.name.replace(/\s/g, "-");
			}
		})
		.on("click", function(d, i) {
			console.log(d);
			setFilterData(d.data, i);
		})
		.append("svg:path")
		.attr({
			fill: function(d, i) {
				return colors(i);
			},
			d: arc
		});
	var _pieLegend = _pieCatContainer
		.append("svg:g")
		.attr({
			class: "legend",
			transform: function() {
				return (
					"translate(" +
					(chartSize.pieCatW - (chartSize.m + chartSize.g)) +
					", " +
					(chartSize.m * 2 + chartOffsetY) +
					")"
				);
			}
		})
		.selectAll(".legend")
		.data(pieCatData)
		.enter()
		.append("g")
		.attr({
			class: "legend-item filter",
			transform: function(d, i) {
				return "translate(0," + i * 28 + ")";
			},
			"data-filter": function(d) {
				return "." + d.name.replace(/\s/g, "-");
			}
		});
	_pieLegend.append("rect").style({
		x: -24,
		y: -12,
		height: 24,
		width: 24,
		fill: function(d, i) {
			return colors(i);
		}
	});
	_pieLegend
		.append("text")
		.attr({
			x: -28,
			y: 0,
			dy: ".35em",
			class: "font_display c_secondary-n2",
			"font-size": function() {
				return chartSize.font_small + "rem";
			}
		})
		.style("text-anchor", "end")
		.text(function(d) {
			return d.name;
		});
	function setFilterData(d, i) {
		_svg.selectAll(".filterFragmentCount").text("~");
		_svg.selectAll(".filterFragmentLabel").text("~");
		_svg.selectAll(".clearFilter").text("");
		let chartID = "#" + d.chart;
		_svg
			.select(chartID)
			.select(".filterFragmentCount")
			.text(d.count);
		_svg
			.select(chartID)
			.select(".filterFragmentLabel")
			.text(d.name.toLowerCase());
		_svg
			.select(chartID)
			.select(".clearFilter")
			.text("clear filters");
	}

	function clearFilterButton() {
		_svg.selectAll(".filterFragmentCount").text("all");
		_svg.selectAll(".filterFragmentLabel").text("none");
		_svg.selectAll(".clearFilter").text("");
	}
}
