//Function runs on window loading
$(document).ready(function() {
  //initGraph();
});

graphData = [];

$("form").submit(function(event) {
  event.preventDefault();

  var data = {
    locationId: selectedLocationId
  };
  var formArray = $(this).serializeArray();
  for (var i = 0; i < formArray.length; i++) {
    // Try to parse it as a number, else return the value as is (empty forms will return empty strings)
    data[formArray[i].name] = Number.parseFloat(formArray[i].value) || formArray[i].value;
  }

  $.ajax({
    type: 'POST',
    url: '/calculate',
    data: JSON.stringify(data),
    contentType: "application/json",
    dataType: 'json',
    success: function(data) {
      graphData = data.graph;
      initGraph();
    },
    error: function() {
      console.log("AJAX failed");
    }
  });
});


/*
 *   Charting
 */

var drawChart = function() {

  var data = new google.visualization.DataTable();
  data.addColumn('number', 'Pond Volume');
  data.addColumn('number', 'Bypass Volume');
  data.addColumn('number', 'Storage Deficit');
  data.addRows(graphData[3].array);

  var options = {
    chart: {
      title: 'Box Office Earnings in First Two Weeks of Opening',
      subtitle: 'in millions of dollars (USD)'
    },
    width: 984,
    height: 440
  };

  var chart = new google.charts.Line(document.getElementById('graph'));

  chart.draw(data, options);
};

var initGraph = function() {
  google.charts.load('current', {
    'packages': ['line']
  });
  google.charts.setOnLoadCallback(drawChart);
};
