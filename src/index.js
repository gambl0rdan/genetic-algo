// var algos = require('./algos.js');
import GeneticAlgo from './algos.js';
// var loaders = require('./csv_loader.js');
// var loaders = require('./data.js');
import CSVLoader from './data.js';
// import { geoPath } from 'd3-geo';

let genAlgo;
let tourSize = 20;
let runCount = 20;


// this is the main methed once all the data loaded
let loadRespCallback = (cities, vectors) => {
	let settings = {
      mutateProb : 0.25,
      lessFitProb : 0.35,
      populationSize : vectors.length
    }



	let algo = new GeneticAlgo(vectors, settings);  
	let results = {
		curFittestRoute : [],
		curFittestPath : Number.MAX_SAFE_INTEGER
	};

	algo.initialise();

	let routePath = d3.geoPath()
	    .projection(projection);

	

	   //runNextGen
	   //Call the breed and get the next best route
	   //call displayAllLines
	let connectingLines = svg.append("g");

	let displayAllLines = (genFittestRoute) => {
		connectingLines.html(""); //clear the Line String
		let genFittestCoords = genFittestRoute.map(route => cities[route]);

		for(let i=0; i<genFittestCoords.length; i++) { 
			let citiesPair = genFittestCoords.slice(i, i+2);
			

			let coordPair;

			// extra check to make sure the last country will be draw connected with the first one
			if (i < genFittestCoords.length - 1){
			 	coordPair = citiesPair.map((city) => [city.lon, city.lat]);
			} else{
				coordPair = [[genFittestCoords[0].lon, genFittestCoords[0].lat], [genFittestCoords[i].lon, genFittestCoords[i].lat]]
			}

			let display = () => {
				connectingLines
				    .append("path")
					.datum({type: "LineString", coordinates: coordPair})
					.attr("d", routePath)
					.attr("fill", "none")
					.attr("stroke", "#FFFAF0")
					.attr("stroke-width", 3)
			}
			setTimeout(display, i*5); //set timeout to draw a line between 2 cities
		}
	}

	let getNextGen = (algo, results) => {
		let population;

		if (algo.generation == 0) {
			population = algo.initialPopulation;
		} else if (algo.generation == runCount) {
			clearInterval(runTimer)
			return; //TODO: Show final results
		} else {
			population = algo.population;
		}


		let runIterationRes = algo.runIteration(population);


		let newPopulation = runIterationRes[0];
		let genFittestPath = runIterationRes[1];
		let genFittestRoute = newPopulation[0];

		if(genFittestPath < results.curFittestPath){
			results.curFittestPath= genFittestPath;
			results.curFittestRoute = genFittestRoute; 	
		}
	
		console.log(`Generation [${algo.generation}]. Fittest of gen [${genFittestPath}], Fittest overall [${results.curFittestPath}]`);
		
		displayAllLines(results.curFittestRoute);
		// displayAllLines(genFittestRoute);
	}

	let runTimer = setInterval(getNextGen, 250, algo, results);
	
	// let finalResult = algo.runAsync(runCount, (route) => setTimeout(displayAllLines, 1000, route));
	// let finalResult = algo.runAsync(runCount, displayAllLines);
	


	/* 
	***** TURN OF THE SET INTERVAL AND FINALRESULT
	*/
	// let finalResult = algo.run(runCount);
	// setInterval(getNextGen(algo), finalResult.length*100 + 100, finalResult);

	// console.log(`Final result after (${runCount}) runs was: [${finalResult}]`);

	// let cityNames = finalResult.map(c =>cities[c].name);
	
	// console.log(`... as country names was:\n (${cityNames}`);


	

	// let bestRoute = finalResult.map(city => cities[city]);


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
	
}

let loader = new CSVLoader();
let res = loader.load(tourSize, loadRespCallback);

let width = window.innerWidth,
    height = window.innerHeight,
    centered,
    clicked_point;

let projection = d3.geoEquirectangular()
					.translate([width/2	, height/2]);


   				  
let plane_path = d3.geoPath()
        		   .projection(projection);

let svg = d3.select("#map").append("svg")
						   .attr("width", width)
						   .attr("height", height)
						   .attr("class", "map");

let rectangle = svg.append("rect")
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




