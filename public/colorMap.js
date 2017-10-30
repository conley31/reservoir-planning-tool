
var pondval = -1;
var waterval = -1;
var resultsval = -1;

var getFile = function() {
  if(pondval == 0 || waterval == 0){
    downloadFile("/data_sets/allData-16Vol-Low.json")
  }
  else if(pondval == 1 || waterval == 0){
    downloadFile("/data_sets/allData-48Vol-Low.json")
  }
  else if(pondval == 2 || waterval == 0){
	downloadFile("/data_sets/allData-80Vol-Low.json")
  }
  else if(pondval == 0 || waterval == 1){
	downloadFile("/data_sets/allData-16Vol-Medium.json")
  }
  else if(pondval == 0 || waterval == 2){
	downloadFile("/data_sets/allData-16Vol-High.json")
  }
  else if(pondval == 1 || waterval == 1){
	downloadFile("/data_sets/allData-48Vol-Medium.json")
  }
  else if(pondval == 1 || waterval == 2){
	downloadFile("/data_sets/allData-48Vol-High.json")
  }
  else if(pondval == 2 || waterval == 1){
	downloadFile("/data_sets/allData-80Vol-Medium.json")
  }
  else if(pondval == 2 || waterval == 2){
	downloadFile("/data_sets/allData-80Vol-High.json")
  }
}

var colorMap = function(addVariable) {
  if (addVariable.hasClass('on')) {
    return;
  }

  var pondsize = document.getElementsByName("pond-size");
  var water = document.getElementsByName("water");
  var results = document.getElementsByName("results");

  

  var contain = -1; //0 for pondsize 1 for water 2 for results

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

  if(resultsval == 0) {
    var legend_annual = document.getElementById('legend-annual');
    document.regionalmap.controls[google.maps.ControlPosition.TOP_LEFT].push(legend_annual);
    $('#legend-percentage').fadeOut('fast');
    $('#legend-captured').fadeOut('fast');
    $('#legend-annual').fadeIn('fast');
    
  }

  if(resultsval == 1) {
    var legend_percentage = document.getElementById('legend-percentage');
    document.regionalmap.controls[google.maps.ControlPosition.TOP_LEFT].push(legend_percentage);
    $('#legend-annual').fadeOut('fast');
    $('#legend-captured').fadeOut('fast');
    $('#legend-percentage').fadeIn('fast');
    

    /*try{
      document.regionalmap.controls[google.maps.ControlPosition.CENTER_RIGHT].push(legend);
    }
    catch(e){
      alert(e.name + "\n" + e.message)
    }*/
  }

  if (resultsval == 2) {
    var legend_captured = document.getElementById('legend-captured');
    document.regionalmap.controls[google.maps.ControlPosition.TOP_LEFT].push(legend_captured);
    $('#legend-annual').fadeOut('fast');
    $('#legend-percentage').fadeOut('fast');
    $('#legend-captured').fadeIn('fast');
  }

  if(pondval == 0 || waterval == 0){
    $.getJSON("/data_sets/allData-16vol-Low.json", function(json) {
      setColor(json);
    });
  }
  else if(pondval == 1 || waterval == 0){
    $.getJSON("/data_sets/allData-48vol-Low.json", function(json) {
      setColor(json);
    });
  }
  else if(pondval == 2 || waterval == 0){
    $.getJSON("/data_sets/allData-80vol-Low.json", function(json) {
      setColor(json);
    });
  }
  else if(pondval == 0 || waterval == 1){
    $.getJSON("/data_sets/allData-16vol-Medium.json", function(json) {
      setColor(json);
    });
  }
  else if(pondval == 0 || waterval == 2){
    $.getJSON("/data_sets/allData-16vol-High.json", function(json) {
      setColor(json);
    });
  }
  else if(pondval == 1 || waterval == 1){
    $.getJSON("/data_sets/allData-48vol-Medium.json", function(json) {
      setColor(json);
    });
  }
  else if(pondval == 1 || waterval == 2){
    $.getJSON("/data_sets/allData-48vol-High.json", function(json) {
      setColor(json);
    });
  }
  else if(pondval == 2 || waterval == 1){
    $.getJSON("/data_sets/allData-80vol-Medium.json", function(json) {
      setColor(json);
    });
  }
  else if(pondval == 2 || waterval == 2){
    $.getJSON("/data_sets/allData-80vol-High.json", function(json) {
      setColor(json);
    });
  }
}

function setColor(objJson) {
  console.log(document.map.controls[google.maps.ControlPosition.TOP_LEFT]);
  console.log(document.regionalmap.controls[google.maps.ControlPosition.TOP_LEFT]);
  document.regionalmap.data.forEach(function(feature){
    var loc = feature.getProperty('Id');
    //console.log(resultsval);
      if(resultsval == 0){
        if(parseInt(objJson[loc].annualIrrigationDepthSupplied) < 150){
          document.regionalmap.data.overrideStyle(feature, {
            fillColor: '#DDE500',
            fillOpacity: 0.4
          });
        }
        else if(parseInt(objJson[loc].annualIrrigationDepthSupplied) < 500){
          document.regionalmap.data.overrideStyle(feature, {
            fillColor: '#0ED900',
            fillOpacity: 0.4
          });
        }else if(parseInt(objJson[loc].annualIrrigationDepthSupplied) < 850){
          document.regionalmap.data.overrideStyle(feature, {
            fillColor: '#00CEAB',
            fillOpacity: 0.4
          });
        }else if(parseInt(objJson[loc].annualIrrigationDepthSupplied) < 1200){
          document.regionalmap.data.overrideStyle(feature, {
            fillColor: '#0070C6',
            fillOpacity: 0.4
          });
        }
        else if(parseInt(objJson[loc].annualIrrigationDepthSupplied) < 1550){
          document.regionalmap.data.overrideStyle(feature, {
            fillColor: '#0500BF',
            fillOpacity: 0.4
          });
        }
        else{
          document.regionalmap.data.overrideStyle(feature, {
            fillColor: '#D50023',
            fillOpacity: 0.4
          });
        }
      }
      else if (resultsval == 1){
        
        if(parseInt(objJson[loc].percentAnnualCapturedDrainFlow) < 15) {
          document.regionalmap.data.overrideStyle(feature, {
            fillColor: '#DDE500',
            fillOpacity: 0.4
          });
        }
        else if(parseInt(objJson[loc].percentAnnualCapturedDrainFlow) < 25) {
          document.regionalmap.data.overrideStyle(feature, {
            fillColor: '#0ED900',
            fillOpacity: 0.4
          });
        }
        else if(parseInt(objJson[loc].percentAnnualCapturedDrainFlow) < 35) {
          document.regionalmap.data.overrideStyle(feature, {
            fillColor: '#00CEAB',
            fillOpacity: 0.4
          });
        }
        else if(parseInt(objJson[loc].percentAnnualCapturedDrainFlow) < 45) {
          document.regionalmap.data.overrideStyle(feature, {
            fillColor: '#0070C6',
            fillOpacity: 0.4
          });
        }
        else if(parseInt(objJson[loc].percentAnnualCapturedDrainFlow) < 55) {
          document.regionalmap.data.overrideStyle(feature, {
            fillColor: '#0500BF',
            fillOpacity: 0.4
          });
        }
        else {
          console.log(objJson[loc].percentAnnualCapturedDrainFlow);
          document.regionalmap.data.overrideStyle(feature, {
            fillColor: '#D50023',
            fillOpacity: 0.4
          });
        }
      } else {
	if(parseInt(objJson[loc].cumulativeCapturedFlow) == 0) {
          document.regionalmap.data.overrideStyle(feature, {
            fillColor: '#616161',
            fillOpacity: 0.4
          });
	}
	else if(parseInt(objJson[loc].cumulativeCapturedFlow) < 3000) {
          document.regionalmap.data.overrideStyle(feature, {
            fillColor: '#EDF8FB',
            fillOpacity: 0.4
          });
	}
	else if(parseInt(objJson[loc].cumulativeCapturedFlow) < 6000) {
          document.regionalmap.data.overrideStyle(feature, {
            fillColor: '#B2E2E2',
            fillOpacity: 0.4
          });
        }
	else if(parseInt(objJson[loc].cumulativeCapturedFlow) < 9000) {
          document.regionalmap.data.overrideStyle(feature, {
            fillColor: '#66C2A4',
            fillOpacity: 0.4
          });
        }
	else if(parseInt(objJson[loc].cumulativeCapturedFlow) < 12000) {
          document.regionalmap.data.overrideStyle(feature, {
            fillColor: '#2CA25F',
            fillOpacity: 0.4
          });
        }
	else  {
	  console.log(objJson[loc].cumulativeCapturedFlow);
          document.regionalmap.data.overrideStyle(feature, {
            fillColor: '#006D2C',
            fillOpacity: 0.4
          });
        }

      }
    });
}

