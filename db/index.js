var mysql = require('mysql');
var nconf = require('nconf');

// Set up config file
nconf.file({
  file: "./config/config.json"
});

var connection = mysql.createConnection(nconf.get('mysql'));
connection.connect();

/**
 *  getLocationById -  Gets a Location's data given a location id
 *
 *  Return - Array of Rows -
 *  [{
 *    RecordedDate: 1980-10-05T04:00:00.000Z,
 *    Drainflow: 0,
 *    Precipitation: 0,
 *    PET: 4.5055
 *  }]
 *
 */
exports.getLocationById = function(Id) {
  return new Promise(function(resolve, reject) {
    if (!Number.isInteger(Id)) {
      reject(new Error('Location Id must be a number'));
    }
    connection.query('SELECT * FROM ??', 'Location' + Id, function(error, results, fields) {
      if (error) {
        reject(error);
      }
      resolve(results);
    });
  });
};

/**
 *  getLocationById -  Gets a Location's evaporation data given a location id
 *
 *  Return - Array of Rows -
 *  [{
 *    RecordedDate: 1980-10-05T04:00:00.000Z,
 *    PET: 4.5055
 *  }]
 *
 */
getPETById = function(Id) {
  return new Promise(function(resolve, reject) {
    if (!Number.isInteger(Id)) {
      reject(new Error('Location Id must be a number'));
    }
    connection.query('SELECT RecordedDate, PET FROM ??', 'Location' + Id, function(error, results, fields) {
      if (error) {
        reject(error);
      }
      resolve(results);
    });
  });
};
