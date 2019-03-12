function drawColorBlocks(selectData, dataSet, selectString, dimensions) {
	// selectData => A unique drawing identifier that has no spaces, no "." and no "#" characters.
	// dataSet => Input Data for the chart, itself.
	// selectString => String that allows you to pass in
	// a D3.selectAll() string.
	var Chart = dimensions;
	var blockChart = {
		w: dimensions.w,
		h: dimensions.h,
		m: dimensions.m,
		block: dimensions.w / 15 - dimensions.gutter,
		gutter: dimensions.gutter
	};
	var blocks = {
		five: {
			y: 0
		},
		four: { y: 0 },
		three: { y: 0 },
		two: { y: 0 },
		one: { y: 0 }
	};
	var color = d3.scale.ordinal();
	color.domain([
		"black",
		"grey",
		"white",
		"pink",
		"red",
		"orange",
		"yellow",
		"green",
		"blue",
		"purple",
		"brown"
	]);
	color.range([
		"#222222",
		"#888888",
		"#dfdfdf",
		"#EF3368",
		"#EB1313",
		"#E75516",
		"#FDE93A",
		"#5DD245",
		"#448BD2",
		"#6E4ACB",
		"#5D3A18"
	]);
	var maxCount = d3.max(dataSet, function(d) {
		return d.count;
	});
	var unit = d3.scale
		.linear()
		.domain([
			0,
			d3.max(dataSet[0], function(d) {
				return d.count;
			})
		])
		.range([1, 5])
		.interpolate(d3.interpolateRound);
	console.log(maxCount);
	var _svg = d3
		.select(selectString)
		.append("svg")
		.attr("class", function() {
			return "block" + selectData;
		})
		.attr("width", blockChart.width)
		.attr("height", blockChart.height)
		.append("svg:g")
		.attr("transform", "translate(0,0)");
	var block_chart = _svg
		.selectAll(".blocks")
		.data(dataSet)
		.enter()
		.append("g")
		.attr("class", "block")
		.attr("transform", function(d) {
			return "translate(" + unit(d.count) + "," + blocks.five.y + ")";
		});
	block_chart.append("svg:a").attr("xlink:href", function(d) {
		return d.type;
	});
}
