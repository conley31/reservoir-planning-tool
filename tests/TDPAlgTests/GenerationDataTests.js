var chai = require('chai').assert;
var a = require('./generateGraphData.js');

//Fill function for each test array
function fillArr(array, size, round2){
	for(var i = 0; i < array.length; i++){
		if(!round2){
			array[i] = [];
		}
		else{
			array[i] = new Array(size);	//one for each increment
			fillArr(array[i], 0 ,false);
		}
	}
}

//Generate allYears array
var allYears = new Array(2);
//allYears.fill([[],[]],0);
fillArr(allYears, 2, true);

for(var i = 0; i < allYears.length; i++){
	for(var j = 0; j < allYears[i].length; j++){
		for(var k = 0; k < 12; k++){
			allYears[i][j][k] = {bypassFlowVol: 1, deficitVol: 2};
		}
	}
}

var allYears2 = new Array(2);
//allYears2.fill([ [], [] ], 0);
fillArr(allYears2, 2, true);

for(var i = 0; i < allYears2.length; i++){
	for(var j = 0; j < allYears2[i].length; j++){
		for(var k = 0; k < 12; k++){
			allYears2[i][j][k] = {bypassFlowVol: k + 1, deficitVol: k};
		}
	}
}


var incs = [2,4,6];

var allYears3 = new Array(5);
fillArr(allYears3, 3, true);

for(var i = 0; i < allYears3.length; i++){
	for(var j = 0; j < allYears3[i].length; j++){
		for(var k = 0; k < 12; k++){
			if(k % 2 === 0){
				allYears3[i][j][k] = {bypassFlowVol: 10, deficitVol: k/incs[j]};
			}	
			else{
				allYears3[i][j][k] = {bypassFlowVol: 0, deficitVol: k/incs[j]};

			}
		}
	}
}

var allYears4 = new Array(5);
//allYears4.fill([ [], [], [] ], 0);
fillArr(allYears4, 3, true);

for(var i = 0; i < allYears4.length; i++){
	for(var j = 0; j < allYears4[i].length; j++){
		for(var k = 0; k < 12; k++){
				allYears4[i][j][k] = {bypassFlowVol: i, deficitVol:i};
		}
	}
}

var allYears5 = new Array(5);
//allYears4.fill([ [], [], [] ], 0);
fillArr(allYears5, 3, true);

for(var i = 0; i < allYears5.length; i++){
	for(var j = 0; j < allYears5[i].length; j++){
		for(var k = 0; k < 12; k++){
				allYears5[i][j][k] = {bypassFlowVol: k, deficitVol:k + 1};
		}
	}
}

var allYears6 = new Array(6);
//allYears4.fill([ [], [], [] ], 0);
fillArr(allYears6, 3, true);

for(var i = 0; i < allYears6.length; i++){
	for(var j = 0; j < allYears6[i].length; j++){
		for(var k = 0; k < 12; k++){
				allYears6[i][j][k] = {bypassFlowVol: i+j+k , deficitVol: 0};
		}
	}
}

var allYears7 = new Array(2);
//allYears.fill([[],[]],0);
fillArr(allYears7, 2, true);

for(var i = 0; i < allYears7.length; i++){
	for(var j = 0; j < allYears7[i].length; j++){
		for(var k = 0; k < 12; k++){
			if(i === 1 && j === 0){
				//intentional undefined slot.
			}
			else{
				allYears7[i][j][k] = {bypassFlowVol: 1, deficitVol: 2};
			}
		}
	}
}

var allYears8 = new Array(5);
//allYears4.fill([ [], [], [] ], 0);
fillArr(allYears8, 3, true);

for(var i = 0; i < allYears8.length; i++){
	for(var j = 0; j < allYears8[i].length; j++){
		for(var k = 0; k < 12; k++){
			if(i % 2 == 0){
				allYears8[i][j][k] = {bypassFlowVol: 1, deficitVol:1};
			}
		}
	}
}


describe('Testing Graph 1 Generation: Average of all Years', function(){
	it('Should return a linear set.', function(){
		chai.deepEqual(a.allYearsAveraged(allYears, [2,4]), [[2, 12, 24], [4, 12, 24]]);
	});

	it('Should return a linear set that corresponds to individual months.', function(){
		chai.deepEqual(a.allYearsAveraged(allYears2, [2,4]), [[2, 78, 66], [4, 78, 66]]);
	});
	
	it('Should return a set where each bypassFlowVol is set depding the current increment for allYears3.', function(){
		chai.deepEqual(a.allYearsAveraged(allYears3, [2, 4, 6]), [[2, 60, 33], [4, 60, 16.5], [6,60 ,11]]);
	});

	it('Should return a set where each bypassFlowVol is the same for all pondVolumes in allYears5.', function(){
		chai.deepEqual(a.allYearsAveraged(allYears5, [2, 4, 6]), [ [ 2, 66, 78 ], [ 4, 66, 78 ], [ 6, 66, 78 ] ]);
	});

	it('Should return a set where each deficitVol is 0 increment for allYears6', function(){
		chai.deepEqual(a.allYearsAveraged(allYears6, [2, 4, 6]), [ [ 2, 96, 0 ], [ 4, 108, 0 ], [ 6, 120, 0 ] ]);
	});


});


describe('Testing Graph 2 Generation: Average of all Years By PondVolume', function(){
	it('Tests if two increments return the same values.', function(){
		chai.deepEqual(a.allYearsByPondVolume(allYears4, [2,4,6], 4),a.allYearsByPondVolume(allYears4, [2,4,6], 6) );
	});
	it('Tests if two increments return the same values.', function(){
		chai.deepEqual(a.allYearsByPondVolume(allYears4, [2,4,6], 2),a.allYearsByPondVolume(allYears4, [2,4,6], 4) );
	});
	it('Tests if two increments return the same values.', function(){
		chai.deepEqual(a.allYearsByPondVolume(allYears4, [2,4,6], 2),a.allYearsByPondVolume(allYears4, [2,4,6], 6) );
	});
	it('Should return a set containing all values of 2.', function(){
		chai.deepEqual(a.allYearsByPondVolume(allYears4, [2, 4, 6], 2), 
		[ [ 0, 2, 2 ],
			[ 1, 2, 2 ],
			[ 2, 2, 2 ],
			[ 3, 2, 2 ],
			[ 4, 2, 2 ],
			[ 5, 2, 2 ],
			[ 6, 2, 2 ],
			[ 7, 2, 2 ],
			[ 8, 2, 2 ],
			[ 9, 2, 2 ],
			[ 10, 2, 2 ],
			[ 11, 2, 2 ] 
		]);
	});

	it('Should return a set where each bypassFlowVol = month and the deficitVol = month + 1', function(){
		chai.deepEqual(a.allYearsByPondVolume(allYears5, [2, 4, 6], 4),
			[ [ 0, 0, 1 ],
			[ 1, 1, 2 ],
			[ 2, 2, 3 ],
			[ 3, 3, 4 ],
			[ 4, 4, 5 ],
			[ 5, 5, 6 ],
			[ 6, 6, 7 ],
			[ 7, 7, 8 ],
			[ 8, 8, 9 ],
			[ 9, 9, 10 ],
			[ 10, 10, 11 ],
			[ 11, 11, 12 ] ]
			);
	});

});

	describe('Testing Graph 3 Generation: Output months of a particular year at a particular volume.', function(){
		it('Should return a single year array for PondVolume of 4 in allYears2.', function(){
			chai.deepEqual(a.allMonthsByYear(allYears2, [2,4], 1980, 4, 1980), [ [ 0, 1, 0 ],
				[ 1, 2, 1 ],
				[ 2, 3, 2 ],
				[ 3, 4, 3 ],
				[ 4, 5, 4 ],
				[ 5, 6, 5 ],
				[ 6, 7, 6 ],
				[ 7, 8, 7 ],
				[ 8, 9, 8 ],
				[ 9, 10, 9 ],
				[ 10, 11, 10 ],
				[ 11, 12, 11 ] ]

				);
		});

		it('Should return a single year array for PondVolume of 4 in allYears5.', function(){
			chai.deepEqual(a.allMonthsByYear(allYears5, [2,4,6], 1980, 4, 1980), [ [ 0, 0, 1 ],
				[ 1, 1, 2 ],
				[ 2, 2, 3 ],
				[ 3, 3, 4 ],
				[ 4, 4, 5 ],
				[ 5, 5, 6 ],
				[ 6, 6, 7 ],
				[ 7, 7, 8 ],
				[ 8, 8, 9 ],
				[ 9, 9, 10 ],
				[ 10, 10, 11 ],
				[ 11, 11, 12 ] ]
				);
		});
		it('Should return a single year array for PondVolume of 2 in allYears5.', function(){
			chai.deepEqual(a.allMonthsByYear(allYears5, [2,4,6], 1980, 2, 1980), [ [ 0, 0, 1 ],
				[ 1, 1, 2 ],
				[ 2, 2, 3 ],
				[ 3, 3, 4 ],
				[ 4, 4, 5 ],
				[ 5, 5, 6 ],
				[ 6, 6, 7 ],
				[ 7, 7, 8 ],
				[ 8, 8, 9 ],
				[ 9, 9, 10 ],
				[ 10, 10, 11 ],
				[ 11, 11, 12 ] ]
				);
		});
		it('Tests two years that have have identical months.', function(){
			chai.deepEqual(a.allMonthsByYear(allYears5, [2, 4, 6], 1980, 2, 1980), a.allMonthsByYear(allYears5, [2,4,6], 1980, 2, 1982));
		});
		
		it('Should return a set where each bypassFlowVol = selectedYear - initial + incrementIndex', function(){
			chai.deepEqual(a.allMonthsByYear(allYears6, [2, 4, 6], 1980, 4, 1984), 
				[ [ 0, 5, 0 ],
				[ 1, 6, 0 ],
				[ 2, 7, 0 ],
				[ 3, 8, 0 ],
				[ 4, 9, 0 ],
				[ 5, 10, 0 ],
				[ 6, 11, 0 ],
				[ 7, 12, 0 ],
				[ 8, 13, 0 ],
				[ 9, 14, 0 ],
				[ 10, 15, 0 ],
				[ 11, 16, 0 ] ]

				);
		});
		
	});



describe('Test all graphs with potentially undefined data', function(){
		it('Should contain two subarrays where the first subarray has half the values of array 2. (allYearsAveraged)', function(){
			chai.deepEqual(a.allYearsAveraged(allYears7, [2,4]), [ 	[2, 6, 12], [4, 12, 24] ]);
		});
		it('Tests having undefined values for a given year (allYearsAveraged).', function(){
			chai.deepEqual(a.allYearsAveraged(allYears8, [2,4, 6]), [ 	[2, 7.2, 7.2], [4, 7.2, 7.2], [6, 7.2, 7.2] ]);
		});
		it('Should contain two subarrays where the first subarray has half the values of array 2. (allYearsAveraged)', function(){
			chai.deepEqual(a.allYearsByPondVolume(allYears7, [2,4], 2), [ [ 0, 0.5, 1 ],
				[ 1, 0.5, 1 ],
				[ 2, 0.5, 1 ],
				[ 3, 0.5, 1 ],
				[ 4, 0.5, 1 ],
				[ 5, 0.5, 1 ],
				[ 6, 0.5, 1 ],
				[ 7, 0.5, 1 ],
				[ 8, 0.5, 1 ],
				[ 9, 0.5, 1 ],
				[ 10, 0.5, 1 ],
				[ 11, 0.5, 1 ] ]);
		});

		it('Tests undefined years. (allYearsByPondVolume)', function(){
			chai.deepEqual(a.allYearsByPondVolume(allYears8, [2,4,6], 4), [ [ 0, 0.6, 0.6 ],
				[ 1, 0.6, 0.6 ],
				[ 2, 0.6, 0.6 ],
				[ 3, 0.6, 0.6 ],
				[ 4, 0.6, 0.6 ],
				[ 5, 0.6, 0.6 ],
				[ 6, 0.6, 0.6 ],
				[ 7, 0.6, 0.6 ],
				[ 8, 0.6, 0.6 ],
				[ 9, 0.6, 0.6 ],
				[ 10, 0.6, 0.6 ],
				[ 11, 0.6, 0.6 ] ]
				)
		});

		it('Should contain subarrays containing all zero values aside from pondVolume. (allMonthsByYear)', function(){
			chai.deepEqual(a.allMonthsByYear(allYears7, [2,4], 1980, 2, 1981), [ [ 0, 0, 0 ],
				[ 1, 0, 0 ],
				[ 2, 0, 0 ],
				[ 3, 0, 0 ],
				[ 4, 0, 0 ],
				[ 5, 0, 0 ],
				[ 6, 0, 0 ],
				[ 7, 0, 0 ],
				[ 8, 0, 0 ],
				[ 9, 0, 0 ],
				[ 10, 0, 0 ],
				[ 11, 0, 0 ] ]
				);
		});

		it('Tests undefined years. Should contain all zeros in subarrays.(allMonthsByYear)', function(){
			chai.deepEqual(a.allMonthsByYear(allYears8, [2,4,6], 1980, 2, 1981), [ [ 0, 0, 0 ],
				[ 1, 0, 0 ],
				[ 2, 0, 0 ],
				[ 3, 0, 0 ],
				[ 4, 0, 0 ],
				[ 5, 0, 0 ],
				[ 6, 0, 0 ],
				[ 7, 0, 0 ],
				[ 8, 0, 0 ],
				[ 9, 0, 0 ],
				[ 10, 0, 0 ],
				[ 11, 0, 0 ] ]

				);
		});


		
	});


