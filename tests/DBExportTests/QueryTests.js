var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
var chaiAsPromised = require("chai-as-promised");
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
        console.log(db.getPETById(5));
        expect(data).to.be.an('array');
        expect(data[0]).to.have.all.keys('RecordedDate', 'PET');
    });
});
