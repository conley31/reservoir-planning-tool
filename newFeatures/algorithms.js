/*jshint esversion: 6*/

var db = require('../db');
var gettables = require('./iterate-database');

/*
 * Constants used in the algorithms. 
 * Low, Medium, and High are 
 * DRAINED_AREA is in acres
 * DEPTH_FIRST_DAY is in feet
 * IRRIGATION INCREMENT is in inches
 * VOLUME is in acres
 * MOISTURE is in ??
 * WATER_CAPACITY is in ??
 *
 */
const DRAINED_AREA = 80;     
const DEPTH_FIRST_DAY = 10;
const IRRIGATION_INCREMENT = 1;

const LOW_VOLUME = 16; 
const MEDIUM_VOLUME = 48;
const HIGH_VOLUME = 80;          

const LOW_SOIL_MOISTURE = 7.6;
const MEDIUM_SOIL_MOISTURE =  12;
const HIGH_SOIL_MOISTURE = 15.6;

const LOW_WATER_CAPACITY = 4.2;
const MEDIUM_WATER_CAPACITY = 6.1;
const HIGH_WATER_CAPACITY = 10.2;

function cellData(loctionID) {
    this.locationID = locationID;
    this.cumulativeIrrigationVol = 0;
    this.AnnualIrrigation = 0;
    this.annualDrainflowCaptubypassFlowVolred = 0;

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
