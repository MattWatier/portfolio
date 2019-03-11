function drawColorWheel(selectData, dataSet, selectString, dimensions) {
	// selectData => A unique drawing identifier that has no spaces, no "." and no "#" characters.
	// dataSet => Input Data for the chart, itself.
	// selectString => String that allows you to pass in
	// a D3.selectAll() string.

	var wheel = dimensions;
	wheel.height = wheel.h;
	wheel.width = wheel.w;
	wheel.radius = Math.min(wheel.height, wheel.width) / 2;
	var color = d3.scale.ordinal();
	color.domain([
		"_color-black",
		"_color-grey",
		"_color-white",
		"_color-pink",
		"_color-red",
		"_color-orange",
		"_color-yellow",
		"_color-green",
		"_color-blue",
		"_color-purple",
		"_color-brown"
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
	var pie = d3.layout
		.pie()
		.sort(null)
		.value(function(d) {
			return d.count;
		});
	var arc = d3.svg
		.arc()
		.outerRadius(wheel.radius - 10)
		.innerRadius(50);
	var _svg = d3
		.select(selectString)
		.append("svg")
		.data([dataSet])
		.attr("class", function() {
			return "pie" + selectData;
		})
		.attr("width", wheel.width)
		.attr("height", wheel.height)
		.append("svg:g")
		.attr(
			"transform",
			"translate(" + wheel.width / 2 + "," + wheel.height / 2 + ")"
		);
	var _arc = _svg
		.selectAll("g.slice")
		.data(pie)
		.enter()
		.append("svg:g")
		.attr("class", "slice");
	_arc
		.append("svg:a")
		.attr("xlink:href", "#")
		.attr("data-filter", function(d) {
			return "." + d.data.classtype;
		})
		.append("svg:path")
		.attr("fill", function(d, i) {
			return color(d.data.type);
		})
		.attr("class", function(d) {
			return d.data.type;
		})
		.attr("d", arc)
		.attr("stroke", "#ffffff")
		.attr("stroke-width", "1")
		.attr("opacity", "0.5")
		.on("mouseover", function() {
			d3.select(this)
				.attr("opacity", "1")
				.attr("stroke-width", "1");
		})
		.on("mouseout", function() {
			d3.select(this)
				.attr("opacity", ".5")
				.attr("stroke-width", "1");
		});
}
