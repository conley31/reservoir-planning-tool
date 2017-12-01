var frequency = new Array(); //Array to hold count of each range
var freqChoice = 0; //0 - percentage, 1 - captured, 2 - annual, 3 - sufficiency
var drop = -1;
var regKML;
var rkml;
var testing;

class infoContent {
  constructor(event, info) {
    this.event = event;
    this.info = info;
  }
}

var contentArray = new Array();
for(var i = 0; i < 11233; i++) {
	contentArray[i] = 0;
}

var infoArray = new Array();

//Draws the histogram/bar chart
var drawHist = function() {
	var data = new google.visualization.DataTable();
	data.addColumn('string', 'Range');
	data.addColumn('number', 'Frequency');
	
	if (freqChoice == 0) { //use percentAnnualCapturedDrainFlow ranges
		data.addRows([
		['Outliers', frequency[0]],
		['<1.5%', frequency[1]],
		['1.5-3%', frequency[2]],
		['3-4.5%', frequency[3]],
		['4.5-6%', frequency[4]],
		['>6%', frequency[5]]
		]);
	}
	else if (freqChoice == 3) { //use cumulativeCapturedFlow ranges
		data.addRows([
		['Outliers', frequency[0]],
		['<30', frequency[1]],
		['30-60', frequency[2]],
		['60-90', frequency[3]],
		['90-120', frequency[4]],
		['>120', frequency[5]]
		]);
	}
	else if (freqChoice == 2) {
		data.addRows([ //use annualIrrigationDepthSupplied ranges
		['Outliers', frequency[0]],
		['<50', frequency[1]],
		['50-100', frequency[2]],
		['100-150', frequency[3]],
		['150-200', frequency[4]],
		['>200', frequency[5]]
		]);
	}
	else {
		data.addRows([ //use irrigationSufficiency ranges
		['Outliers', frequency[0]],
		['0', frequency[1]],
		['0-25', frequency[2]],
		['25-50', frequency[3]],
		['50-75', frequency[4]],
		['>75', frequency[5]]
		]);
	}
	
	var options = {
		title: 'Frequency of Each Range',
		legend: {position: 'none'}
	};
	
	//creates a new bar chart
	var chart = new google.visualization.BarChart(document.getElementById('histogram-1'));
	chart.draw(data, options); //draws the chart using the data and options given
}

//Initializes the google charts needed
var initHistogram = function() {
	google.charts.load('current', {'packages':['bar', 'corechart', 'controls']});
	google.charts.setOnLoadCallback(drawHist);
};

var pondval = -1;
var waterval = -1;
var resultsval = -1;

//Checks which json file to download
var getFile = function() {
  if(pondval == 0 || waterval == 0){
    downloadFile("/data_sets/allData-16vol-Low.json")
  }
  else if(pondval == 1 || waterval == 0){
    downloadFile("/data_sets/allData-48vol-Low.json")
  }
  else if(pondval == 2 || waterval == 0){
	downloadFile("/data_sets/allData-80vol-Low.json")
  }
  else if(pondval == 0 || waterval == 1){
	downloadFile("/data_sets/allData-16vol-Medium.json")
  }
  else if(pondval == 0 || waterval == 2){
	downloadFile("/data_sets/allData-16vol-High.json")
  }
  else if(pondval == 1 || waterval == 1){
	downloadFile("/data_sets/allData-48vol-Medium.json")
  }
  else if(pondval == 1 || waterval == 2){
	downloadFile("/data_sets/allData-48vol-High.json")
  }
  else if(pondval == 2 || waterval == 1){
	downloadFile("/data_sets/allData-80vol-Medium.json")
  }
  else if(pondval == 2 || waterval == 2){
	downloadFile("/data_sets/allData-80vol-High.json")
  }
}

//Determines which map and json file to load
var colorMap = function(addVariable) {

  var pondsize = document.getElementsByName("pond-size");
  var water = document.getElementsByName("water");
  var results = document.getElementsByName("results");
  var years = document.getElementById("year-dropdownReg");
  

  var contain = -1; //0 for pondsize 1 for water 2 for results 3 for dropdown
  if(parseInt($(years).val()) != drop) {
    contain == 0;
    drop = parseInt($(years).val());
    //console.log(dropdownval);
  }

  for(var i = 0; i < pondsize.length; i++) {
    if($(pondsize[i]).is(addVariable)){
      pondval = parseInt($(pondsize[i]).val());
      contain = 0;
      break;
    }
  }

  if(contain == -1) {
    for(var i = 0; i < water.length; i++) {
      if($(water[i]).is(addVariable)){
        waterval = parseInt($(water[i]).val());
        contain = 1;
        break;
      }
    }
    if(contain == -1) {
      for(var i = 0; i < results.length; i++) {
        if($(results[i]).is(addVariable)){
          resultsval = parseInt($(results[i]).val());
          contain = 2;
          break;
        }
      }
    }
  }

  if(contain == 0) {
    for(var i = 0; i < pondsize.length; i++) {
      if($(pondsize[i]).hasClass('on')){
        $(pondsize[i]).removeClass('on');
        $(pondsize[i]).addClass('off');
      }
    }
  }
  else if(contain == 1) {
    for(var i = 0; i < water.length; i++) {
      if($(water[i]).hasClass('on')){
        $(water[i]).removeClass('on');
        $(water[i]).addClass('off');
      }
    }
  }
  else if(contain == 2) {
    for(var i = 0; i < results.length; i++) {
      if($(results[i]).hasClass('on')){
        $(results[i]).removeClass('on');
        $(results[i]).addClass('off');
      }
    }
  }

  addVariable.removeClass('off');
  addVariable.addClass('on');

  if(pondval == -1 || waterval == -1 || resultsval == -1){
    return;
  }

  //Displays map for annualIrrigationDepthSupplied
  if(resultsval == 0) {
    var legend_annual = document.getElementById('legend-annual');
    document.regionalmap.controls[google.maps.ControlPosition.TOP_LEFT].push(legend_annual);
    $('#legend-percentage').fadeOut('fast');
    $('#legend-captured').fadeOut('fast');
    $('#legend-sufficiency').fadeOut('fast');
    $('#legend-annual').fadeIn('fast');
    
  }

  //Displays map for percentAnnualCapturedDrainFlow
  if(resultsval == 1) {
    var legend_percentage = document.getElementById('legend-percentage');
    document.regionalmap.controls[google.maps.ControlPosition.TOP_LEFT].push(legend_percentage);
    $('#legend-annual').fadeOut('fast');
    $('#legend-captured').fadeOut('fast');
    $('#legend-sufficiency').fadeOut('fast');
    $('#legend-percentage').fadeIn('fast');
    

    /*try{
      document.regionalmap.controls[google.maps.ControlPosition.CENTER_RIGHT].push(legend);
    }
    catch(e){
      alert(e.name + "\n" + e.message)
    }*/
  }

  //Displays map for capturedDrainflow
  if (resultsval == 2) {
    var legend_captured = document.getElementById('legend-captured');
    document.regionalmap.controls[google.maps.ControlPosition.TOP_LEFT].push(legend_captured);
    $('#legend-annual').fadeOut('fast');
    $('#legend-percentage').fadeOut('fast');
    $('#legend-sufficiency').fadeOut('fast');
    $('#legend-captured').fadeIn('fast');
  }


  //Displays map for irrigationSufficiency
  if (resultsval == 3) {
    var legend_sufficiency = document.getElementById('legend-sufficiency');
    document.regionalmap.controls[google.maps.ControlPosition.TOP_LEFT].push(legend_sufficiency);
    $('#legend-annual').fadeOut('fast');
    $('#legend-percentage').fadeOut('fast');
    $('#legend-captured').fadeOut('fast');
    $('#legend-sufficiency').fadeIn('fast');
  }

  $('#map-buffer2').fadeIn('fast');
  //Determines which json file to load for data
  whatMap = "regional";
  if(drop == 0){
    drop = "0000";
  }

  console.time("regMapLoad");
  var file = "/data_sets/map_data_named/" + drop + "-" + pondval + "-" + waterval;
  rkml = "/data_sets/kml_files/" + drop + "-" + pondval + "-" + waterval;
  if(resultsval == 0){
    file = file + "-AnnualIrrigation.zip";
    rkml = rkml + "-AnnualIrrigation.zip";
    downloadJSON(file)
  }
  else if (resultsval == 1){
    file = file + "-PercentAnnualDrainflow.zip";
    rkml = rkml + "-PercentAnnualDrainflow.zip";
    downloadJSON(file);
  }
  else if (resultsval == 2){
    file = file + "-CapturedDrainflow.zip";
    rkml = rkml + "-CapturedDrainflow.zip";
    downloadJSON(file);
  }
  else if(resultsval == 3){
    file = file + "-IrrigationSufficiency.zip";
    rkml = rkml + "-IrrigationSufficiency.zip";
    downloadJSON(file);
  }
  
}

//Colors the GeoJSON grids on the google map
function setColor(objJson) {
  
  //Reset frequency count to 0
  for (var i = 0; i < 6; i++) {
	  frequency[i] = 0;
  }
  var array = [];

  //Close previous infowindows, remove all events from infoArray
  for(var i = 0; i < infoArray.length; i++) {
    var win = infoArray[i].info;
    win.close();
  }
  infoArray = new Array();
  //array = JSON.parse(array);
  
  //For each grid in the GeoJSON, decide which color to make it based on its value for the current map
  //Increment frequency as well
  document.regionalmap.data.forEach(function(feature){
	  
    var loc = feature.getProperty('Id');
    var tempJSON;
    //console.log(resultsval);
<<<<<<< HEAD
    if(resultsval == 0){
=======
      if(resultsval == 0){
	     document.getElementById("five-nums").innerHTML = "Five Number Summary: 0.00009695 0.63919928 2.24316159 18.99784124 335.74870016 | Mean = 23.13214, SD = 47.23474";
>>>>>>> e03f361a867fc5a25c4da8f9af027bb3bbfe9764
		    freqChoice = 2;
        tempJSON = objJson[loc];
		    //AnnualIrrigationDepthSupplied
        if(parseInt(tempJSON) > 250){
          document.regionalmap.data.overrideStyle(feature, {
            fillColor: '#616161',
            fillOpacity: 0.25
          });
		  
		  frequency[0] += 1;
		  contentArray[loc] = parseFloat(tempJSON);
        }
        else if(parseInt(tempJSON) < 50){
          document.regionalmap.data.overrideStyle(feature, {
            fillColor: '#A6611A',
            fillOpacity: 0.4
          });
		  
		  frequency[1] += 1;
		  contentArray[loc] = parseFloat(tempJSON);
        }
		else if(parseInt(tempJSON) < 100){
          document.regionalmap.data.overrideStyle(feature, {
            fillColor: '#DFC27D',
            fillOpacity: 0.4
          });
		  
		  frequency[2] += 1;
		  contentArray[loc] = parseFloat(tempJSON);
        }
		else if(parseInt(tempJSON) < 150){
          document.regionalmap.data.overrideStyle(feature, {
            fillColor: '#F5F5F5',
            fillOpacity: 0.4
          });
		  
		  frequency[3] += 1;
		  contentArray[loc] = parseFloat(tempJSON);
        }
        else if(parseInt(tempJSON) < 200){
          document.regionalmap.data.overrideStyle(feature, {
            fillColor: '#80CDC1',
            fillOpacity: 0.4
          });
		  
		  frequency[4] += 1;
		  contentArray[loc] = parseFloat(tempJSON);
        }
        else{
          document.regionalmap.data.overrideStyle(feature, {
            fillColor: '#018571',
            fillOpacity: 0.4
          });
		  
		  frequency[5] += 1;
		  contentArray[loc] = parseFloat(tempJSON);
        }
      }
	  
	  //PercentAnnualCapturedDrainFlow
      else if (resultsval == 1){
		  
		    freqChoice = 0;
        tempJSON = objJson[loc];

        
        if(parseInt(tempJSON) > 8) {
          document.regionalmap.data.overrideStyle(feature, {
            fillColor: '#616161',
            fillOpacity: 0.4
          });
		  
		  frequency[0] += 1;
		  contentArray[loc] = parseFloat(tempJSON);
        }
        else if(parseInt(tempJSON) < 1.5) {
          document.regionalmap.data.overrideStyle(feature, {
            fillColor: '#D7191C',
            fillOpacity: 0.4
          });
		  
		  frequency[1] += 1;
		  contentArray[loc] = parseFloat(tempJSON);
        }
        else if(parseInt(tempJSON) < 3) {
          document.regionalmap.data.overrideStyle(feature, {
            fillColor: '#FDAE61',
            fillOpacity: 0.4
          });
		  
		  frequency[2] += 1;
		  contentArray[loc] = parseFloat(tempJSON);
        }
        else if(parseInt(tempJSON) < 4.5) {
          document.regionalmap.data.overrideStyle(feature, {
            fillColor: '#FFFFBF',
            fillOpacity: 0.4
          });
		  
		  frequency[3] += 1;
		  contentArray[loc] = parseFloat(tempJSON);
        }
        else if(parseInt(tempJSON) < 6) {
          document.regionalmap.data.overrideStyle(feature, {
            fillColor: '#ABD9E9',
            fillOpacity: 0.4
          });
		  
		  frequency[4] += 1;
		  contentArray[loc] = parseFloat(tempJSON);
        }
        else {
          document.regionalmap.data.overrideStyle(feature, {
            fillColor: '2C7BBB',
            fillOpacity: 0.4
          });
		  
		  frequency[5] += 1;
		  contentArray[loc] = parseFloat(tempJSON);
        }
      } 
	  
	  //CumulativeCapturedFlow
	  else if (resultsval == 2) {
		  
		  freqChoice = 1;
      tempJSON = objJson[loc];
		if(parseInt(tempJSON) > 74.331329) {
			  document.regionalmap.data.overrideStyle(feature, {
				fillColor: '#616161',
				fillOpacity: 0.4
			  });
			  
			  frequency[0] += 1;
			  contentArray[loc] = parseFloat(tempJSON);
		}
		else if(parseInt(tempJSON) < 30) {
			  document.regionalmap.data.overrideStyle(feature, {
				fillColor: '#D7191C',
				fillOpacity: 0.4
			  });
			  
			  frequency[1] += 1;
			  contentArray[loc] = parseFloat(tempJSON);
		}
		else if(parseInt(tempJSON) < 60) {
			  document.regionalmap.data.overrideStyle(feature, {
				fillColor: '#FDAE61',
				fillOpacity: 0.4
			  });
			  
			  frequency[2] += 1;
			  contentArray[loc] = parseFloat(tempJSON);
			}
		else if(parseInt(tempJSON) < 90) {
			  document.regionalmap.data.overrideStyle(feature, {
				fillColor: '#FFFFBF',
				fillOpacity: 0.4
			  });
			  
			  frequency[3] += 1;
			  contentArray[loc] = parseFloat(tempJSON);
			}
		else if(parseInt(tempJSON) < 120) {
			  document.regionalmap.data.overrideStyle(feature, {
				fillColor: '#ABD9E9',
				fillOpacity: 0.4
			  });
			  
			  frequency[4] += 1;
			  contentArray[loc] = parseFloat(tempJSON);
			}
		else  {
			  document.regionalmap.data.overrideStyle(feature, {
				fillColor: '#2C7BBB',
				fillOpacity: 0.4
			  });
			  
			  frequency[5] += 1;
			  contentArray[loc] = parseFloat(tempJSON);
			}

		  }
		  
		  //irrigationSufficiency
		  else {
			  freqChoice = 3;
        tempJSON = objJson[loc];

			if(parseInt(tempJSON) > 100) {
			  document.regionalmap.data.overrideStyle(feature, {
				fillColor: '#616161',
				fillOpacity: 0.4
			  });
			  
			  frequency[0] += 1;
			  contentArray[loc] = parseFloat(tempJSON);
			}
			
			else if(parseInt(tempJSON) == 0) {
			  document.regionalmap.data.overrideStyle(feature, {
				fillColor: '#A6611A',
				fillOpacity: 0.4
			  });
			  
			  frequency[1] += 1;
			  contentArray[loc] = parseFloat(tempJSON);
			}
			
			else if(parseInt(tempJSON) < 25) {
			  document.regionalmap.data.overrideStyle(feature, {
				fillColor: '#DFC27D',
				fillOpacity: 0.4
			  });
			  
			  frequency[2] += 1;
			  contentArray[loc] = parseFloat(tempJSON);
			}
			
			else if(parseInt(tempJSON) < 50) {
			  document.regionalmap.data.overrideStyle(feature, {
				fillColor: '#F5F5F5',
				fillOpacity: 0.4
			  });
			  
			  frequency[3] += 1;
			  contentArray[loc] = parseFloat(tempJSON);
			}
			
			else if(parseInt(tempJSON) < 75) {
			  document.regionalmap.data.overrideStyle(feature, {
				fillColor: '#80CDC1',
				fillOpacity: 0.4
			  });
			  
			  frequency[4] += 1;
			  contentArray[loc] = parseFloat(tempJSON);
			}
			
			else {
			  document.regionalmap.data.overrideStyle(feature, {
				fillColor: '#018571',
				fillOpacity: 0.4
			  });
			  
			  frequency[5] += 1;
			  contentArray[loc] = parseFloat(tempJSON);
			}
		  }
	  
    });
	
	//Initialize the histogram/bar chart
	initHistogram();
  $('#histogram1-body').fadeIn('slow',function() {
    $('#histogram-buffer1').fadeOut('fast');
  });
  $('#map-buffer2').fadeOut('fast');
  array = JSON.stringify(array);
  //saveData(array, '1981-0-0-0-reg.json');
  tempStor = JSON.stringify(objJson);
  whatMap = "rkml";
  downloadJSON(rkml);
  /*document.comparemap.data.toGeoJson(function(data) {
      regKML = tokml(data);
  });*/
  console.timeEnd("regMapLoad");
}

// Select a polygon on the map
var selectFeature_regional = function(event) {
	var loc = event.feature.getProperty('Id');
	var contentString = '<div style="text-align: center;">' +
  "Location ID: " + loc + ",Value: " + contentArray[loc] +
  '<br><button onclick="downloadLocations()">Download Selected Locations</button></br></div>';
	
	var infowindow = new google.maps.InfoWindow({
		content: contentString,
		position: event.latLng
	});

  var newInfo = new infoContent(event, infowindow);
  infoArray.push(newInfo);

  google.maps.event.addListener(infowindow, 'closeclick', function() {
	if (infoArray.length >= 2) {
		if (infowindow === infoArray[infoArray.length - 1].info) {
			var i = infoArray.length - 2;
			var loc = infoArray[i].event.feature.getProperty('Id');
			var str = "Location ID:" + loc + ",Value: " + contentArray[loc] +
			'<br><button onclick="downloadLocations()">Download Selected Locations</button></br></div>';
			
			var win = infoArray[i].info;
			win.setContent(str);
      
      console.log("regional popup donwload button changed");
		}
	}
	  
    for(var i = 0; i < infoArray.length; i++) {
      if (infoArray[i].info === infowindow) {
        infoArray.splice(i, 1); //remove the event and infowindow from the array
      }
    }

    console.log("regional popup closed");
  }); 
	
  infowindow.open(document.regionalmap);

  console.log("regional popup open");

  if (infoArray.length >= 2) {
		var i = infoArray.length - 2;
		
		//Remove download button from previous event
		var loc = infoArray[i].event.feature.getProperty('Id');
		var str = "Location ID:" + loc + ",Value: " + contentArray[loc];
		
		var win = infoArray[i].info;
		win.setContent(str);
    console.log("regional popup donwload button changed");
	}
};

function downloadLocations() {
	var csv = "";
	
	for(var i = 0; i < infoArray.length; i++) {
		var loc = infoArray[i].event.feature.getProperty('Id');
		var csvString;
		
		if(i === infoArray.length - 1) {
			csvString = loc + ',' + contentArray[loc] + '\n';
		}
		
		else {
			csvString = loc + ',' + contentArray[loc] + ',\n';
		}
		csv += csvString;
	} 
	
	var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, 'data.csv');
        console.log("regional data donwloaded");
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
            console.log("regional data donwloaded");
        }
    }
}
