var results2val = -1;
var dropdownval = -1;
var compareKML;

var frequency = new Array(); //Array to hold count of each range

//Draws the histogram/bar chart for the comparison map
var drawHist2 = function() {
	var data = new google.visualization.DataTable();
	data.addColumn('string', 'Range');
	data.addColumn('number', 'Frequency');

	data.addRows([
	['<10', frequency[0]],
	['10-20', frequency[1]],
	['20-30', frequency[2]],
	['30-40', frequency[3]],
	['40-50', frequency[4]],
	['>50', frequency[5]]
	]);
	
	var options = {
		title: 'Frequency of Each Range',
		legend: {position: 'none'}
	};
	
	//Creates a new bar chart
	var chart = new google.visualization.BarChart(document.getElementById('histogram-2'));
	chart.draw(data, options); //draws the bar chart with the given data and options
}

//Calls google loader to load charts needed
var initHist2 = function() {
	google.charts.load('current', {'packages':['bar', 'corechart', 'controls']});
	google.charts.setOnLoadCallback(drawHist2);
};

//Increments/changes variables to reflect what data will be needed to display
var colorComp = function(addVariable) {

	var results2 = document.getElementsByName("results2");
	var dropdown = document.getElementById("year-dropdown2");

	var contain = -1; //0 for year 1 for results
	if(parseInt($(dropdown).val()) != dropdownval) {
		contain == 0;
		dropdownval = parseInt($(dropdown).val());
		//console.log(dropdownval);
	}
	if(contain == -1){
  		for(var i = 0; i < results2.length; i++) {
  			console.log($(results2[i]));
    		if($(results2[i]).is(addVariable)){
      			results2val = parseInt($(results2[i]).val());
      			contain = 1;
      			break;
    		}
  		}
	}
	console.log(contain);
  	if(contain == 1) {
    	for(var i = 0; i < results2.length; i++) {
      		if($(results2[i]).hasClass('on')){
        		$(results2[i]).removeClass('on');
        		$(results2[i]).addClass('off');
      		}
    	}
    	addVariable.removeClass('off');
  		addVariable.addClass('on');
  	}


  if(results2val == -1){
    return;
  }

  /*$.getJSON("/data_sets/comparison-map-data.json", function(json) {
      setColorComp(json);
    })*/

    //console.log(compareMapData);
    //var result = hmget("compareMapData");
 	//console.log(result);

    setColorComp(compareMapData);
   /*$.get("/data_sets/comparison-map-data.json.zip", function(data) {

   		//var testing = new File("/data_sets/comparison-map-data.json.zip")
   		
   })*/

}

//Unzips large json data file
function unzipBlob(blob, callback) {
  // use a zip.BlobReader object to read zipped data stored into blob variable
  zip.createReader(new zip.BlobReader(blob), function(zipReader) {
    // get entries from the zip file
    zipReader.getEntries(function(entries) {
      // get data from the first file
      entries[0].getData(new zip.BlobWriter("text/plain"), function(data) {
        // close the reader and calls callback function with uncompressed data as parameter
        zipReader.close();
        callback(data);
      });
    });
  }, onerror);
}

function setColorComp(objJson) {
	//Resets counters
	for (var i = 0; i < 6; i++) {
	  frequency[i] = 0;
	}
	initHist2(); //initializes histogram/bar chart
	
	//For each GeoJSON grid cell - color according to its data, increment frequency counter as well
 	document.comparemap.data.forEach(function(feature){
    	var loc = feature.getProperty('Id');
		
		//Drainflow
    	if(results2val == 0){
			if(parseInt(objJson[loc].yearArray[dropdownval-1981].drainflow) < 10){
          		document.comparemap.data.overrideStyle(feature, {
            	fillColor: '#DDE500',
            	fillOpacity: 0.4
          		});
				
				frequency[0] += 1;
        	}
        	else if(parseInt(objJson[loc].yearArray[dropdownval-1981].drainflow) < 20){
          		document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#00CEAB',
            		fillOpacity: 0.4
          		});
				
				frequency[1] += 1;
          	}
          	else if(parseInt(objJson[loc].yearArray[dropdownval-1981].drainflow) < 30){
          		document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#0070C6',
            		fillOpacity: 0.4
          		});
				
				frequency[2] += 1;
          	}
          	else if(parseInt(objJson[loc].yearArray[dropdownval-1981].drainflow) < 40){
          		document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#0500BF',
            		fillOpacity: 0.4
          		});
				
				frequency[3] += 1;
          	}
          	else{
          		document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#D50023',
            		fillOpacity: 0.4
          		});
				
				frequency[4] += 1;
        	}
		}
		
		//SurfaceRunoff
		else if(results2val == 1){
			if(parseInt(objJson[loc].yearArray[dropdownval-1981].surfacerunoff) < 10){
          		document.comparemap.data.overrideStyle(feature, {
            	fillColor: '#DDE500',
            	fillOpacity: 0.4
          		});
				
				frequency[0] += 1;
        	}
        	else if(parseInt(objJson[loc].yearArray[dropdownval-1981].surfacerunoff) < 20){
          		document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#00CEAB',
            		fillOpacity: 0.4
          		});
				
				frequency[1] += 1;
          	}
          	else if(parseInt(objJson[loc].yearArray[dropdownval-1981].surfacerunoff) < 30){
          		document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#0070C6',
            		fillOpacity: 0.4
          		});
				
				frequency[2] += 1;
          	}
          	else if(parseInt(objJson[loc].yearArray[dropdownval-1981].surfacerunoff) < 40){
          		document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#0500BF',
            		fillOpacity: 0.4
          		});
				
				frequency[3] += 1;
          	}
          	else{
          		document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#D50023',
            		fillOpacity: 0.4
          		});
				
				frequency[4] += 1;
        	}
		}
		
		//Precipitation
		else if (results2val == 2){
			prop = "precipitation";
			if(parseInt(objJson[loc].yearArray[dropdownval-1981].precipitation) < 10){
          		document.comparemap.data.overrideStyle(feature, {
            	fillColor: '#DDE500',
            	fillOpacity: 0.4
          		});
				
				frequency[0] += 1;
        	}
        	else if(parseInt(objJson[loc].yearArray[dropdownval-1981].precipitation) < 20){
          		document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#00CEAB',
            		fillOpacity: 0.4
          		});
				
				frequency[1] += 1;
          	}
          	else if(parseInt(objJson[loc].yearArray[dropdownval-1981].precipitation) < 30){
          		document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#0070C6',
            		fillOpacity: 0.4
          		});
				
				frequency[2] += 1;
          	}
          	else if(parseInt(objJson[loc].yearArray[dropdownval-1981].precipitation) < 40){
          		document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#0500BF',
            		fillOpacity: 0.4
          		});
				
				frequency[3] += 1;
          	}
          	else{
          		document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#D50023',
            		fillOpacity: 0.4
          		});
				
				frequency[4] += 1;
        	}
		}
		
		//PET
		else if(results2val == 3){
			prop = "pet";
			if(parseInt(objJson[loc].yearArray[dropdownval-1981].pet) < 10){
          		document.comparemap.data.overrideStyle(feature, {
            	fillColor: '#DDE500',
            	fillOpacity: 0.4
          		});
				
				frequency[0] += 1;
        	}
        	else if(parseInt(objJson[loc].yearArray[dropdownval-1981].pet) < 20){
          		document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#00CEAB',
            		fillOpacity: 0.4
          		});
				
				frequency[1] += 1;
          	}
          	else if(parseInt(objJson[loc].yearArray[dropdownval-1981].pet) < 30){
          		document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#0070C6',
            		fillOpacity: 0.4
          		});
				
				frequency[2] += 1;
          	}
          	else if(parseInt(objJson[loc].yearArray[dropdownval-1981].pet) < 40){
          		document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#0500BF',
            		fillOpacity: 0.4
          		});
				
				frequency[3] += 1;
          	}
          	else{
          		document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#D50023',
            		fillOpacity: 0.4
          		});
				
				frequency[4] += 1;
        	}
		}
		
		//DEA_PET
		else if(results2val == 4){
			prop = "dea_pet";
			if(parseInt(objJson[loc].yearArray[dropdownval-1981].dea_pet) < 10){
          		document.comparemap.data.overrideStyle(feature, {
            	fillColor: '#DDE500',
            	fillOpacity: 0.4
          		});
				
				frequency[0] += 1;
        	}
        	else if(parseInt(objJson[loc].yearArray[dropdownval-1981].dea_pet) < 20){
          		document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#00CEAB',
            		fillOpacity: 0.4
          		});
				
				frequency[1] += 1;
          	}
          	else if(parseInt(objJson[loc].yearArray[dropdownval-1981].dea_pet) < 30){
          		document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#0070C6',
            		fillOpacity: 0.4
          		});
				
				frequency[2] += 1;
          	}
          	else if(parseInt(objJson[loc].yearArray[dropdownval-1981].dea_pet) < 40){
          		document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#0500BF',
            		fillOpacity: 0.4
          		});
				
				frequency[3] += 1;
          	}
          	else{
          		document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#D50023',
            		fillOpacity: 0.4
          		});
				
				frequency[4] += 1;
        	}
		}
    });
    console.log("finished coloring");

    document.comparemap.data.toGeoJson(function(data) {
    	compareKML = tokml(data);
    });
}
