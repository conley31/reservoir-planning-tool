/*jshint esversion: 6 */

//set up modules
var mysql = require('mysql');
var nconf = require('nconf');

//set up config file
nconf.file({
file: '../config/config.json'
});
if(!Object.keys(nconf.get()).length){
  throw new Error('Unable t load config file. Make sure config/config.json exists.');
}

//Create mysql connection pool
var pool = mysql.createPool(nconf.get('mysql'));

/*
 *
 * getNumberOfTables - Gets the number of tables in the database
 *
 * Return - Integer -
 *
 */

exports.getNumberOfTables = () => {
  return new Promise ((resolve, reject) => {
      pool.getConnection((err,connection) => {
          if (err){
          reject(err);
          } else {
          connection.query("SELECT count(*) AS tablesCount FROM information_schema.tables WHERE table_schema = 'TEMP'", function(error,results,fields){
              connection.release();
              if(error){
              reject(error);
              } else{
              resolve(results[0].tablesCount);

              }
              });
          }
          });
      });
};
