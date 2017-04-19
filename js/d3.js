var dataset = [];
for (var i = 0; i < 30; i++) {
  var newNum = Math.round(Math.random() * 50);
  dataset.push(newNum);
}

var dataset2 = [];
var numDataPoints = 50;
var xRange = Math.random() * 1000;
var yRange = Math.random() * 1000;
for (var i = 0; i < numDataPoints; i++) {
  var newNumber1 = Math.round(Math.random() * xRange);
  var newNumber2 = Math.round(Math.random() * yRange);
  dataset2.push([newNumber1, newNumber2]);
}

var dataset3 = [];
var numPoints = 100;
var numWaves = 4;
var i, o, p;

for (i = 0; i < numPoints; i += 1) {
  p = i / (numPoints - 1) * 100;
  o = Math.PI * p * numWaves * 2;
  dataset3.push({ percent: p, offset: o });
}

// width and height
var w = 650;
var h = 250;
var barPadding = 1;
var plotPadding = 30;

// easy-as-pi example(transitions)
var svg = d3.select("#easy-as-pi")
  .append("svg")
  .attr("width", "100%")
  .attr("height", "100%");

var rect = svg.append("rect")
  .attr("x", 0)
  .attr("y", 0)
  .attr("width", "100%")
  .attr("height", "100%")
  .attr("fill", "white")
  .attr("stroke", "none");

var circles = svg.selectAll(".circle-transition")
  .data(dataset3)
  .enter()
  .append("circle")
  .attr("class", "circle-transition")
  .attr("cx", (d) => d.percent + "%")
  .attr("cy", "50%")
  .attr("r", "1%");

// function endAll(transition, callback) {
//   var n = 0;
//   transition.on(function() { ++n; })
//     .on('end', function() {
//       if (!--n) callback.apply(this, arguments);
//     });
// }
// Usage
// d3.selectAll('g').transition().call(endAll, allDone);

function endall(transition, callback) { 
  if (transition.size() === 0) { callback() }
  var n = 0; 
  transition 
    .each(function() { ++n; }) 
    .on("end", function() { if (!--n) callback.apply(this, arguments); }); 
}

var done = () => console.log("done");

var recolor = function() {
  d3.select("rect")
    .transition()
    .duration(3000)
    .attr("fill", "hsl(" + (Math.random() * 360) + ",100%,50%)")
    .on("end", recolor);
};

wave = function() {

  //Move to bottom
  d3.select(this)
    .transition()
    .duration(3000)
    .attr("cy", "0%")
    .on("end", function() {

      //Move to top
      d3.select(this)
        .transition()
        .delay(function(d, i) {
          return i * 50;
        })
        .duration(3000)
        .attr("cy", "100%")
        .on("end", wave);

    });

};

recolor();

d3.selectAll(".circle-transition")
  .transition()
  .duration(500)
  .attr("fill", "red")
  .attr("cy", "0%")
  .transition()
  .duration(1000)
  .attr("fill", "lime")
  .attr("cy", "100%")
  .transition()
  .delay( (d, i) => i * 50)
  .attr("fill", "aqua")
  .duration(1000)
  .attr("cy", "1%")
  .call(endall, () => {
    // previous transition has ended
    d3.selectAll(".circle-transition")
      .transition()
      .attr("cy", "50%")
      // .transition()
      .delay( (d, i) => (i * 50) )
      .duration(100)
      .attr("fill", "steelblue")
      .call(endall, () => {
        d3.selectAll(".circle-transition")
          .transition()
          .delay( (d, i) => (i * 50) )
          .duration(100)
          .attr("fill", "#CCEE33")
          .call(endall, () => {
            d3.selectAll(".circle-transition")
              .transition()
              .delay( (d, i) => (i * 50) )
              .duration(100)
              .attr("fill", "rgb(255, 100, 33)")
              .call(endall, () => {
                d3.selectAll(".circle-transition")
                  .transition()
                  .delay( (d, i) => (i * 20) )
                  .duration(500)
                  .attr("r", "10%")
                  .call(endall, () => {
                    d3.selectAll(".circle-transition")
                      .transition()
                      .delay( (d, i) => (i * 20) )
                      .duration(500)
                      .attr("r", (d, i) => (Math.random() * 7) + "%" )
                      .call(endall, () => {
                        d3.selectAll(".circle-transition")
                          .transition()
                          .delay( (d, i) => (i * 20) )
                          .duration(500)
                          .attr("r", (d, i) => ((Math.sin(i / 5) + 1.1) * 3) + "%" )
                          .call(endall, () => {
                            d3.selectAll(".circle-transition")
                              // reset
                              .transition()
                              .duration(500)
                              .attr("r", "1%")
                              .call(endall, () => {
                                d3.selectAll(".circle-transition")
                                  .transition()
                                  .delay( (d, i) => (i * 50) )
                                  .duration(1500)
                                  .attr("cy", "100%")
                                  .on("end", wave)
                              });
                           })
                       });
                   });
               });
           });
       });
   });

// Scatterplot example
// x-scale
var xScale = d3.scaleLinear()
                     .domain([0, d3.max(dataset2, (d) => d[0]) ])
                     .range([plotPadding, w - plotPadding * 2]);
// y-scale
var yScale = d3.scaleLinear()
                     .domain([0, d3.max(dataset2, (d) => d[1]) ])
                     .range([h - plotPadding, plotPadding]);
// radius scale
var rScale = d3.scaleLinear()
                     .domain([0, d3.max(dataset2, (d) => d[1]) ])
                     .range([2, 5]);

var svg = d3.select("#scatterplot")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

// x-Axis
var xAxis = d3.axisBottom()
              .scale(xScale)
              .ticks(5);
// y-Axis
var yAxis = d3.axisLeft()
              .scale(yScale)
              .ticks(5);

// format
// var formatAsPercentage = d3.format(".1%");
// xAxis.tickFormat(formatAsPercentage);

svg.selectAll("circle")
   .data(dataset2)
   .enter()
   .append("circle")
   .attr("cx", (d) => xScale(d[0]))
   .attr("cy", (d) => yScale(d[1]))
   .attr("r", (d) =>  rScale(d[1]));

// svg.selectAll("text")
//    .data(dataset2)
//    .enter()
//    .append("text")
//    .text( (d) => `${d[0]}, ${d[1]}`)
//    .attr("x", (d) => xScale(d[0]))
//    .attr("y", (d) => yScale(d[1]))
//    .attr("font-family", "sans-serif")
//    .attr("font-size", "11px")
//    .attr("fill", "red");

// x-axis
svg.append("g")
   .attr("class", "axis")
   .attr("transform", "translate(0," + (h - plotPadding) + ")")
   .call(xAxis);

// y-axis
svg.append("g")
   .attr("class", "axis")
   .attr("transform", "translate(" + plotPadding + ",0)")
   .call(yAxis);

// Another bar chart example
// Create SVG element
var svg = d3.select("#bar-chart-2")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

// create rectangles
svg.selectAll("rect")
   .data(dataset)
   .enter()
   .append("rect")
   .attr("x", (d, i) => i * (w / dataset.length))
   .attr("y", (d) => h - (d * 4))
   .attr("width", w / dataset.length - barPadding)
   .attr("height", (d) => d * 4)
   // .attr("fill", "#FCB126"); // solid color bar
   .attr("fill", (d) => "rgb(0, 0, " + (d * 10) + ")");

// add text
svg.selectAll("text")
   .data(dataset)
   .enter()
   .append("text")
   .text((d) => d)
   .attr("x", (d, i) => i * (w / dataset.length) + (w / dataset.length - barPadding) / 2)
   .attr("y", (d) => h - (d * 4) + 14)
   .attr("font-family", "sans-serif")
   .attr("font-size", "11px")
   .attr("fill", "white")
   .attr("text-anchor", "middle");


// Bar chart example
d3.select("#bar-chart")
  .selectAll("div")
  .data(dataset)
  .enter()
  .append("div")
  .attr("class", "bar")
  .style("height", (d) => { 
    var barHeight = d * 5;
    return barHeight + "px" });

// SVG example

var dataset = [ 5, 10, 15, 20, 25 ];

var svg = d3.select("body")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

var circles = svg.selectAll("circle")
               .data(dataset)
               .enter()
               .append("circle");

circles.attr("cx", (d, i) => (i * 60) + 25 )
       .attr("cy", h/2)
       .attr("r", (d) => d)
       .attr("fill", "#FEC854")
       .attr("stroke", "#B31F29")
       .attr("stroke-width", (d) => d/2);


// Appending text example
// d3.select("body")
//   .data(dataset)
//   .enter()
//   .append("p")
//   .text( (d) => "I can count up to " + d ) // add text
//   .style("color", (d) => d > 15 ? "red" : "black" ) // add styling to text;