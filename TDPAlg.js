/*
   -------TDPAlg.js**-------
Notes: This file exports the algorithm developed by the Transforming Drainage Project.

All variable that are preceeded by an underscore are from form inputs
*/
module.exports = function(_pondVolSmallest, _pondVolLargest, _pondVolIncrement, _pondDepth, _maxSoilMoisture, _irrigationArea, _irrigationDepth, _availableWaterCapacity){		//TODO: add last argument.
	const seepageVolDay = 0.01; //ft
	const numberOfIncrements = (_pondVolLargest - _pondVolSmallest)/_pondVolIncrement;		//specify on front-end that the increment can't be zero.

	for(i = 0; i < numberOfIncrements; i++){
		var pondVol = _pondVolSmallest + (i * _pondVolIncrement);
		var pondArea = pondVol/pondDepth;	//specify on front-end that the pondDepth can't be zero.

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

		var precipDepthDay; //from database;
		var evapDepthDay; //from database;
		var waterVolDay; //from db;
		var pondPrecipVolDay = percipDay * pondArea;
		var inflowVolDay; //from db;		
		var soilMoistureDepthDay = soilMoistureDepthDayPrev + precipDepthDay – evapDepthDay;
		var irrigationVolDay;
		var deficitVolDay;	

		/*
		**********************************************
					     DAY-1 VALUES
		***********************************************
		*/
		var soilMoistureDepthDayPrev = _maxSoilMoisture;
		var pondWaterVolDayPrev = _pondDepth * pondArea;

		/*
		********************************************************************************************************
		
			THE FOLLOWING SHOULD BE RUN FOR EVERY DAY,MONTH, AND YEAR. ONLY WRITING OUT DAILY AND ANNUAL DATA.

		********************************************************************************************************
		*/


		if(soilMoistureDepthDay < (0.5*_availableWaterCapacity)){
			irrigationVolDay = irrigationDepth * irrigationArea;
			if(irrigationVolDay > waterVolDay){
				deficitVolDay = (irrigationVolDay – waterVolDay)/PondArea;
			}
			else{
				deficitVolDay = 0;
			}
		}

		/* Need to query database for evalVolDay or read from inputted CSV */
		var evapVolDay;
		var pondWaterVolDay = (pondWaterVolDayPrev + inflowVolDay + pondPrecipVolDay - irrigationVolDay - seepageVolDay – evapVolDay);

		var bypassFlowVolDay;

		if(pondWaterVolDay > pondVol){
			bypassFlowVolDay = pondWaterVolDay – pondVol;
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

		/*
		**************************************************************************************************************

					  				   WRITE OUT ALL ANNUAL INFORMATION HERE.
		(Write Date, InflowVolDay, EvaporationVolDay, SeepageVolDay, IrrigationVolDay, BypassVolDay, PondWaterDepthDay)

		***************************************************************************************************************
		*/


	}

}
