/*jshint esversion: 6 */
var csv = require('fast-csv'),
  fs = require('fs'),
  db = require('../db');

var dateTrack = null;

module.exports.readUserCSV = function(inStream) {
  return new Promise(function(resolve, reject) {
    var buffer = [];
    csv
      .fromStream(inStream, {
        headers: ['Year', 'Month', 'Day', 'Drainflow', 'Precipitation', 'PET']
      })

      .validate(function(data) {
        return (isValidDate(data.Day, data.Month, data.Year) &&
          isValidNumber(data.Drainflow) &&
          isValidNumber(data.Precipitation) &&
          isValidNumber(data.PET));
      })

      .on('data-invalid', function(data, index) {
        reject(new Error('Invalid row ' + (index + 1) + ': ' + data.Year +
          ',' + data.Month +
          ',' + data.Day +
          ',' + data.Drainflow +
          ',' + data.Precipitation +
          ',' + data.PET));
      })

      .on('data', function(data) {
        buffer.push(data);
      })

      .on('end', function() {
        resolve(buffer);
      });
  });
};

/*
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
      .fromStream(inStream, {
        headers: ['Year', 'Month', 'Day', 'Drainflow', 'Precipitation', 'PET']
      })

      .validate(function(data) {
        return (isValidDate(data.Day, data.Month, data.Year) &&
          isValidNumber(data.Drainflow) &&
          isValidNumber(data.Precipitation) &&
          isValidNumber(data.PET));
      })

      .on('data-invalid', function(data, index) {
        reject(new Error('Invalid row ' + (index + 1) + ': ' + data.Year +
          ',' + data.Month +
          ',' + data.Day +
          ',' + data.Drainflow +
          ',' + data.Precipitation +
          ',' + data.PET +
          '\n CSV Format(Year, Month, Day, Drainflow(in), Precipitation(in), PET(in))'));
      })
      .on('data', function(data) {
        buffer.push(data);
      })

      .on('error', function(error) {
        reject(new Error('CSV Format(Year, Month, Day, Drainflow(in), Precipitation(in), PET(in))'));
      })

      .on('end', function() {
        var dataCursor;

        resolve(toSQLFormat(buffer));
        //activate to re-enable blending user and db data (requires location id)
        // db.getLocationById(id).then(function(data) {
        //   var userRows = toSQLFormat(buffer);
        //   resolve(blendArray(data, userRows));
        // });
      });
  });
};

function toSQLFormat(userRows) {
  var sqlRowsFormat = [];
  for(var i = 0; i < userRows.length; i++) {
    sqlRowsFormat.push({
      RecordedDate: new Date(userRows[i].Year, userRows[i].Month - 1, userRows[i].Day),
      Drainflow: userRows[i].Drainflow,
      Precipitation: userRows[i].Precipitation,
      PET: userRows[i].PET
    });
  }
  return sqlRowsFormat;
}

/*
 *  blendArray -  Fully blends userCSV data with sqlRows.
 *                Adds sqlRows less than the start of userCSV
 *                data. Adds sqlRows that occur inbetween userCSV
 *                rows of data. Adds sqlRows that occur after the
 *                end of userCSV.
 *
 *  Return - Array of userRows blended with sqlRows -
 *  [ {
 *    'RecordedDate': 1980-10-08T05:00:00.000Z,
 *    'Drainflow': '1.2321',
 *    'Precipitation': '9.342',
 *    'PET': '3.21323'
 *  }, ...]
 *
 */

function blendArray(sqlRows, userRows) {
  var startDate = userRows[0].RecordedDate.setHours(0, 0, 0, 0);
  var endDate = userRows[userRows.length - 1].RecordedDate.setHours(0, 0, 0, 0);
  var blendedArray = [];
  var index = 0;
  //Add data that exists before userRows data begins
  while (sqlRows.length > index && sqlRows[index].RecordedDate.setHours(0, 0, 0, 0) < startDate) {
    blendedArray.push(sqlRows[index]);
    ++index;
  }
  //Fill gaps inbetween dates in userRows
  for (var i = 0; i < userRows.length - 1; i++) {
    blendedArray.push(userRows[i]);
    resp = fillGaps(index, sqlRows, userRows[i], userRows[i + 1]);
    index = resp[0];
    blendedArray.concat(resp[1]);
  }
  //Add data that exists after userRows end
  blendedArray.push(userRows[userRows.length - 1]);
  while (index < sqlRows.length) {
    if (sqlRows[index].RecordedDate.setHours(0, 0, 0, 0) > endDate)
      blendedArray.push(sqlRows[index]);
    ++index;
  }
  return blendedArray;
}

/*
 *  fillGaps -  Checks for any date gaps between userRowStart and userRowEnd.
 *              If gaps exist, then rows are returned from sqlRows data if they exist.
 *
 *  Return - Array of startIndex for sqlRows and Rows to fill gaps -
 *  [2074, {
 *    'RecordedDate': 1980-10-08T05:00:00.000Z,
 *    'Drainflow': '1.2321',
 *    'Precipitation': '9.342',
 *    'PET': '3.21323'
 *  }, ...]
 *
 */

function fillGaps(startIndex, sqlRows, userRowStart, userRowEnd) {
  var index = startIndex;
  startDate = new Date(userRowStart.Year, userRowStart.Month, userRowStart.Day);
  endDate = new Date(userRowEnd.Year, userRowEnd.Month, userRowEnd.Day);
  var arr = [];

  while (index < sqlRows.length && sqlRows[index].RecordedDate < endDate) {
    if (sqlRows[index].RecordedDate > startDate) {
      arr.push((sqlRows[index]));
    }
    ++index;
  }

  return [index, arr];
}

/*
 *  addPETs -  Master function to addPET. Loops through all userRows and
 *             passes each userRow and sqlRows to addPETs.
 *
 *  Return - Array of userRows with PETs added -
 *  [ {
 *    'RecordedDate': 1980-10-08T05:00:00.000Z,
 *    'Drainflow': '1.2321',
 *    'Precipitation': '9.342',
 *    'PET': '3.21323'
 *  }, ...]
 *
 */

function addPETs(sqlRows, userRows) {
  var buffer = [];
  for (var index in userRows) {
    resp = addPET(sqlRows, userRows[index]);
    if (resp !== null)
      buffer.push(resp);
  }
  return buffer;
}

/*
 *  addPET  -  Searches SQL Rows to find a date that matches the userRow.
 *             Once found, it sets the PET var of userRow and returns the row.
 *             If the row cannot be matched, then null is returned and the row
 *             should be discarded.
 *
 *  Return - SUCCESS - One userRow with PET value set -
 *  {
 *    'RecordedDate': 1980-10-08T05:00:00.000Z,
 *    'Drainflow': '1.2321',
 *    'Precipitation': '9.342',
 *    'PET': '3.21323'
 *  }
 *
 *  Return - FAIL - NULL
 *
 */

function addPET(sqlRows, userRow) {
  row = arraytoSQLFormat(userRow);
  index = 0;
  while (index < sqlRows.length) {
    if (sqlRows[index].RecordedDate.setHours(0, 0, 0, 0) === row.RecordedDate.setHours(0, 0, 0, 0)) {
      row.PET = sqlRows[index].PET;
    }
    ++index;
  }
  if (!('PET' in row))
    return null;
  return row;
}

/*
 *  arraytoSQLFormat -  Changes CSVRow to match SQL format
 *
 *  Return - A formatted hash -
 *  {
 *    'RecordedDate': 1980-10-08T05:00:00.000Z,
 *    'Drainflow': '1.2321',
 *    'Precipitation': '9.342',
 *    'PET': '3.21323'
 *  }
 *
 */

function arraytoSQLFormat(CSVRow) {
  var row = {
    'RecordedDate': new Date(CSVRow.Year, CSVRow.Month - 1, CSVRow.Day),
    'Drainflow': CSVRow.Drainflow,
    'Precipitation': CSVRow.Precipitation,
    'PET': null
  };
  return row;
}

/*
 *  seek -  Finds the first date in an array(rows) that is equal to or greater than
 *          the first row(firstBuf) date from the user uploaded CSV.
 *
 *  Return - int of the index in rows where date is greater.
 *
 */

function seek(rows, firstBuf) {
  var i = 0;
  while (rows[i].RecordedDate < new Date(firstBuf.Year, firstBuf.Month - 1, firstBuf.Day))
    i++;
  return ++i;
}

function isValidDate(day, month, year) {
  if (Number(day) != day)
    return false;

  if (Number(month) != month)
    return false;

  if (Number(year) != year)
    return false;

  if (year < 1900 || year > 3000 || month < 1 || month > 12)
    return false;

  var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0))
    monthLength[1] = 29;

  return day > 0 && day <= monthLength[month - 1];

}

function isValidNumber(n) {
  return (!isNaN(n) && Number(n) >= 0 && n !== '');
}

Date.prototype.addDays = function(days) {
  var d = new Date(this.valueOf());
  d.setDate(d.getDate() + days);
  return d;
};

Date.prototype.toShortString = function() {
  var yyyy = this.getFullYear().toString();
  var mm = (this.getMonth() + 1).toString();
  var dd = this.getDate().toString();

  var mmChars = mm.split('');
  var ddChars = dd.split('');

  return yyyy + '-' + (mmChars[1] ? mm : '0' + mmChars[0]) + '-' + (ddChars[1] ? dd : '0' + ddChars[0]);
};
