var map;

//Function runs on window loading
window.onload = function() {
  initGraph();
  initMap();
};

// Funciton to initialize the Google Map, this gets called by the Google maps API
function initMap() {
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

  // Registers a click event for a single polygon
  map.data.addListener('click', function(event) {
    // TODO: for now just colors it red
    var locId = event.feature.getProperty('Id');
    console.log(locId);
    $('#mapselection').text('You selected id: ' + locId);
    map.data.overrideStyle(event.feature, {
      fillColor: 'red',
      fillOpacity: 1,
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
}

function initGraph() {
  google.charts.load('current', {'packages':['line']});
      google.charts.setOnLoadCallback(drawChart);

    function drawChart() {

      var data = new google.visualization.DataTable();
      data.addColumn('number', 'Day');
      data.addColumn('number', 'Guardians of the Galaxy');
      data.addColumn('number', 'The Avengers');
      data.addColumn('number', 'Transformers: Age of Extinction');

      data.addRows([
        [1,  37.8, 80.8, 41.8],
        [2,  30.9, 69.5, 32.4],
        [3,  25.4,   57, 25.7],
        [4,  11.7, 18.8, 10.5],
        [5,  11.9, 17.6, 10.4],
        [6,   8.8, 13.6,  7.7],
        [7,   7.6, 12.3,  9.6],
        [8,  12.3, 29.2, 10.6],
        [9,  16.9, 42.9, 14.8],
        [10, 12.8, 30.9, 11.6],
        [11,  5.3,  7.9,  4.7],
        [12,  6.6,  8.4,  5.2],
        [13,  4.8,  6.3,  3.6],
        [14,  4.2,  6.2,  3.4]
      ]);

      var options = {
        chart: {
          title: 'Box Office Earnings in First Two Weeks of Opening',
          subtitle: 'in millions of dollars (USD)'
        },
        width: 900,
        height: 500
      };

      var chart = new google.charts.Line(document.getElementById('graph'));

      chart.draw(data, options);
    }
}
