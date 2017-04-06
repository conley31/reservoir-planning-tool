/*jshint esversion: 6 */
/*
   -------TDPAlg.js**-------
Notes:
-This file exports the algorithm developed by the Transforming Drainage Project.
-All variables that are preceded by an underscore are from form inputs
*/

var db = require('../db');
var userparse = require('./UserParse');

//monthlyData will be an object that is used inside of allYears
function monthlyData(){
  this.bypassFlowVol = 0;
  this.deficitVol = 0;
  this.pondWaterDepth = 0;
}

exports.calc = function(_drainedArea, _pondVolSmallest, _pondVolLargest, _pondVolIncrement, _pondDepth, _pondDepthInitial,
_maxSoilMoisture, _irrigationArea, _irrigationDepth, _availableWaterCapacity, _locationId, _csvFileStream) { //TODO: add last argument.

  return new Promise(function(resolve, reject) {
    pullData(_locationId, _csvFileStream).then(function(data){
      var dailyData = {};
      const numberOfIncrements = ((_pondVolLargest - _pondVolSmallest) / _pondVolIncrement);
      var allYears = [];
      var increments = [];
      const seepageVolDay = 0.01; //feet
      var initialYear = null;

      for (var i = 0; i < numberOfIncrements; i++) {
        var pondVol = _pondVolSmallest + (i * _pondVolIncrement);
        increments[i] = pondVol;
        var pondArea = pondVol/_pondDepth;
        dailyData[pondVol] = [];

        /*
        **********************************************
                   DAY-1 VALUES
        ***********************************************
        */
        var soilMoistureDepthDayPrev = _maxSoilMoisture;	//inches
        var pondWaterVolDayPrev = _pondDepthInitial * pondArea; //acre-feet
        

        /* LOOP THROUGH EVERY DAY */
        for (var j = 0; j < data.length; j++) {
          /*
          **********************************************
                     DAILY VALUES
          **********************************************
          */
          var currentDate = data[j].RecordedDate; // Javascript Date object
          var currentYear = currentDate.getFullYear();
          var currentMonth = currentDate.getMonth();

          //consider setting initialYear = data[0].RecordedDate.getFullYear(); instead of checking for null values every iteration.

          if(initialYear === null){
            initialYear = currentYear;
          }

          var inflowVolDay = data[j].Drainflow * _drainedArea;
          var precipDepthDay = data[j].Precipitation;
          var evapDepthDay = data[j].PET;

          var irrigationVolDay = 0;
          var deficitVolDay = 0;

          var evapVolDay = evapDepthDay * pondArea;

          var pondPrecipVolDay = (precipDepthDay * pondArea);
          var soilMoistureDepthDay = (soilMoistureDepthDayPrev + precipDepthDay - evapDepthDay);
          var pondWaterVolDay = pondWaterVolDayPrev;

          if (soilMoistureDepthDay < (0.5 * _availableWaterCapacity)) {
            irrigationVolDay = _irrigationDepth * _irrigationArea;

            if (irrigationVolDay > pondWaterVolDay) {
              deficitVolDay = (irrigationVolDay - pondWaterVolDay);
            }
          }


          pondWaterVolDay = (pondWaterVolDayPrev + inflowVolDay + pondPrecipVolDay - irrigationVolDay - seepageVolDay - evapVolDay);
          if(pondWaterVolDay < 0){
            pondWaterVolDay = 0;
          }

          var bypassFlowVolDay = 0;
          if (pondWaterVolDay > pondVol) {
            //console.log("bypassFlowVolDay should be equal to:", pondWaterVolDay - pondVol);
            bypassFlowVolDay = pondWaterVolDay - pondVol;
            pondWaterVolDay = pondVol;
          }

          var pondWaterDepthDay = pondWaterVolDay/pondArea;

          /*
          **************************************************************************************************************

                            WRITE OUT ALL DAILY INFORMATION HERE.

          (Write Date, InflowVolDay, EvaporationVolDay, SeepageVolDay, IrrigationVolDay, BypassVolDay, PondWaterDepthDay)

          ***************************************************************************************************************
          */
          dailyData[pondVol].push({
            date: currentDate,
            inflowVol: inflowVolDay,
            evaporationVol: evapVolDay,
            seepageVol: seepageVolDay,
            irrigationVol: irrigationVolDay,
            bypassVol: bypassFlowVolDay,
            pondWaterDepth: pondWaterDepthDay
          });

          //update the (day-1) variables
          soilMoistureDepthDayPrev = soilMoistureDepthDay;
          pondWaterVolDayPrev = pondWaterVolDay;


          //updated allYears at the current year at the current increment and at the current month.

          if(typeof allYears[currentYear - initialYear] === "undefined"){
            allYears[currentYear - initialYear] = [];
          }
          if(typeof allYears[currentYear - initialYear][i] === "undefined"){
            allYears[currentYear - initialYear][i] = [];
          }
          if(typeof allYears[currentYear - initialYear][i][currentMonth] === "undefined"){
           allYears[currentYear - initialYear][i][currentMonth] = new monthlyData();
          }
         
          //update monthly values here

          allYears[currentYear - initialYear][i][currentMonth].bypassFlowVol += bypassFlowVolDay;
          allYears[currentYear - initialYear][i][currentMonth].deficitVol += deficitVolDay;
          allYears[currentYear - initialYear][i][currentMonth].pondWaterDepth += pondWaterDepthDay;
        }

      }

      //consider sending back an object with the first graphs data already calculated.
      resolve({ graphData: allYears, incData: increments, firstYearData: initialYear, dailyData: dailyData });
    });
});
};

// TODO document this method
function pullData(_locationId, stream) {
  return new Promise(function(resolve, reject) {
    if(Number.isInteger(_locationId))
      resolve(db.getLocationById(_locationId));
    if(stream && stream !== "undefined") {
      resolve(userparse.readUserCSV(stream));
    }
    reject(new Error('Neither LocationID nor Stream are valid'));
  });
}
