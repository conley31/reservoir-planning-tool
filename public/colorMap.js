var frequency = new Array(); //Array to hold count of each range
var freqChoice = 0; //0 - percentage, 1 - captured, 2 - annual, 3 - sufficiency
var drop = -1;
var regKML;

//Draws the histogram/bar chart
var drawHist = function() {
	var data = new google.visualization.DataTable();
	data.addColumn('string', 'Range');
	data.addColumn('number', 'Frequency');
	
	if (freqChoice == 0) { //use percentAnnualCapturedDrainFlow ranges
		data.addRows([
		['Data Unavailable', frequency[0]],
		['<12.5', frequency[1]],
		['12.5-25%', frequency[2]],
		['25-37.5%', frequency[3]],
		['37.5-50%', frequency[4]],
		['>50%', frequency[5]]
		]);
	}
	else if (freqChoice == 3) { //use cumulativeCapturedFlow ranges
		data.addRows([
		['Data Unavailable', frequency[0]],
		['<3000', frequency[1]],
		['3000-6000', frequency[2]],
		['6000-9000', frequency[3]],
		['9000-12000', frequency[4]],
		['>12000', frequency[5]]
		]);
	}
	else if (freqChoice == 2) {
		data.addRows([ //use annualIrrigationDepthSupplied ranges
		['Data Unavailable', frequency[0]],
		['<50', frequency[1]],
		['50-100', frequency[2]],
		['100-150', frequency[3]],
		['150-200', frequency[4]],
		['>200', frequency[5]]
		]);
	}
	else {
		data.addRows([ //use irrigationSufficiency ranges
		['Data Unavailable', frequency[0]],
		['<7.5%', frequency[1]],
		['7.5-15%', frequency[2]],
		['15-22.5%', frequency[3]],
		['22.5-30%', frequency[4]],
		['>30%', frequency[5]]
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
  if(pondval == 0 || waterval == 0){
    downloadJSON("/data_sets/all-Data-16vol-Low.zip");
    /*$.getJSON("/data_sets/allData-16vol-Low.json", function(json) {
      setColor(json);
    });*/
  }
  else if(pondval == 1 || waterval == 0){
    downloadJSON("/data_sets/all-Data-48vol-Low.zip");
    /*$.getJSON("/data_sets/allData-48vol-Low.json", function(json) {
      setColor(json);
    });*/
  }
  else if(pondval == 2 || waterval == 0){
    downloadJSON("/data_sets/all-Data-80vol-Low.zip");    
    /*$.getJSON("/data_sets/allData-80vol-Low.json", function(json) {
      setColor(json);
    });*/
  }
  else if(pondval == 0 || waterval == 1){
    downloadJSON("/data_sets/all-Data-16vol-Medium.zip");    
    /*$.getJSON("/data_sets/allData-16vol-Medium.json", function(json) {
      setColor(json);
    });*/
  }
  else if(pondval == 0 || waterval == 2){
    downloadJSON("/data_sets/all-Data-16vol-High.zip");    
    /*$.getJSON("/data_sets/allData-16vol-High.json", function(json) {
      setColor(json);
    });*/
  }
  else if(pondval == 1 || waterval == 1){
    downloadJSON("/data_sets/all-Data-48vol-Medium.zip");
    /*$.getJSON("/data_sets/allData-48vol-Medium.json", function(json) {
      setColor(json);
    });*/
  }
  else if(pondval == 1 || waterval == 2){
    downloadJSON("/data_sets/all-Data-48vol-High.zip");
    /*$.getJSON("/data_sets/allData-48vol-High.json", function(json) {
      setColor(json);
    });*/
  }
  else if(pondval == 2 || waterval == 1){
    downloadJSON("/data_sets/all-Data-80vol-Medium.zip");
    /*$.getJSON("/data_sets/allData-80vol-Medium.json", function(json) {
      setColor(json);
    });*/
  }
  else if(pondval == 2 || waterval == 2){
    downloadJSON("/data_sets/all-Data-80vol-High.zip");
    /*$.getJSON("/data_sets/allData-80vol-High.json", function(json) {
      setColor(json);
    });*/
  }
}

//Colors the GeoJSON grids on the google map
function setColor(objJson) {
  console.log(document.map.controls[google.maps.ControlPosition.TOP_LEFT]);
  console.log(document.regionalmap.controls[google.maps.ControlPosition.TOP_LEFT]);
  
  //Reset frequency count to 0
  for (var i = 0; i < 6; i++) {
	  frequency[i] = 0;
  }
  
  //For each grid in the GeoJSON, decide which color to make it based on its value for the current map
  //Increment frequency as well
  document.regionalmap.data.forEach(function(feature){
    var loc = feature.getProperty('Id');
    var tempJSON;
    //console.log(resultsval);
      if(resultsval == 0){
		    freqChoice = 2;
		    if(drop == 0){
          tempJSON = objJson[loc].annualIrrigationDepthSupplied;
        }
        else {
          tempJSON = objJson[loc].allYears[drop-1981].annualIrrigationDepthSupplied;
        }
		    //AnnualIrrigationDepthSupplied
        if(parseInt(tempJSON) == 0){
          document.regionalmap.data.overrideStyle(feature, {
            fillColor: '#616161',
            fillOpacity: 0.25
          });
		  
		  frequency[0] += 1;
        }
        else if(parseInt(tempJSON) < 50){
          document.regionalmap.data.overrideStyle(feature, {
            fillColor: '#A6611A',
            fillOpacity: 0.4
          });
		  
		  frequency[1] += 1;
        }
		else if(parseInt(tempJSON) < 100){
          document.regionalmap.data.overrideStyle(feature, {
            fillColor: '#DFC27D',
            fillOpacity: 0.4
          });
		  
		  frequency[2] += 1;
        }
		else if(parseInt(tempJSON) < 150){
          document.regionalmap.data.overrideStyle(feature, {
            fillColor: '#F5F5F5',
            fillOpacity: 0.4
          });
		  
		  frequency[3] += 1;
        }
        else if(parseInt(tempJSON) < 200){
          document.regionalmap.data.overrideStyle(feature, {
            fillColor: '#80CDC1',
            fillOpacity: 0.4
          });
		  
		  frequency[4] += 1;
        }
        else{
          document.regionalmap.data.overrideStyle(feature, {
            fillColor: '#018571',
            fillOpacity: 0.4
          });
		  
		  frequency[5] += 1;
        }
      }
	  
	  //PercentAnnualCapturedDrainFlow
      else if (resultsval == 1){
		  
		    freqChoice = 0;
        if(drop == 0){
          tempJSON = objJson[loc].percentAnnualCapturedDrainflow;
        }
        else {
          tempJSON = objJson[loc].allYears[drop-1981].percentAnnualCapturedDrainflow;
        }

        
        if(parseInt(tempJSON) == 0) {
          document.regionalmap.data.overrideStyle(feature, {
            fillColor: '#616161',
            fillOpacity: 0.4
          });
		  
		  frequency[0] += 1;
        }
        else if(parseInt(tempJSON) < 12.5) {
          document.regionalmap.data.overrideStyle(feature, {
            fillColor: '#D7191C',
            fillOpacity: 0.4
          });
		  
		  frequency[1] += 1;
        }
        else if(parseInt(tempJSON) < 25) {
          document.regionalmap.data.overrideStyle(feature, {
            fillColor: '#FDAE61',
            fillOpacity: 0.4
          });
		  
		  frequency[2] += 1;
        }
        else if(parseInt(tempJSON) < 37.5) {
          document.regionalmap.data.overrideStyle(feature, {
            fillColor: '#FFFFBF',
            fillOpacity: 0.4
          });
		  
		  frequency[3] += 1;
        }
        else if(parseInt(tempJSON) < 50) {
          document.regionalmap.data.overrideStyle(feature, {
            fillColor: '#ABD9E9',
            fillOpacity: 0.4
          });
		  
		  frequency[4] += 1;
        }
        else {
          document.regionalmap.data.overrideStyle(feature, {
            fillColor: '2C7BBB',
            fillOpacity: 0.4
          });
		  
		  frequency[5] += 1;
        }
      } 
	  
	  //CumulativeCapturedFlow
	  else if (resultsval == 3) {
		  
		  freqChoice = 1;
      if(drop == 0){
          tempJSON = objJson[loc].capturedFlow;
        }
        else {
          tempJSON = objJson[loc].allYears[drop-1981].capturedFlow;
        }
		if(parseInt(tempJSON) == 0) {
			  document.regionalmap.data.overrideStyle(feature, {
				fillColor: '#616161',
				fillOpacity: 0.4
			  });
			  
			  frequency[0] += 1;
		}
		else if(parseInt(tempJSON) < 30) {
			  document.regionalmap.data.overrideStyle(feature, {
				fillColor: '#D7191C',
				fillOpacity: 0.4
			  });
			  
			  frequency[1] += 1;
		}
		else if(parseInt(tempJSON) < 60) {
			  document.regionalmap.data.overrideStyle(feature, {
				fillColor: '#FDAE61',
				fillOpacity: 0.4
			  });
			  
			  frequency[2] += 1;
			}
		else if(parseInt(tempJSON) < 90) {
			  document.regionalmap.data.overrideStyle(feature, {
				fillColor: '#FFFFBF',
				fillOpacity: 0.4
			  });
			  
			  frequency[3] += 1;
			}
		else if(parseInt(tempJSON) < 120) {
			  document.regionalmap.data.overrideStyle(feature, {
				fillColor: '#ABD9E9',
				fillOpacity: 0.4
			  });
			  
			  frequency[4] += 1;
			}
		else  {
		  console.log(tempJSON);
			  document.regionalmap.data.overrideStyle(feature, {
				fillColor: '#2C7BBB',
				fillOpacity: 0.4
			  });
			  
			  frequency[5] += 1;
			}

		  }
		  
		  //irrigationSufficiency
		  else {
			  freqChoice = 3;
        if(drop == 0){
          tempJSON = objJson[loc].irrigationSufficiency;
        }
        else {
          tempJSON = objJson[loc].allYears[drop-1981].irrigationSufficiency;
        }
			  
			if(parseInt(tempJSON) == 0) {
			  document.regionalmap.data.overrideStyle(feature, {
				fillColor: '#616161',
				fillOpacity: 0.4
			  });
			  
			  frequency[0] += 1;
			}
			
			else if(parseInt(tempJSON) < 7.5) {
			  document.regionalmap.data.overrideStyle(feature, {
				fillColor: '#A6611A',
				fillOpacity: 0.4
			  });
			  
			  frequency[1] += 1;
			}
			
			else if(parseInt(tempJSON) < 15) {
			  document.regionalmap.data.overrideStyle(feature, {
				fillColor: '#DFC27D',
				fillOpacity: 0.4
			  });
			  
			  frequency[2] += 1;
			}
			
			else if(parseInt(tempJSON) < 22.5) {
			  document.regionalmap.data.overrideStyle(feature, {
				fillColor: '#F5F5F5',
				fillOpacity: 0.4
			  });
			  
			  frequency[3] += 1;
			}
			
			else if(parseInt(tempJSON) < 30) {
			  document.regionalmap.data.overrideStyle(feature, {
				fillColor: '#80CDC1',
				fillOpacity: 0.4
			  });
			  
			  frequency[4] += 1;
			}
			
			else {
			  document.regionalmap.data.overrideStyle(feature, {
				fillColor: '#018571',
				fillOpacity: 0.4
			  });
			  
			  frequency[5] += 1;
			}
		  }
	  
    });
	//Initialize the histogram/bar chart
	initHistogram();
  $('#histogram1-body').fadeIn('slow',function() {
    $('#histogram-buffer1').fadeOut('fast');
  });
  $('#map-buffer2').fadeOut('fast');
  document.comparemap.data.toGeoJson(function(data) {
      data.features[0].properties.styleUrl = '#transRedPoly';
      data.features[0].properties.fill = '#018571';
      data.features[0].properties.fillOpacity = '0.4'
      console.log(data.features[0].properties);
      regKML = tokml(data);
  });
}

