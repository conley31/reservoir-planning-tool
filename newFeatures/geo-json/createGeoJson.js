var fs = require('fs');
var json = JSON.parse(fs.readFileSync("final_index_FeaturesToJSON.json"));

var jsonFiles = ['allData-16Vol-Low.json', 'allData-16Vol-Medium.json', 'allData-16Vol-High.json',
    'allData-48Vol-Low.json', 'allData-48Vol-Medium.json', 'allData-48Vol-High.json',
    'allData-80Vol-Low.json', 'allData-80Vol-Medium.json', 'allData-80Vol-High.json'];


var geoJsonAnnualIrrigationDepth = ['16Vol-Low-AnnualIrrigationDepth.json', '16Vol-Medium-AnnualIrrigationDepth.json', '16Vol-High-AnnualIrrigationDepth.json',
                                         '48Vol-Low-AnnualIrrigationDepth.json', '48Vol-Medium-AnnualIrrigationDepth.json', '48Vol-High-AnnualIrrigationDepth.json',
                                         '80Vol-Low-AnnualIrrigationDepth.json', '80Vol-Medium-AnnualIrrigationDepth.json', '80Vol-High-AnnualIrrigationDepth.json'];
                                         
var len = json["features"].length;

for(var i = 0; i < jsonFiles.length; i++){
  var data = JSON.parse(fs.readFileSync(jsonFiles[i]));
  var outfile = geoJsonAnnualIrrigationDepth[i];
  for(var j = 0; j < len - 1; j++){
    json["features"][j].properties;
    var currentFeature = json["features"][j]["properties"];
    var value = parseInt(data[j].annualIrrigationDepthSupplied);
    if(value < 50){
      currentFeature.fillColor = '#A6611A';
      currentFeature.fillOpacity = 0.4;
    }
    else if(value < 100) {
      currentFeature.fillColor = '#DFC27D';
      currentFeature.fillOpacity = 0.4;
    }
    else if(value < 150) {
      currentFeature.fillColor = '#F5F5F5';
      currentFeature.fillOpacity = 0.4;
    }
    else if(value < 200) {
      currentFeature.fillColor = '#80CDC1';
      currentFeature.fillOpacity = 0.4;
    }
    else{
      currentFeature.fillColor = '#018571';
      currentFeature.fillOpacity = 0.4;
    }
  }
  fs.writeFileSync(outfile,JSON.stringify(json));
}

