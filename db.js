var mysql = require('mysql');

// TODO: replace this with rconf
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'TDP'
});

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

module.exports = getLocationById;
