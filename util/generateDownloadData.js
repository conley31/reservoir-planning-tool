var months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

function fillThree(array) {
	for (var i = 0; i < array.length; i++) {
		array[i] = new Array(3);
		array[i].fill(0, 0);
	}
}

function fillFour(array){
	for(var i = 0; i < array.length; i++){
		array[i] = new Array(4);
		array[i].fill(0, 0);
	}
}

/* This is used to return the yearly cumulative value of the last recorded month */
function latestIndex(arr){
	for(var i = (arr.length -1); i >= 0; i--){
		if(typeof arr[i] !== 'undefined'){
			return i;
		}
	}
}
/* Used to determine if a given year is a leap year. */
function leapYear(year){
  return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
}

/* Returns the number of days in a given month of a given year */
function daysInMonth(month, year){
	if(month === 1){
		if(leapYear(year)){
			return 29;
		}
		return 28;
	}
	else if(month <= 6){
		if( month % 2 === 0 ){
			return 31;
		}

		return 30;
	}
	else{
		if(month % 2 === 0){
			return 30;
		}
		return 31;
	}
}

exports.allYearsAveraged = function (allYears, increments) {
	//fill the output array with zero
	var outputArray = new Array(increments.length);
	fillThree(outputArray);
	//Add every months data from each year to the appropriate volume increment
	for (var i = 0; i < allYears.length; i++) {
		if (allYears[i] && typeof allYears[i] !== 'undefined') {
			for (var j = 0; j < allYears[i].length; j++){
				if (allYears[i][j] && typeof allYears[i][j] !== 'undefined') {
					var k = latestIndex(allYears[i][j]);
					if (allYears[i][j][k] && typeof allYears[i][j][k] !== 'undefined') {
						outputArray[j][1] += allYears[i][j][k].bypassFlowVol;
						outputArray[j][2] += allYears[i][j][k].deficitVol;
					}
				}
			}
		}
	}

	for (i = 0; i < outputArray.length; i++) {
		if (typeof outputArray[i] !== 'undefined') {
      outputArray[i] = {
        'Pond Volume (acre-feet)': increments[i],
        'Bypass Flow (acre-feet)': outputArray[i][1] / allYears.length,
        'Storage Deficit (acre-feet)': outputArray[i][2] / allYears.length
      };
		}
	}

	return outputArray;
};

exports.allYearsByPondVolume = function (allYears, increments, specificPondVolume, initialYear) {
	//need smallestVolume and increment to determine what index we should look at within allYears[year][?]

	var outputArray = new Array(12);	//this array will be contain an array for every month
	fillFour(outputArray);
  console.log('increments', typeof increments[0]);
  console.log('specificPondVolume', typeof specificPondVolume);
  console.log('initialYear', initialYear);
	/* Grab the index corresponding to the given pondVolume */
	var currentIncrement = increments.findIndex(function(vol) {
		return vol === parseInt(specificPondVolume);
	});
  console.log('currentIncrement', currentIncrement);
	/* Loop over all years and months with specific increment */
	for (var i = 0; i < allYears.length; i++) {
		if (allYears[i] && allYears[i][currentIncrement] && typeof allYears[i] !== 'undefined' && typeof allYears[i][currentIncrement] !== 'undefined') {
			for (var k = 0; k < allYears[i][currentIncrement].length; k++) {
				if (allYears[i][currentIncrement][k] && typeof allYears[i][currentIncrement][k] !== 'undefined') {
          outputArray[k][1] += allYears[i][currentIncrement][k].bypassFlowVol;
					outputArray[k][2] += allYears[i][currentIncrement][k].deficitVol;
					outputArray[k][3] += (allYears[i][currentIncrement][k].pondWaterDepth/daysInMonth(k, initialYear+i));
				}
			}
		}
	}

	for (i = 0; i < outputArray.length; i++) {
		//set each month to numerical value starting from 0
		if (typeof outputArray[i] !== 'undefined') {

      outputArray[i] = {
        'Month': months[i],
        'Bypass Flow (Cumulative acre-feet)': outputArray[i][1] / allYears.length,
        'Storage Deficit (Cumulative acre-feet)': outputArray[i][2] / allYears.length,
        'Pond Water Depth (feet)': outputArray[i][3] / allYears.length
      };
		}
	}

	return outputArray;
};
