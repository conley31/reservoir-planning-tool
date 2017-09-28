//Code to run algorithms.js and create a new JSON file
//To run code: cd to reservoir-planning-tool and run: node newFeatures/create-map-json.js

var alg = require('./algorithms.js');
var d = require('./calculate-map-data.js');
const fs = require('fs');

var Map = [];
Map = alg.calcAllLocations(d.DRAINED_AREA, d.DEPTH_FIRST_DAY, d.IRRIGATION_INCREMENT, d.LOW_VOLUME, d.LOW_SOIL_MOISTURE, d.LOW_WATER_CAPACITY);
//console.log(JSON.stringify(Map.allCells));

if ((Map.allCells.length == 0)) {
	console.log("Empty");
}

//Add to JSON
//var json = JSON.stringify(Map);
//fs.writeFile('myjsonfile.json', json, 'utf8');