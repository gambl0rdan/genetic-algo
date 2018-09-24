var algos = require('./algos.js');
var loaders = require('./csv_loader.js');

let genAlgo;
let tourSize = 80;
let runCount = 400;

let resp = (countries, vectors) => {
	let settings = {
      mutateProb : 0.25,
      lessFitProb : 0.35,
      populationSize : vectors.length
    }

	algo = new algos.GeneticAlgo(vectors, settings);  
	algo.initialise();
	
	let finalResult = algo.run(runCount);
	console.log(`Final result after (${runCount}) runs was: [${finalResult}]`);

	let countryNames = finalResult.map(c => countries[c].name);
	console.log(`... as country names was:\n (${countryNames}`);

}

let loader = new loaders.CSVLoader();
let res = loader.load(resp, tourSize);

