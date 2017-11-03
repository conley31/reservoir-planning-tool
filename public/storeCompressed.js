var compareMapData, lowlow, lowmed, lowhigh, medlow, medmed, medhigh, highlow, highmed, highhigh;
var preDownload = function() {
  downloadJSON(9, "/data_sets/comparison-map-data.json.zip");
	downloadJSON(0, "/data_sets/allData-16vol-Low-Test.json.zip").then(function(response){
		console.log(response);
	}, function(error){
		console.log(error);
	});
}

var downloadJSON = function(source) {
  console.log("printing");
  var request = new XMLHttpRequest();
    request.responseType = "blob";
    request.onload = handleFile;
    request.open("GET", source);
    var place = 0;

    request.send();

    function handleFile(data) {
      //console.log(this.response);
      //console.log(blob);
      zip.workerScriptsPath = '/zip/';
    zip.createReader(new zip.BlobReader(this.response), function(reader) {
      // get all entries from the zip
      //console.log("in reader");
      reader.getEntries(function(entries) {
        //console.log(entries.length);
      if (entries.length) {
        //console.log("getting entries")
       // get first entry content as text
          entries[0].getData(new zip.TextWriter(), function(text) {
           // text contains the entry data as a String
            //console.log(text);
            //compareMapData = JSON.parse(text);
            //console.log(text.length);
            if(text != null){
            	console.log("notNULL");
            }
            if(source == "/data_sets/comparison-map-data.zip"){
              setColorComp(JSON.parse(text));
            }
            else {
              setColor(JSON.parse(text));
            }

            //setColorComp(temp);

            // close the zip reader
            reader.close(function() {
            // onclose callback
          });

        }, function(current, total) {
            // onprogress callback
              //console.log("current: " + current);
              //console.log("total: " + total);
        });
      }
      });
          console.log("done");

    }, function(error) {
      // onerror callback
        console.log("error: " + error);
    });
    }
    console.log("returning");
}