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
	
	
}




}
