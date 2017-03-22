/*jshint esversion: 6 */
/*
   -------TDPAlg.js**-------
Notes:
-This file exports the algorithm developed by the Transforming Drainage Project.
-All variables that are preceded by an underscore are from form inputs
*/

var db = require('./db'),
userparse = require('./UserParse');

module.exports.calc = function(_pondVolSmallest, _pondVolLargest, _pondVolIncrement, _pondDepth, _pondDepthInitial, _maxSoilMoisture, _irrigationArea, _irrigationDepth, _availableWaterCapacity, _locationId, stream) { //TODO: add last argument.
  return new Promise(function(resolve, reject) {
    pullData(_locationId, stream).then(function(data){
      var numOfRows = data.length;
      var allAnnuals = [];
      const seepageVolDay = 0.01; //feet
      const numberOfIncrements = ((_pondVolLargest - _pondVolSmallest) / _pondVolIncrement);

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

        /* LOOP THROUGH EVERY DAY */

        for (var j = 0; j < data.length; j++) {
          /*
          **********************************************
                     DAILY VALUES
          **********************************************
          */
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

<<<<<<< HEAD
=======
          /*
          **************************************************************************************************************

                            WRITE OUT ALL DAILY INFORMATION HERE.

          (Write Date, InflowVolDay, EvaporationVolDay, SeepageVolDay, IrrigationVolDay, BypassVolDay, PondWaterDepthDay)

          ***************************************************************************************************************
          */
>>>>>>> 9a339ae8ce8f33696ddab52a000cf13466073782

          //update the (day-1) variables
          soilMoistureDepthDayPrev = soilMoistureDepthDay;
          pondWaterVolDayPrev = pondWaterVolDay;

          /*
          **************************************************************************************************************

                  THIS MARKS THE END OF THE DAILY COUNTS. UPDATE THE ANNUAL VALUES.

          ***************************************************************************************************************
          */


          /*******Calculate totals for every day in database*******/

<<<<<<< HEAD
          inflowVolTotal += inflowVolDay;
          evapVolTotal+= evapVolDay;
          seepageVolTotal += seepageVolDay;
          irrigationVolTotal+= irrigationVolDay;
          bypassFlowVolTotal += bypassFlowVolDay;
          deficitVolTotal += (deficitVolDay * pondArea);
=======
                             WRITE OUT ALL ANNUAL INFORMATION HERE.
          (Write Date, InflowVolYear, EvaporationVolYear, SeepageVolYear, IrrigationVolYear, BypassVolYear, PondWaterDepthYear)

          ***************************************************************************************************************
          */
>>>>>>> 9a339ae8ce8f33696ddab52a000cf13466073782
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
