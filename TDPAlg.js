/*jshint esversion: 6 */
/*
   -------TDPAlg.js**-------
Notes:
-This file exports the algorithm developed by the Transforming Drainage Project.
-All variables that are preceded by an underscore are from form inputs
*/

var db = require('./db'),
var userparse = require('./UserParse');

//monthlyData will be an object that is used inside of allYears
function monthlyData(){
  this.bypassFlow = 0;
  this.deficit = 0; 
  this.pondDepth = 0;
}

module.exports.calc = function(_pondVolSmallest, _pondVolLargest, _pondVolIncrement, _pondDepth, _pondDepthInitial, _maxSoilMoisture, _irrigationArea, _irrigationDepth, _availableWaterCapacity, _locationId, _csvFileStream) { //TODO: add last argument.
  return new Promise(function(resolve, reject) {
    pullData(_locationId, _csvFileStream).then(function(data){
      const numberOfIncrements = ((_pondVolLargest - _pondVolSmallest) / _pondVolIncrement);      
      var numOfRows = data.length;
      var allYears = [];
      var allAnnuals = [];
      const seepageVolDay = 0.01; //feet

      for (var i = 0; i < numberOfIncrements; i++) {
        var pondVol = _pondVolSmallest + (i * _pondVolIncrement);
        var pondArea = pondVol/_pondDepth;
        /*
        **********************************************
        			     TOTAL VALUES
        **********************************************
        */
        var inflowVolTotal = 0;
        var evapVolTotal = 0;
        var seepageVolTotal = 0;
        var irrigationVolTotal = 0;
        var bypassFlowVolTotal = 0;
        var deficitVolTotal = 0;

        /*
        **********************************************
                   DAY-1 VALUES
        ***********************************************
        */
        var soilMoistureDepthDayPrev = _maxSoilMoisture;	//inches
        var pondWaterVolDayPrev = _pondDepthInitial * pondArea; //acre-feet

        var initialYear = null;

        /* LOOP THROUGH EVERY DAY */
        for (var j = 0; j < data.length; j++) {
          /*
          **********************************************
                     DAILY VALUES
          **********************************************
          */

          var currentDate = data[j].RecordedDate;
          var currentYear = currentDate.getFullYear();
          var currentMonth = currentDate.getMonth(); 

          if(initialYear == null){
            initialYear = currentYear;
          }

          var inflowVolDay = data[j].Drainflow;
          var precipDepthDay = data[j].Precipitation;
          var evapDepthDay = data[j].PET;

          var irrigationVolDay = 0;
          var deficitVolDay = 0;
          var bypassFlowVolDay;

          var evapVolDay = evapDepthDay * pondArea;

          var pondPrecipVolDay = (precipDepthDay * pondArea);
          var soilMoistureDepthDay = (soilMoistureDepthDayPrev + precipDepthDay - evapDepthDay);


          if (soilMoistureDepthDay < (0.5 * _availableWaterCapacity)) {
            irrigationVolDay = _irrigationDepth * _irrigationArea;

            if (irrigationVolDay > pondWaterVolDay) {
              deficitVolDay = (irrigationVolDay - pondWaterVolDay);
          	}
          }
          //update water volume in pond
          var pondWaterVolDay = (pondWaterVolDayPrev + inflowVolDay + pondPrecipVolDay - irrigationVolDay - seepageVolDay - evapVolDay);

          //calculate bypass
          if (pondWaterVolDay > pondVol) {
            bypassFlowVolDay = pondWaterVolDay - pondVol;
            pondWaterVolDay = pondVol;
          } 

          else {
            bypassFlowVolDay = 0;
          }

          var pondWaterDepthDay = pondWaterVolDay/pondArea;

          /*
          **************************************************************************************************************

                            WRITE OUT ALL DAILY INFORMATION HERE.

          (Write Date, InflowVolDay, EvaporationVolDay, SeepageVolDay, IrrigationVolDay, BypassVolDay, PondWaterDepthDay)

          ***************************************************************************************************************
          */

          //update the (day-1) variables
          soilMoistureDepthDayPrev = soilMoistureDepthDay;
          pondWaterVolDayPrev = pondWaterVolDay;

          /*
          **************************************************************************************************************

                  THIS MARKS THE END OF THE DAILY COUNTS. UPDATE THE ANNUAL VALUES.

          ***************************************************************************************************************
          */


          //updated allYears at the current year at the current increment and at the current month.
          if(typeof allYears[currentYear - initialYear] == "undefined"){
              allYears[current-initialYear] = []; 
          }
          if(typeof allYears[currentYear - initialYear][i] == "undefined"){
              allYears[currentYear - initialYear][i] = [];
          }
          if(typeof allYears[currentYear - initialYear][i][currentMonth] == "undefined"){
           allYears[currentYear - initialYear][i][currentMonth] = new monthlyData();
          }

          //update monthly values here 
          allYears[currentYear - initialYear][i][currentMonth].bypassFlowVol += bypassFlowVolDay;
          allYears[currentYear - initialYear][i][currentMonth].deficitVol += deficitVolDay;


          //why are they updating all these values? they aren't used.
          //they may just want this information written out to a file
          inflowVolTotal += inflowVolDay;
          evapVolTotal+= evapVolDay;
          seepageVolTotal += seepageVolDay;
          irrigationVolTotal+= irrigationVolDay;
          bypassFlowVolTotal += bypassFlowVolDay;
          deficitVolTotal += (deficitVolDay * pondArea);
        }

        /***** THE COMMENTED REGION BELOW CONTAINS AVGS FOR ALL VALUES ******/
        //allAnnuals.push([pondVol, (inflowVolYear / numOfRows), (evapVolYear / numOfRows), (seepageVolDay / numOfRows), (irrigationVolYear / numOfRows), (bypassFlowVolYear / numOfRows), (deficitVolYear / numOfRows)]);

        allAnnuals.push([pondVol, (bypassFlowVolYear / numOfDays), (deficitVolYear / numOfDays)]);

      }
      resolve(allAnnuals);
    });
    });
};

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
