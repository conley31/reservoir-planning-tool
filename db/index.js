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
