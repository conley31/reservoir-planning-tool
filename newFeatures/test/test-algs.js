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

it('should return annual database data array for location 0',function(){
    this.timeout(0);
    return dir.getData(0).then(function(data){
//        console.log(data);
        expect(data.yearArray).to.be.an('array');
    });
});
