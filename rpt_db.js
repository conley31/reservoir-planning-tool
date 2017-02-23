var mysql = require('mysql');
var nconf = require('nconf');

nconf.file({ file: "./config/config.json"});

var connection = mysql.createConnection(nconf.get('mysql'));

connection.connect();

var getLocationById = function(Id) {
  if (!Number.isInteger(Id)) {
    return null;
  }

  connection.query('SELECT * FROM ??', 'Location' + Id,  function(error, results, fields) {
    if (error) throw error;
    console.log(results);
  });

};

// getLocationById(1);

module.exports = getLocationById;
