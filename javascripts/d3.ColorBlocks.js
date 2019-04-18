function drawColorBlocks(selectData, dataSet, selectString, dimensions) {
	// selectData => A unique drawing identifier that has no spaces, no "." and no "#" characters.
	// dataSet => Input Data for the chart, itself.
	// selectString => String that allows you to pass in
	// a D3.selectAll() string.
	var columns = 5;
	var blockSize = {
		w: dimensions.w,
		h: dimensions.h,
		m: dimensions.m,
		block: (dimensions.w - (columns - 1) * 2) / columns,
		gutter: 2
	};
	function blockDimension(multiplier) {
		if (multiplier == 1) {
			return blockSize.block;
		} else {
			return blockSize.block * multiplier + blockSize.gutter * (multiplier - 1);
		}
	}
	var blocks = [
		{ type: "1", y: 0, x: 0, w: blockDimension(1), h: blockDimension(1) },
		{ type: "2", y: 0, x: 0, w: blockDimension(1), h: blockDimension(2) },
		{ type: "3", y: 0, x: 0, w: blockDimension(3), h: blockDimension(1) },
		{ type: "4", y: 0, x: 0, w: blockDimension(2), h: blockDimension(2) },
		{ type: "5", y: 0, x: 0, w: blockDimension(5), h: blockDimension(1) }
	];
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

	var tempCountArray = [];
	for (var i = 0; i < dataSet.length; i++) {
		tempCountArray.push(dataSet[i].count);
	}
	var maxCount = Math.max.apply(Math, tempCountArray);

	console.log(maxCount);
	var unit = d3.scale
		.linear()
		.domain([0, maxCount])
		.range([1, 4])
		.interpolate(d3.interpolateRound);

	var _svg = d3
		.select(selectString)
		.append("div")
		.attr({
			class: function() {
				return "block" + selectData;
			},
			width: blockSize.w,
			height: blockSize.h,
			transform: "translate(0,0)"
		});

	var block_chart = _svg
		.append("div")
		.attr("id", "colorBlockContainer")
		.selectAll(".blocks")
		.data(dataSet);

	// .attr("transform", function(d) {
	// 	var returnTranslate =
	// 		"translate(" +
	// 		blocks[unit(d.count) - 1].x +
	// 		"," +
	// 		blocks[unit(d.count) - 1].y +
	// 		")";
	// 	blocks[unit(d.count) - 1].y =
	// 		blocks[unit(d.count) - 1].y +
	// 		unit(d.count) * blockSize.block +
	// 		unit(d.count) * blockSize.gutter;
	// 	return returnTranslate;
	// });
	// translate to the cube to the slot
	block_chart
		.enter()
		.append("div")
		.attr("data-filter", function(d, i) {
			return ".color-" + d.name;
		})
		.attr({
			class: function(d) {
				return (
					d.name +
					" block br_3 m_1 br_solid br_black-2 block hover:opacity opacity_7"
				);
			},
			style: function(d, i) {
				return (
					"height:" +
					blocks[unit(d.count) - 1].h +
					"px; width:" +
					blocks[unit(d.count) - 1].w +
					"px; background-color:" +
					color(d.name) +
					";"
				);
			}
		});
}
