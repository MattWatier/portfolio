function drawColorChart(chartID, dataSet, dataSetName, selectString) {
	// chartID => A unique drawing identifier that has no spaces, no "." and no "#" characters.
	// dataSet => Input Data for the chart, itself.
	// selectString => String that allows you to pass in
	// a D3.selectAll() string.
	var dSet = dataSet;
	var dataSetName = dataSetName;
	// for (var i = 0; i < dataSet.length; i++) {
	//   var $d = new Date(dataSet[i]['date']);
	//var $UTCdate = $d.getUTCDate();
	//   dataSet[i]['date'] = $d;
	// }

	var colorChart = { w: windowWidth - 500, h: 1000 };
	var color = d3.scale
		.ordinal()
		.domain([
			"_color-black",
			"_color-grey",
			"_color-white",
			"_color-pink",
			"_color-red",
			"_color-orange",
			"_color-brown",
			"_color-yellow",
			"_color-green",
			"_color-blue",
			"_color-purple"
		])
		.range([
			"#222222",
			"#888888",
			"#dfdfdf",
			"#EF3368",
			"#EB1313",
			"#E75516",
			"#5D3A18",
			"#FDE93A",
			"#5DD245",
			"#448BD2",
			"#6E4ACB"
		]);
	var xc = d3.scale
		.linear()
		.domain([0, 1716])
		.range([0, colorChart.w - 500]);
	console.log(xc(1716));
	var xd = d3.scale
		.linear()
		.domain([
			d3.min(dSet, function(d) {
				return d.date;
			}),
			d3.max(dSet, function(d) {
				return d.date;
			})
		])
		.range([0, colorChart.w - 500]);

	var color_chart_svg = d3
		.select(selectString)
		.append("svg")
		.attr("class", function() {
			return "color" + chartID;
		})
		.attr("width", colorChart.w)
		.attr("height", colorChart.h)
		.append("g")
		.attr("transform", "translate(" + 250 + "," + 250 + ")");

	var circles = color_chart_svg
		.selectAll(".circles")
		.data(dataSet)
		.enter()
		.append("g")
		.attr("class", "color_time");

	circles
		.append("circle")
		.attr("cy", 200)
		.attr("cx", function(d) {
			return xd(d.date) + colorChart.w / 2;
		})
		.attr("data-role", function(d) {
			return d.name;
		})
		.attr("r", 3)
		.style("fill", function(d) {
			return color(d.name);
		})
		.style("fill-opacity", 0.75);

	circles
		.append("circle")
		.attr("cy", 100)
		.attr("cx", function(d) {
			return xc(d.id) + 0;
		})
		.attr("data-role", function(d) {
			return d.name;
		})
		.attr("r", 3)
		.style("fill", function(d) {
			return color(d.name);
		})
		.style("fill-opacity", 0.75);

	var curves = circles
		.append("svg:line")
		.attr("x", function(d) {
			return xd(d.date) + colorChart.w;
		})
		.attr("y", function(d) {
			return xc(d.id) + 0;
		})
		.attr("y1", 200)
		.attr("y2", 100)
		.style("stroke", function(d) {
			return color(d.name);
		})
		.style("stroke-opacity", 0.75)
		.interpolate("cardinal")
		.tension(0);
}

function drawDonutChart(chartID, dataSet, selectString) {
	// chartID => A unique drawing identifier that has no spaces, no "." and no "#" characters.
	// dataSet => Input Data for the chart, itself.
	// selectString => String that allows you to pass in
	// a D3.selectAll() string.
	var wCalc = $(selectString).width() - 40;
	var hCalc = Math.max(
		Math.max(document.documentElement.clientHeight, window.innerHeight || 0) /
			4,
		250
	);

	var donutChart = {
		w: wCalc,
		h: hCalc,
		r: Math.min((wCalc - 32) * 0.4, hCalc - 32) / 2,
		m: 16
	};
	var color = d3.scale.category20c();
	var pie = d3.layout
		.pie()
		.sort(null)
		.value(function(d) {
			return d.count;
		});
	var arc = d3.svg
		.arc()
		.outerRadius(donutChart.r - donutChart.m / 2)
		.innerRadius(donutChart.r - (donutChart.r * 2) / 3);
	var _svg = d3
		.select(selectString)
		.append("svg")
		.data([dataSet])
		.attr("class", function() {
			return "pie" + chartID;
		})
		.attr("width", donutChart.w)
		.attr("height", donutChart.h)
		.append("svg:a")
		.attr("xlink:href", chartID)
		.append("svg:g")
		.attr(
			"transform",
			"translate(" +
				(donutChart.r + donutChart.m / 2) +
				"," +
				(donutChart.h / 2 + donutChart.m) +
				")"
		);
	var _arc = _svg
		.selectAll("g.slice")
		.data(pie)
		.enter()
		.append("svg:g")
		.attr("class", "slice");
	_arc
		.append("svg:path")
		.attr("fill", function(d, i) {
			return color(d.data.type);
		})
		.attr("class", function(d) {
			return d.data.type;
		})
		.attr("d", arc);
	var legend = _svg
		.selectAll(".legend")
		.data(color.domain())
		.enter()
		.append("g")
		.attr("class", "legend")
		.attr("transform", function(d, i) {
			return (
				"translate(" +
				(donutChart.r + donutChart.m * 2) +
				"," +
				(i * 28 - donutChart.r + 10) +
				")"
			);
		});
	legend
		.append("rect")
		.attr("x", -24)
		.attr("y", -12)
		.attr("width", 24)
		.attr("height", 25)
		.style("fill", color);
	legend
		.append("text")
		.attr("x", 4)
		.attr("y", 0)
		.attr("dy", ".35em")
		.attr("class", "font_1 font_display c_secondary-n2")
		.style("text-anchor", "start")
		.text(function(d) {
			return d;
		});
}

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
	console.log(wCalc);
	var barChart = { w: wCalc, h: windowHeight - 100, m: 20 };
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
