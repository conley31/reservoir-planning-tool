var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
var chaiAsPromised = require('chai-as-promised');
var db = require('../../db');

chai.use(chaiAsPromised);

it('should get valid location data from ID', function() { // no done
    return db.getLocationById(5).then(function(data){
        expect(data).to.be.an('array');
    });
});

it('should be rejected for an invalid ID', function() { // no done
    return assert.isRejected(db.getLocationById(-23), "ER_NO_SUCH_TABLE: Table 'tdp.location-23' doesn't exist");
});

it('should require an integer ID', function() { // no done
    return assert.isRejected(db.getLocationById('23'), "Location Id must be a number");
});

it('should get RecordedDate & PET from ID', function() { // no done
    return db.getPETById(5).then(function(data){
        expect(data).to.be.an('array');
        expect(data[0]).to.have.all.keys('RecordedDate', 'PET');
    });
});

it('should get data within a date range for an ID', function() { // no done
  return db.getLocationForDateRange(5, '1981-01-01', '1990-01-01').then(function(data){
      for(i = 0; i < data.length; i++) {
        expect(data[i].RecordedDate).to.satisfy(function(date) { return date > Date.parse('1980-12-31'); });
        expect(data[i].RecordedDate).to.satisfy(function(date) { return date < Date.parse('1990-01-02'); });
      }
  });
});

it('should have a 0 length for data out of range', function() { // no done
  return db.getLocationForDateRange(5, '1781-01-01', '1790-01-01').then(function(data){
      expect(data).to.be.empty;
  });
});
