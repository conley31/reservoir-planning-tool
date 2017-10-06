var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
var dir = require('../algorithms.js');

it('should return an array of objects of mapping data',function(){
    this.timeout(0);
    return dir.calcAllLocations(80,10,1,16,7.6,4.2,5).then(function(data){
        expect(data).to.be.an('array');
    });
});

it('should return an array of length 5',function(){
    this.timeout(0);
    return dir.calcAllLocations(80,10,1,16,7.6,4.2,5).then(function(data){
        expect(data.length).to.equal(5);
    });
});

it('should get the number computed for annual captured drainflow',function(){
    this.timeout(0);
    return dir.calcAllLocations(80,10,1,16,7.6,4.2,1).then(function(data){
        expect(data[0].annualIrrigationDepthSupplied).to.be.a('number');
    });

});

it('should return annual database data array for location 0',function(){
    this.timeout(0);
    return dir.getData(0).then(function(data){
        expect(data.yearArray).to.be.an('array');
    });
});

it('should give and error for illegal value',function(){
   expect(dir.calcAllLocations(-80,10,1,16,7.6,4.2,1)).to.be.an('error');
    
});

it('should write a JSON file titled mapData.json',function(){
    this.timeout(0);
    return dir.calcAllLocations(80,10,1,16,7.6,4.2,1).then(function(data){
      dir.makeJson(data).then(function(result){
        expect(file('mapData.json')).to.exist;
      });
    });

});

