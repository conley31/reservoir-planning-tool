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

    //setColorComp(compareMapData);
    $('#map-buffer3').fadeIn('fast');
    downloadJSON("/data_sets/comparison-map-data.zip");
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
		  var tempJSON;
		//Drainflow
    	if(results2val == 0){
        if(dropdownval == 0){
          tempJSON = objJson[loc].drainflow;

        }
        else {
          tempJSON = objJson[loc].yearArray[dropdownval-1981].drainflow;
        }
			if(parseInt(tempJSON) == 0){
          		document.comparemap.data.overrideStyle(feature, {
            	fillColor: '#616161',
            	fillOpacity: 0.25
          		});
				
				frequency[0] += 1;
        	}
        	else if(parseInt(tempJSON) < 1.5){
          		document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#F1EEF6',
            		fillOpacity: 0.4
          		});
				
				frequency[1] += 1;
          	}
          	else if(parseInt(tempJSON) < 3){
          		document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#BDC9E1',
            		fillOpacity: 0.4
          		});
				
				frequency[2] += 1;
          	}
          	else if(parseInt(tempJSON) < 4.5){
          		document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#74A9CF',
            		fillOpacity: 0.4
          		});
				
				frequency[3] += 1;
          	}
		else if(parseInt(tempJSON) < 6){
			document.comparemap.data.overrideStyle(feature, {
			fillColor: '#2B8CBE',
			fillOpacity: 0.4
			});
				frequency[4] += 1;
		}
          	else{
          		document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#045A8D',
            		fillOpacity: 0.4
          		});
				
				frequency[5] += 1;
        	}
		}
		
		//SurfaceRunoff
		else if(results2val == 1){
      if(dropdownval == 0){
          tempJSON = objJson[loc].surfacerunnof;
        }
        else {
          tempJSON = objJson[loc].yearArray[dropdownval-1981].surfacerunoff;
        }
			if(parseInt(tempJSON) < 10){
          		document.comparemap.data.overrideStyle(feature, {
            	fillColor: '#DDE500',
            	fillOpacity: 0.4
          		});
				
				frequency[0] += 1;
        	}
        	else if(parseInt(tempJSON) < 20){
          		document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#00CEAB',
            		fillOpacity: 0.4
          		});
				
				frequency[1] += 1;
          	}
          	else if(parseInt(tempJSON) < 30){
          		document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#0070C6',
            		fillOpacity: 0.4
          		});
				
				frequency[2] += 1;
          	}
          	else if(parseInt(tempJSON) < 40){
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
      if(dropdownval == 0){
          tempJSON = objJson[loc].precipitation;
        }
        else {
          tempJSON = objJson[loc].yearArray[dropdownval-1981].precipitation;
        }
			if(parseInt(tempJSON) < 10){
          		document.comparemap.data.overrideStyle(feature, {
            	fillColor: '#DDE500',
            	fillOpacity: 0.4
          		});
				
				frequency[0] += 1;
        	}
        	else if(parseInt(tempJSON) < 20){
          		document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#00CEAB',
            		fillOpacity: 0.4
          		});
				
				frequency[1] += 1;
          	}
          	else if(parseInt(tempJSON) < 30){
          		document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#0070C6',
            		fillOpacity: 0.4
          		});
				
				frequency[2] += 1;
          	}
          	else if(parseInt(tempJSON) < 40){
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
      if(dropdownval == 0){
          tempJSON = objJson[loc].pet;
        }
        else {
          tempJSON = objJson[loc].yearArray[dropdownval-1981].pet;
        }
			if(parseInt(tempJSON) < 10){
          		document.comparemap.data.overrideStyle(feature, {
            	fillColor: '#DDE500',
            	fillOpacity: 0.4
          		});
				
				frequency[0] += 1;
        	}
        	else if(parseInt(tempJSON) < 20){
          		document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#00CEAB',
            		fillOpacity: 0.4
          		});
				
				frequency[1] += 1;
          	}
          	else if(parseInt(tempJSON) < 30){
          		document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#0070C6',
            		fillOpacity: 0.4
          		});
				
				frequency[2] += 1;
          	}
          	else if(parseInt(tempJSON) < 40){
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
      if(dropdownval == 0){
          tempJSON = objJson[loc].dea_pet;
        }
        else {
          tempJSON = objJson[loc].yearArray[dropdownval-1981].dea_pet;
        }
			if(parseInt(tempJSON) < 10){
          		document.comparemap.data.overrideStyle(feature, {
            	fillColor: '#DDE500',
            	fillOpacity: 0.4
          		});
				
				frequency[0] += 1;
        	}
        	else if(parseInt(tempJSON) < 20){
          		document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#00CEAB',
            		fillOpacity: 0.4
          		});
				
				frequency[1] += 1;
          	}
          	else if(parseInt(tempJSON) < 30){
          		document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#0070C6',
            		fillOpacity: 0.4
          		});
				
				frequency[2] += 1;
          	}
          	else if(parseInt(tempJSON) < 40){
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
    $('#map-buffer3').fadeOut('fast');
    $('#histogram2-body').fadeIn('slow',function() {
    $ ('#histogram-buffer2').fadeOut('fast');
    });
    document.comparemap.data.toGeoJson(function(data) {
    	compareKML = tokml(data);
    });
}
