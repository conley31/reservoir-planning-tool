/*
   -------TDPAlg.js**-------
Notes:
-This file exports the algorithm developed by the Transforming Drainage Project.
-All variables that are preceded by an underscore are from form inputs
*/

var db = require('./db');

module.exports.calc = function(_pondVolSmallest, _pondVolLargest, _pondVolIncrement, _pondDepth, _pondDepthInitial, _maxSoilMoisture, _irrigationArea, _irrigationDepth, _availableWaterCapacity, _locationId) { //TODO: add last argument.
  return new Promise(function(resolve, reject) {
    db.getLocationById(_locationId).then(function(data) {
      var numOfDays = data.length;
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


          //update the (day-1) variables
          soilMoistureDepthDayPrev = soilMoistureDepthDay;
          pondWaterVolDayPrev = pondWaterVolDay;

          /*
          **************************************************************************************************************

          			  THIS MARKS THE END OF THE DAILY COUNTS. UPDATE THE ANNUAL VALUES.

          ***************************************************************************************************************
          */


          /*******Calculate totals for every day in database*******/

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
