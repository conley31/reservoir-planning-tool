var results2val = -1;
var dropdownval = -1;
var compareKML;
var whatMap = "";
var ckml;
var cmpChoice = 0;

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

	if (cmpChoice == 0) { //drainflow
		data.addRows([
		['Data Unavailable', frequencycmp[0]],
		['<1.5', frequencycmp[1]],
		['1.5-3.0', frequencycmp[2]],
		['3.0-4.5', frequencycmp[3]],
		['4.5-6.0', frequencycmp[4]],
		['>6.0', frequencycmp[5]]
		]);
	}
	else if (cmpChoice == 1) { //surface runoff
		data.addRows([
		['Outlier', frequencycmp[0]],
		['<25', frequencycmp[1]],
		['25-50', frequencycmp[2]],
		['50-75', frequencycmp[3]],
		['75-100', frequencycmp[4]],
		['>100', frequencycmp[5]]
		]);
	}
	else if (cmpChoice == 2) { //precipitation
		data.addRows([
		['Outliers', frequencycmp[0]],
		['<12.5', frequencycmp[1]],
		['12.5-25', frequencycmp[2]],
		['25-37.5', frequencycmp[3]],
		['37.5-50', frequencycmp[4]],
		['>50', frequencycmp[5]]
		]);
	}
	else if (cmpChoice === 3) { //evapotranspiration
		data.addRows([
		['Outliers', frequencycmp[0]],
		['<75', frequencycmp[1]],
		['75-150', frequencycmp[2]],
		['150-225', frequencycmp[3]],
		['225-300', frequencycmp[4]],
		['>300', frequencycmp[5]]
		]);
	}
	else {
		data.addRows([ //open water evaporation
		['Outliers', frequencycmp[0]],
		['<5', frequencycmp[1]],
		['5-10', frequencycmp[2]],
		['10-15', frequencycmp[3]],
		['15-20', frequencycmp[4]],
		['>20', frequencycmp[5]]
		]);
	}
	
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
    		if($(results2[i]).is(addVariable)){
      			results2val = parseInt($(results2[i]).val());
      			contain = 1;
      			break;
    		}
  		}
	}
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
    $('#legend-et').fadeOut('fast');
    $('#legend-evaporation').fadeOut('fast');
  }

if(results2val == 1) {
    var legend_runoff = document.getElementById('legend-runoff');
    document.comparemap.controls[google.maps.ControlPosition.TOP_LEFT].push(legend_runoff);
    $('#legend-precipitation').fadeOut('fast');
    $('#legend-runoff').fadeIn('fast');
    $('#legend-drain').fadeOut('fast');
    $('#legend-et').fadeOut('fast');
    $('#legend-evaporation').fadeOut('fast');
  }
	
if(results2val == 2) {
    var legend_precipitation = document.getElementById('legend-precipitation');
    document.comparemap.controls[google.maps.ControlPosition.TOP_LEFT].push(legend_precipitation);
    $('#legend-precipitation').fadeIn('fast');
    $('#legend-runoff').fadeOut('fast');
    $('#legend-drain').fadeOut('fast');
    $('#legend-et').fadeOut('fast');
    $('#legend-evaporation').fadeOut('fast');
  }
	
if(results2val == 3) {
    var legend_evaporation = document.getElementById('legend-evaporation');
    document.comparemap.controls[google.maps.ControlPosition.TOP_LEFT].push(legend_evaporation);
    $('#legend-precipitation').fadeOut('fast');
    $('#legend-runoff').fadeOut('fast');
    $('#legend-drain').fadeOut('fast');
    $('#legend-et').fadeOut('fast');
    $('#legend-evaporation').fadeIn('fast');
  }
	
if(results2val == 4) {
    var legend_et = document.getElementById('legend-et');
    document.comparemap.controls[google.maps.ControlPosition.TOP_LEFT].push(legend_et);
    $('#legend-precipitation').fadeOut('fast');
    $('#legend-runoff').fadeOut('fast');
    $('#legend-drain').fadeOut('fast');
    $('#legend-et').fadeIn('fast');
    $('#legend-evaporation').fadeOut('fast');
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
  console.time("compMapLoad");
  var file = "/data_sets/map_files/" + dropdownval;
  ckml = "/data_sets/kml_files/" + dropdownval;
  if(results2val == 0){
    file = file + "-Drainflow.zip";
    ckml = ckml + "-Drainflow.zip";
    downloadJSON(file)
  }
  else if (results2val == 1){
    file = file + "-SurfaceRunoff.zip";
    ckml = ckml + "-SurfaceRunoff.zip";
    downloadJSON(file);
  }
  else if (results2val == 2){
    file = file + "-Precipitation.zip";
    ckml = ckml + "-Precipitation.zip";
    downloadJSON(file);
  }
  else if(results2val == 3){
    file = file + "-Evapotranspiration.zip";
    ckml = ckml + "-Evapotranspiration.zip";
    downloadJSON(file);
  }
  else if(results2val == 4){
    file = file + "-OpenWaterEvaporation.zip";
    ckml = ckml + "-OpenWaterEvaporation.zip";
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
		document.getElementById("five-nums2").innerHTML = "Five Number Summary: 0.000000e+00, 1.643583e+00, 8.386946e+00, 5.860012e+14, 6.326299e+16 | Mean = 1.332241e+15, SD = 4.28131e+15";
		cmpChoice = 0;
        tempJSON = objJson[loc];
			if(parseInt(tempJSON) > 20){
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
			document.getElementById("five-nums2").innerHTML = "Five Number Summary: 0.00324803, 1.62379931, 3.20490982, 12.17261884, 622.00229983 | Mean = 34.97021, SD = 77.23314";
			cmpChoice = 1;
      tempJSON = objJson[loc];
			if(parseInt(tempJSON) > 110){
          		document.comparemap.data.overrideStyle(feature, {
            	fillColor: '#616161',
            	fillOpacity: 0.25
          		});
				
				frequencycmp[0] += 1;
				contentArraycmp[loc] = parseFloat(tempJSON);
        	}
		else if(parseInt(tempJSON) < 25){
          		document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#FFFFD4',
            		fillOpacity: 0.4
          		});
				
				frequencycmp[1] += 1;
				contentArraycmp[loc] = parseFloat(tempJSON);
        	}
        	else if(parseInt(tempJSON) < 50){
          		document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#FED98E',
            		fillOpacity: 0.4
          		});
				
				frequencycmp[2] += 1;
				contentArraycmp[loc] = parseFloat(tempJSON);
          	}
          	else if(parseInt(tempJSON) < 75){
          		document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#FE9929',
            		fillOpacity: 0.4
          		});
				
				frequencycmp[3] += 1;
				contentArraycmp[loc] = parseFloat(tempJSON);
          	}
          	else if(parseInt(tempJSON) < 100){
          		document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#D95F0E',
            		fillOpacity: 0.4
          		});
				
				frequencycmp[4] += 1;
				contentArraycmp[loc] = parseFloat(tempJSON);
          	}
          	else{
          		document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#993404',
            		fillOpacity: 0.4
          		});
				
				frequencycmp[5] += 1;
				contentArraycmp[loc] = parseFloat(tempJSON);
        	}
		}
		
		//Precipitation
		else if (results2val == 2){
			document.getElementById("five-nums2").innerHTML = "Five Number Summary: 12.63610, 28.12480, 34.00826, 39.07008, 58.22912 | Mean = 33.4969, SD = 77.23314";
			cmpChoice = 2;
			prop = "precipitation";
      tempJSON = objJson[loc];
			
			if(parseInt(tempJSON) < 11.70688 || parseInt(tempJSON) > 55.424928){
          		document.comparemap.data.overrideStyle(feature, {
            	fillColor: '#616161',
            	fillOpacity: 0.25
          		});
				
				frequencycmp[0] += 1;
				contentArraycmp[loc] = parseFloat(tempJSON);
        	}
		else if(parseInt(tempJSON) < 12.5){
          		document.comparemap.data.overrideStyle(feature, {
            	fillColor: '#FFFFCC',
            	fillOpacity: 0.4
          		});
				
				frequencycmp[1] += 1;
				contentArraycmp[loc] = parseFloat(tempJSON);
        	}
        	else if(parseInt(tempJSON) < 25){
          		document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#A1DAB4',
            		fillOpacity: 0.4
          		});
				
				frequencycmp[2] += 1;
				contentArraycmp[loc] = parseFloat(tempJSON);
          	}
          	else if(parseInt(tempJSON) < 37.5){
          		document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#41B6C4',
            		fillOpacity: 0.4
          		});
				
				frequencycmp[3] += 1;
				contentArraycmp[loc] = parseFloat(tempJSON);
          	}
          	else if(parseInt(tempJSON) < 50){
          		document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#2C7FB8',
            		fillOpacity: 0.4
          		});
				
				frequencycmp[4] += 1;
				contentArraycmp[loc] = parseFloat(tempJSON);
          	}
          	else{
          		document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#253494',
            		fillOpacity: 0.4
          		});
				
				frequencycmp[5] += 1;
				contentArraycmp[loc] = parseFloat(tempJSON);
        	}
		}
		
		//evaporation
		else if(results2val == 3){
			document.getElementById("five-nums2").innerHTML = "Five Number Summary: 0.4598114, 48.0063976, 52.0118195, 58.4702242, 610.1174979 | Mean = 74.0531, SD = 62.38632";
			cmpChoice = 3;
			prop = "pet";
      tempJSON = objJson[loc];
			if(parseInt(tempJSON) > 24.759455){
          		document.comparemap.data.overrideStyle(feature, {
            	fillColor: '#616161',
            	fillOpacity: 0.25
          		});
				
				frequencycmp[0] += 1;
				contentArraycmp[loc] = parseFloat(tempJSON);
        	}
		else if(parseInt(tempJSON) < 5){
          		document.comparemap.data.overrideStyle(feature, {
            	fillColor: '#EDF8FB',
            	fillOpacity: 0.4
          		});
				
				frequencycmp[1] += 1;
				contentArraycmp[loc] = parseFloat(tempJSON);
        	}
        	else if(parseInt(tempJSON) < 10){
          		document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#B3CDE3',
            		fillOpacity: 0.4
          		});
				
				frequencycmp[2] += 1;
				contentArraycmp[loc] = parseFloat(tempJSON);
          	}
          	else if(parseInt(tempJSON) < 15){
          		document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#8C96C6',
            		fillOpacity: 0.4
          		});
				
				frequencycmp[3] += 1;
				contentArraycmp[loc] = parseFloat(tempJSON);
          	}
          	else if(parseInt(tempJSON) < 20){
          		document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#8856A7',
            		fillOpacity: 0.4
          		});
				
				frequencycmp[4] += 1;
				contentArraycmp[loc] = parseFloat(tempJSON);
          	}
          	else{
          		document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#810F7C',
            		fillOpacity: 0.4
          		});
				
				frequencycmp[5] += 1;
				contentArraycmp[loc] = parseFloat(tempJSON);
        	}
		}
		
		//DEA_PET
		else if(results2val == 4){
			document.getElementById("five-nums2").innerHTML = "Five Number Summary: 2.0000, 18.06653, 19.19257, 20.74370, 219.79867 | Mean = 19.65112, SD = 2.263488";

			cmpChoice = 4;
			prop = "dea_pet";
      tempJSON = objJson[loc];
			if(parseInt(tempJSON) > 24.759455){
          		document.comparemap.data.overrideStyle(feature, {
            	fillColor: '#616161',
            	fillOpacity: 0.25
          		});
				
				frequencycmp[0] += 1;
				contentArraycmp[loc] = parseFloat(tempJSON);
        	}
			else if(parseInt(tempJSON) < 5){
          		document.comparemap.data.overrideStyle(feature, {
            	fillColor: '#EDF8FB',
            	fillOpacity: 0.4
          		});
				
				frequencycmp[1] += 1;
				contentArraycmp[loc] = parseFloat(tempJSON);
        	}
        	else if(parseInt(tempJSON) < 10){
          		document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#B2E2E2',
            		fillOpacity: 0.4
          		});
				
				frequencycmp[2] += 1;
				contentArraycmp[loc] = parseFloat(tempJSON);
          	}
          	else if(parseInt(tempJSON) < 15){
          		document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#66C2A4',
            		fillOpacity: 0.4
          		});
				
				frequencycmp[3] += 1;
				contentArraycmp[loc] = parseFloat(tempJSON);
          	}
          	else if(parseInt(tempJSON) < 20){
          		document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#2CA25F',
            		fillOpacity: 0.4
          		});
				
				frequencycmp[4] += 1;
				contentArraycmp[loc] = parseFloat(tempJSON);
          	}
          	else{
          		document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#006D2C',
            		fillOpacity: 0.4
          		});
				
				frequencycmp[5] += 1;
				contentArraycmp[loc] = parseFloat(tempJSON);
        	}
		}
    });
    $('#map-buffer3').fadeOut('fast');
    $('#histogram2-body').fadeIn('slow',function() {
    $ ('#histogram-buffer2').fadeOut('fast');
    });

    whatMap = "ckml";
    downloadJSON(ckml);
    console.timeEnd("compMapLoad");
    /*document.comparemap.data.toGeoJson(function(data) {
    	compareKML = tokml(data);
    });*/
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

        console.log("compare popup download button changed");
  		}
	  }
    
	
	for(var i = 0; i < infoArraycmp.length; i++) {
      if (infoArraycmp[i].info === infowindow) {
        infoArraycmp.splice(i, 1); //remove the event and infowindow from the array
      }
    }

    console.log("compare popup closed");
  }); 
	
  infowindow.open(document.comparemap);

  console.log("compare popup open");
  
	if (infoArraycmp.length >= 2) {
		var i = infoArraycmp.length - 2;
		
		//Remove download button from previous event
		var prevloc = infoArraycmp[i].event.feature.getProperty('Id');
		var newContentString = "Location ID:" + prevloc + ",Value: " + contentArraycmp[prevloc];
		
		var newWindow = infoArraycmp[i].info;
		newWindow.setContent(newContentString);
    console.log("compare popup download button changed");
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
