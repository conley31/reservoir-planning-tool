var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
var dir = require('../algorithms.js');

it('should return the annual irrigation supplied',function(){
    this.timeout(0);
    var data = dir.calcAllLocations(80,10,1,16,7.6,4.2);
    console.log(data.allCells[1].annualIrrigationDepthSupplied);
    expect(data.allCells[1].annualIrrigationDepthSupplied).to.be.a('number');
});
