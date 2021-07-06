function drawColorBarFilter(dataSet, selectString, dimensions) {
	var accumulatedXPos = 0;
	// Dimnesions of the Chart with customizable size
	var chartSize = {
		w: dimensions.w,
		h: dimensions.h,
		m: dimensions.m,
		g: dimensions.g != false ? dimensions.g : '2',
		font_small: dimensions.font_small != false ? dimensions.font_small : '.8333333333',
		font_normal: dimensions.font_normal != false ? dimensions.font_normal : '1',
		font_large: dimensions.font_large != false ? dimensions.font_large : '1.44',
	};
	console.log('chart size  ' + JSON.stringify(chartSize));
	// Color Set Up
	var color = d3.scale.ordinal();
	color.domain(['black', 'brown', 'grey', 'white', 'red', 'orange', 'yellow', 'green', 'blue', 'purple']);
	color.range([
		'#111111',
		'#5D3A18',
		'#aaaaaa',
		'#dfdfdf',
		'#EB1313',
		'#E75516',
		'#FDE93A',
		'#5DD245',
		'#448BD2',
		'#6E4ACB',
	]);

	// Max Width of Data Points need to be set to allow for the blocks to fill the left to right space.
	var TotalColorCounts = dataSet.reduce(function (accumulator, currentValue) {
		return Number(accumulator) + Number(currentValue.count);
	}, 0);
	var widthUnit = d3.scale
		.linear()
		.domain([0, TotalColorCounts])
		.range([0, dimensions.w - dimensions.m * 2])
		.interpolate(d3.interpolateRound);

	// Set up the base SVG for the rest of the elements to be attached to.

	var _svg = d3
		.select(selectString)
		.append('svg')
		.attr({
			class: function () {
				return selectString.slice(1, -1) + '_chart';
			},
			width: chartSize.w,
			height: function () {
				return (((chartSize.font_large + chartSize.font_normal) * 16) + chartSize.m * 2 + chartSize.g * 2) + 29;
			},
			transform: 'translate(0, 0)',
		});

	// Append The title
	_svg.append('text')
		.text('Colors')
		.style("font-family", "'SansationBold', 'trebuchet MS', Arial, sans-serif")
		.attr({
			class: "font_display",
			'font-size': function () {
				return chartSize.font_large + "rem";
			},
			x: chartSize.m,
			y: chartSize.m,
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
			x: chartSize.m,
			y: chartSize.font_large * 16 + chartSize.g + chartSize.m,
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
			x: chartSize.w - chartSize.m,
			y: chartSize.font_large * 16 + chartSize.g + chartSize.m,
			'alignment-baseline': 'hanging',
			fill: "#888"
		});
	// Append the Chart
	var block_chart = _svg
		.append('g')
		.attr('id', 'colorBlockChart')
		.attr({
			width: chartSize.w - chartSize.m * 2,
			height: function () {
				return chartSize.w < 1024 ? 29 : 10;
			},
			transform: function () {
				return 'translate(' + chartSize.m + ',' + (((chartSize.font_large + chartSize.font_normal) * 16) + chartSize.m + (chartSize.g * 2)) + ')';

			},
		})
		.selectAll('.blocks')
		.data(dataSet)
		.enter();
	console.log();
	// Each Block needs to build upon the last to make a full line across the page.
	block_chart.append('rect').attr({
		class: function (d) {
			return d.name + ' block filter';
		},
		stroke: '#fff',
		'stroke-width': 1,
		height: function () {
			return chartSize.w < 1024 ? 29 : 10;
		},
		width: function (d) {
			return widthUnit(d.count);
		},
		fill: function (d) {
			return color(d.name);
		},
		transform: function (d, i) {
			return 'translate(' + blockPosition(d) + ')';
		},
		'data-filter': function (d, i) {
			return '.color-' + d.name;
		},
	});

	function blockPosition(d) {
		var xpos, ypos;
		xpos = accumulatedXPos;
		ypos = 0;

		accumulatedXPos += widthUnit(Number(d.count));

		return xpos + ',' + ypos;
	}
}