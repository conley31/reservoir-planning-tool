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
    strokeWeight: 1,
    strokeColor: 'blue',
    strokeOpacity: 0.12
  });

  // Enforces a zoom level between 6 and 11
  map.addListener('zoom_changed', function() {
    if (map.getZoom() < 6) {
      map.setZoom(6);
    } else if (map.getZoom() > 11) {
      map.setZoom(11);
    }
  });

  // Limit map to a certain area
  var bounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(37, -98), // TODO: Add this to the config file
    new google.maps.LatLng(49, -77)
  );
  map.addListener('dragend', function() {
    if (bounds.contains(map.getCenter())) {
      return;
    }
    var center = map.getCenter();
    if (center.lng() < bounds.getNorthEast().lng()) x = bounds.getNorthEast().lng();
    if (center.lng() > bounds.getNorthEast().lat()) x = bounds.getNorthEast().lat();
    if (center.lat() < bounds.getSouthWest().lng()) y = bounds.getSouthWest().lng();
    if (center.lat() > bounds.getSouthWest().lat()) y = bounds.getSouthWest().lat();
    map.setCenter(new google.maps.LatLng(y, x));
  });

  // Registers a click event for a single polygon
  map.data.addListener('click', function(event) {
    selectLocation(event.feature);
    map.data.overrideStyle(event.feature, {
      fillColor: 'blue',
      fillOpacity: 0.2
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

var toggleText = 0;

$('#map-submit').click(function() {
  if(toggleText == 0) {
    $('#map').fadeOut('slow', function() {
      $('#graph-body').fadeIn('slow');
      $('#form-data').fadeIn('slow');
      $('#map-submit').text('Select Another Location');
    });
    toggleText = 1;
  } else {
    $('#graph-body').fadeOut('slow', function() {
      $('#map').fadeIn('slow');
      $('#form-data').fadeOut('slow');
      $('#map-submit').text('Confirm Selection');
    });
    toggleText = 0;
  }

});
