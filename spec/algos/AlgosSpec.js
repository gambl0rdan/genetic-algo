describe("Player", function() {
  var algos = require('../../src/algos.js');
  // var Song = require('../../lib/jasmine_examples/Song');
  var genAlgo;


  beforeEach(function() {
  	 genAlgo = new algos.GeneticAlgo();  
  });

  it("should be able to breed failure", function() {

  	genAlgo.breed();
    
	expect(genAlgo.generation).toEqual(1);
  });

  describe("when song has been paused", function() {
    beforeEach(function() {
      // player.play(song);
      // player.pause();
    });

    it("should indicate that the song is currently paused", function() {
      // expect(player.isPlaying).toBeFalsy();

      // // demonstrates use of 'not' with a custom matcher
      // expect(player).not.toBePlaying(song);
    });

    it("should be possible to resume", function() {
      // player.resume();
      // expect(player.isPlaying).toBeTruthy();
      // expect(player.currentlyPlayingSong).toEqual(song);
    });
  });

});
