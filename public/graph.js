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
      console.log(data);
      GraphOne(data);
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
  data = new google.visualization.DataTable();
  data.addColumn('number', 'Pond Volume');
  data.addColumn('number', 'Bypass Volume');
  data.addColumn('number', 'Storage Deficit');
  data.addRows(graphData[3]);
  options = {
    chart: {
      title: 'Bypass Flow and Storage Deficit VS Pond Volume',
      subtitle: 'in tbd scale'
    }
  };

  chart = new google.charts.Line(document.getElementById('graph-1'));
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
  graphData[3] = generateGraphData.allYearsAveraged(array.graphData, array.incData);
  graphData[4] = "graph-1";
  addIncDropdown(array.incData, '#pond-inc-dropdown');
  initGraph();
}

var addIncDropdown = function(array, id) {
  var dropdown = $(id);
  for(var i = 0; i < array.length; i++) {
    // dropdown.append("<option value='" + array[i] + "'>" + array[i] + "</option>");
    dropdown.append($("<option></option>").val("arr[i]").html(array[i]));
  }
}

var graphTwo = function(array) {

}
