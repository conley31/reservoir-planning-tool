_ = require('lodash');

polygons = require('./public/final_index_FeaturesToJSON.json');

// Re-format array
var featuresArray = _.map(polygons.features, f => {
  return {
    pos: {
      lat: f.geometry.coordinates[0][0][1],
      lng: f.geometry.coordinates[0][0][0]
    },
    id: f.properties.Id
  };
});



var features = _.groupBy(featuresArray, f => {
  return f.pos.lat;
});

for (var i = 0; i < features.length; i++) {
  features[i] = _.sortBy(features[i], f => {
    return f.pos.lng;
  });
}


exports.getFeatures = () => {
  return features;
};

console.log(features);
