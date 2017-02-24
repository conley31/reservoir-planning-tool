var mysql = require('mysql');
var nconf = require('nconf');

// Set up config file
nconf.file({
  file: "./config/config.json"
});

var connection = mysql.createConnection(nconf.get('mysql'));

exports.getLocationById = function(Id) {
  connection.connect();
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

//Dates are expected as string in format YYYY-MM-DD
exports.getLocationForDateRange = function(Id, startDate, endDate) {
  connection.connect();
  return new Promise(function(resolve, reject) {
    if(!Number.isInteger(Id) || NaN == Date.parse(startDate) || NaN == Date.parse(endDate)) {
      reject(new Error('Type Error: Expected Types are Int, Date as Str, Date as Str'));
    }
    connection.query('SELECT * FROM ?? WHERE RecordedDate >= \'?\' AND RecordedDate <= \'?\'', ['Location' + Id, startDate, endDate]function(error, results, fields) {
      if (error) {
        reject(error);
      }
      resolve(results);
    });
  });
};
