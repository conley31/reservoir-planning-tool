/*
   -------TDPAlg.js**-------
Notes: 
-This file exports the algorithm developed by the Transforming Drainage Project.
-All variables that are preceded by an underscore are from form inputs
*/
"use strict";

var db = require('./db');
module.exports = function(_pondVolSmallest, _pondVolLargest, _pondVolIncrement, _pondDepth,_pondDepthInitial, _maxSoilMoisture, _irrigationArea, _irrigationDepth, _availableWaterCapacity, _locationId){		//TODO: add last argument.
	var allAnnuals = [];	
	const seepageVolDay = 0.01;
	const numberOfIncrements = (_pondVolLargest - _pondVolSmallest)/_pondVolIncrement;		//specify on front-end that the increment can't be zero.
	

	for(var i = 0; i < _numberOfIncrements; i++){
		var pondVol = _pondVolSmallest + (i * _pondVolIncrement);
		var pondArea = pondVol/_pondDepth;	//specify on front-end that the _pondDepth can't be zero.
		/*
		**********************************************
					     ANNUAL VALUES 
		**********************************************
		*/
		var inflowVolYear = 0;
		var evapVolYear = 0;
		var seepageVolYear = 0;
		var irrigationVolYear = 0;
		var bypassVolYear = 0;
		var deficitVolYear = 0;

		/*
		**********************************************
					     DAILY VALUES
		**********************************************
		*/

		var numOfRows;
		db.getLocationById(_locationId).then(function(data){

		numOfRows = data.length;

		/*
		**********************************************
					     DAY-1 VALUES
		***********************************************
		*/
		var soilMoistureDepthDayPrev = _maxSoilMoisture;
		//SHOULD THIS BE _pondDepth or _pondDepthInitial????
		var pondWaterVolDayPrev = _pondDepthInitial * pondArea;

		/* LOOP THROUGH EVERY DAY */

		for(var j = 0; j < data.length; j++){

		var inflowVolDay = data[j].Drainflow; //DOUBLE CHECK THAT THIS IS CORRECT;
		var precipDepthDay = data[j].Precipitation;
		var evapDepthDay = data[j].PET; 


		var irrigationVolDay;
		var deficitVolDay;	
		var bypassFlowVolDay;

		/* Need to query database for evalVolDay or read from inputted CSV */
		var evapVolDay;
		
		var pondPrecipVolDay = (percipDay * pondArea);
		var soilMoistureDepthDay = (soilMoistureDepthDayPrev + precipDepthDay - evapDepthDay);


		if(soilMoistureDepthDay < (0.5*_availableWaterCapacity)){
			irrigationVolDay = _irrigationDepth * _irrigationArea;
			if(irrigationVolDay > waterVolDay){
				deficitVolDay = (irrigationVolDay - waterVolDay)/pondArea;
			}
			else{
				deficitVolDay = 0;
			}
		}
		//STILL NEED TO UPDATE IRRIGATIONVOLDAY IF THE ABOVE IF STATEMENT BREAKS.	
		var pondWaterVolDay = (pondWaterVolDayPrev + inflowVolDay + pondPrecipVolDay - irrigationVolDay - seepageVolDay - evapVolDay);

		if(pondWaterVolDay > pondVol){
			bypassFlowVolDay = pondWaterVolDay - pondVol;
			pondWaterVolDay = pondVol;
		}
		else{
			bypassFlowVolDay=0
		}

		pondWaterDepthDay = waterVolDay/pondArea;

		/*
		**************************************************************************************************************

			  							WRITE OUT ALL DAILY INFORMATION HERE.

		(Write Date, InflowVolDay, EvaporationVolDay, SeepageVolDay, IrrigationVolDay, BypassVolDay, PondWaterDepthDay)

		***************************************************************************************************************
		*/

		//update the (day-1) variables
		soilMoistureDepthDayPrev = soilMoistureDepthDay;
		waterVolDayPrev = waterVolDay;

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
		bypassVolYear += bypassVolDay
		deficitVolYear += (deficitVolDay*pondArea);

	}
});

		/*
		**************************************************************************************************************

					  				   WRITE OUT ALL ANNUAL INFORMATION HERE.
		(Write Date, InflowVolDay, EvaporationVolDay, SeepageVolDay, IrrigationVolDay, BypassVolDay, PondWaterDepthDay)

		***************************************************************************************************************
		*/

		allAnnuals.push([pondVol,(inflowVolYear/numOfRows), (evapVolYear/numOfRows), (seepageVolDay/numOfRows), (irrigationVolYear/numOfRows), (bypassVolYear/numOfRows), (deficitVolYear/numOfRows)]);

	}


	return allAnnuals;

}

