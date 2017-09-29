//Code to run algorithms.js and create a new JSON file
//To run code: cd to reservoir-planning-tool and run: node newFeatures/create-map-json.js

var alg = require('./algorithms.js');
var d = require('./calculate-map-data.js');
const fs = require('fs');

var Map = [];
Map = alg.calcAllLocations(80, 10, 1, 16, 7.6, 4.2);
//console.log(JSON.stringify(Map.allCells));

if ((Map.allCells.length == 0)) {
	console.log("Empty");
}

//Add to JSON
//var json = JSON.stringify(Map);
//fs.writeFile('myjsonfile.json', json, 'utf8');

process.exit()