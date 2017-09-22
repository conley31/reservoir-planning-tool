var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
var dir = require('../../newFeatures');

it('should return a number that represents the number of tables in the database',function(){
    return dir.getNumberOfTables().then(function(data){
        expect(data).to.be.a('number');
    });
});
