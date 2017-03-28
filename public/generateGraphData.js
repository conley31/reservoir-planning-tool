/* The following functions need to be used to grab needed graphing data for a specific graph */

//all of these will need access to the return array from TDPAlg.calc()

/*this is more or less pseudocode as I don't know exactly where each of these will be called.*/

//the below variables can be grabbed from TDPAlg.js
var allYears =
var increments = 
var initialYear = 

function fillThree(array){
	for(var i = 0; i < array.length; i++){
		array[i] = new Array(3);
		array[i].fill(0, 0);
	}
}

/*TESTED AND PASSING*/
exports.allYearsAveraged = function(allYears, increments, initialYear){

        //fill the output array with zero
        var outputArray = new Array(increments.length);
        fillThree(outputArray);
        //Add every months data from each year to the appropriate volume increment
        for(var i = 0; i < allYears.length; i++){           
                for(var j = 0; j < allYears[i].length; j++){
                        for(var k = 0; k < allYears[i][j].length; k++){
                                outputArray[j][1] += allYears[i][j][k].bypassFlowVol;
                                outputArray[j][2] += allYears[i][j][k].deficitVol;
                        }   
                }   
        }

        for(i = 0; i < outputArray.length; i++){
                outputArray[i][0] = increments[i];
                outputArray[i][1] /= allYears.length;
                outputArray[i][2] /= allYears.length;
        }
             
             
        return outputArray;
}

exports.allYearsAveragedByMonth = function(allYears, increments, specificPondVolume){

	var outputArray = new Array(12);	//this array will be contain an array for every month
	fillThree(outputArray);
	console.log(outputArray);	

	var currentIncrement = increments.findIndex((vol)=>{
		return vol === specificPondVolume;
	});

	for(var i = 0; i < allYears.length; i++){
		for(var k = 0; k < allYears[i][currentIncrement].length; k++){
			outputArray[k][1] += allYears[i][currentIncrement][k].bypassFlowVol;
			outputArray[k][2] += allYears[i][currentIncrement][k].deficitVol;
		}
	}	

	for(i = 0; i < outputArray.length; i++){
		//set each month to numerical value starting from 0		
		outputArray[i][0] = i;
		
		outputArray[i][1] /= allYears.length;
		outputArray[i][2] /= allYears.length;
	}
}

function allMonthsByYear(specificPondVolume, specificYear){
//need smallestVolume and increment to determine what index we should look at within allYears[year][?]
	var outputArray = new Array(12);	//this array will be contain an array for every month
	outputArray.fill([0,0,0],0);	

	var currentIncrement = increments.findIndex((vol)=>{
		return vol === specificPondVolume;
	});
	var yearIndex = specificYear - initialYear;
	for(var k = 0; k < allYears[yearIndex][currentIncrement].length; k++){
		outputArray[k][1] += allYears[yearIndex][currentIncrement][k].bypassFlowVol;
		outputArray[k][2] += allYears[yearIndex][currentIncrement][k].deficitVol;
	}

	for(var i = 0; i < outputArray.length; i++){
		//set each month to numerical value starting from 0
		outputArray[i][0] = i;
	}
}