var csv = require('fast-csv');
var fs = require('fs');

function verifyUserCSV(userStream) {
  csv
    .fromStream(userStream, {headers : ["Year", "Month", "Day", "Drainflow", "Precipitation", "PET"]})
    .validate(function(data) {
      return (isValidDate(data["Day"], data["Month"], data["Year"]) &&
              isValidNumber(data["Drainflow"]) &&
              isValidNumber(data["Precipitation"]) &&
              isValidNumber(data["PET"]));
    })
    .on("data-invalid", function(data, index) {
      throw new Error('Line ' + (index + 1) + ': ' + data["Year"]
                      + ',' + data["Month"]
                      + ',' + data["Day"]
                      + ',' + data["Drainflow"]
                      + ',' + data["Precipitation"]
                      + ',' + data["PET"]);
    })
};

function isValidDate(day, month, year) {
  if(Number(day) != day)
    return false;

  if(Number(month) != month)
    return false

  if(Number(year) != year)
    return false

  if(year < 1900 || year > 3000 || month < 1 || month > 12)
    return false;
  
  var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

  if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
    monthLength[1] = 29;

  return day > 0 && day <= monthLength[month - 1];

}

function isValidNumber(n) {
  return (!isNaN(n) && Number(n) >= 0)
}


var stream = fs.createReadStream("db/daily_files/Daily_48.9375_-99.1875.txt");
try {
  verifyUserCSV(stream)
}
catch (e) {
  console.log(e);
}
