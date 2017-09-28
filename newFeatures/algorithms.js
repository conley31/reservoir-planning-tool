/*jshint esversion: 6*/

var db = require('../db');
var gettables = require('./iterate-database');
var TDPAlg = require('../util/TDPAlg.js');


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
  var locationId;
  var allYears;
  var csvData = {};
  for (var i = 0; i < tableCount; i++) {
    locationId = ('Location' + i);
    var cell = new cellData();     //create new cell to be inserted into the array. Each cell represents one location(grid cell).
    csvData[i] = [];
    cell.locationID = locationId;

    TDPalg.calc(drainedArea, 0, pondVol, pondVol, pondDepth, soilMoisture, drainedArea, irrigationDepth, waterCapacity, locationId,void 0).then(function(data){
      allYears = data.graphData;   //graphData is the allYears array computed by TDPalg.calc
      for(var j = 0; j < allYears.length; j++){
        if(typeof allYears[j] !== 'undefined'){
          for(var k = 0; k < allYears[j].length; k++){
            if(typeof allYears[j][1][k] !== 'undefined'){   //using '1' because 0 is the empty pond
              cell.cumulativeIrrigationVolume += allYears[j][1][m].irrigationVol;
              cell.cumulativeCapturedFlow += allYears[j][1][m].capturedFlowVol;
             }
          }    
        }
      } 
    });
    db.getLocationById(i).then(function(temp){   
      for(var j = 0; j < temp.lenght; j++){
        cell.cumulativeDrainflow += temp.Drainflow;
      }
    });

    /* Perform Calculations */
    cell.annualIrrigationDepthSupplied = (cell.cumulativeIrrigationVolume * .15);
    cell.percentAnnualCapturedDrainflow = (cell.cumulativeCapturedFlow / cell.cumulativeDrainflow);
    allCells[i] = cell;

    //update CSV data
    csvData[i].push({
        "LocationID": cell.locationID,
        "Annual Irrigation Depth Supplied": cell.annualIrrigationDepthSupplied,
        "Percent Annual Captured Dranflow": cell.percentAnnualCaptuedDrainflow
    });
  }
    return{
        allCells: allCells,
        csvData: csvData
    };
}

