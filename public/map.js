/*
 *   Maps
 */
var map;
var selectedFeature;
var selectedLocationId;

// Function to initialize the Google Map, this gets called by the Google maps API
var initMap = function() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 41.8781, // Center at Chicago
      lng: -87.6298
    },
    scrollwheel: false,
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
    selectFeature(event.feature);
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

  // Create the search box and link it to the UI element.
  var input = document.getElementById('places-input');
  var searchBox = new google.maps.places.SearchBox(input, {
    bounds: bounds
  });
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });
  // Listen for a new place from the search box
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length === 0) {
      return;
    }
    // Center on the map and zoom in
    locMarker.setPosition(places[0].geometry.location);
    map.setCenter(places[0].geometry.location);
    map.setZoom(11);
    selectLocation(places[0].geometry.location);
  });

  //remove buffer after map is loaded
  google.maps.event.addListener(map, 'idle', function(){
    $("#buffer-container").fadeOut('fast');
  });
};

var selectFeature = function(feature) {
  // Old selectedFeature to white
  map.data.overrideStyle(selectedFeature, {
    fillColor: 'white',
    fillOpacity: 0,
    strokeWeight: 1
  });
  // new feature to blue
  map.data.overrideStyle(feature, {
    fillColor: 'blue',
    fillOpacity: 0.2
  });

  selectedFeature = feature;

  selectedLocationId = selectedFeature.getProperty('Id');

  $('#map-submit').fadeIn('slow');
};

var selectLocation = function(location) {
  $.ajax({
    type: 'POST',
    url: '/locations',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify(location)
  }).done(function(response) {
    if (response) {
      var feature = map.data.getFeatureById(response.id);
      selectFeature(map.data.getFeatureById(response.id));
    }
  });
};
