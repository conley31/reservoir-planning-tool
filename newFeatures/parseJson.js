var fs = require('fs');
var json = (fs.readFileSync("all-low-data.json"));
var response = JSON.parse(json);
for(var i = 0; i < response.length; i++) {
	console.log(response[i]);
}
process.exit();