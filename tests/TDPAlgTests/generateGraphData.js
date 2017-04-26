/* The following functions need to be used to grab needed graphing data for a specific graph */

//all of these will need access to the return array from TDPAlg.calc()



function fillThree(array) {
  for (var i = 0; i < array.length; i++) {
    array[i] = new Array(3);
    array[i].fill(0, 0);
  }
}

exports.allYearsAveraged = function(allYears, increments) {

  //fill the output array with zero
  var outputArray = new Array(increments.length);
  fillThree(outputArray);
  //Add every months data from each year to the appropriate volume increment
  for (var i = 0; i < allYears.length; i++) {
    if (typeof allYears[i] !== 'undefined') {
      for (var j = 0; j < allYears[i].length; j++) {
        if (typeof allYears[i][j] !== 'undefined') {
          for (var k = 0; k < allYears[i][j].length; k++) {
            if (typeof allYears[i][j][k] !== 'undefined') {
              outputArray[j][1] += allYears[i][j][k].bypassFlowVol;
              outputArray[j][2] += allYears[i][j][k].deficitVol;
            }
          }
        }
      }
    }
  }

  for (i = 0; i < outputArray.length; i++) {
    if (typeof outputArray[i] !== 'undefined') {
      outputArray[i][0] = increments[i];
      outputArray[i][1] /= allYears.length;
      outputArray[i][2] /= allYears.length;
    }
  }

  return outputArray;
};


exports.allYearsByPondVolume = function(allYears, increments, specificPondVolume) {
  //need smallestVolume and increment to determine what index we should look at within allYears[year][?]

  var outputArray = new Array(12); //this array will be contain an array for every month
  fillThree(outputArray);

  var currentIncrement = increments.findIndex((vol) => {
    return vol === specificPondVolume;
  });

  for (var i = 0; i < allYears.length; i++) {
    if (typeof allYears[i] !== 'undefined' && typeof allYears[i][currentIncrement] !== 'undefined') {
      for (var k = 0; k < allYears[i][currentIncrement].length; k++) {
        if (typeof allYears[i][currentIncrement][k] !== 'undefined') {
          outputArray[k][1] += allYears[i][currentIncrement][k].bypassFlowVol;
          outputArray[k][2] += allYears[i][currentIncrement][k].deficitVol;
        }
      }
    }
  }

  for (i = 0; i < outputArray.length; i++) {
    //set each month to numerical value starting from 0
    if (typeof outputArray[i] !== 'undefined') {
      outputArray[i][0] = i;
      outputArray[i][1] /= allYears.length;
      outputArray[i][2] /= allYears.length;
    }
  }

  return outputArray;
};

exports.allMonthsByYear = function(allYears, increments, initialYear, specificPondVolume, specificYear) {
  //need smallestVolume and increment to determine what index we should look at within allYears[year][?]
  var outputArray = new Array(12); //this array will be contain an array for every month
  fillThree(outputArray);

  var currentIncrement = increments.findIndex((vol) => {
    return vol === specificPondVolume;
  });
  var yearIndex = specificYear - initialYear;

  if (typeof allYears[yearIndex] !== 'undefined' && typeof allYears[yearIndex][currentIncrement] !== 'undefined') {

    for (var k = 0; k < allYears[yearIndex][currentIncrement].length; k++) {
      if (typeof allYears[yearIndex][currentIncrement][k] !== 'undefined') {
        outputArray[k][1] += allYears[yearIndex][currentIncrement][k].bypassFlowVol;
        outputArray[k][2] += allYears[yearIndex][currentIncrement][k].deficitVol;
      }
    }
  }

  for (var i = 0; i < outputArray.length; i++) {
    //set each month to numerical value starting from 0
    if (typeof outputArray[i] !== 'undefined') {
      outputArray[i][0] = i;
    }
  }

  return outputArray;
};
