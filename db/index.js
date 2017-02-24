var mysql = require('mysql');
var nconf = require('nconf');

// Set up config file
nconf.file({
  file: "./config/config.json"
});

var connection = mysql.createConnection(nconf.get('mysql'));
connection.connect();

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

//
/**
 *  getLocationById -  Gets a Location's data given a location id and a date range
 *  Dates are expected as string in format YYYY-MM-DD
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
exports.getLocationForDateRange = function(Id, startDate, endDate) {
  return new Promise(function(resolve, reject) {
    if(!Number.isInteger(Id) || isNaN(Date.parse(startDate)) || isNaN(Date.parse(endDate))) {
      reject(new Error('Type Error: Expected Types are Int, Date as Str, Date as Str'));
    }
    connection.query('SELECT * FROM ?? WHERE RecordedDate >= ? AND RecordedDate <= ?', ['Location' + Id, startDate, endDate], function(error, results, fields) {
      if (error) {
        reject(error);
      }
      resolve(results);
    });
  });
};
