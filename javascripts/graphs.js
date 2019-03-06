var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight;

function drawMagnitudeofWork(chartID, dataSet, dataSetName, selectString) {
	// chartID => A unique drawing identifier that has no spaces, no "." and no "#" characters.
	// dataSet => Input Data for the chart, itself.
	// selectString => String that allows you to pass in
	// a D3.selectAll() string.
	var dSet = dataSet;
	var dataSetName = dataSetName;
	var chartDimensions = { w: 1024, h: 1000 };
}

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
/// PAGE CHART
function drawBarChart(chartID, dataSet, selectString) {
	// chartID => A unique drawing identifier that has no spaces, no "." and no "#" characters.
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
	var hCalc = Math.max(
		document.documentElement.clientHeight,
		window.innerHeight || 0
	);
	var dataSet = dataSet;
	var barChart = { w: wCalc, h: Math.max(hCalc * 0.45, 300), m: 10 };

	barChart.height = barChart.h;
	barChart.width = barChart.w;
	var color = d3.scale.category20().domain(d3.range(dataSet.length));
	var x = d3.scale
		.ordinal()
		.domain(d3.range(dataSet.length))
		.rangeRoundBands([0, barChart.width], 0.05);
	var y = d3.scale
		.linear()
		.domain([
			0,
			d3.max(dataSet, function(d) {
				return d.count;
			})
		])
		.range([0, barChart.height], 0);

	var bchart_svg = d3
		.select(selectString)
		.append("svg")
		.attr({
			class: function() {
				return "bar" + chartID;
			},
			width: barChart.w,
			height: barChart.h,
			transform: "translate(" + barChart.m + "," + barChart.m + ")"
		});

	var bchart = bchart_svg
		.selectAll(".bar")
		.data(dataSet)
		.enter()
		.append("g")
		.attr("class", "bar");

	bchart
		.append("svg:a")
		.attr("xlink:href", function(d) {
			return d.type;
		})
		.append("rect")
		.attr({
			class: function(d) {
				return d.type;
			},
			x: function(d, i) {
				return x(i);
			},
			y: function(d) {
				return barChart.height - y(d.count);
			},
			height: function(d) {
				return y(d.count);
			},
			width: x.rangeBand(),
			fill: function(d, i) {
				return color(i);
			}
		});
	// The "Number" count of elements in each gallery
	bchart
		.append("text")
		.text(function(d) {
			return d.count;
		})
		.attr({
			class: "count font_display font_3",
			x: function(d, i) {
				return x(i) + 5;
			},
			y: function(d) {
				return barChart.height - y(d.count) + 55;
			},
			width: x.rangeBand(),
			fill: "#ffffff"
		});
	// The "Name" of each gallery
	bchart
		.append("text")
		.text(function(d) {
			return d.type;
		})
		.attr({
			class: "label font_0",
			x: function(d, i) {
				return x(i) + 5;
			},
			y: function(d) {
				return barChart.height - y(d.count) + 20;
			},
			width: x.rangeBand(),
			fill: "#ffffff"
		});
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

function flattenArray(obj) {
	var arraytemp = [];
	for (key in obj) {
		if (obj.hasOwnProperty(key)) {
			arraytemp.push(obj[key]);
		}
	}
	return arraytemp;
}

// function renderBubbleGraph(dataSet){
// if(windowWidth>1120){windowWidth=1120;}
// var margin = {top: 80, right: 150, bottom: 70, left: 20},
//     width = windowWidth - margin.left - margin.right-50,
//     height = 500 - margin.top - margin.bottom;
// if(windowWidth<800){margin.right=120;width = windowWidth - margin.left - margin.right-50;}
// if(windowWidth<500){margin.right=80;width = windowWidth - margin.left - margin.right-50;}
// var d3_data = flattenArray(dataSet);
// var y_domain = domainArray(d3_data, "type");
// var parentArray = domainArray(d3_data, "type");

// function domainArray(a , type, included) {

//   var parentdata   = [];
//   var data =[];// ["Photos","Canvas","Page","Screen"];
//   for (var i = 0; i < a.length; i++) {
//     parentdata.push(a[i]['parent']);
//     if( included == a[i]['parent'] || included == "all" ){
//        data.push( a[i][type] );
//     }
//   }
//   if( parentdata.indexOf(included) == -1 && included != "all" ){ included = undefined; }
//   if(included == undefined){ return unique( parentdata );}

//   if(included != "all"){ data.push( included );}
//   return unique(data);
// }

// var x = d3.scale.linear().range([0, width],1);
// var y = d3.scale.ordinal().rangePoints([0, height],1);

// var colorDomain = colorDomain();
// var photoColors = ["#4ab000","#fe5e9a","#ffa6c7","#ffd1e3"]
// var paperColors =["#b137f0","#56ad16","#9ed976","#3d89ba","#8ecef5"]
// var screenColors = ["#3081c2","#ff5e14","#ff883c","#ffbe78","#ffe4c7","#a24bff","#c691ff","#e2c7ff"];
// var canvasColors =["#3182bd","#6baed6" ,"#e55600","#5e4000","#6e592a","#94815c"];
// var colorType= [];
// var colorRange = colorType.concat(photoColors,paperColors,canvasColors,screenColors);
// var color = d3.scale.ordinal().domain(colorDomain).range(colorRange);

// function colorDomain(){
//   var collection = [];
//   var parents = unique( domainArray(d3_data, "parent","all")  );

//   for (var i = 0; i < parents.length; i++) {
//     collection.push(parents[i]);
//     var group = [];
//     var type = unique(domainArray(d3_data, "type",parents[i]));
//     for (var a = 0; a < type.length; a++) {
//       if(parent[i] != type[a]){ collection.push( type[a]  );
//     };}

//   };
//   return unique(collection).reverse();

// }

// var svg = d3.select("#dataholder").append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//     .append("g")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// x.domain(d3.extent(d3_data, function(d) { return d.date}));
// y.domain( y_domain );

// var shadedblocks = svg.selectAll(".shadedblocks")
//     .data(x.ticks(10))
//     .enter().append("g")
//     .attr("class", "shadedblocks")
//     .attr("transform", function(d,i){return "translate("+x(d)+",0)";});
// shadedblocks.append("rect")
//     .attr("class", "blocks")
//     .attr("height",height)
//     .attr("width", function(d,i){ return (x(1)-x(0)); })
//     .attr("x", 0 )
//     .attr("y", 0 )
//     .style("fill", "#000000")
//     .style("fill-opacity",function(d,i){ return ( i & 1 ) ? .01 : .1; });
// shadedblocks.append("text")
//     .attr("class", "toplabel")
//     .attr("x", function(d,i){ return (x(1)-x(0))- 5; })
//     .attr("y", 10)
//     .attr("dy", ".35em")
//     .style("text-anchor","end")
//     .style("fill", "#999999")
//     .text(function(d){return d});
// shadedblocks.append("text")
//     .attr("class", "bottomlabel")
//     .attr("x", function(d,i){ return (x(1)-x(0))- 5; })
//     .attr("y",height-10)
//     .attr("dy", ".35em")
//     .style("text-anchor","end")
//     .style("fill", "#999999")
//     .text(function(d){return d});

// var circles = svg.selectAll(".circles")
//     .data(d3_data)
//     .enter().append("g")
//    .attr("class", "circles");

//   circles.append("circle")
//   .attr("class", "category")
//   .attr("cx",function(d){ return x(d.date); })
//     .attr("cy",function(d){ return y(d.type); })
//     .attr("data-role",function(d){ return d.type; })
//     .attr("r", function(d,i){ return d.parentnode ?   (Math.sqrt( d.r ) * 4) :  0; })
//     .style("fill", function(d) { return color(d.type); })
//     .style("fill-opacity",0.75)
//     .style("stroke-opacity", .25);

// createLegend( y_domain );

// function createLegend( ydomain ){
//   var recthieght = height / Object.keys(ydomain).length;
//   svg.selectAll(".legend").remove();
//   var legend = svg.selectAll(".legend")
//     .data(ydomain)
//     .enter().append("g")
//     .attr("class", "legend")
//     .attr("transform", function(d, i) { return "translate("+((x(1)-x(0)))+"," + ( recthieght * i )+ ")"; });
// legend.append("rect")
//     .attr("x", width + 10)
//     .attr("width", 5)
//     .attr("height", recthieght )
//     .style("fill", color);
// legend.append("text")
//   .attr("class","legend")
//     .attr("x", width + 19)
//     .attr("y", 9)
//     .attr("dy", ".35em")
//     .style("text-anchor", "start")
//     .text(function(d) { return d; });
// legend.append("rect")
//     .attr("class","hitarea")
//     .attr("x", width + 10)
//     .attr("width",80)
//     .attr("height", recthieght)
//     .attr("data-role", function(d){return d} )
//     .style("cursor","pointer")
//     .style("fill-opacity",0)
//     .on("click", transitioncircles);

// }
// function transitioncircles( d ){

//     y = d3.scale.ordinal();
//     y.rangePoints([0, height],1);
//     y_domain = domainArray(d3_data, "type", d);
//     y.domain( y_domain );
//     var topLevel = ( parentArray.indexOf(d) != -1)? false : true;
//       svg.selectAll(".category")
//         .transition().duration(500)
//         .attr("cy",function(d){
//             if( topLevel ){
//               return (d.parentnode)? y(d.type) : y(d.parent) ;
//             }else{
//               return y( d.type );
//             }
//           })
//         .attr("r",function(d){
//             if( topLevel ){
//                return (d.parentnode)? ( Math.sqrt(d.r) * 4 ): 0 ;
//             }else{
//                return ( y_domain.indexOf(d.type) != -1  )? (Math.sqrt( d.r ) * 4) : 0;
//               }
//           })
//         .style("fill", function(d){
//            if (topLevel) {
//               return (d.parentnode)? color(d.type) : "#cccccc";
//            }else{
//               return ( d.parentnode )? "#cccccc" : color(d.type) ;
//             }
//         })
//         .style("fill-opacity", function(d){
//             if (topLevel) {
//               return(d.parentnode)? 0.75: 0 ;
//             }else{
//               return ( y_domain.indexOf(d.type) != -1 )? .75 : 0;
//             }
//         });
//         createLegend( y_domain  );
// }
// }

function unique(arr) {
	var a = [];
	var l = arr.length;
	for (var i = 0; i < l; i++) {
		for (var j = i + 1; j < l; j++) {
			// If a[i] is found later in the array
			if (arr[i] === arr[j]) j = ++i;
		}
		a.push(arr[i]);
	}
	return a;
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
		"_color-brown",
		"_color-yellow",
		"_color-green",
		"_color-blue",
		"_color-purple"
	]);
	color.range([
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
