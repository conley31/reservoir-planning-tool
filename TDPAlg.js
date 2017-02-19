/*
   -------TDPAlg.js**-------
Notes: This file exports the algorithm developed by the Transforming Drainage Project.

 */

module.exports = function(pondVolSmallest, pondVolLargest, pondVolIncrement, pondDepth, maxSoilMoisture, irrigationArea, irrigationDepth){		//TODO: add last argument.
	const seepageVolumeDay = 0.01; //ft
	const numberOfIncrements = (pondVolLargest - pondVolSmallest)/pondVolIncrement;		//specify on front-end that the increment can't be zero.

	for(i = 0; i < numberOfIncrements; i++){
		var pondVolume = pondVolSmallest + (i * pondVolIncrement);
		var pondArea = pondVolume/pondDepth;						//specify on front-end that the pondDepth can't be zero.


		var soilMoistureDepthDayPrev = maxSoilMoisture;
		//The following should be done for every year, month, day and requires inputs from the database.

		var precipDepthDay = //from database;
		var evapDepthDay = //from database;
		var irrigationVolDay = //from db;
		var waterVolDay = //from db;
		var pondPrecipVolDay = percipDay * pondArea;
		var soilMoistureDepthDay = soilMoistureDepthDayPrev + precipDepthDay – evapDepthDay;	//TODO: still waiting on frankenb to tell me if this is the correct statement.
		if(soilMoistureDepthDay < 0.5*maxSoilMoisture){
			irrigationVolDay = irrigationDepth * irrigationArea;

			//CHECK WITH FRANKENB TO MAKE SURE THIS IF STATEMENT SHOULD BE NESTED.
			if(irrigationVolDay > waterVolDay){
				DeficitVolDay = (IrrigationVolDay – WaterVolDay)/PondArea;
				else{
					DeficitVolDay = 0;
				}
			}
		}

		//I DO NOT KNOW WHAT SHE WAS GOING FOR HERE.
		Read EvaporationVolDay //read from regional input file?????

			WaterVolDay = WaterVolDay(date-1) + InflowVolDay +PondPrecipVolDay - IrrigationVolDay - SeepageVolDay – EvaporationVolDay 
			if(WaterVolDay > PondVol){
				BypassFlowVolDay= WaterVolDay – PondVol, 
					WaterVolDay = PondVol
			}
			else{
				BypassFlow=0
			}
		PondWaterDepthDay = WaterVolDay/PondArea	

		//update soilMoistureDepthDayPrev before loop ends
		soilMoistureDepthDayPrev = soilMoistureDepthDay;

			//REST OF THE ALGORITHM IS WRITING TO FILES.
	}


}
