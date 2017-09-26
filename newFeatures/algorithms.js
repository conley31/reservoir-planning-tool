/*jshint esversion: 6*/

var db = require('../db');
var gettables = require('./iterate-database');


function cellData() {
     this.locationID = 0;
     this.cumulativeIrrigationVolume = 0;   //this member is not entirely necessary for the final product and can be replaced by a local variable
     this.cumulativeCapturedFlow = 0;       //this member is not entirely necessary for the final product and can be replaced by a local variable
     this.cumulativeDrainflow = 0;          //this member is not entirely necessary for the final product and can be replaced by a local variable
     this.annualIrrigationDepthSupplied = 0;
     this.percentAnnualCapturedDrainFlow = 0;
}
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

exports.calcAllLocations = function(drainedArea, pondDepth, irrigationDepth, pondVol, soilMoisture, waterCapacity){
    if (drainedArea <= 0) {
	console.log("ILLEGAL VALUE drainedArea: " + drainedArea);
    }
    if (pondDepth <= 0) {
	console.log("ILLEGAL VALUE pondDepth: " + pondDepth);
    } 
    if (irrigationDepth <= 0) {
	console.log("ILLEGAL VALUE irrigationDepth: " + irrigationDepth);
    }
    if (pondVol <= 0) {
	console.log("ILLEGAL VALUE pondVol: " + pondVol);
    }
    if (soilMoisture <= 0) {
	console.log("ILLEGAL VALUE soilMoisture: " + soilMoisture);
    }
    if (waterCapacity <= 0) {
	console.log("ILLEGAL VALUE waterCapacity: " + waterCapacity);
    }
    var tableCount = gettables.getNumberOfTables();

    var allCells = [];

    for (var i = 0; i < tableCount; i++) {
        var locationId = ('Location' + i);
        db.getLocationById(locationId).then(function(data){
            
             var cell = new cellData();     //create new cell to be inserted into the array. Each cell represents one location(grid cell).
             cell.locationID = locationId;
                for(var j = 0; j < data.length; j++){
                    cell.cumulativeIrrigationVolume += (irrigationDepth / 12 * drainedArea);

                    cell.cumulativeCapturedFlow += (data[j].Drainflow / 12 * drainedArea);
                    cell.cumulativeDrainflow += (data[j].Drainflow);
                }
             cell.annualIrrigationDepthSupplied = (cell.cumulativeIrrigationVolume * .15);
             cell.percentAnnualCapturedDrainflow = (cell.cumulativeCapturedFlow / cell.cumulativeDrainflow);
             allCells[i] = cell;
        }
        
    }
    return allCells;
}
