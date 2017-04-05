graphData = [];
var data;
var options;
var chart;
var receivedArray;
var currentPondIncrement

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
      receivedArray = data;
      GraphOne();
    },
    error: function() {
      console.log("AJAX failed");
    }
  });
});


/*
 *   Charting
 */

//Draws graph onto div
var drawChart = function() {
  data = new google.visualization.DataTable();
  var i = 0;
  while(typeof graphData[i] == "string") {
    data.addColumn('number', graphData[i++]);
  }
  data.addRows(graphData[i++]);
  options = {
    chart: {
      title: graphData[i++],
      subtitle: graphData[i++]
    }
  };

  chart = new google.charts.Line(document.getElementById(graphData[i]));
  chart.draw(data, options);
};

//For first grpah
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

//Create graph 1
var GraphOne = function() {
  array = receivedArray;
  graphData = [];
  graphData[0] = 'Pond Volume';
  graphData[1] = 'Bypass Volume';
  graphData[2] = 'Storage Deficit';
  graphData[3] = generateGraphData.allYearsAveraged(array.graphData, array.incData);
  graphData[4] = 'Bypass Flow and Storage Deficit VS Pond Volume'
  graphData[5] = 'in tbd scale'
  graphData[6] = "graph-1";
  addIncDropdown(array.incData);
  initGraph();
}

//Create graph 2
var graphTwo = function(pondIncrement) {
  currentPondIncrement = pondIncrement;
  graphData = [];
  graphData[0] = 'Months';
  graphData[1] = 'Pond Water Depth';
  graphData[2] = 'Bypass (Cumulative)';
  graphData[3] = 'Deficit (Cumulative)';
  graphData[4] = generateGraphData.allYearsByPondVolume(array.graphData, array.incData, pondIncrement);
  graphData[5] = 'Average Pond Depth By Month, all years averaged for Pond Volume = ' + pondIncrement;
  graphData[6] = 'in tbd scale';
  graphData[7] = "graph-2";
  addYearDropdown();
  $("#year-card").fadeIn('fast');
  drawChart();
}

//Create graph 3
var graphThree = function(year) {
  graphData = [];
  graphData[0] = 'Months';
  graphData[1] = 'Pond Water Depth';
  graphData[2] = 'Bypass (Cumulative)';
  graphData[3] = 'Deficit (Cumulative)';
  graphData[4] = generateGraphData.allMonthsByYear(array.graphData, array.incData, array.initialYear, currentPondIncrement, year);
  graphData[5] = 'Average Pond Depth By Month, for Year = ' + year + ' for Pond Volume = ' + currentPondIncrement;
  graphData[6] = 'in tbd scale';
  graphData[7] = "graph-3";
  drawChart();
}

//Populate pond increment dropdown
var addIncDropdown = function(array) {
  var dropdown = $('#pond-inc-dropdown');
  dropdown.find('option').remove()
  for(var i = 0; i < array.length; i++) {
    // dropdown.append("<option value='" + array[i] + "'>" + array[i] + "</option>");
    dropdown.append($("<option></option>").val(array[i]).html(array[i]));
  }
}

//Populate year dropdown
var addYearDropdown = function() {
  var dropdown = $('#year-dropdown');
  dropdown.find('option').remove()
  for(var i = 1980; i < 2010; i++) {
    // dropdown.append("<option value='" + array[i] + "'>" + array[i] + "</option>");
    dropdown.append($("<option></option>").val(i).html(i));
  }
}
