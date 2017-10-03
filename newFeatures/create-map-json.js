//Code to run algorithms.js and create a new JSON file
//To run code: cd to reservoir-planning-tool and run: node newFeatures/create-map-json.js

var alg = require('./algorithms.js');
var d = require('./calculate-map-data.js');

var i = 0;
var f = 'all-map-data.json',
	fs = require('fs');
(function loop() {
	if (i < 1872) {
		alg.calcAllLocations(80, 10, 1, 48, 12, 6.1, i).then(function(result) {
			//console.log(JSON.stringify(result));
			if (i == 0) {
				fs.writeFileSync(f, JSON.stringify(result));
			}
			else {
				fs.appendFileSync(f, JSON.stringify(result));
			}
			console.log(i);
			i = i + 936;
			loop();
		});
	}
	
	else {
		process.exit();
	}
}());