/*
   -------TDPAlg.js**-------
Notes: This file exports the algorithm developed by the Transforming Drainage Project.

 */

module.exports = function(pondVolSmallest, pondVolLargest, pondVolIncrement, pondDepth){		//TODO: add last argument.
	const seepageVolumeDay = 0.01; //ft
	const numberOfIncrements = (pondVolLargest - pondVolSmallest)/pondVolIncrement;		//TODO:specify on front-end that the increment can't be zero.

	for(i = 0; i < numberOfIncrements; i++){
		var pondVolume = pondVolSmallest + (i * pondVolIncrement);
		var pondArea = pondVolume/pondDepth;						//TODO: specify on front-end that the pondDepth can't be zero.



		//The following should be done for every year, month, day and requires inputs from the database.

		var precipDay = //from database;
		var pondPrecipVolDay = percipDay * pondArea;
		MaxSoilMoistureDepth = INPUT;
		var SoilMoistureDepthDay = SoilMoistureDepthDay +PrecipDepthDay – EvaporationDepthDay;	//TODO: still waiting on frankenb to tell me if this is the correct statement.
		if(SoilMoistureDepthDay < 0.5*MaxSoilMoistureDepth){
			IrrigationVolDay=IrrigDepth*FieldArea;
			//CHECK WITH FRANKENB TO MAKE SURE THIS IF STATEMENT SHOULD BE NESTED.
			if(IrrigationVolDay > WaterVolDay){
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

			//REST OF THE ALGORITHM IS WRITING TO FILES.
	}


}
