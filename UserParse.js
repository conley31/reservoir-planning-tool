/*jshint esversion: 6 */
var csv = require('fast-csv'),
  fs = require('fs'),
  db = require('./db');

var dateTrack = null;


module.exports.readUserCSV = function(inStream) {
  return new Promise(function(resolve, reject) {
    var buffer = [];
    csv
    .fromStream(inStream, {headers : ["Year", "Month", "Day", "Drainflow", "Precipitation", "PET"]})

    .validate(function(data) {
      return (isValidDate(data.Day, data.Month, data.Year) &&
              isValidNumber(data.Drainflow) &&
              isValidNumber(data.Precipitation) &&
              isValidNumber(data.PET));
    })
    .on("data-invalid", function(data, index) {
      reject(new Error('Invalid row ' + (index + 1) + ': ' + data.Year +
                      ',' + data.Month +
                      ',' + data.Day +
                      ',' + data.Drainflow +
                      ',' + data.Precipitation +
                      ',' + data.PET));
    })
    .on("data", function(data) {
      buffer.push(data);
    })
    .on("end", function() {
      resolve(buffer);
    });
  });
};

/**
 *  verifyAndBlendUserCSV -  Verifies a user's CSV upload and then interlaces missing data with TDP data
 *
 *  Return - Array of Rows -
 *  [{
 *    Year: '1981',
      Month: '1',
      Day: '7',
      Drainflow: 1.0755,
      Precipitation: 2.38,
      PET: 1.6041
 *  }, ...]
 *
 */

module.exports.verifyAndBlendUserCSV = function(id, inStream) {
  return new Promise(function(resolve, reject) {
    var buffer = [];
    var blendedArray = [];

    csv
    .fromStream(inStream, {headers : ["Year", "Month", "Day", "Drainflow", "Precipitation", "PET"]})

    .validate(function(data) {
      return (isValidDate(data.Day, data.Month, data.Year) &&
              isValidNumber(data.Drainflow) &&
              isValidNumber(data.Precipitation) &&
              isValidNumber(data.PET));
    })

    .on("data-invalid", function(data, index) {
      reject(new Error('Invalid row ' + (index + 1) + ': ' + data.Year +
                      ',' + data.Month +
                      ',' + data.Day +
                      ',' + data.Drainflow +
                      ',' + data.Precipitation +
                      ',' + data.PET));
    })
    .on("data", function(data) {
      buffer.push(data);
    })

    .on("end", function() {
      var dataCursor;

      db.getLocationById(id).then(function(data) {
        var locationIndex = seek(data, buffer[0]);
        for(var i = 0; i < buffer.length - 1; i++) {
          blendedArray.push(buffer[i]);
          response = fillGaps(locationIndex, data, buffer[i], buffer[i+1]);
          locationIndex = response[0];
          blendedArray = blendedArray.concat(response[1]);
        }

        blendedArray.push(buffer[buffer.length - 1]);
        resolve(blendedArray);
      });
    });
  });
};

/**
 *  fillGaps -  Checks for any date gaps between userRowStart and userRowEnd.
 *              If gaps exist, then rows are returned from sqlRows data if they exist.
 *
 *  Return - Array of startIndex for sqlRows and Rows to fill gaps -
 *  [2074, {
 *    Year: '1981',
      Month: '1',
      Day: '7',
      Drainflow: 1.0755,
      Precipitation: 2.38,
      PET: 1.6041
 *  }, ...]
 *
 */

function fillGaps(startIndex, sqlRows, userRowStart, userRowEnd) {
  var index = startIndex;
  startDate = new Date(userRowStart.Year, userRowStart.Month, userRowStart.Day);
  endDate = new Date(userRowEnd.Year, userRowEnd.Month, userRowEnd.Day);
  var arr = [];

  while(index < sqlRows.length && sqlRows[index].RecordedDate < endDate) {
    if(sqlRows[index].RecordedDate > startDate) {
      arr.push(formattedHash(sqlRows[index]));
    }
    ++index;
  }

  return [index, arr];
}

/**
 *  formattedHash -  Changes sqlRow to match CSV format
 *
 *  Return - A formatted hash -
 *  {
 *    "Year": "2000",
      "Month": "11",
      "Day": "43",
      "Drainflow": "1.2321",
      "Precipitation": "9.342",
      "PET": "3.21323"
 *  }
 *
 */

function formattedHash(sqlRow) {
  var row = {"Year": sqlRow.RecordedDate.getFullYear().toString(),
             "Month": (sqlRow.RecordedDate.getMonth()).toString(),
             "Day": sqlRow.RecordedDate.getDate().toString(),
             "Drainflow": sqlRow.Drainflow,
             "Precipitation": sqlRow.Precipitation,
             "PET": sqlRow.PET};
  return row;
}

/**
 *  seek -  Finds the first date in an array(rows) that is equal to or greater than
 *          the first row(firstBuf) date from the user uploaded CSV.
 *
 *  Return - int of the index in rows where date is greater.
 *
 */

function seek(rows, firstBuf) {
  var i = 0;
  while(rows[i].RecordedDate < new Date(firstBuf.Year, firstBuf.Month - 1, firstBuf.Day))
    i++;
  return ++i;
}

function isValidDate(day, month, year) {
  if(Number(day) != day)
    return false;

  if(Number(month) != month)
    return false;

  if(Number(year) != year)
    return false;

  if(year < 1900 || year > 3000 || month < 1 || month > 12)
    return false;

  var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

  if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
    monthLength[1] = 29;

  return day > 0 && day <= monthLength[month - 1];

}

function isValidNumber(n) {
  return (!isNaN(n) && Number(n) >= 0);
}

Date.prototype.addDays = function(days) {
  var d = new Date(this.valueOf());
  d.setDate(d.getDate() + days);
  return d;
};

Date.prototype.toShortString = function() {
  var yyyy = this.getFullYear().toString();
  var mm = (this.getMonth()+1).toString();
  var dd  = this.getDate().toString();

  var mmChars = mm.split('');
  var ddChars = dd.split('');

  return yyyy + '-' + (mmChars[1]?mm:"0"+mmChars[0]) + '-' + (ddChars[1]?dd:"0"+ddChars[0]);
};
