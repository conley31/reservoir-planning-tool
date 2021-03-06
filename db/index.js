/*jshint esversion: 6 */
var mysql = require('mysql');
var nconf = require('nconf');

// Set up config file
nconf.file({
  file: './config/config.json'
});
if (!Object.keys(nconf.get()).length) {
  throw new Error('Unable to load config file. Check to make sure config/config.json exists');
}
// Create a MySQL connection pool
var pool = mysql.createPool(nconf.get('mysql'));

/*
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
exports.getLocationById = Id => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
      } else if (!Number.isInteger(Id)) {
        reject(new Error('Location Id must be a number'));
      } else {
        connection.query('SELECT * FROM ?? WHERE YEAR(RecordedDate) > 1980 AND YEAR(RecordedDate) < 2010 Order BY RecordedDate', 'Location' + Id, function(error, results, fields) {
          connection.release();
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      }
    });
  });
};

/*
 *  getPETById -  Gets a Location's evaporation data given a location id
 *
 *  Return - Array of Rows -
 *  [{
 *    RecordedDate: 1980-10-05T04:00:00.000Z,
 *    PET: 4.5055
 *  }]
 *
 */
exports.getPETById = Id => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
      } else if (!Number.isInteger(Id)) {
        reject(new Error('Location Id must be a number'));
      } else {
        connection.query('SELECT RecordedDate, PET FROM ?? WHERE YEAR(RecordedDate) > 1980 AND YEAR(RecordedDate) < 2010 Order BY RecordedDate', 'Location' + Id, function(error, results, fields) {
          connection.release();
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      }
    });
  });
};

/*
 *  getLocationForDateRange -  Gets a Location's data given a location id and a date range
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
exports.getLocationForDateRange = (Id, startDate, endDate) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
      } else if (!Number.isInteger(Id) || isNaN(Date.parse(startDate)) || isNaN(Date.parse(endDate))) {
        reject(new Error('Type Error: Expected Types are Int, Date as Str, Date as Str'));
      } else {
        connection.query('SELECT * FROM ?? WHERE RecordedDate >= ? AND RecordedDate <= ? Order BY RecordedDate', ['Location' + Id, startDate, endDate], function(error, results, fields) {
          connection.release();
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      }
    });
  });
};

// Returns the current MySQL pool
exports.getPool = () => {
  return pool;
};

// Close the pool connection with the database, with an optional callback
exports.close = cb => {
  pool.end(function(err) {
    console.log('Database pool ended');
    if (err) throw err;
    if (cb) cb();
  });
};
