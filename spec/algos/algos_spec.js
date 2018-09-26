describe("Algos", function() {
  var algos = require('../../src/algos.js');
  let genAlgo;
  
  let distanceValues = [
    [6, 6, 6, 7],
    [4, 4, 4, 4],
    [8, 8, 8, 8],
    [1, 6, 7, 2]
  ];
 
  let initPopulation = [
    [0, 1, 2, 2],
    [2, 3, 1, 0],
    [1, 2, 0, 3],
    [3, 0, 2, 1]
  ];

  let distArray = [0.35439628592692346, 0.7087925718538469, 0.8842187333876741, 1];

  let settings = {
      mutateProb : 0.25, //Probability that after crossover our tours will mutate (swap 2 entries)
      lessFitProb : 0.35, //We have a dist function, but add further randomness to increase diversity with a less fit factor
      populationSize : 4 // How many tours per generation
  }

  beforeEach(function() {
  	 genAlgo = new algos.GeneticAlgo(distanceValues, settings);    
  });


  it("should be able to breed", function() {

    genAlgo.initialPopulation = initPopulation;
    genAlgo.distArray = distArray;

	  let actRes = genAlgo.breed(initPopulation, distArray);
  	expect(genAlgo.generation).toEqual(1);
    console.log('Fitness: ' + actRes);
    expect(actRes.length).toEqual(4);
  });


  it("should be able to run!", function() {

    genAlgo.initialPopulation = initPopulation;
    genAlgo.distArray = distArray;

    let actRes = genAlgo.run(10);
    expect(genAlgo.generation).toEqual(10);
    expect(actRes).toEqual(jasmine.arrayContaining([0,1,2,3]));

  });


  it("should be fit!", function() {
    let expRes = 18;
    let actRes = genAlgo.calculateFitness([1,0,2]);
    expect(actRes).toEqual(expRes);  
  });


  it("should log dist!", function() {
    let expRes = 0.10641;
    let actRes = genAlgo.logDist(2, 0.99);
    expect(actRes).toBeCloseTo(expRes, 4);  
  });


  it("should get priority array", function() {
    let actRes = genAlgo.generateLogarithmicPriorityArray(settings.populationSize);
    expect(actRes.length).toEqual(4);
    console.log(actRes);
    actRes.forEach(d => expect(d).toBeLessThan(1.00001));  
    expect(actRes).toEqual(jasmine.arrayContaining(distArray));
  });


  it("Mutate arrayand keep samr values", function() {
    let actRes = genAlgo.mutate([0,1,2]);
    expect(actRes).toEqual(jasmine.arrayContaining([0,1,2]));
  });


  it("Should cross over the chosen x and y tours", function () {
    let expRes = [];
    let actRes = genAlgo.crossover([1, 2, 3, 0], [2, 3, 0, 1]);

    expect(actRes).toEqual(jasmine.arrayContaining([0, 1, 2, 3]));

  });


  it("Should generate initial population", function () {
    let expRes = [];
    let actRes = genAlgo.genOriginalPopulation(distanceValues);


    actRes.forEach(ind => expect(ind).toEqual(jasmine.arrayContaining([0, 1, 2, 3])));
    
  });



  it("Shouldshufflfe an item by a given amt", function () {
    let actRes = genAlgo.shuffle([1, 2, 3, 0]);
    expect(actRes).toEqual(jasmine.arrayContaining([0, 1, 2, 3]));
  });


  it("Should swap value at given points", function () {
    let expRes = [1, 2, 0, 3];
    let actRes = genAlgo.swap([1, 2, 3, 0], 2, 3);
    expect(actRes).toEqual(expRes);
  });

});
