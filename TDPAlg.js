/*
   -------TDPAlg.js**-------
Notes: This file exports the algorithm developed by the Transforming Drainage Project.

*/

module.exports = function(pondVolSmallest, pondVolLargest, pondVolIncrement, pondDepth, maxSoilMoisture, irrigationArea, irrigationDepth){		//TODO: add last argument.
	const seepageVolDay = 0.01; //ft
	const numberOfIncrements = (pondVolLargest - pondVolSmallest)/pondVolIncrement;		//specify on front-end that the increment can't be zero.

	for(i = 0; i < numberOfIncrements; i++){
		var pondVol = pondVolSmallest + (i * pondVolIncrement);
		var pondArea = pondVol/pondDepth;						//specify on front-end that the pondDepth can't be zero.


		var soilMoistureDepthDayPrev = maxSoilMoisture;
		var waterVolDayPrev = //TODO: what should the default here be?

		//The following should be done for every year, month, day and requires inputs from the database.
		var precipDepthDay = //from database;
		var evapDepthDay = //from database;
		var irrigationVolDay = //from db;
		var waterVolDay = //from db;
		var pondPrecipVolDay = percipDay * pondArea;
		var soilMoistureDepthDay = soilMoistureDepthDayPrev + precipDepthDay – evapDepthDay;
		var deficitVolDay;
		var inflowVolDay = //from db;

		if(soilMoistureDepthDay < 0.5*maxSoilMoisture){
			irrigationVolDay = irrigationDepth * irrigationArea;
			//CHECK WITH FRANKENB TO MAKE SURE THIS IF STATEMENT SHOULD BE NESTED.
			if(irrigationVolDay > waterVolDay){
				deficitVolDay = (irrigationVolDay – waterVolDay)/PondArea;
			}
			else{
				deficitVolDay = 0;
			}

		}

		//I DO NOT KNOW WHAT SHE WAS GOING FOR HERE.
		Read EvaporationVolDay //read from regional input file?????
		//what is the difference between evapVolDay and evapDepthDay????
		var waterVolDay = waterVolDayPrev + inflowVolDay + pondPrecipVolDay - irrigationVolDay - seepageVolDay – evapVolDay;

		var bypassFlow, bypassFlowVolDay; 	//what is the difference here or are they the same?

		if(WaterVolDay > PondVol){
			bypassFlowVolDay= waterVolDay – pondVol;
			waterVolDay = pondVol;
		}
		else{
			bypassFlow=0
		}

		pondWaterDepthDay = waterVolDay/pondArea;


		//update the prev
		soilMoistureDepthDayPrev = soilMoistureDepthDay;
		waterVolDayPrev = waterVolDay;

	//Write out daily outputs:
	//Write Date, InflowVolDay, EvaporationVolDay, SeepageVolDay, IrrigationVolDay, BypassVolDay, PondWaterDepthDay

/*******Calculate annual values*******/
var inflowVolYear = inflowVolYear + inflowVolDay;	//inflowVolYear should not be in its defintion.
var evapVolYear = evapVolYear + evapVolDay; 		//again, evapVolYear should not be in its definition.
var seepageVolYear = seepageVolYear + seepageVolDay;	//I thought this was constant.
var irrigationVolYear = irrigationVolYear + irrigationVolDay;	//I'm assuming all of these are for the year-1
var bypassVolYear = bypassVolYear + bypassVolDay
var deficitVolYear = deficitVolYear + (deficitVolDay*pondArea);
/*
#for storage deficit, daily is as a depth, yearly is as a volume. 
*/

}




}
