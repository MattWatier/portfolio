function drawColorBlocks(selectData, dataSet, selectString, dimensions) {
	// selectData => A unique drawing identifier that has no spaces, no "." and no "#" characters.
	// dataSet => Input Data for the chart, itself.
	// selectString => String that allows you to pass in
	// a D3.selectAll() string.

	console.log(dataSet);
	var columns = 6;
	var blockSize = {
		w: dimensions.w,
		h: dimensions.h,
		m: dimensions.m,
		block: dimensions.w / columns - dimensions.g * 2,
		g: dimensions.g
	};
	console.log(blockSize);
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
		"teal",
		"purple",
		"brown"
	]);
	color.range([
		"#111111",
		"#999999",
		"#dfdfdf",
		"#EF3368",
		"#EB1313",
		"#E75516",
		"#FDE93A",
		"#5DD245",
		"#448BD2",
		"#008080",
		"#6E4ACB",
		"#5D3A18"
	]);

	var countTotal = dataSet.reduce(function(accumulator, currentValue) {
		console.log("prev " + accumulator);
		return Number(accumulator) + Number(currentValue.count);
	}, 0);
	console.log("countTotal " + countTotal);

	var unit = d3.scale
		.linear()
		.domain([0, countTotal])
		.range([0, 36])
		.interpolate(d3.interpolateRound);
	var graphData = [];
	for (var i = 0; i < dataSet.length; i++) {
		dataSet[i].unit = unit(dataSet[i].count) + 1;
		var dataPush = dataSet[i];
		for (var a = 1; a < dataSet[i].unit; a++) {
			graphData.push(dataPush);
		}
	}

	console.log(graphData);

	var _svg = d3
		.select(selectString)
		.append("svg")
		.attr({
			class: function() {
				return "block" + selectData;
			},
			width: blockSize.w,
			height: blockSize.w,
			transform: "translate(0, 0)"
		});
	_svg.append("rect").attr({
		class: "background",
		width: blockSize.w - blockSize.g * 2,
		height: blockSize.w - blockSize.g * 2,
		stroke: "#cccccc",
		"stroke-width": "1",
		transform: "translate(" + 0 + "," + 0 + ")",
		fill: "#fdfdfd"
	});

	var block_chart = _svg
		.append("g")
		.attr("id", "colorBlockContainer")
		.attr({
			width: blockSize.w - blockSize.m * 2,
			height: blockSize.w - blockSize.m * 2,
			stroke: "#cccccc",
			"stroke-width": "1",
			transform: "translate(" + blockSize.m + "," + blockSize.m + ")"
		})
		.selectAll(".blocks")
		.data(graphData)
		.enter();

	block_chart.append("rect").attr({
		class: function(d) {
			return d.name + " block";
		},
		stroke: "#cccccc",
		height: blockSize.block - blockSize.g * 2,
		width: blockSize.block - blockSize.g * 2,
		fill: function(d) {
			return color(d.name);
		},
		transform: function(d, i) {
			return "translate(" + blockPosition(i) + ")";
		},
		"data-filter": function(d, i) {
			return ".color-" + d.name;
		}
	});
	function blockPosition(i) {
		var xpos, ypos;
		xpos = (i % 6) * blockSize.block + blockSize.g;
		ypos = Math.floor(i / 6) * blockSize.block + blockSize.g;
		return xpos + "," + ypos;
	}
}
