/*jshint esversion: 6 */
// Constants and imports
const PORT = process.env.PORT || 8080;
// Package Imports
var express = require('express'),
  bodyParser = require('body-parser'),
  formidable = require('formidable'),
  util = require('util'),
  fs = require('fs'),
  nconf = require('nconf'),
  morgan = require('morgan'),
  csv = require('fast-csv'),
  session = require('express-session');

var db = require('./db');
var TDPAlg = require('./util/TDPAlg.js');
var polygons = require('./util/polygons');
var app = express();

// Set up config file using nconf library
nconf.file({
  file: "./config/config.json"
});

/*
 * Express Middleware and Server Configuration
 */
app.use(morgan('combined')); // Enable logging
app.use(express.static(__dirname + '/public')); // Serve static files from the public directory
app.use(bodyParser.json()); // Decode JSON from request bodies
// Options for urlencoded requests
app.use(bodyParser.urlencoded({
  extended: false,
  limit: '5mb'
}));
app.set('view engine', 'ejs'); // Use ejs to render templates
if (app.get('env') === 'production') {
  app.set('trust proxy', 1); // session package - trust first proxy if on production system
}
// express-session library initialization options
app.use(session({
  secret: 'keyboard cat', // TODO: Make a config option and add to config file
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, // TODO: Change when HTTPS is setup
    expires: false // Only remains when the
  }
}));
// Initialize Daily data in session store
app.use(function(req, res, next) {
  if (!req.session.dailyData) {
    req.session.dailyData = null;
  }
  next();
});

/*
 * Routes
 */
// GET the home page
app.get('/', function(req, res) {
  req.session.dailyData = null; // Reset daily data each time the page loads
  res.render("index.ejs", {
    googleMapsKey: nconf.get("google_maps").key
  });
});

// AJAX Request To run the Algorithm (see util/TDPAlg.js)
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
      TDPAlg.calc(_.drainedArea, _.pondVolSmallest, _.pondVolLargest, _.pondVolIncrement, _.pondDepth, _.pondWaterDepthInitial, _.maxSoilMoistureDepth,
        _.irrigatedArea, _.irrigDepth, _.availableWaterCapacity, _.locationId, stream).then(function(data) {
        req.session.dailyData = data.dailyData; 
        res.send(data);
      });

    });

});

// AJAX Request to search locations (see util/polygons.js)
app.post('/locations', (req, res) => {
  var location = polygons.getLocation(req.body);
  if (!location) {
    res.sendStatus(404);
  }
  res.json(location);
});

// Download the daily data
app.get('/download', (req, res) => {
  var pondVol = req.query.pondVol;
  // If the daily data isn't there, return 404 NOT FOUND
  if (req.session.dailyData === null || typeof(req.session.dailyData[pondVol]) === "undefined") {
    // console.log(req.session.dailyData);
    res.sendStatus(404);
    return;
  }
  // Tell the browser to download the file
  res.attachment('download.csv'); // Content-Disposition: attachment
  // Creates the CSV and writes it to the output stream
  csv
    .writeToStream(res, req.session.dailyData[pondVol], {
      headers: true,
    });
});

/*
 * End Routes
 */

// Handle Errors
app.get('*', (req, res) => {
  res.sendStatus(404);
});

// Start the server
var server = app.listen(PORT, function() {
  console.log('Running Server on Port: ', PORT);
});

// Gracefully handle exits by closing the database pool
var exitHandler = function() {
  db.close(process.exit);

  setTimeout(function() {
    console.error("Could not close connections in time, forcefully shutting down");
    process.exit(1);
  }, 30 * 1000);

};

process.on('SIGINT', exitHandler);
process.on('SIGTERM', exitHandler);
