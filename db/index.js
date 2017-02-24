var mysql = require('mysql');
var nconf = require('nconf');

// Set up config file
nconf.file({
  file: "./config/config.json"
});

var connection = mysql.createConnection(nconf.get('mysql'));

var getLocationById = function(Id) {
  connection.connect();
  return new Promise(function(resolve, reject) {
    if (!Number.isInteger(Id)) {
      reject(null);
    }
    connection.query('SELECT * FROM ??', 'Location' + Id, function(error, results, fields) {
      if (error) {
        reject(error);
      }
      resolve(results);
    });
  });
};

module.exports = getLocationById;
