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

  var csvData = {};
  var calculationPromises = [];
  var drainPromises = [];

  return gettables.getNumberOfTables().then(function(iterations){

  for (var i = 0; i < iterations; i++) {
   calculationPromises[i] = TDPAlg.calc(drainedArea, 0, pondVol, pondVol, pondDepth, pondDepth, soilMoisture, drainedArea, irrigationDepth, waterCapacity, i,void 0);
   drainPromises[i] = calcDrainflow(i);
   }

   return Promise.all(drainPromises).then(function(drainData) {
	   return Promise.all(calculationPromises).then(function(data){
			var allCells = [];
			for (var i = 0; i < iterations; i++){
			  allCells[i] = new cellData();
			  allCells[i].locationID = ('Location' + i);
			  var allYears = data[i].graphData;
			  for( var j = 0; j <allYears.length; j++){
				if(typeof allYears[j] !== 'undefined'){
				  for ( var k = 0; k < allYears[j][1].length; k++){
					if(typeof allYears[j][1][k] !== 'undefined'){
					  allCells[i].cumulativeIrrigationVolume += allYears[j][1][k].irrigationVol;
					  allCells[i].cumulativeCapturedFlow += allYears[j][1][k].capturedFlowVol;
					  allCells[i].cumulativeDrainflow = drainData[i];
					}
				  }
				}
			  }
			  allCells[i].annualIrrigationDepthSupplied = (allCells[i].cumulativeIrrigationVolume * .15);
			  if (allCells[i].cumulativeCapturedFlow == 0 || allCells[i].cumulativeDrainflow == 0) {
				  allCells[i].percentAnnualCapturedDrainFlow = 0;
			  }
			  else {
				allCells[i].percentAnnualCapturedDrainFlow = (allCells[i].cumulativeCapturedFlow/allCells[i].cumulativeDrainflow);
			  }
			  //console.log(allCells[i].locationID,"AnnualIrrigationDepthSupplied:", allCells[i].annualIrrigationDepthSupplied);
			}
			
			return allCells;
		});
	   return allCells;
   });
   return allCells;
 });
  return allCells;

}

function calcDrainflow(_locationId) {
	var drainflow = 0;
	return new Promise(function(resolve, reject) {
		db.getLocationById(_locationId).then(function(data) {
			for(var i = 0; i < data.length; i++) {
				drainflow += data[i].Drainflow;
			}
			
			resolve(drainflow);
		});
	});
}
