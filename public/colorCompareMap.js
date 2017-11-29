var results2val = -1;
var dropdownval = -1;
var compareKML;
var whatMap = "";

var frequencycmp = new Array(); //Array to hold count of each range

class infoContentcmp {
  constructor(event, info) {
    this.event = event;
    this.info = info;
  }
}

var contentArraycmp = new Array();
for(var i = 0; i < 11233; i++) {
	contentArraycmp[i] = 0;
}

var infoArraycmp = new Array();

//Draws the histogram/bar chart for the comparison map
var drawHist2 = function() {
	var data = new google.visualization.DataTable();
	data.addColumn('string', 'Range');
	data.addColumn('number', 'Frequency');

	data.addRows([
	['<10', frequencycmp[0]],
	['10-20', frequencycmp[1]],
	['20-30', frequencycmp[2]],
	['30-40', frequencycmp[3]],
	['40-50', frequencycmp[4]],
	['>50', frequencycmp[5]]
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

if(results2val == 0) {
    var legend_drain = document.getElementById('legend-drain');
    document.comparemap.controls[google.maps.ControlPosition.TOP_LEFT].push(legend_drain);
    $('#legend-precipitation').fadeOut('fast');
    $('#legend-runoff').fadeOut('fast');
    $('#legend-drain').fadeIn('fast');
  }
	

  /*$.getJSON("/data_sets/comparison-map-data.json", function(json) {
      setColorComp(json);
    })*/

    //console.log(compareMapData);
    //var result = hmget("compareMapData");
 	//console.log(result);

    //setColorComp(compareMapData);
  $('#map-buffer3').fadeIn('fast');
      //document.comparemap.data.loadGeoJson('testgeo.json');

    ///downloadJSON("/data_sets/comparison-map-data.zip");
   /*$.get("/data_sets/comparison-map-data.json.zip", function(data) {

   		//var testing = new File("/data_sets/comparison-map-data.json.zip")
   		
   })*/
  if(dropdownval == 0){
    dropdownval = "0000";
  }
  whatMap = "compare";
  var file = "/data_sets/map_data_named/" + dropdownval;
  if(results2val == 0){
    file = file + "-Drainflow.zip"
    downloadJSON(file)
  }
  else if (results2val == 1){
    file = file + "-SurfaceRunoff.zip";
    downloadJSON(file);
  }
  else if (results2val == 2){
    file = file + "-Precipitation.zip";
    downloadJSON(file);
  }
  else if(results2val == 3){
    file = file + "-Evapotranspiration.zip";
    downloadJSON(file);
  }
  else if(results2val == 4){
    file = file + "-OpenWaterEvaporation.zip";
    downloadJSON(file);
  }

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
	  frequencycmp[i] = 0;
	}
	initHist2(); //initializes histogram/bar chart

  //Close previous infowindows and remove them from infoArraycmp
  for (var i = 0; i < infoArraycmp.length; i++) {
    var win = infoArraycmp[i].info;
    win.close();
  }
  infoArraycmp = new Array();
	
	//For each GeoJSON grid cell - color according to its data, increment frequency counter as well
 	document.comparemap.data.forEach(function(feature){
    	var loc = feature.getProperty('Id');
		  var tempJSON;
		//Drainflow
    	if(results2val == 0){
        tempJSON = objJson[loc];
			if(parseInt(tempJSON) == 0){
          		document.comparemap.data.overrideStyle(feature, {
            	fillColor: '#616161',
            	fillOpacity: 0.25
          		});
				
				frequencycmp[0] += 1;
				contentArraycmp[loc] = parseFloat(tempJSON);
        	}
        	else if(parseInt(tempJSON) < 1.5){
          		document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#F1EEF6',
            		fillOpacity: 0.4
          		});
				
				frequencycmp[1] += 1;
				contentArraycmp[loc] = parseFloat(tempJSON);
          	}
          	else if(parseInt(tempJSON) < 3){
          		document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#BDC9E1',
            		fillOpacity: 0.4
          		});
				
				frequencycmp[2] += 1;
				contentArraycmp[loc] = parseFloat(tempJSON);
          	}
          	else if(parseInt(tempJSON) < 4.5){
          		document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#74A9CF',
            		fillOpacity: 0.4
          		});
				
				frequencycmp[3] += 1;
				contentArraycmp[loc] = parseFloat(tempJSON);
          	}
		else if(parseInt(tempJSON) < 6){
			document.comparemap.data.overrideStyle(feature, {
			fillColor: '#2B8CBE',
			fillOpacity: 0.4
			});
				frequencycmp[4] += 1;
				contentArraycmp[loc] = parseFloat(tempJSON);
		}
          	else{
          		document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#045A8D',
            		fillOpacity: 0.4
          		});
				
				frequencycmp[5] += 1;
				contentArraycmp[loc] = parseFloat(tempJSON);
        	}
		}
		
		//SurfaceRunoff
		else if(results2val == 1){
      tempJSON = objJson[loc];
			if(parseInt(tempJSON) < 10){
          		document.comparemap.data.overrideStyle(feature, {
            	fillColor: '#DDE500',
            	fillOpacity: 0.4
          		});
				
				frequencycmp[0] += 1;
				contentArraycmp[loc] = parseFloat(tempJSON);
        	}
        	else if(parseInt(tempJSON) < 20){
          		document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#00CEAB',
            		fillOpacity: 0.4
          		});
				
				frequencycmp[1] += 1;
				contentArraycmp[loc] = parseFloat(tempJSON);
          	}
          	else if(parseInt(tempJSON) < 30){
          		document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#0070C6',
            		fillOpacity: 0.4
          		});
				
				frequencycmp[2] += 1;
				contentArraycmp[loc] = parseFloat(tempJSON);
          	}
          	else if(parseInt(tempJSON) < 40){
          		document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#0500BF',
            		fillOpacity: 0.4
          		});
				
				frequencycmp[3] += 1;
				contentArraycmp[loc] = parseFloat(tempJSON);
          	}
          	else{
          		document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#D50023',
            		fillOpacity: 0.4
          		});
				
				frequencycmp[4] += 1;
				contentArraycmp[loc] = parseFloat(tempJSON);
        	}
		}
		
		//Precipitation
		else if (results2val == 2){
			prop = "precipitation";
      tempJSON = objJson[loc];
			if(parseInt(tempJSON) < 10){
          		document.comparemap.data.overrideStyle(feature, {
            	fillColor: '#DDE500',
            	fillOpacity: 0.4
          		});
				
				frequencycmp[0] += 1;
				contentArraycmp[loc] = parseFloat(tempJSON);
        	}
        	else if(parseInt(tempJSON) < 20){
          		document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#00CEAB',
            		fillOpacity: 0.4
          		});
				
				frequencycmp[1] += 1;
				contentArraycmp[loc] = parseFloat(tempJSON);
          	}
          	else if(parseInt(tempJSON) < 30){
          		document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#0070C6',
            		fillOpacity: 0.4
          		});
				
				frequencycmp[2] += 1;
				contentArraycmp[loc] = parseFloat(tempJSON);
          	}
          	else if(parseInt(tempJSON) < 40){
          		document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#0500BF',
            		fillOpacity: 0.4
          		});
				
				frequencycmp[3] += 1;
				contentArraycmp[loc] = parseFloat(tempJSON);
          	}
          	else{
          		document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#D50023',
            		fillOpacity: 0.4
          		});
				
				frequencycmp[4] += 1;
				contentArraycmp[loc] = parseFloat(tempJSON);
        	}
		}
		
		//PET
		else if(results2val == 3){
			prop = "pet";
      tempJSON = objJson[loc];
			if(parseInt(tempJSON) < 10){
          		document.comparemap.data.overrideStyle(feature, {
            	fillColor: '#DDE500',
            	fillOpacity: 0.4
          		});
				
				frequencycmp[0] += 1;
				contentArraycmp[loc] = parseFloat(tempJSON);
        	}
        	else if(parseInt(tempJSON) < 20){
          		document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#00CEAB',
            		fillOpacity: 0.4
          		});
				
				frequencycmp[1] += 1;
				contentArraycmp[loc] = parseFloat(tempJSON);
          	}
          	else if(parseInt(tempJSON) < 30){
          		document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#0070C6',
            		fillOpacity: 0.4
          		});
				
				frequencycmp[2] += 1;
				contentArraycmp[loc] = parseFloat(tempJSON);
          	}
          	else if(parseInt(tempJSON) < 40){
          		document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#0500BF',
            		fillOpacity: 0.4
          		});
				
				frequencycmp[3] += 1;
				contentArraycmp[loc] = parseFloat(tempJSON);
          	}
          	else{
          		document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#D50023',
            		fillOpacity: 0.4
          		});
				
				frequencycmp[4] += 1;
				contentArraycmp[loc] = parseFloat(tempJSON);
        	}
		}
		
		//DEA_PET
		else if(results2val == 4){
			prop = "dea_pet";
      tempJSON = objJson[loc];
			if(parseInt(tempJSON) < 10){
          		document.comparemap.data.overrideStyle(feature, {
            	fillColor: '#DDE500',
            	fillOpacity: 0.4
          		});
				
				frequencycmp[0] += 1;
				contentArraycmp[loc] = parseFloat(tempJSON);
        	}
        	else if(parseInt(tempJSON) < 20){
          		document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#00CEAB',
            		fillOpacity: 0.4
          		});
				
				frequencycmp[1] += 1;
				contentArraycmp[loc] = parseFloat(tempJSON);
          	}
          	else if(parseInt(tempJSON) < 30){
          		document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#0070C6',
            		fillOpacity: 0.4
          		});
				
				frequencycmp[2] += 1;
				contentArraycmp[loc] = parseFloat(tempJSON);
          	}
          	else if(parseInt(tempJSON) < 40){
          		document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#0500BF',
            		fillOpacity: 0.4
          		});
				
				frequencycmp[3] += 1;
				contentArraycmp[loc] = parseFloat(tempJSON);
          	}
          	else{
          		document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#D50023',
            		fillOpacity: 0.4
          		});
				
				frequencycmp[4] += 1;
				contentArraycmp[loc] = parseFloat(tempJSON);
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

// Select a polygon on the map
var selectFeature_compare = function(event) {
	var loc = event.feature.getProperty('Id');
	var contentString = '<div style="text-align: center;">' +
  "Location ID: " + loc + ",Value: " + contentArraycmp[loc] +
  '<br><button onclick="downloadLocationscmp()">Download Selected Locations</button></br></div>';
	
	var infowindow = new google.maps.InfoWindow({
		content: contentString,
		position: event.latLng
	});

  var newInfo = new infoContentcmp(event, infowindow);
  infoArraycmp.push(newInfo);

  google.maps.event.addListener(infowindow, 'closeclick', function() {
	  if (infoArraycmp.length >= 2) {
		  
		if (infowindow === infoArraycmp[infoArraycmp.length - 1].info) {
			var i = infoArraycmp.length - 2;
			var prevloc = infoArraycmp[i].event.feature.getProperty('Id');
			var newContentString = "Location ID:" + prevloc + ",Value: " + contentArraycmp[prevloc] +
			'<br><button onclick="downloadLocationscmp()">Download Selected Locations</button></br></div>';
		
			var newWindow = infoArraycmp[i].info;
			newWindow.setContent(newContentString);
		}
	  }
    
	
	for(var i = 0; i < infoArraycmp.length; i++) {
      if (infoArraycmp[i].info === infowindow) {
        infoArraycmp.splice(i, 1); //remove the event and infowindow from the array
      }
    }
  }); 
	
  infowindow.open(document.comparemap);
  
	if (infoArraycmp.length >= 2) {
		var i = infoArraycmp.length - 2;
		
		//Remove download button from previous event
		var prevloc = infoArraycmp[i].event.feature.getProperty('Id');
		var newContentString = "Location ID:" + prevloc + ",Value: " + contentArraycmp[prevloc];
		
		var newWindow = infoArraycmp[i].info;
		newWindow.setContent(newContentString);
    }
};

function downloadLocationscmp() {
	var csv = "";
	
	for(var i = 0; i < infoArraycmp.length; i++) {
		var loc = infoArraycmp[i].event.feature.getProperty('Id');
		var csvString;
		
		if(i === infoArraycmp.length - 1) {
			csvString = loc + ',' + contentArraycmp[loc] + '\n';
		}
		
		else {
			csvString = loc + ',' + contentArraycmp[loc] + ',\n';
		}
		csv += csvString;
	} 
	
	var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, 'data.csv');
    } 
		
	else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", 'data.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}
