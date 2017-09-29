//Code to run algorithms.js and create a new JSON file
//To run code: cd to reservoir-planning-tool and run: node newFeatures/create-map-json.js

var alg = require('./algorithms.js');
var d = require('./calculate-map-data.js');
const fs = require('fs');

alg.calcAllLocations(80, 10, 1, 16, 7.6, 4.2).then(function(result) {
	//console.log(JSON.stringify(result));
	console.log(result);
	//fs.writeFileSync('all-map-data.json', JSON.stringify(result), 'utf8');
	process.exit();
});