class GeneticAlgo {

	constructor(distanceValues, settings){
		this.generation = 0;
		this.distanceValues = distanceValues;
		this.cityCount = distanceValues.length;
		this.settings = settings;
		this.distArray = [];
	}

	initialise(){
		this.initialPopulation = this.genOriginalPopulation(this.distanceValues);
		this.distArray = this.generateLogarithmicPriorityArray(this.settings.populationSize);
		console.log("Initialise Complete!");
	}

	logDist(k, p) {
		let s = (-1.0) / (Math.log(1 - p));
		return s * (Math.pow(p, k) / k);
	}

	generateLogarithmicPriorityArray(arraySize) {

		let logDistArray = [];
		logDistArray[0] = this.logDist(1, 0.99);
		for (let i = 1; i < arraySize; i++) {
			logDistArray[i] = logDistArray[i - 1] + this.logDist(i, 0.99);
		}

		for (let i = 0; i < arraySize; i++) {
			logDistArray[i] = logDistArray[i] / logDistArray[arraySize - 1];
			// System.out.println(distArray[i]);
		}

		return logDistArray;
	}

	run(loopCount) {
		let curFittestRoute;
		let curFittestPath = Number.MAX_SAFE_INTEGER;
		
		let population = this.initialPopulation;
		while (this.generation < loopCount) {
			// everytime you breed, population value which you golt back from this.initialPopulation
			// returns a new value/population
			// and we assign it back to population and use it for the next go
			population = this.breed(population, this.distArray);
			population.sort((a,b) => this.calculateFitness(a)- this.calculateFitness(b));
			
			let genFittestRoute = population[0]; //[1,6,4, 9]
			let genFittestPath = this.calculateFitness(genFittestRoute);
			
			if(genFittestPath < curFittestPath){
				curFittestPath = genFittestPath;
				curFittestRoute = genFittestRoute; 	
			}
		
			console.log(`Generation [${this.generation}]. Fittest of gen [${genFittestPath}], Fittest overall [${curFittestPath}]`);
			this.generation++;
		}

		return curFittestRoute;
	}

	runIteration(population, currentGeneration, loopCount) {
		let curFittestRoute;
		let curFittestPath = Number.MAX_SAFE_INTEGER;

		while (currentGeneration < loopCount) {
			let newPopulation = this.breed(population, this.distArray);
			newPopulation.sort((a,b) => this.calculateFitness(a)- this.calculateFitness(b));
			
			let genFittestRoute = newPopulation[0]; //[1,6,4, 9]
			let genFittestPath = this.calculateFitness(genFittestRoute);
			
			if(genFittestPath < curFittestPath){
				curFittestPath = genFittestPath;
				curFittestRoute = genFittestRoute; 	
			}
		
			console.log(`Generation [${this.generation}]. Fittest of gen [${genFittestPath}], Fittest overall [${curFittestPath}]`);
		}

		
		// this.generation++;

		return [newPopulation, genFittestPath];

	}


	breed(currentPopulation, distArray){
		this.generation++;
		currentPopulation.sort((a,b) => this.calculateFitness(a)- this.calculateFitness(b));
		let curFitness = this.calculateFitness(currentPopulation[0]);

		// console.log(`Fittest in the generation is ${curFitness}`)

		let newPopulation = [];

		for (let popCounter = 0; popCounter < this.settings.populationSize; popCounter++) {
			let currentNumber = Math.random();
			let xInd = -1;
			let yInd = -1;
			for (let q = 0; q < 2; q++) { // not an O(n) loop

				for (let j1 = 0; j1 < this.settings.populationSize; j1++) {
					currentNumber = Math.random();
					if (currentNumber < distArray[j1]) {
						//Found number
						if (q == 0) {
							//xIndexOffset=0;
							if (Math.random() < this.settings.lessFitProb) {
								xInd = j1 + Math.floor(Math.random() * (this.settings.populationSize - j1)) ;

							} else {
								xInd = j1;
							}
							break; // Technically bad

						} else {

							if (Math.random() < this.settings.lessFitProb) {

								let nextInt = this.settings.populationSize - j1;
								let yIndexOffset = Math.floor(Math.random() * nextInt);
								if (xInd != j1 + yIndexOffset) { // Should be mostly 0 (80% of the time)
									yInd = j1 + yIndexOffset;
									break; // Technically bad

								}

								// Less fit tour chosen

							} else {
								if (xInd != j1) { // Should be mostly 0 (80% of the time)
									yInd = j1;
									break; // Technically bad

								}

							}
						}
					}
				}
			}

			let x = [];
			let y = [];

			let j = 0;
			for (let u = 0; u < this.settings.populationSize; u++) {

				if (j == xInd) {
					x =currentPopulation[u].slice();
				}
				if (j == yInd) {
					y =currentPopulation[u].slice();
				}

				j++;
			}

			let z = this.crossover(x, y);
			z = this.mutate(z);
			newPopulation[popCounter] = z.slice();
	
		}
		return newPopulation;

	}

	mutate(tour){

		let d = 0;
		let i = 0;
		let size = tour.length;
		// for(int j = 0;j<100;j++){
		d = Math.random();
		// System.out.printf("j = %d ", j);

		// Allows 25% chance of mutation
		if (d < this.settings.mutateProb) {

			for (let j = 0; j < this.cityCount; j++) {
				i = j;// randomNumber.nextInt(size);
				d = Math.random();
				let e = this.cityCount;
				if (d < (0.05)) {
					let temp = i;

					while (i == temp) {
						i = Math.floor(Math.random() * size);
					}

					// System.out.printf("Old fitness: %d\n",calculateFitness(tour));
					let  temp2 = tour[i];
					tour[i] = tour[temp];

					tour[temp] = temp2;
				}
			}
			// System.out.printf("Switched node %d with %d\n",temp,i);
			// System.out.printf("New fitness: %d\n",calculateFitness(tour));
		}

		return tour;
	}

crossover(x, y) {
		let splitIndex = Math.floor(Math.random() * x.length);
		let tempArray = [];
		let cityCount = x.length;

		let newX = x.slice(splitIndex).concat(y.slice(y.length - splitIndex, y.length)); 
		let newY= y.slice(splitIndex).concat(x.slice(x.length - splitIndex, x.length)); 
 		// Now take into account the missing and repeated cities

		let xNotFoundList = [];
		let yNotFoundList = [];
		let xMultipleList = [];
		let yMultipleList = [];

		let xList = Array(cityCount).fill(0);
		let yList = Array(cityCount).fill(0);
		for (let i = 0; i < cityCount; i++) {

			if (xList[newX[i]] >= 1) {
				xMultipleList.push(i);
				xList[newX[i]]++;
			} else {
				xList[newX[i]]++;
			}

			if (yList[newY[i]] >= 1) {
				yMultipleList.push(i);
				yList[newY[i]]++;
			} else{
				yList[newY[i]]++;
			}
		}

		for (let  i = 0; i < cityCount; i++) {
			if (xList[i] == 0) {
				xNotFoundList.push(i);
			}
			if (yList[i] == 0) {
				yNotFoundList.push(i);
			}
		}

		let yListB = yList.map(i=>i);
		let yOld = newY.map(i=>i);

		while (xMultipleList.length > 0) {
			let i = 0;
			if (xNotFoundList.length > 1) {
				i =  Math.floor(Math.random() * (xMultipleList.length - 1));
			}
			newX[xMultipleList[0]] = xNotFoundList[i]; //
			xMultipleList.shift();
			xNotFoundList.splice(i,1);
		}

		while (yMultipleList.length > 0) {
			let i = 0;
			if (yNotFoundList.length > 1) {
				i = Math.floor(Math.random() * (yMultipleList.length - 1));
			}
			newY[yMultipleList[0]] = yNotFoundList[i]; //
			yMultipleList.shift();
			yNotFoundList.splice(i,1);
		}

		let x1 = newX[0];
		let y1 = newY[0];

		for (let i = 1; i < cityCount; i++) {
			if (newX[i] == x1) {
				// console.log("Multiple in x");
			}
			if (newY[i] == y1) {
				// console.log("Multiple in y");
 			}

		}

		if (this.calculateFitness(newX) < this.calculateFitness(newY)){
			return newX;
		}
		return newY;

	}

	calculateFitness(tour){
		// console.log(`Calculating fitness for tour: ${tour}`);
		let i = 0;
		let pathCost = 0;
		while (i < tour.length - 1) {

			let dist = this.distanceValues[tour[i]][tour[i + 1]];
			pathCost += dist;
			i++;
		}
		pathCost += this.distanceValues[tour[tour.length - 1]][tour[0]];
		return pathCost;
	}	


	genOriginalPopulation(distanceValues) {
		let cityList = [];
		let population = [];
		let individual = [];
		for (let i = 0; i < distanceValues.length; i++) {
			individual[i] = i;
		}

		for (let j = 0; j < this.settings.populationSize; j++) {
			// let state = "";
			this.shuffle(individual);
			population[j] = individual.slice();
		}
	
		return population;
	}


	swap(individual, a, b){
		let aa = individual[a];
		let bb = individual[b];
		individual.splice(a, 1, bb);
		individual.splice(b, 1, aa);
		
		return individual;
	} 

	shuffle(individual){
		for (let i = individual.length; i > 1; i--) {
			this.swap(individual, i - 1, Math.floor(Math.random() * i));
		}
		return individual;
	} 
}

// module.exports.GeneticAlgo = GeneticAlgo;
export default GeneticAlgo;


