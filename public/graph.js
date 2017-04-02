

graphData = [];
var data;
var options;
var chart;

$("form").submit(function(event) {
  event.preventDefault();

  var formData = new FormData();
  formData.append('file', $('input[type=file]')[0].files[0]);
  formData.append('locationId', selectedLocationId);

  var formArray = $(this).serializeArray();
  for (var i = 0; i < formArray.length; i++) {

    //TODO add checks for values being passed through

    // Try to parse it as a number, else return the value as is (empty forms will return empty strings)
    formData.append(formArray[i].name, Number.parseFloat(formArray[i].value) || formArray[i].value);
  }

  $.ajax({
    type: 'POST',
    url: '/calculate',
    data: formData,
    contentType: false,
    processData: false,
    success: function(data) {
      // graphData = data.graph;
      // initGraph();
      GraphOne(data.graph);
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
  chart.draw(data, options);
};

var initGraph = function() {
  google.charts.load('current', {
    'packages': ['line']
  });
  google.charts.setOnLoadCallback(drawChart);
};

//Resizes Graph on window resize
$(window).smartresize(function () {
  if(data && options && chart) {
    chart.draw(data, options);
  }
});

var GraphOne = function(array) {
  data = new google.visualization.DataTable();
  data.addColumn('number', 'Pond Volume');
  data.addColumn('number', 'Bypass Volume');
  data.addColumn('number', 'Storage Deficit');
  data.addRows(allYearsAveraged(array.graphData, array.incData));

  options = {
    chart: {
      title: 'Bypass Flow and Storage Deficit VS Pond Volume',
      subtitle: 'in tbd scale'
    }
  };

  chart = new google.charts.Line(document.getElementById('graph-1'));
  initGraph();
}
