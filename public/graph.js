//Function runs on window loading
$(document).ready(function() {
  //initGraph();
});

graphData = [];

$( "form" ).submit(function( event ) {
  event.preventDefault();
  console.log( $( this ).serializeArray() );
  $.ajax({
    type: 'POST',
    url: '/',
    data: $( this ).serializeArray(),
    success: function(data) {
      graphData = data.graph;
      console.log(graphData[3].array);
      initGraph();
    },
    error:function() {
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
    height: 400
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
