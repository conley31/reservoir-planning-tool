/* The following functions need to be used to grab needed graphing data for a specific graph */

//all of these will need access to the return array from TDPAlg.calc()
document.generateGraphData = {};
document.months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

function fillThree(array){
	for(var i = 0; i < array.length; i++){
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
function latestIndex(arr){
	for(var i = (arr.length -1); i >= 0; i--){
		if(typeof arr[i] !== "undefined"){
			return i;
		}
	}
}
function leapYear(year){
  return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
}

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

document.generateGraphData.allYearsAveraged = function(allYears, increments){

	//fill the output array with zero
	var outputArray = new Array(increments.length);
	fillThree(outputArray);
	//Add every months data from each year to the appropriate volume increment
	for(var i = 0; i < allYears.length; i++){
		if(allYears[i] && typeof allYears[i] !== "undefined"){
			for(var j = 0; j < allYears[i].length; j++){
				if(allYears[i][j] && typeof allYears[i][j] !== "undefined"){
						var k = latestIndex(allYears[i][j]);
						if(allYears[i][j][k] && typeof allYears[i][j][k] !== "undefined"){
							outputArray[j][1] += allYears[i][j][k].bypassFlowVol;
							outputArray[j][2] += allYears[i][j][k].deficitVol;
						}
				}
			}
		}
	}

	for(i = 0; i < outputArray.length; i++){
		if(typeof outputArray[i] !== "undefined"){
			outputArray[i][0] = increments[i];	//pondWaterDepth
			outputArray[i][1] /= allYears.length;	//byPassFlow
			outputArray[i][2] /= allYears.length; 	//deficitVol
		}
	}

	return outputArray;
};


document.generateGraphData.allYearsByPondVolume = function(allYears, increments, specificPondVolume, initialYear){
	//need smallestVolume and increment to determine what index we should look at within allYears[year][?]

	var outputArray = new Array(12);	//this array will be contain an array for every month
	fillFour(outputArray);

	/* Grab the index corresponding to the given pondVolume */
	var currentIncrement = increments.findIndex(function(vol) {
		return vol === specificPondVolume;
	});


	for(var i = 0; i < allYears.length; i++){
		if(allYears[i][currentIncrement] && typeof allYears[i] !== "undefined" && typeof allYears[i][currentIncrement] !== "undefined"){
			for(var k = 0; k < allYears[i][currentIncrement].length; k++){
				if(allYears[i][currentIncrement][k] && typeof allYears[i][currentIncrement][k] !== "undefined"){
					outputArray[k][1] += allYears[i][currentIncrement][k].bypassFlowVol;
					outputArray[k][2] += allYears[i][currentIncrement][k].deficitVol;
					outputArray[k][3] += (allYears[i][currentIncrement][k].pondWaterDepth/daysInMonth(k, initialYear+i));
				}

			}
		}
	}

	for(i = 0; i < outputArray.length; i++){
		//set each month to numerical value starting from 0
		if(typeof outputArray[i] !== "undefined"){
			outputArray[i][0] = document.months[i];
			outputArray[i][1] /= allYears.length;
			outputArray[i][2] /= allYears.length;
			outputArray[i][3] /= allYears.length;
		}
	}

	return outputArray;
};

document.generateGraphData.allMonthsByYear = function(allYears, increments, initialYear, specificPondVolume, specificYear){
//need smallestVolume and increment to determine what index we should look at within allYears[year][?]
	var outputArray = new Array(12);	//this array will be contain an array for every month
	fillFour(outputArray);

	var currentIncrement = increments.findIndex(function(vol) {
		return vol === specificPondVolume;
	});
	var yearIndex = specificYear - initialYear;


	if(typeof allYears[yearIndex] !== "undefined" && typeof allYears[yearIndex][currentIncrement] !== "undefined"){

		for(var k = 0; k < allYears[yearIndex][currentIncrement].length; k++){
			if(allYears[yearIndex][currentIncrement][k] && typeof allYears[yearIndex][currentIncrement][k] !== "undefined"){
				outputArray[k][1] += allYears[yearIndex][currentIncrement][k].bypassFlowVol;
				outputArray[k][2] += allYears[yearIndex][currentIncrement][k].deficitVol;
				console.log(allYears[yearIndex][currentIncrement][k].pondWaterDepth);
				outputArray[k][3] += (allYears[yearIndex][currentIncrement][k].pondWaterDepth /daysInMonth(k, specificYear));
			}
		}
	}

	for(var i = 0; i < outputArray.length; i++){
		//set each month to numerical value starting from 0
		if(typeof outputArray[i] !== "undefined"){
			outputArray[i][0] = document.months[i];
		}
	}

	return outputArray;
};

// Defines the implementation of findIndex for IE.
// https://tc39.github.io/ecma262/#sec-array.prototype.findIndex
if (!Array.prototype.findIndex) {
  Object.defineProperty(Array.prototype, 'findIndex', {
    value: function(predicate) {
     // 1. Let O be ? ToObject(this value).
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      var o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0;

      // 3. If IsCallable(predicate) is false, throw a TypeError exception.
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
      }

      // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
      var thisArg = arguments[1];

      // 5. Let k be 0.
      var k = 0;

      // 6. Repeat, while k < len
      while (k < len) {
        // a. Let Pk be ! ToString(k).
        // b. Let kValue be ? Get(O, Pk).
        // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
        // d. If testResult is true, return k.
        var kValue = o[k];
        if (predicate.call(thisArg, kValue, k, o)) {
          return k;
        }
        // e. Increase k by 1.
        k++;
      }

      // 7. Return -1.
      return -1;
    }
  });
}
