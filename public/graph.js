//Function runs on window loading
$(document).ready(function() {
  initGraph();
});

$( "form" ).submit(function( event ) {
  event.preventDefault();
  console.log( $( this ).serializeArray() );
  $.ajax({
    type: 'POST',
    url: '/',
    data: $( this ).serializeArray(),
    success: function() {
      alert('HUZZAH');
    },
    error:function() {
      alert('well crap');
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
  data.addRows([
    [1, 37.8, 80.8],
    [2, 30.9, 69.5],
    [3, 25.4, 57],
    [4, 11.7, 18.8],
    [5, 11.9, 17.6],
    [6, 8.8, 13.6],
    [7, 7.6, 12.3,],
    [8, 12.3, 29.2],
    [9, 16.9, 42.9],
    [10, 12.8, 30.9],
    [11, 5.3, 7.9],
    [12, 6.6, 8.4],
    [13, 4.8, 6.3],
    [14, 4.2, 6.2,]
  ]);

  var options = {
    chart: {
      title: 'Box Office Earnings in First Two Weeks of Opening',
      subtitle: 'in millions of dollars (USD)'
    },
    width: 984,
    height: 500
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
