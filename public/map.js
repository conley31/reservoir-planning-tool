/*
 *   Maps
 */
document.map;
document.selectedFeature;
document.selectedLocationId;

var disableListener = false;

// Function to initialize the Google Map, this gets called by the Google maps API
var initMap = function() {
  document.map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 41.8781, // Center at Chicago
      lng: -87.6298
    },
    scrollwheel: false,
    zoom: 6
  });

  document.map.data.loadGeoJson('final_index_FeaturesToJSON.json');
  document.map.data.setStyle({
    fillColor: 'white',
    fillOpacity: 0,
    strokeWeight: 1,
    strokeColor: 'blue',
    strokeOpacity: 0.12
  });

/*          Leaving this out for now, not sure how but it is causing bugs
  // Function to initialize LEGEND
  var legend = document.getElementById('legend');
  for (var style in styles) {
	var name = style.name;
	var dive = document.createElement('div');
	div.innerHTML = name;
	legend.appendChild(div);
  }
//  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(document.getElementById('legend'));
*/
  // Enforces a zoom level between 5 and 12
  document.map.addListener('zoom_changed', function() {
    if (document.map.getZoom() < 5) {
      document.map.setZoom(6);
    } else if (document.map.getZoom() > 12) {
      document.map.setZoom(11);
    }
  });

  // Limit map to a certain area
  var bounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(37, -98), // TODO: Add this to the config file
    new google.maps.LatLng(49, -77)
  );
  document.map.addListener('dragend', function() {
    if (bounds.contains(document.map.getCenter())) {
      return;
    }
    var center = document.map.getCenter();
    if (center.lng() < bounds.getNorthEast().lng()) x = bounds.getNorthEast().lng();
    if (center.lng() > bounds.getNorthEast().lat()) x = bounds.getNorthEast().lat();
    if (center.lat() < bounds.getSouthWest().lng()) y = bounds.getSouthWest().lng();
    if (center.lat() > bounds.getSouthWest().lat()) y = bounds.getSouthWest().lat();
    document.map.setCenter(new google.maps.LatLng(y, x));
  });

  // Registers a click event for a single polygon
  document.map.data.addListener('click', function(event) {
    if(disableListener) {
      return;
    }
    selectFeature(event.feature);
  });

  var locMarker = new google.maps.Marker({
    map: document.map,
    title: 'Your Location'
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
  document.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  // Bias the SearchBox results towards current map's viewport.
  document.map.addListener('bounds_changed', function() {
    searchBox.setBounds(document.map.getBounds());
  });
  // Listen for a new place from the search box
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length === 0) {
      return;
    }
    // Center on the map and zoom in
    locMarker.setPosition(places[0].geometry.location);
    document.map.setCenter(places[0].geometry.location);
    document.map.setZoom(11);
    if(disableListener) {
      return;
    }
    selectLocation(places[0].geometry.location);
  });

  //remove buffer after map is loaded
  google.maps.event.addListener(document.map, 'idle', function() {
    $('#map-buffer').fadeOut('fast');
  });
};

// Select a polygon on the map
var selectFeature = function(feature) {
  // Old selectedFeature to white
  document.map.data.overrideStyle(document.selectedFeature, {
    fillColor: 'white',
    fillOpacity: 0,
    strokeWeight: 1
  });
  // new feature to blue
  document.map.data.overrideStyle(feature, {
    fillColor: 'blue',
    fillOpacity: 0.2
  });

  document.selectedFeature = feature;

  document.selectedLocationId = document.selectedFeature.getProperty('Id');

  $('#map-submit').fadeIn('slow');
};

// Select a feature using a location (lat, long) object
var selectLocation = function(location) {
  $.ajax({
    type: 'POST',
    url: '/locations',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify(location),
    success: function(response) {
      if (response) {
        var feature = document.map.data.getFeatureById(response.id);
        selectFeature(document.map.data.getFeatureById(response.id));
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      if (jqXHR.responseJSON.error) {
        console.error(jqXHR.responseJSON.error);
      }
      var errorMessage = jqXHR.responseJSON.errorMessage;
      displayErrorModal(errorMessage);
    }
  });
};
