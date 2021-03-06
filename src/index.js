// var algos = require('./algos.js');
import GeneticAlgo from './algos.js';
// var loaders = require('./csv_loader.js');
// var loaders = require('./data.js');
import CSVLoader from './data.js';
// import { geoPath } from 'd3-geo';

let genAlgo;
let tourSize = 20;
let runCount = 200;

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

	let displayAllLines = (curFittestRoute) => {
		connectingLines.html(""); //clear the Line String
		let curFittestCoords = curFittestRoute.map(route => cities[route]);

		for(let i=0; i<curFittestCoords.length; i++) { 
			let citiesPair = curFittestCoords.slice(i, i+2);
			
			let coordPair;

			// extra check to make sure the last country will be draw connected with the first one
			if (i < curFittestCoords.length - 1){
			 	coordPair = citiesPair.map((city) => [city.lon, city.lat]);
			} else{
				coordPair = [[curFittestCoords[0].lon, curFittestCoords[0].lat], [curFittestCoords[i].lon, curFittestCoords[i].lat]]
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
		let genFittestRoute = newPopulation[0];
		let genFittestPath = runIterationRes[1];
		

		if(genFittestPath < results.curFittestPath){
			results.curFittestPath= genFittestPath;
			results.curFittestRoute = genFittestRoute; 	
		}
	
		console.log(`Generation [${algo.generation}]. Fittest of gen [${genFittestPath}], Fittest overall [${results.curFittestPath}]`);
		
		
		// console.log(`curFittestRoute is: ${results.curFittestPath}`);
		//method to round up number to 3 decimals
		document.getElementById('result').innerHTML = Math.round(results.curFittestPath*1000)/1000; 



		// displayAllLines(results.curFittestRoute);
		displayAllLines(genFittestRoute);
	}


	let runTimer = setInterval(getNextGen,100, algo, results);
	

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
	  .attr("r", 4)
	  .attr("fill", "#FFFAF0");
	  // .attr("debug", (row) => JSON.stringify(row))
	  // .attr("debug2", (row) => JSON.stringify(projection([+row.lng, +row.lat])))
	  // .attr("debug3", (row) => JSON.stringify([+row.lng, +row.lat]))
	
}

let loader = new CSVLoader();
let res = loader.load(tourSize, loadRespCallback);