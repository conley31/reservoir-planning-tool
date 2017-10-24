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

/* comparisonData holds a locationID and an array which holds yearlyData from 1981-2009 for each grid cell location */
function comparisonData() {
	this.locationID = 0;
	this.yearArray = [];
}

/* yearlyData holds information from the database for one year*/
function yearlyData(currentYear) {
	this.year = currentYear;
	this.drainflow = 0;
	this.precipitation = 0;
	this.surfacerunoff = 0;
	this.pet = 0;
	this.dae_pet = 0;
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

/*
 *
 *  calcAllLocations    -   computes data for every location in the
 *                          database and performs computations on it
 *
 *
 *  Return  -  allCells  -  array that holds cellData objects, each cellData object
 *               			holds cumulative data that is used to color each cell
 *               			location accordingly based on its value
 */
exports.calcAllLocations = function(drainedArea, pondDepth, irrigationDepth, pondVol, soilMoisture, waterCapacity, locations){
  if (drainedArea <= 0) {
    return new Error("ILLEGAL VALUE drainedArea: " + drainedArea);
  }
  if (pondDepth <= 0) {
    return new Error("ILLEGAL VALUE pondDepth: " + pondDepth);
  } 
  if (irrigationDepth <= 0) {
    return new Error("ILLEGAL VALUE irrigationDepth: " + irrigationDepth);
  }
  if (pondVol <= 0) {
    return new Error("ILLEGAL VALUE pondVol: " + pondVol);
  }
  if (soilMoisture <= 0) {
    return new Error("ILLEGAL VALUE soilMoisture: " + soilMoisture);
  }
  if (waterCapacity <= 0) {
    return new Error("ILLEGAL VALUE waterCapacity: " + waterCapacity);
  }
 
  /* Arrays used to hold promises for different items */
  var calculationPromises = []; //Holds the results from TDPAlg for each grid cell location
  var drainPromises = []; //Holds the results from calcDrainflow for each grid cell location

  for (var i = 0; i < locations; i++) {
	calculationPromises[i] = TDPAlg.calc(drainedArea, 0, pondVol, pondVol, pondDepth, pondDepth, soilMoisture, drainedArea, irrigationDepth, waterCapacity, i,void 0);
	drainPromises[i] = calcDrainflow(i);
  }
   
   /*Once all the promises are finished we can begin calculating our results */
   return Promise.all(drainPromises).then(function(drainData) {
	   return Promise.all(calculationPromises).then(function(data){
		   
			var allCells = [];
			
			for (var i = 0; i < locations; i++){
			  allCells[i] = new cellData(); //a new cellData object is made for each location
			  allCells[i].locationID = ('Location' + i);
			  
			  var allYears = data[i].graphData;
			  
			  for( var j = 0; j < allYears.length; j++){
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
			}

			return allCells;
		});
   });
   }

/* Function to create and write to mapData.json*/
exports.makeJson = function(allCells){
  return new Promise(function(resolve, reject){
  var f = 'mapData.json';
  var  fs = require('fs');
    fs.writeFileSync(f,JSON.stringify(allCells));
    resolve(allCells);
   });
}

/* Function to get the cumulative drainflow for one location from the database for use in the computing captured flow */
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

/*
 *
 * getData  -   Computes data grouped by year for the given
 *              locationId
 *
 * Return   -   Object representing location that contains an
 *              array containing one yearlyData object per index
 *
 *
 */
exports.getData = function(locationId) {
	var allDates = [];
	
	return new Promise(function(resolve,reject){
    db.getLocationById(locationId).then(function(data){
		
      var compData = new comparisonData();
      compData.locationID = ('Location' + locationId);
      var initialYear;
	  
      for(var i = 0; i < data.length; i++){
        var currentDate = data[i].RecordedDate;
        var currentYear = currentDate.getFullYear();
		
        if(initialYear == null){
           initialYear = currentYear;
        }
        if(typeof compData.yearArray[currentYear-initialYear] === 'undefined'){
          compData.yearArray[currentYear-initialYear] = new yearlyData(currentYear);
        }
		
        compData.yearArray[currentYear-initialYear].drainflow += data[i].Drainflow;
        compData.yearArray[currentYear-initialYear].precipitation += data[i].Precipitation;
        compData.yearArray[currentYear-initialYear].surfacerunoff += data[i].SurfaceRunoff;
        compData.yearArray[currentYear-initialYear].pet += data[i].PET;
        compData.yearArray[currentYear-initialYear].dae_pet += data[i].DAE_PET;
      }
      resolve(compData);
    });
  });
}

