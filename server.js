/*jshint esversion: 6 */
const PORT = process.env.PORT || 3000;
var express = require('express'),
  bodyParser = require('body-parser'),
  formidable = require('formidable'),
  util = require('util'),
  fs = require('fs');

var db = require('./db');
var TDPAlg = require('./TDPAlg.js');
var app = express();


app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended : false,
    limit: '5mb'
}));

app.get('/', function(req, res) {
  res.render("index.ejs");
});

app.post('/calculate', function(req, res) {

  var _ = [];
  var stream;
  var form = new formidable.IncomingForm().parse(req);
  form.uploadDir = "/tmp/";
  form
    .on('fileBegin', function(name, file) {
        file.path = '/tmp/' + file.name;
    })
    .on('file', function(name, file) {
        stream = fs.createReadStream('/tmp/' + file.name);
    })
    .on('field', function(name, field) {
        _[name] = Number(field);
    })
    .on('error', function(err) {
        next(err);
    })
    .on('end', function() {
      TDPAlg.calc(_.pondVolSmallest, _.pondVolLargest, _.pondVolIncrement, _.pondDepth, _.pondWaterDepthInitial, _.maxSoilMoistureDepth, _.irrigatedArea, _.irrigDepth, _.availableWaterCapacity, _.locationId, stream).then(function(data) {
      var graph_data = {
        "graph": [{
            "line": {
              "type": "number",
              "axis": "Pond Volume"
            }
          },
          {
            "line": {
              "type": "number",
              "axis": "Bypass Volume"
            }
          },
          {
            "line": {
              "type": "number",
              "axis": "Storage Deficit"
            }
          },
          {
            "array": data //return value from TDPAlg.js

            /* Example Format:
             [
                     [1, 37.8, 80.8],
                     [2, 30.9, 69.5],
                     [3, 25.4, 57],
                     [4, 11.7, 18.8],
                     [5, 11.9, 17.6],
                     [6, 8.8, 13.6],
                     [7, 7.6, 12.3],
                     [8, 12.3, 29.2],
                     [9, 16.9, 42.9],
                     [10, 12.8, 30.9],
                     [11, 5.3, 7.9],
                     [12, 6.6, 8.4],
                     [13, 4.8, 6.3],
                     [14, 4.2, 6.2]
                 ]
                 */
          }
        ]
      };

      res.json(graph_data);

      });
  });

});

app.get('*', (req, resp) => {
  resp.status(404).send('404 Page Not Found.');
});

var server = app.listen(PORT, function() {
  console.log('Running Server on Port: ', PORT);
});

var exitHandler = function() {
  db.close(process.exit);

  setTimeout(function() {
    console.error("Could not close connections in time, forcefully shutting down");
    process.exit(1);
  }, 30 * 1000);

};

process.on('SIGINT', exitHandler);
process.on('SIGTERM', exitHandler);
