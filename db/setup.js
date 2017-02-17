var mysql = require('mysql');
var CSV = require('fast-csv');
var nestedCSV = require('fast-csv');
var fs = require('fs');
var nested_fs = require('fs');
var async = require('async');

var stream = fs.createReadStream("index.csv");

async.waterfall([
  function(callback) {
    CSV
    .fromStream(stream, {headers : ["FID", "ID", "Latitude", "Longitude", "TextFile", "URL"]})
      .on("data", function(data){
        console.log(data["ID"] + ":" +  data["TextFile"]);
        callback(null, "daily_files/" + data["TextFile"]);
      });
  },
  function(data, callback) {
    var nestedStream = nested_fs.createReadStream("daily_files/" + data["TextFile"]);
    nestedCSV
        .fromStream(nestedStream, {headers : ["year", "month", "day", "drainflow", "precipitation", "PET"]})
          .on("data", function(nested_data){
            console.log(nested_data["year"] + ":" +  nested_data["month"] + ":" + nested_data["day"] + ":" + nested_data["PET"]);
          })
          .on("end", function(){
            console.log("done");
      });
  }])


var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'PxrhjGtvWwC4^X%Z',
  database: 'TDP'
})

connection.connect(function(err) {
  if (err) throw err
  console.log('You are now connected...')
})