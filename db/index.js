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

exports.getPETById = function(Id) {
  return new Promise(function(resolve, reject) {
    if (!Number.isInteger(Id)) {
      reject(new Error('Location Id must be a number'));
    }
    connection.query('SELECT PET FROM ??', 'Location' + Id, function(error, results, fields) {
      if (error) {
        reject(error);
      }
      resolve(results);
    });
  });
};
