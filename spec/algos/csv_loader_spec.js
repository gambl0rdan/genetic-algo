describe("CVS Utils", function() {
  
  var csv_loader = require('../../src/csv_loader.js');
 
  beforeEach(function() {
  	
    
  });


  it("should be able to read", function() {
        
      let resp = (countries, vectors) => {
        expect(countries.length).toEqual(234);
        expect(vectors.length).toEqual(5);
      }

      let loader = new csv_loader.CSVLoader();
      loader.load(resp, 5);

  });


});
