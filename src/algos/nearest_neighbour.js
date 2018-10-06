class NearestNeighbourAlgo {
	constructor(distanceValues, settings){
		this.distanceValues = distanceValues;
		this.cityCount = distanceValues.length;
		this.settings = settings;
	}

	initialise(){
		console.log("Initialise Complete!");
	}

	calculateFitness(tour) {
		// Put fitness as the Tour length for now
		let i = 0;
		let pathCost = 0;
		while (i < tour.length - 1) {
			pathCost += this.distanceValues[tour[i]][tour[i + 1]];
			i++;
		}
		pathCost += this.distanceValues[tour[tour.length - 1]][tour[0]];
		return pathCost;
	}

	evaluationFunction(current, neighbour, goal, pathLength) {

		if (pathLength == 0){
			return this.currentToNextCost(current, neighbour);
		}

		let currentToGoalVal = this.currentToGoalCost(current, goal);
		if (currentToGoalVal == 0)
			return 0;
		return currentToGoalVal + this.currentToNextCost(current, neighbour);


		return 0;
	}


	currentToGoalCost(current, goal){
		return this.distanceValues[current][goal];
	}

	currentToNextCost(current, neighbour){
		return this.distanceValues[current][neighbour];
	
	}

	search(node){
		let goalNode = Number.MAX_SAFE_INTEGER - 4000;
		let shortestNode = Number.MAX_SAFE_INTEGER - 2000;
		let pathLength = 0;
		let pathCost = 0;
		let staticGoal = node;
		let state = [];
		state.push(node - 1);
		if (node < this.cityCount + 1) { // If valid Start Goal chosen

			let goalFound = false;

			while (!goalFound && pathLength < this.cityCount + 13) { // ||
				let shortestFunction = Number.MAX_SAFE_INTEGER;

				for (let i = 0; i < this.cityCount; i++) {
					if (!state.includes(i) || ((pathLength >= this.cityCount - 1 && i == goalNode))) {
						let currentValue = this.evaluationFunction(node - 1, i, goalNode - 1, pathLength);// distanceValues[i][y-1]);
						if (currentValue < shortestFunction) {
							shortestFunction = currentValue;
							shortestNode = i;
						}
					}
				}

				pathCost += this.distanceValues[node - 1][shortestNode];
				node = shortestNode + 1;
				pathLength++;

				if (node - 1 == goalNode) {
					goalFound = true;
				} else {
					state.push(shortestNode);
				}
				goalNode = staticGoal - 1;

			}
		}

		return state;

	}


	run(){
		let population = [];
		population[0] = this.search(this.cityCount);
		for (let  i = 1; i < this.cityCount; i++) {
			population[i] = this.search(i + 1);
		}

		return population;
	}

}
// module.exports.NearestNeighbourAlgo = NearestNeighbourAlgo;
// module.exports.NearestNeighbourAlgo = NearestNeighbourAlgo;

export default NearestNeighbourAlgo = NearestNeighbourAlgo;

