_ = require('lodash');

polygons = require('./public/final_index_FeaturesToJSON.json');

var groupedByY = _.groupBy(polygons.features, f => {
  return f.geometry.coordinates[0][0][1];
});

for(var i = 0; i < groupedByY.length; i++) {
  groupedByY[i] = _.sortBy(groupedByY[i], f => {
    return f.geometry.coordinates[0][0][0]
  });
}

console.log(groupedByY);
