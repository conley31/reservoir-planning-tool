var results2val = -1;
var dropdownval = -1;

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
  console.log("getjson");

  $.getJSON("/data_sets/comparison-map-data.json", function(json) {
  	  console.log("waiting to print");
      console.log(json[0].yearArray[0]);
      setColorComp(json);
    });

  console.log("passed the get");

  /*if(pondval == 0 || waterval == 0){
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
  }*/

}

function setColorComp(objJson) {
	console.log("coloring");
 	document.regionalmap.data.forEach(function(feature){
    	var loc = feature.getProperty('Id');
    });
    console.log("finished coloring");
}
