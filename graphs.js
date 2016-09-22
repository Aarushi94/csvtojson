function createStackedChart(){
  var life = ["female", "male"];

  var margin = {top: 40, right: 100, bottom: 150, left: 50},
      width = 1000 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  var x = d3.scale.ordinal()
      .rangeRoundBands([0, width]);

  var y = d3.scale.linear()
      .rangeRound([height, 0]);

  var z = ["orange", "brown"]

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");



  var svg = d3.select("#stackG").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



  d3.json("asianCountriesLifeExpectancy.json", function(error, data) {
    if (error) throw error;

    var layers = d3.layout.stack()(life.map(function(c) {
      return data.map(function(d) {
        return {x: d.countryName, y: d[c]};
      });
    }));

    var tip = d3.tip()
          .attr('class', 'd3-tip')
          .offset([-10, 0])
          .html(function(d) {
            return "<span style='color:red'>" + d.y.toFixed(2) + "</span>";
          })
  svg.call(tip);
  //  console.log(layers);

    x.domain(layers[0].map(function(d) { return d.x; }));
    y.domain([0, d3.max(layers[layers.length - 1], function(d) { return d.y0 + d.y; })]).nice();

    var layer = svg.selectAll(".layer")
        .data(layers)
        .enter().append("g")
        .attr("class", "layer")
        .style("fill", function(d, i) { return z[i]; });

    layer.selectAll("rect")
        .data(function(d) { return d; })
        .enter().append("rect")
        .attr("x", function(d) { return x(d.x); })
        .attr("y", function(d) { return y(d.y + d.y0); })
        .attr("height", function(d) { return y(d.y0) - y(d.y + d.y0); })
        .attr("width", x.rangeBand() - 1)
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);


          var legend = svg.selectAll(".legend")
          .data(z)
          .enter().append("g")
          .attr("class", "legend")
          .attr("transform", function(d, i) { return "translate(30," + i * 19 + ")"; });

          legend.append("rect")
          .attr("x", width - 18)
          .attr("width", 18)
          .attr("height", 18)
          .style("fill", function(d, i) {return z.slice()[i];});

          legend.append("text")
          .attr("x", width + 5)
          .attr("y", 9)
          .attr("dy", ".35em")
          .style("text-anchor", "start")
          .text(function(d, i) {
            switch (i) {
              case 0: return "Female";
              case 1: return "Male";
            }
          });


    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.55em")
        .attr("transform", "rotate(-90)" );


    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 5)
        .attr("dy", ".71em")
        .style("text-anchor", "end");

  // Heading of the chart
        svg.append("text")
  			  .attr("x", (width/2))
  				.attr("y", 0-(margin.top/2))
  				.attr("text-anchor", "middle")
  				.style("font-size", "20px")
  				.style("text-decoration", "bold")
  				.text("Life Expectancy of All Asian Countries(1960-2015)");
  });

}


function createBarGraph(){
  var margin = {top: 40, right: 20, bottom: 120, left: 40},
      width = 1000 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;


  // set the ranges
  var x = d3.scale.ordinal().rangeRoundBands([0, width], .5);

  var y = d3.scale.linear().range([height, 0]);

  // define the axis
  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")


  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .ticks(10);

  var tip = d3.tip()
  		  .attr('class', 'd3-tip')
  		  .offset([-10, 0])
  		  .html(function(d) {
  		    return "<span style='color:red'>" + d["totalValue"].toFixed(2) + "</span>";
  		  })


  // add the SVG element
  var svg = d3.select("#barG").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

  svg.call(tip);
  // load the data
  d3.json("topCountriesLifeExpectancy.json", function(error, data) {

    // scale the range of the data
    x.domain(data.map(function(d) { return d["countryName"]; }));
    y.domain([d3.min(data, function(d) { return d["totalValue"]-0.5; }), d3.max(data, function(d) { return d["totalValue"]+1; })]);

    // add axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
      .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.55em")
        .attr("transform", "rotate(-90)" );

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 5)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Total Life Expectancy at birth");


    // Add bar chart
    svg.selectAll("bar")
        .data(data)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d["countryName"]); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d["totalValue"]); })
        .attr("height", function(d) { return height - y(d["totalValue"]); })
  			.on('mouseover', tip.show)
        .on('mouseout', tip.hide)
        .style("fill","orange");

  // Heading of the chart
  			svg.append("text")
  			  .attr("x", (width/2))
  				.attr("y", 0-(margin.top/2))
  				.attr("text-anchor", "middle")
  				.style("font-size", "20px")
  				.style("text-decoration", "bold")
  				.text("Life Expectancy of Top 5 Countries");


  });

}
