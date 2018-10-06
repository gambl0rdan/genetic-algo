// let fs = require('fs'); //Mangaes file ops from JS core
let d3 = require('d3'); // Handle CSVs

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
	let  ac = Math.abs(b.lat - a.lat);
	let cb = Math.abs(b.lon - a.lon);
	return Math.hypot(ac, cb);
}

class CityLocation {

	constructor(name, lat, lon) {
		this.name = name;
		this.lat = lat;
		this.lon = lon;
	}	
}


class CSVLoader {
	load(tourSize, callback){
		let cities = [];

		console.log("Start load");
		d3.csv("../capital-cities.csv").then(function(d) {
			let data = d.slice(0, tourSize);
			console.log("Inside D3 CSV callback");
			data.forEach(val => {
				cities.push(
					new CityLocation(
		    			val.city,
		    			+(val.lat),
		    			+(val.lng)
					)
				)
			})
			let vectors = getDistanceMatrix(cities, tourSize);
    		callback(cities, vectors); 
		}) 
		console.log("Finish load");
	}

}

// export default CSVLoader;
module.exports.CSVLoader = CSVLoader;