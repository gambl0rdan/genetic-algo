var csv = require('csv');
var fs = require('fs');

var CityLocation = require('./city_location.js').CityLocation;
 
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