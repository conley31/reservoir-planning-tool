/* The following functions need to be used to grab needed graphing data for a specific graph */

//all of these will need access to the return array from TDPAlg.calc()

var generateGraphData = {};

function fillThree(array){
	for(var i = 0; i < array.length; i++){
		array[i] = new Array(3);
		//[pondVol, bypassFlow, deficit]
		array[i].fill(0, 0);
	}
}

function fillFour(array){
	for(var i = 0; i < array.length; i++){
		array[i] = new Array(4);
		//[pondVol, bypassFlow, deficit, pondWaterDepth]
		array[i].fill(0, 0);
	}
}

generateGraphData.allYearsAveraged = function(allYears, increments){

	//fill the output array with zero
	var outputArray = new Array(increments.length);
	fillThree(outputArray);
	//Add every months data from each year to the appropriate volume increment
	for(var i = 0; i < allYears.length; i++){
		if(allYears[i] && typeof allYears[i] !== "undefined"){
			for(var j = 0; j < allYears[i].length; j++){
				if(allYears[i][j] && typeof allYears[i][j] !== "undefined"){
					for(var k = 0; k < allYears[i][j].length; k++){
						if(allYears[i][j][k] && typeof allYears[i][j][k] !== "undefined"){
							outputArray[j][1] += allYears[i][j][k].bypassFlowVol;
							outputArray[j][2] += allYears[i][j][k].deficitVol;
						}
					}
				}
			}
		}
	}

	for(i = 0; i < outputArray.length; i++){
		if(typeof outputArray[i] !== "undefined"){
			outputArray[i][0] = increments[i];
			outputArray[i][1] /= allYears.length;
			outputArray[i][2] /= allYears.length;
		}
	}

	return outputArray;
};


generateGraphData.allYearsByPondVolume = function(allYears, increments, specificPondVolume){
	//need smallestVolume and increment to determine what index we should look at within allYears[year][?]

	var outputArray = new Array(12);	//this array will be contain an array for every month
	fillFour(outputArray);
	
	var currentIncrement = increments.findIndex((vol)=>{
		return vol === specificPondVolume;
	});


	for(var i = 0; i < allYears.length; i++){
		if(allYears[i][currentIncrement] && typeof allYears[i] !== "undefined" && typeof allYears[i][currentIncrement] !== "undefined"){
			for(var k = 0; k < allYears[i][currentIncrement].length; k++){
				if(allYears[i][currentIncrement][k] && typeof allYears[i][currentIncrement][k] !== "undefined"){
					outputArray[k][1] += allYears[i][currentIncrement][k].bypassFlowVol;
					outputArray[k][2] += allYears[i][currentIncrement][k].deficitVol;
					outputArray[k][3] += allYears[i][currentIncrement][k].pondWaterDepth;
				}
			}
		}
	}

	for(i = 0; i < outputArray.length; i++){
		//set each month to numerical value starting from 0
		if(typeof outputArray[i] !== "undefined"){
			outputArray[i][0] = i;
			outputArray[i][1] /= allYears.length;
			outputArray[i][2] /= allYears.length;
			outputArray[i][3] /= allYears.length;
		}
	}
	console.log(allYears);
	console.log(outputArray);

	return outputArray;
};

generateGraphData.allMonthsByYear = function(allYears, increments, initialYear, specificPondVolume, specificYear){
//need smallestVolume and increment to determine what index we should look at within allYears[year][?]
	var outputArray = new Array(12);	//this array will be contain an array for every month
	fillFour(outputArray);

	var currentIncrement = increments.findIndex((vol)=>{
		return vol === specificPondVolume;
	});
	var yearIndex = specificYear - initialYear;

	if(typeof allYears[yearIndex] !== "undefined" && typeof allYears[yearIndex][currentIncrement] !== "undefined"){

		for(var k = 0; k < allYears[yearIndex][currentIncrement].length; k++){
			if(typeof allYears[yearIndex][currentIncrement][k] !== "undefined"){
				outputArray[k][1] += allYears[yearIndex][currentIncrement][k].bypassFlowVol;
				outputArray[k][2] += allYears[yearIndex][currentIncrement][k].deficitVol;
				outputArray[k][3] += allYears[yearIndex][currentIncrement][k].pondWaterDepth;
			}
		}
	}

	for(var i = 0; i < outputArray.length; i++){
		//set each month to numerical value starting from 0
		if(typeof outputArray[i] !== "undefined"){
			outputArray[i][0] = i;
		}
	}

	return outputArray;
};
