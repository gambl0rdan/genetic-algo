// var algos = require('./algos.js');
import GeneticAlgo from './algos.js';
// var loaders = require('./csv_loader.js');
// var loaders = require('./data.js');
import CSVLoader from './data.js';

let genAlgo;
let tourSize = 80;
let runCount = 400;

let resp = (countries, vectors) => {
	let settings = {
      mutateProb : 0.25,
      lessFitProb : 0.35,
      populationSize : vectors.length
    }

	let algo = new GeneticAlgo(vectors, settings);  
	algo.initialise();
	
	let finalResult = algo.run(runCount);
	console.log(`Final result after (${runCount}) runs was: [${finalResult}]`);

	let countryNames = finalResult.map(c => countries[c].name);
	console.log(`... as country names was:\n (${countryNames}`);

}

let loader = new CSVLoader();
let res = loader.load(resp, tourSize);

let width = window.innerWidth,
    height = window.innerHeight,
    centered,
    clicked_point;

let projection = d3.geoEquirectangular()
					.translate([width/2	, height/2]);;


   				   
    
let plane_path = d3.geoPath()
        		   .projection(projection);

let svg = d3.select("body").append("svg")
						   .attr("width", width)
						   .attr("height", height)
						   .attr("class", "map");

var rectangle = svg.append("rect")
                            .attr("x", 0)
                            .attr("y", 0)
                            .attr("width", width)
                            .attr("height", height)
                            .attr("fill", "black");
    
let g = svg.append("g");
let path = d3.geoPath()
    .projection(projection);
    
// load and display the World
d3.json("https://unpkg.com/world-atlas@1/world/110m.json", function(error, topology) {
    g.selectAll("path")
      .data(topojson.feature(topology, topology.objects.countries)
          .features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("fill", "#787878")
      ;
 });

let capitalsCircles = svg.append("g")
	  .selectAll("circle")
	  .data(cities)
	  .enter()
	  .append("circle")
	  .attr("cx", (row) => projection([row.lon, row.lat])[0])
	  .attr("cy", (row) => projection([row.lon, row.lat])[1])
	  .attr("r", 3)
	  .attr("fill", "#FFFAF0");
	  // .attr("debug", (row) => JSON.stringify(row))
	  // .attr("debug2", (row) => JSON.stringify(projection([+row.lng, +row.lat])))
	  // .attr("debug3", (row) => JSON.stringify([+row.lng, +row.lat]))

 
let routePath = d3.geoPath()
    .projection(projection);

let connectingLines = svg.append("g");

let displayAllLines = () => {
	connectingLines.html(""); //clear the Line String

	for(let i=0; i<cities.length-1; i++) { 
		let citiesPair = cities.slice(i, i+2);
		let coordPair = citiesPair.map((row) => [row.lon, row.lat]);
		let display = () => {
			connectingLines
			    .append("path")
				.datum({type: "LineString", coordinates: coordPair})
				.attr("d", routePath)
				.attr("fill", "none")
				.attr("stroke", "#FFFAF0")
				.attr("stroke-width", 3)
		}
		setTimeout(display, i*100); //set timeout to draw a line between 2 cities
	}
}

setInterval(displayAllLines, cities.length*100 + 1000);


