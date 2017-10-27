var results2val = -1;
var dropdownval = -1;
var compareKML;
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

    setColorComp(compareMapData);
   /*$.get("/data_sets/comparison-map-data.json.zip", function(data) {

   		//var testing = new File("/data_sets/comparison-map-data.json.zip")
   		
   })*/

}

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
  var temp;
  var done = document.comparemap.data.toGeoJson(function(data) {
    temp = data;
  });

 	document.comparemap.data.forEach(function(feature){
    	var loc = feature.getProperty('Id');

    	if(results2val == 0){
			if(parseInt(objJson[loc].yearArray[dropdownval-1981].drainflow) < 10){
              temp.features[loc].properties.fill = "#DDE500";
              document.comparemap.data.overrideStyle(feature, {
            	fillColor: '#DDE500',
            	fillOpacity: 0.4
          		});
        	}
        	else if(parseInt(objJson[loc].yearArray[dropdownval-1981].drainflow) < 20){
          		temp.features[loc].properties.fill = "#00CEAB";
              document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#00CEAB',
            		fillOpacity: 0.4
          		});
          	}
          	else if(parseInt(objJson[loc].yearArray[dropdownval-1981].drainflow) < 30){
          		temp.features[loc].properties.fill = "#0070C6";
              document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#0070C6',
            		fillOpacity: 0.4
          		});
          	}
          	else if(parseInt(objJson[loc].yearArray[dropdownval-1981].drainflow) < 40){
          		temp.features[loc].properties.fill = "#0500BF";
              document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#0500BF',
            		fillOpacity: 0.4
          		});
          	}
          	else{
              temp.features[loc].properties.fill = "#D50023";
          		document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#D50023',
            		fillOpacity: 0.4
          		});
        	}
		}
		else if(results2val == 1){
			if(parseInt(objJson[loc].yearArray[dropdownval-1981].surfacerunoff) < 10){
          		temp.features[loc].properties.fill = "#DDE500";
              document.comparemap.data.overrideStyle(feature, {
            	fillColor: '#DDE500',
            	fillOpacity: 0.4
          		});
        	}
        	else if(parseInt(objJson[loc].yearArray[dropdownval-1981].surfacerunoff) < 20){
          		temp.features[loc].properties.fill = "#00CEAB";
              document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#00CEAB',
            		fillOpacity: 0.4
          		});
          	}
          	else if(parseInt(objJson[loc].yearArray[dropdownval-1981].surfacerunoff) < 30){
          		temp.features[loc].properties.fill = "#0070C6";
              document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#0070C6',
            		fillOpacity: 0.4
          		});
          	}
          	else if(parseInt(objJson[loc].yearArray[dropdownval-1981].surfacerunoff) < 40){
          		temp.features[loc].properties.fill = "#0500BF";
              document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#0500BF',
            		fillOpacity: 0.4
          		});
          	}
          	else{
              temp.features[loc].properties.fill = "#D50023";
          		document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#D50023',
            		fillOpacity: 0.4
          		});
        	}
		}
		else if (results2val == 2){
			prop = "precipitation";
			if(parseInt(objJson[loc].yearArray[dropdownval-1981].precipitation) < 10){
          		temp.features[loc].properties.fill = "#DDE500";
              document.comparemap.data.overrideStyle(feature, {
            	fillColor: '#DDE500',
            	fillOpacity: 0.4
          		});
        	}
        	else if(parseInt(objJson[loc].yearArray[dropdownval-1981].precipitation) < 20){
          		temp.features[loc].properties.fill = "#00CEAB";
              document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#00CEAB',
            		fillOpacity: 0.4
          		});
          	}
          	else if(parseInt(objJson[loc].yearArray[dropdownval-1981].precipitation) < 30){
          		temp.features[loc].properties.fill = "#0070C6";
              document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#0070C6',
            		fillOpacity: 0.4
          		});
          	}
          	else if(parseInt(objJson[loc].yearArray[dropdownval-1981].precipitation) < 40){
          		temp.features[loc].properties.fill = "#0500BF";
              document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#0500BF',
            		fillOpacity: 0.4
          		});
          	}
          	else{
          		temp.features[loc].properties.fill = "#D50023";
              document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#D50023',
            		fillOpacity: 0.4
          		});
        	}
		}
		else if(results2val == 3){
			prop = "pet";
			if(parseInt(objJson[loc].yearArray[dropdownval-1981].pet) < 10){
          		temp.features[loc].properties.fill = "#DDE500";
              document.comparemap.data.overrideStyle(feature, {
            	fillColor: '#DDE500',
            	fillOpacity: 0.4
          		});
        	}
        	else if(parseInt(objJson[loc].yearArray[dropdownval-1981].pet) < 20){
          		temp.features[loc].properties.fill = "#00CEAB";
              document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#00CEAB',
            		fillOpacity: 0.4
          		});
          	}
          	else if(parseInt(objJson[loc].yearArray[dropdownval-1981].pet) < 30){
          		temp.features[loc].properties.fill = "#0070C6";
              document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#0070C6',
            		fillOpacity: 0.4
          		});
          	}
          	else if(parseInt(objJson[loc].yearArray[dropdownval-1981].pet) < 40){
          		temp.features[loc].properties.fill = "#0500BF";
              document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#0500BF',
            		fillOpacity: 0.4
          		});
          	}
          	else{
          		temp.features[loc].properties.fill = "#D50023";
              document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#D50023',
            		fillOpacity: 0.4
          		});
        	}
		}
		else if(results2val == 4){
			prop = "dea_pet";
			if(parseInt(objJson[loc].yearArray[dropdownval-1981].dea_pet) < 10){
          		temp.features[loc].properties.fill = "#DDE500";
              document.comparemap.data.overrideStyle(feature, {
            	fillColor: '#DDE500',
            	fillOpacity: 0.4
          		});
        	}
        	else if(parseInt(objJson[loc].yearArray[dropdownval-1981].dea_pet) < 20){
          		temp.features[loc].properties.fill = "#00CEAB";
              document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#00CEAB',
            		fillOpacity: 0.4
          		});
          	}
          	else if(parseInt(objJson[loc].yearArray[dropdownval-1981].dea_pet) < 30){
          		temp.features[loc].properties.fill = "#0070C6";
              document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#0070C6',
            		fillOpacity: 0.4
          		});
          	}
          	else if(parseInt(objJson[loc].yearArray[dropdownval-1981].dea_pet) < 40){
          		temp.features[loc].properties.fill = "#0500BF";
              document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#0500BF',
            		fillOpacity: 0.4
          		});
          	}
          	else{
              temp.features[loc].properties.fill = "#D50023";
          		document.comparemap.data.overrideStyle(feature, {
            		fillColor: '#D50023',
            		fillOpacity: 0.4
          		});
        	}
		}
    });
    compareKML = temp;
    console.log("finished coloring");
    
}
