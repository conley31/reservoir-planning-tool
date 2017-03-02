/*
   -------TDPAlg.js**-------
Notes:
-This file exports the algorithm developed by the Transforming Drainage Project.
-All variables that are preceded by an underscore are from form inputs
*/

var db = require('./db');

module.exports.calc = function(_pondVolSmallest, _pondVolLargest, _pondVolIncrement, _pondDepth, _pondDepthInitial, _maxSoilMoisture, _irrigationArea, _irrigationDepth, _availableWaterCapacity, _locationId) { //TODO: add last argument.
	return new Promise(function(resolve, reject){
		db.getLocationById(_locationId).then(function(data) {
			var numOfRows = data.length;
			var allAnnuals = [];
			const seepageVolDay = 0.01;
			const numberOfIncrements = (_pondVolLargest - _pondVolSmallest) / _pondVolIncrement;

	for (var i = 0; i < numberOfIncrements; i++) {
		var pondVol = _pondVolSmallest + (i * _pondVolIncrement);
		var pondArea = pondVol / _pondDepth;
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
      			     DAY-1 VALUES
      ***********************************************
      */
      var soilMoistureDepthDayPrev = _maxSoilMoisture;
      var pondWaterVolDayPrev = _pondDepthInitial * pondArea;

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
        	deficitVolDay = 0;
        	pondWaterVolDay = (pondWaterVolDayPrev + inflowVolDay + pondPrecipVolDay - irrigationVolDay - seepageVolDay - evapVolDay);
        }

        if (pondWaterVolDay > pondVol) {
        	bypassFlowVolDay = pondWaterVolDay - pondVol;
        	pondWaterVolDay = pondVol;
        } 

        else {
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
    /*
    **************************************************************************************************************

    			  				   WRITE OUT ALL ANNUAL INFORMATION HERE.
    (Write Date, InflowVolYear, EvaporationVolYear, SeepageVolYear, IrrigationVolYear, BypassVolYear, PondWaterDepthYear)

    ***************************************************************************************************************
    */
}

allAnnuals.push([pondVol, (inflowVolYear / numOfRows), (evapVolYear / numOfRows), (seepageVolDay / numOfRows), (irrigationVolYear / numOfRows), (bypassFlowVolYear / numOfRows), (deficitVolYear / numOfRows)]);

}

resolve (allAnnuals);

});

});


};



