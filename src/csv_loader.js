var csv = require('csv'); // Handle CSVs
var fs = require('fs'); //Mangaes file ops from JS core


var CityLocation = require('./city_location.js').CityLocation;


// Creates an N * N matrix of distances between each city
// inefficient but double loopd through our tour
function getDistanceMatrix(locations, tourSize){
	var distances =  [...Array(tourSize)].map(e => Array(tourSize));
	for(let y = 0; y < tourSize; y++) {
		for(let x = 0; x < tourSize; x++){
			let dt = Math.abs(distance(locations[y], locations[x]));
			
			distances[y][x] = dt;
			distances[x][y] = dt;
		}
		  }
	
	return distances;
}

// Absolute Distance between 2 cities
function distance(a, b) {
	 ac = Math.abs(b.lat - a.lat);
	 cb = Math.abs(b.lon - a.lon);
	 return Math.hypot(ac, cb);
}

class CSVLoader {

	load(consumer, tourSize){


		let headerFound = false;
		var countries=[];
		fs.createReadStream('capital-cities.csv')
		    .pipe(csv.parse({delimiter: ','}))
		    .on('data', function(countryRow) {
                	
		        if(headerFound){
			        countries.push(
			        	new CityLocation(countryRow[0],
	                			Number.parseFloat(countryRow[2]),
	                			Number.parseFloat(countryRow[3])
	                	)
	                );  
		        }
		        else{
		        	headerFound = true;
		        }

		    })
		    .on('end',function() {
		      let vectors = getDistanceMatrix(countries, tourSize);
		      consumer(countries, vectors);
		    });

	}

}

module.exports.CSVLoader = CSVLoader;