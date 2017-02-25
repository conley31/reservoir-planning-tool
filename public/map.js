/*
 *   Maps
 */
var map;
var selectedFeature;

// Function to initialize the Google Map, this gets called by the Google maps API
var initMap = function() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 41.8781,
      lng: -87.6298
    },
    zoom: 6
  });

  map.data.loadGeoJson('final_index_FeaturesToJSON.json');
  map.data.setStyle({
    fillColor: 'white',
    fillOpacity: 0,
    strokeWeight: 1
  });

  map.addListener('zoom_changed', function() {
    if (map.getZoom() < 6) {
      map.setZoom(6);
    } else if (map.getZoom() > 11) {
      map.setZoom(11);
    }
  });

  // Registers a click event for a single polygon
  map.data.addListener('click', function(event) {
    selectLocation(event.feature);
    map.data.overrideStyle(event.feature, {
      fillColor: 'green',
      fillOpacity: 0.8
    });
  });

  var locMarker = new google.maps.Marker({
    map: map,
    title: "Your Location"
  });
  // Geolocation for HTML5 compatible browsers
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      locMarker.setPosition(pos);
    });
  }
};

var selectLocation = function(feature) {
  map.data.overrideStyle(selectedFeature, {
    fillColor: 'white',
    fillOpacity: 0,
    strokeWeight: 1
  });

  selectedFeature = feature;

  $('#mapselection').text('You selected id: ' + selectedFeature.getProperty('Id'));
};
