function masterChart(DOMSelector, dset, dimensions) {
   chartSize = {
      w: dimensions.w,
      m: dimensions.m,
      g: dimensions.g != false ? dimensions.g : '2',
      font_small: dimensions.font_small != false ? dimensions.font_small : ".8333333333",
      font_normal: dimensions.font_normal != false ? dimensions.font_normal : "1",
      font_large: dimensions.font_large != false ? dimensions.font_large : "1.44"
   };
   colorBarDataSet = dset.colorData
   // Need to calc this dimensions.
   chartSize.h = 500;
   // Color Bar
   let accumulatedXPos = 0;
   let color_colors = d3.scale.ordinal();
   color_colors.domain(['black', 'brown', 'grey', 'white', 'red', 'orange', 'yellow', 'green', 'blue', 'purple']).range([
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
   colorBarX = d3.scale
      .linear()
      .domain([0, colorBarDataSet.reduce(function (accumulator, currentValue) {
         return Number(accumulator) + Number(currentValue.count);
      }, 0)])
      .range([0, dimensions.w - dimensions.m * 2])
      .interpolate(d3.interpolateRound);
   var stackedBar;

};