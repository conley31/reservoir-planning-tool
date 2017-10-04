var fs = require('fs');
var json = (fs.readFileSync("allData-16Vol-Low.json"));
var response = JSON.parse(json);
for(var i = 0; i < response.length; i++) {
	console.log(response[i]);
}
process.exit();