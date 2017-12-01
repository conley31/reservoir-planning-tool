var compareMapData, lowlow, lowmed, lowhigh, medlow, medmed, medhigh, highlow, highmed, highhigh;
var preDownload = function() {
  downloadJSON(9, "/data_sets/comparison-map-data.json.zip");
	downloadJSON(0, "/data_sets/allData-16vol-Low-Test.json.zip").then(function(response){
	}, function(error){
		console.log(error);
	});
}

var downloadJSON = function(source) {
  var request = new XMLHttpRequest();
    request.responseType = "blob";
    request.onload = handleFile;
    request.open("GET", source);
    var place = 0;

    request.send();

    function handleFile(data) {
      zip.workerScriptsPath = '/zip/';
    zip.createReader(new zip.BlobReader(this.response), function(reader) {
      // get all entries from the zip
      reader.getEntries(function(entries) {
      if (entries.length) {
       // get first entry content as text
          entries[0].getData(new zip.TextWriter(), function(text) {
           // text contains the entry data as a String
            if(text != null){
            	//console.log("notNULL");
            }
            console.assert(text != null, {"message":"file is null"});
            if(whatMap == "compare"){
              setColorComp(JSON.parse(text));
            }
            else if(whatMap == "regional"){
              setColor(JSON.parse(text));
            }
            else if(whatMap == "rkml"){
              regKML = text;
            }
            else if(whatMap = "ckml"){
              compareKML = text;
            }

            //setColorComp(temp);

            // close the zip reader
            reader.close(function() {
            // onclose callback
          });

        }, function(current, total) {
            // onprogress callback
        });
      }
      });

    }, function(error) {
      // onerror callback
        console.log("error: " + error);
    });
    }
}