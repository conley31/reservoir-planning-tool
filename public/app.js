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
  google.charts.load('current', {'packages':['corechart']});
  google.charts.setOnLoadCallback(drawChart);

  function drawChart() {
    var data = google.visualization.arrayToDataTable([
      ['Year', 'Sales', 'Expenses'],
      ['2004',  1000,      400],
      ['2005',  1170,      460],
      ['2006',  660,       1120],
      ['2007',  1030,      540]
    ]);

    var options = {
      title: 'Company Performance',
      curveType: 'function',
      legend: { position: 'bottom' }
    };

    var chart = new google.visualization.LineChart(document.getElementById('graph'));

    chart.draw(data, options);
  }
}
