describe("Nearest Neighbour", function() {
  var nearest_neighbour = require('../../src/algos/nearest_neighbour.js');
  let nnAlgo;

  let distanceValues = [
    [0, 2, 6, 7],
    [2, 0, 4, 4],
    [6, 4, 0, 5],
    [7, 6, 5, 0]
  ];
 
  let initPopulation = [
    [0, 1, 3, 2],
    [2, 3, 1, 0],
    [1, 2, 0, 3],
    [3, 0, 2, 1]
  ];

  let settings = {
  }

  beforeEach(function() {
  	 nnAlgo = new nearest_neighbour.NearestNeighbourAlgo(distanceValues, settings);    
  });


  
  it("should be fit!", function() {
    let expRes = 19;
    let actRes = nnAlgo.calculateFitness([1,0,2,3]);
    expect(actRes).toEqual(expRes);  
  });

 
  it("should correctly evalutate a given tour and return a fitness value!", function() {
    let expRes = 9;

    let current = 0;
    let neigh = 1;
    let goal = 3;
    let pathLen = 4;

    let actRes = nnAlgo.evaluationFunction(current, neigh, goal, pathLen);
    expect(actRes).toEqual(expRes);  
  });


  it("should return the current cost vlaue for a given goal", function() {
    let expRes = 7;
    let current = 0;
    let goal = 3;
    
    let actRes = nnAlgo.currentToGoalCost(current, goal);
    expect(actRes).toEqual(expRes);  
  });


  it("should return the current to next cost for a given goal", function() {
    let expRes = 2;
    let current = 0;
    let neighbour = 1;
    
    let actRes = nnAlgo.currentToNextCost(current, neighbour);
    expect(actRes).toEqual(expRes);  
  });


  it("it should return a routen for a given starting entry point", function() {
    let expRes = [3, 2, 0, 1];
    let value = 4;
    
    let actRes = nnAlgo.search(value);
    console.log(actRes);
    expect(actRes).toEqual(expRes);  
  });


  it("it should run and generate an initial population", function() {
    let expRes = [1, 0, 2];
    let value = 4;
    
    let actRes = nnAlgo.run();
    console.log(actRes);
    actRes.forEach(ind => expect(ind).toEqual(jasmine.arrayContaining([0, 1, 2, 3])));
  });
})
