/*jshint esversion: 6 */
/*
   -------TDPAlg.js**-------
Notes:
-This file exports the algorithm developed by the Transforming Drainage Project.
-All variables that are preceded by an underscore are from form inputs
-All values are in acre/feet or feet
*/

var db = require('../db');
var userparse = require('./UserParse');

/* monthlyData will be an object that is used inside of allYears to represent each month */
function monthlyData(){
  this.bypassFlowVol = 0;
  this.deficitVol = 0;
  this.pondWaterDepth = 0;
}

exports.calc = function(_drainedArea, _pondVolSmallest, _pondVolLargest, _pondVolIncrement, _pondDepth, _pondDepthInitial,
_maxSoilMoisture, _irrigationArea, _irrigationDepth, _availableWaterCapacity, _locationId, _csvFileStream) { //TODO: add last argument.

  return new Promise(function(resolve, reject) {
    pullData(_locationId, _csvFileStream).then(function(data){
      /*dailyData is an object that will be used for creating downloadable CSV */
      var dailyData = {}; 
      /* allYears stores data for graphs on the client */
      var allYears = [];
      /*
         increments will store the actual pondVolumes that go along with each increment.
         Pond volumes are not stored within allYears, so increments will be passed to client as well
      */
      var increments = [];
      const numberOfIncrements = ((_pondVolLargest - _pondVolSmallest) / _pondVolIncrement); 
      const seepageVolDay = 0.01;
      var initialYear = null;

      /* Run the calculation for every pond increment */
      for (var i = 0; i <= numberOfIncrements; i++) {
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


        /* LOOP THROUGH EVERY DAY(ROW) in Database */
        for (var j = 0; j < data.length; j++) {
          /*
          **********************************************
                     DAILY VALUES
          **********************************************
          */
          var currentDate = data[j].RecordedDate; // Javascript Date object
          var currentYear = currentDate.getFullYear();
          var currentMonth = currentDate.getMonth();

          if(initialYear === null){
            initialYear = currentYear;
          }

          var inflowVolDay = data[j].Drainflow * _drainedArea;
          var precipDepthDay = data[j].Precipitation;
          var evapDepthDay = data[j].PET;
          

          var irrigationVolDay = 0;
          var deficitVolDay = 0;

          var evapVolDay = evapDepthDay * pondArea;
          var pondPrecipVolDay = precipDepthDay * pondArea;

          var soilMoistureDepthDay = (soilMoistureDepthDayPrev + precipDepthDay - evapDepthDay);
          if( soilMoistureDepthDay < 0 ){
            soilMoistureDepthDay = 0;
          }

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

          /* update the (day-1) variables */
          /* here lies the problem. */
          soilMoistureDepthDayPrev = soilMoistureDepthDay;
          pondWaterVolDayPrev = pondWaterVolDay;


          /* updated allYears at the current year at the current increment and at the current month. */
          //console.log("Current Year:", currentYear, " Pond Vol:", pondVol);
          if(pondVol == 60){
              console.log("-----------------------------------------------------------------------------------");
              
              console.log("Drainflow:",data[j].Drainflow," Precipitation:", data[j].Precipitation," PET:", data[j].PET);
              console.log("Pond Water Depth Day:", pondWaterDepthDay);
              console.log("Pond Area:", pondArea );
              console.log("Pond Water Volume Day:", pondWaterVolDay);
              console.log("Pond Precip Volume Day:", pondPrecipVolDay);
              console.log("Irrigation Volume Day:", irrigationVolDay);
              console.log("Soil Moisture Depth Day:", soilMoistureDepthDay);
              
              console.log("Bypass flow vol day:", bypassFlowVolDay);
              console.log("deficit vol day:", bypassFlowVolDay);

          }

          if(typeof allYears[currentYear - initialYear] === "undefined"){
            allYears[currentYear - initialYear] = [];
          }
          if(typeof allYears[currentYear - initialYear][i] === "undefined"){
            allYears[currentYear - initialYear][i] = [];
          }
          if(typeof allYears[currentYear - initialYear][i][currentMonth] === "undefined"){
           allYears[currentYear - initialYear][i][currentMonth] = new monthlyData();
          }

          allYears[currentYear - initialYear][i][currentMonth].bypassFlowVol += bypassFlowVolDay;
          allYears[currentYear - initialYear][i][currentMonth].deficitVol += deficitVolDay;
          allYears[currentYear - initialYear][i][currentMonth].pondWaterDepth += pondWaterDepthDay;
        }

      }

      resolve({ graphData: allYears, incData: increments, firstYearData: initialYear, dailyData: dailyData });
    });
});
};

/*
 *  pullData  -   Chooses whether to just get SQL Data or
 *                if the user has uploaded a CSV that needs
 *                to be blended and then returned.
 *
 *  Return - Either SQLRows or blendedCSV -
 *  [ {
 *    "RecordedDate": 1980-10-08T05:00:00.000Z,
 *    "Drainflow": "1.2321",
 *    "Precipitation": "9.342",
 *    "PET": "3.21323"
 *  }, ...]
 *
 */
function pullData(_locationId, stream) {
  return new Promise(function(resolve, reject) {
    if(typeof stream != 'undefined') {
      resolve(userparse.verifyAndBlendUserCSV(_locationId, stream));
    }
    else {
      resolve(db.getLocationById(_locationId));
    }
  });
}
