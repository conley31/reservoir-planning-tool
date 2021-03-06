/*jshint esversion: 6 */
/*
   -------TDPAlg.js**-------
Notes:
-This file exports the algorithm developed by the Transforming Drainage Project.
-All variables that are preceded by an underscore are from form inputs
-All values are in acre/feet or feet
*/

var db = require('../db');
var userparse = require('./UserParse');
require('./decimal-round');

/* monthlyData will be an object that is used inside of allYears to represent each month */
function monthlyData() {
  this.bypassFlowVol = 0;
  this.deficitVol = 0;
  this.pondWaterDepth = 0;
  this.evapVol = 0;
  this.irrigationVol = 0;
  this.seepageVol = 0;
  this.inflowVol = 0;
  this.pondPrecipVol = 0;
  this.bypassFlowVolM = 0;
  this.deficitVolM = 0;
  this.capturedFlowVol = 0;
}

exports.calc = function(_drainedArea, _pondVolSmallest, _pondVolLargest, _pondVolIncrement, _pondDepth, _pondDepthInitial,
  _maxSoilMoisture, _irrigationArea, _irrigationDepth, _availableWaterCapacity, _locationId, _csvFileStream) {

  var params = arguments;

  return new Promise(function(resolve, reject) {
    /* Sanitize inputs from client */
    for (var prop in params) {
      /* The only paramters that are allowed to be undefined is _csvFileStream and _locationId */
      if (prop !== (params.length - 1).toString() && prop !== (params.length - 2)) {
        if (typeof params[prop] !== 'number') {
          reject(new Error('Undefined Input:' + prop));
        }
      }
    }

    /*
      *********************************NEEDED ERROR CHECKS****************************************
      -pondVolLargest cannot be smaller than the smallest.
      -pondDepth cannot be less than or equal to zero.
      -pondVolSmallest cannot be less than zero.
      -pondVolIncrement cannot be greater than the difference in smallest and largest pond volume.
      ********************************************************************************************

    */
    if ((_pondVolLargest - _pondVolSmallest) < 0 || _pondDepth <= 0 || _pondVolSmallest < 0) {
      reject(new Error('Invalid Input Creating Divide By Zero Error'));
    }

    if (_pondVolIncrement > (_pondVolLargest - _pondVolSmallest)) {
      reject(new Error('Pond increment cannot be larger than the difference between the largest and smallest pond volumes.'));
    }

    pullData(_locationId, _csvFileStream).then(function(data) {
      /*dailyData is an object that will be used for creating downloadable CSV */
      var dailyData = {};
      /* allYears stores data for graphs on the client */
      var allYears = [];
      /*
         increments will store the actual pondVolumes that go along with each increment.
         Pond volumes are not stored within allYears, so increments will be passed to client as well
      */
      var increments = [];
      const numberOfIncrements = ((_pondVolLargest - _pondVolSmallest) / _pondVolIncrement);
      const seepageVolDay = 0.01;
      var initialYear = null;

      /* Run the calculation for every pond increment */
      for (var i = 0; i <= numberOfIncrements; i++) {
        var pondVol = _pondVolSmallest + (i * _pondVolIncrement);
        increments[i] = pondVol;
        var pondArea = pondVol / _pondDepth;
        dailyData[pondVol] = [];

        /*
        **********************************************
                   DAY-1 VALUES
        ***********************************************
        */
        var soilMoistureDepthDayPrev = _maxSoilMoisture; //inches
        var pondWaterVolDayPrev = _pondDepthInitial * pondArea; //acre-feet


        /* LOOP THROUGH EVERY DAY(ROW) in Database */
        for (var j = 0; j < data.length; j++) {
          /*
          **********************************************
                     DAILY VALUES
          **********************************************
          */
          var currentDate = data[j].RecordedDate; // Javascript Date object
          var currentYear = currentDate.getFullYear();
          var currentMonth = currentDate.getMonth();


          if (initialYear === null) {
            initialYear = currentYear;
          }

          var inflowVolDay = (data[j].Drainflow / 12) * _drainedArea;
          var precipDepthDay = data[j].Precipitation;
          var evapDepthDay = data[j].PET;


          var irrigationVolDay = 0;
          var deficitVolDay = 0;

          var evapVolDay = (evapDepthDay / 12) * pondArea;

          var pondPrecipVolDay = (precipDepthDay / 12) * pondArea;


          var soilMoistureDepthDay = (soilMoistureDepthDayPrev + precipDepthDay - evapDepthDay);

          /* soilMoistureDepthDay cannot be negative */
          if (soilMoistureDepthDay < 0) {
            soilMoistureDepthDay = 0;
          }

          if (soilMoistureDepthDay > _maxSoilMoisture) {
            soilMoistureDepthDay = _maxSoilMoisture;
          }

          var pondWaterVolDay = pondWaterVolDayPrev;

          if (soilMoistureDepthDay < (0.5 * _availableWaterCapacity)) {

            if (pondVol === 0) {
              irrigationVolDay = 0;
            } else {
              irrigationVolDay = (_irrigationDepth / 12) * _irrigationArea;
            }

            if (irrigationVolDay > pondWaterVolDay) {
              deficitVolDay = (irrigationVolDay - pondWaterVolDay);
            }

            if (deficitVolDay > 0) {
              irrigationVolDay = irrigationVolDay - deficitVolDay;
            }

            soilMoistureDepthDay = (soilMoistureDepthDayPrev + precipDepthDay + ((irrigationVolDay * 12) / _irrigationArea) - evapDepthDay);
          }

          if (soilMoistureDepthDay < 0) {
            soilMoistureDepthDay = 0;
          }

          if (soilMoistureDepthDay > _maxSoilMoisture) {
            soilMoistureDepthDay = _maxSoilMoisture;
          }

          pondWaterVolDay = (pondWaterVolDayPrev + inflowVolDay + pondPrecipVolDay - irrigationVolDay - seepageVolDay - evapVolDay);

          /* pondWaterVolDay cannot be negative */
          if (pondWaterVolDay < 0) {
            pondWaterVolDay = 0;
          }

          var bypassFlowVolDay = 0;

          if (pondWaterVolDay > pondVol) {
            bypassFlowVolDay = pondWaterVolDay - pondVol;
            pondWaterVolDay = pondVol;
          }

          var capturedFlowVolDay = 0;
          capturedFlowVolDay = Math.min(inflowVolDay, pondVol - pondWaterVolDay);

          var pondWaterDepthDay = pondWaterVolDay / pondArea;

          /*
          **************************************************************************************************************

                        WRITE OUT ALL DAILY INFORMATION HERE. -- This gets output to the User's output CSV

          (Write Date, InflowVolDay, EvaporationVolDay, SeepageVolDay, IrrigationVolDay, BypassVolDay, PondWaterDepthDay)

          ***************************************************************************************************************
          */
          dailyData[pondVol].push({
            "date": currentDate,
            "inflowVol (acre-feet)": Math.round10(inflowVolDay, -3),
            "evaporationVol (acre-feet)": Math.round10(evapVolDay, -3),
            "seepageVol (acre-feet)": Math.round10(seepageVolDay, -3),
            "irrigationVol (acre-feet)": Math.round10(irrigationVolDay, -3),
            "bypassVol (acre-feet)": Math.round10(bypassFlowVolDay, -3),
            "pondWaterDepth (feet)": Math.round10(pondWaterDepthDay, -3),
            "deficitVol (acre-feet)": Math.round10(deficitVolDay, -3),
            "precipDepth (feet)": Math.round10(precipDepthDay, -3),
            "pondWaterVolDay": Math.round10(pondWaterVolDay, -3),
            "capturedFlowVolDay": Math.round10(capturedFlowVolDay, -3),
            "soilMoistureDepthDay": Math.round10(soilMoistureDepthDay, -3)
          });

          /* update the (day-1) variables */
          soilMoistureDepthDayPrev = soilMoistureDepthDay;
          pondWaterVolDayPrev = pondWaterVolDay;


          if (typeof allYears[currentYear - initialYear] === 'undefined') {
            allYears[currentYear - initialYear] = [];
          }
          if (typeof allYears[currentYear - initialYear][i] === 'undefined') {
            allYears[currentYear - initialYear][i] = [];
          }
          if (typeof allYears[currentYear - initialYear][i][currentMonth] === 'undefined') {
            allYears[currentYear - initialYear][i][currentMonth] = new monthlyData();
          }


          /*****************************************************************************************
             The values for bypassFlowVol and deficitVol are cumulative. If the current month value
             is zero then it is safe to add the previous month's values into current month.
          ******************************************************************************************/

          if (allYears[currentYear - initialYear][i][currentMonth].bypassFlowVol === 0) {
            if (currentMonth !== 0 && typeof allYears[currentYear - initialYear][i][currentMonth - 1] !== 'undefined') {
              allYears[currentYear - initialYear][i][currentMonth].bypassFlowVol = allYears[currentYear - initialYear][i][currentMonth - 1].bypassFlowVol;
            }
          }

          if (allYears[currentYear - initialYear][i][currentMonth].deficitVol === 0) {
            if (currentMonth !== 0 && typeof allYears[currentYear - initialYear][i][currentMonth - 1] !== 'undefined') {
              allYears[currentYear - initialYear][i][currentMonth].deficitVol = allYears[currentYear - initialYear][i][currentMonth - 1].deficitVol;
            }
          }

          if (allYears[currentYear - initialYear][i][currentMonth].capturedFlowVol === 0) {
            if (currentMonth !== 0 && typeof allYears[currentYear - initialYear][i][currentMonth - 1] !== 'undefined') {
              allYears[currentYear - initialYear][i][currentMonth].capturedFlowVol = allYears[currentYear - initialYear][i][currentMonth - 1].capturedFlowVol;
            }
          }

          if (allYears[currentYear - initialYear][i][currentMonth].irrigationVol === 0) {
            if (currentMonth !== 0 && typeof allYears[currentYear - initialYear][i][currentMonth - 1] !== 'undefined') {
              allYears[currentYear - initialYear][i][currentMonth].irrigationVol = allYears[currentYear - initialYear][i][currentMonth - 1].irrigationVol;
            }
          }

          allYears[currentYear - initialYear][i][currentMonth].bypassFlowVol += bypassFlowVolDay;
          allYears[currentYear - initialYear][i][currentMonth].deficitVol += deficitVolDay;
          allYears[currentYear - initialYear][i][currentMonth].pondWaterDepth += pondWaterDepthDay;
          allYears[currentYear - initialYear][i][currentMonth].evapVol += evapVolDay;
          allYears[currentYear - initialYear][i][currentMonth].irrigationVol += irrigationVolDay;
          allYears[currentYear - initialYear][i][currentMonth].seepageVol += seepageVolDay;
          allYears[currentYear - initialYear][i][currentMonth].inflowVol += inflowVolDay;
          allYears[currentYear - initialYear][i][currentMonth].pondPrecipVol += pondPrecipVolDay;
          allYears[currentYear - initialYear][i][currentMonth].bypassFlowVolM += bypassFlowVolDay;
          allYears[currentYear - initialYear][i][currentMonth].deficitVolM += deficitVolDay;
          allYears[currentYear - initialYear][i][currentMonth].capturedFlowVol += capturedFlowVolDay;
        }

      }

      resolve({
        graphData: allYears,
        incData: increments,
        firstYearData: initialYear,
        dailyData: dailyData
      });

    }).catch(function(reason) {
      if (reason.message.includes('ECONNREFUSED')) {
        console.error('Error connecting to MySQL. Did you start MySQL?');
        reason.message = 'Error connecting to MySQL: ' + reason.message;
      } else if (reason.message.includes('CSV')) {
        reason.message = 'Invalid CSV: ' + reason.message;
      }
      reject(reason);

    });
  });
};

/*
 *  pullData  -   Chooses whether to just get SQL Data or
 *                if the user has uploaded a CSV that needs
 *                to be blended and then returned.
 *
 *  Return - Either SQLRows or blendedCSV -
 *  [ {
 *    'RecordedDate': 1980-10-08T05:00:00.000Z,
 *    'Drainflow': '1.2321',
 *    'Precipitation': '9.342',
 *    'PET': '3.21323'
 *  }, ...]
 *
 */
function pullData(_locationId, stream) {
  return new Promise(function(resolve, reject) {
    if (typeof stream != 'undefined') {
      resolve(userparse.verifyAndBlendUserCSV(_locationId, stream));
    } else {
      resolve(db.getLocationById(_locationId));
    }
  });
}
