
var pondval = -1;
var waterval = -1;
var resultsval = -1;

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
      pondval = parseInt($(pondsize[i]));
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
          resultsval = parseInt($(results).val());
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
  document.regionalmap.data.forEach(function(feature){
    var loc = feature.getProperty('Id');
      if(resultsval == 0){
        if(parseInt(objJson[loc].annualIrrigationDepthSupplied) < 100){
          document.regionalmap.data.overrideStyle(feature, {
            fillColor: 'red',
            fillOpacity: 0.2
          });
        }
        else if(parseInt(objJson[loc].annualIrrigationDepthSupplied) < 300){
          document.regionalmap.data.overrideStyle(feature, {
            fillColor: 'yellow',
            fillOpacity: 0.2
          });
        }
        else if(parseInt(objJson[loc].annualIrrigationDepthSupplied) < 500){
          document.regionalmap.data.overrideStyle(feature, {
            fillColor: 'green',
            fillOpacity: 0.2
          });
        }
        else{
          document.regionalmap.data.overrideStyle(feature, {
            fillColor: 'blue',
            fillOpacity: 0.2
          });
        }
      }
      else {
        if(parseInt(objJson[loc].percentAnnualCapturedDrainFlow) < 1) {
          document.regionalmap.data.overrideStyle(feature, {
            fillColor: 'red',
            fillOpacity: 0.2
          });
        }
        else if(parseInt(objJson[loc].percentAnnualCapturedDrainFlow) < 3) {
          document.regionalmap.data.overrideStyle(feature, {
            fillColor: 'yellow',
            fillOpacity: 0.2
          });
        }
        else if(parseInt(objJson[loc].percentAnnualCapturedDrainFlow) < 6) {
          document.regionalmap.data.overrideStyle(feature, {
            fillColor: 'green',
            fillOpacity: 0.2
          });
        }
        else {
          document.regionalmap.data.overrideStyle(feature, {
            fillColor: 'green',
            fillOpacity: 0.2
          });
        }
      }
    });
}

