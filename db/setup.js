var mysql = require('mysql');
var CSV = require('fast-csv');
var nestedCSV = require('fast-csv');
var fs = require('fs');
var nested_fs = require('fs');


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

var createTable = "CREATE TABLE IF NOT EXISTS " 
var values = `(ID INT NOT NULL AUTO_INCREMENT,
  RecordDate DATE DEFAULT NULL,
  Drainflow FLOAT DEFAULT NULL,
  Precipitation FLOAT DEFAULT NULL,
  PET FLOAT DEFAULT NULL,
  PRIMARY KEY (ID)
)`

var TableData = [];

var stream = fs.createReadStream("index.csv");
CSV
	.fromStream(stream, {headers : ["FID", , , , "TextFile", ,]})
    .on("data", function(data){
      TableData.push([data["FID"], data["TextFile"]])
      //connection.query(createTable + "Location" + data["ID"] + " " + values);
      
    })
    .on("end", function(){
         while(TableData.length != 0) {
          var Table = TableData.pop();
          connection.query(createTable + "Location" + Table[0] + " " + values);
          var nestedStream = nested_fs.createReadStream("daily_files/" + Table[1]);
          nestedCSV
            .fromStream(nestedStream, {headers : ["year", "month", "day", "drainflow", "precipitation", "PET"]})
            .on("data", function(nested_data){
            var insertValues = { RecordDate: nested_data["year"] + "-" + nested_data["month"] + "-" + nested_data["day"],
                                Drainflow: nested_data["drainflow"],
                                Precipitation: nested_data["precipitation"],
                                PET: nested_data["PET"]};
            var query = connection.query('INSERT INTO Location' +  Table[0] + ' SET ?', insertValues)
          })
          .on("end", function(){
            
          });
         }
    });





