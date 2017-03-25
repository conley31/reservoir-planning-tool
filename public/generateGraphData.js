/* The following functions need to be used to grab needed graphing data for a specific graph */

//all of these will need access to the return array from TDPAlg.calc()

/*this is more or less pseudocode as I don't know exactly where each of these will be called.*/
var allYears = //call TdpAlg.js

function allYearsAveraged(){
	var outputArray = [];	
	for(var i = 0; i < allYears.length; i++){
		for(var j = 0; j < allYears[i].length){
			for(var k = 0; k < allYears[i][j].length; k++){
				outputArray[j] += allYears[i][j][k];
			}
		}
	}
}

allYearsAveragedByMonth(specificPondVolume){

}

allMonthsByYear(specificPondVolume, specificYear){

}