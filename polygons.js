_ = require('lodash');
polygons = require('./public/final_index_FeaturesToJSON.json');

// Re-format array
var featuresArray = _.map(polygons.features, f => {
  return {
    // Lower right-hand corner of the polygon
    pos: {
      lat: f.geometry.coordinates[0][1][1],
      lng: f.geometry.coordinates[0][1][0]
    },
    id: f.properties.Id
  };
});

// Group by longitude
var features = _.groupBy(featuresArray, f => {
  return f.pos.lng;
});
var lngs = _.map(Object.keys(features), parseFloat).sort(function(a, b) {
  return a - b;
});

// Sort by Latitude
for (var i = 0; i < features.length; i++) {
  features[i] = _.sortBy(features[i], f => {
    return f.pos.lat;
  });
}

exports.getLocation = (pos) => {
  for (var i = 0; i < lngs.length; i++) {
    if (lngs[i] >= pos.lng) {
      // List of polygons with the right lng
      var list = features[lngs[i]];
      for (var j = 0; j < list.length; j++) {
        if (list[j].pos.lat >= pos.lat) {
          return list[j - 1];
        }
      }
    }
  }
};

exports.getFeatures = () => {
  return features;
};

// console.log(exports.getLocation({
//   lat: 40.4259,
//   lng: -89.9081
// }));
