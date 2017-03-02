/*
   -------TDPAlg.js**-------
Notes:
-This file exports the algorithm developed by the Transforming Drainage Project.
-All variables that are preceded by an underscore are from form inputs
*/

var db = require('./db');
module.exports = function(_pondVolSmallest, _pondVolLargest, _pondVolIncrement, _pondDepth, _pondDepthInitial, _maxSoilMoisture, _irrigationArea, _irrigationDepth, _availableWaterCapacity, _locationId) { //TODO: add last argument.
  var allAnnuals = [];
  const seepageVolDay = 0.01;
  const numberOfIncrements = (_pondVolLargest - _pondVolSmallest) / _pondVolIncrement; //specify on front-end that the increment can't be zero.


  for (var i = 0; i < numberOfIncrements; i++) {
    var pondVol = _pondVolSmallest + (i * _pondVolIncrement);
    var pondArea = pondVol / _pondDepth; //specify on front-end that the _pondDepth can't be zero.
    /*
    **********************************************
    			     ANNUAL VALUES
    **********************************************
    */
    var inflowVolYear = 0;
    var evapVolYear = 0;
    var seepageVolYear = 0;
    var irrigationVolYear = 0;
    var bypassFlowVolYear = 0;
    var deficitVolYear = 0;

    /*
    **********************************************
    			     DAILY VALUES
    **********************************************
    */

    var numOfRows;
    db.getLocationById(_locationId).then(function(data) {

      numOfRows = data.length;

      /*
      **********************************************
      			     DAY-1 VALUES
      ***********************************************
      */
      var soilMoistureDepthDayPrev = _maxSoilMoisture;
      var pondWaterVolDayPrev = _pondDepthInitial * pondArea;

      /* LOOP THROUGH EVERY DAY */

      for (var j = 0; j < data.length; j++) {

        var inflowVolDay = data[j].Drainflow;
        var precipDepthDay = data[j].Precipitation;
        var evapDepthDay = data[j].PET;


        var irrigationVolDay = 0;
        var deficitVolDay;
        var bypassFlowVolDay;

        var evapVolDay = evapDepthDay * pondArea;

        var pondPrecipVolDay = (precipDepthDay * pondArea);
        var soilMoistureDepthDay = (soilMoistureDepthDayPrev + precipDepthDay - evapDepthDay);
        var pondWaterVolDay;


        if (soilMoistureDepthDay < (0.5 * _availableWaterCapacity)) {
          irrigationVolDay = _irrigationDepth * _irrigationArea;
          pondWaterVolDay = (pondWaterVolDayPrev + inflowVolDay + pondPrecipVolDay - irrigationVolDay - seepageVolDay - evapVolDay);

          if (irrigationVolDay > pondWaterVolDay) {
            deficitVolDay = (irrigationVolDay - pondWaterVolDay) / pondArea;
          } else {
            deficitVolDay = 0;
          }
        }
        //set pondWaterVolDay with an irrigationVolDay of zero.
        else {
          pondWaterVolDay = (pondWaterVolDayPrev + inflowVolDay + pondPrecipVolDay - irrigationVolDay - seepageVolDay - evapVolDay);
        }

        if (pondWaterVolDay > pondVol) {
          bypassFlowVolDay = pondWaterVolDay - pondVol;
          pondWaterVolDay = pondVol;
        } else {
          bypassFlowVolDay = 0;
        }

        var pondWaterDepthDay = pondWaterVolDay / pondArea;

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


        /*******Calculate annual values*******/

        inflowVolYear += inflowVolDay;
        evapVolYear += evapVolDay;
        seepageVolYear += seepageVolDay;
        irrigationVolYear += irrigationVolDay;
        bypassFlowVolYear += bypassFlowVolDay;
        deficitVolYear += (deficitVolDay * pondArea);

      }
    });

    /*
    **************************************************************************************************************

    			  				   WRITE OUT ALL ANNUAL INFORMATION HERE.
    (Write Date, InflowVolDay, EvaporationVolDay, SeepageVolDay, IrrigationVolDay, BypassVolDay, PondWaterDepthDay)

    ***************************************************************************************************************
    */

    allAnnuals.push([pondVol, (inflowVolYear / numOfRows), (evapVolYear / numOfRows), (seepageVolDay / numOfRows), (irrigationVolYear / numOfRows), (bypassFlowVolYear / numOfRows), (deficitVolYear / numOfRows)]);

  }


  return allAnnuals;

};
