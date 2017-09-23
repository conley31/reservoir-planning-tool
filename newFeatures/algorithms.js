/*jshint esversion: 6*/

var db = require('../db');
var gettables = require('./iterate-database');

/* Calculated data holds the algorithm's outputs */
function calculatedData(){
    /* TODO add needed vars to hold calculated values (supplied on Sprint 1 Map Goals.docx in slack) */

}

exports.calcAllLocations = function(){
    var tableCount = gettables.getNumberOfTables();
    for (var i = 0; i < tableCount; i++) {
        var locationId = ('Location' + i);
        db.getLocationById(locationId).then(function(data){
            /* 
             *  'data' is an array object that corresponds to a table (AKA Location) inside the mysql database
             *  'data' indices are days (example: data[3] corresponds to LocationX's data for the 4th recorded date.
             *  'data[<index>]' contains the following:
             *  +-----------------+--------+
             *  |  Field          | Type   | 
             *  +-----------------+--------+
             *  | RecordedDate    |date    |
             *  | Drainflow       |float   |
             *  | Precipitation   |float   |
             *  | PET             |float   |
             *  | SurfaceRunoff   |float   |
             *  | DAE_PET         |float   |
             *  +-----------------+--------+
             *
             * Example: data[2].Precipitation resolves to the third recorded date's precipitation
             *
             */
                
                for(var j = 0; j < data.length; j++){
                    
                }

            /*
             * TODO
             * add algorithms into the for loop above and store results in the calculatedData object
             *
             * Example:
             * myData = new calculatedData();
             * myData.annualDrainflow += data[j].Drainflow;
             *
             */


        }
        
    }
}
