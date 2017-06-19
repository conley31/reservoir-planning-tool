var graphData = [];
var data;
var options;
var chart;
var receivedArray;
var currentPondVolume;
var currentYear;

$('form').submit(function(event) {
  var validation = validateCalculatorInput();
  document.displayFormError(validation[1]);
  if (!validation[0])
    return false;

  //Dispaly results divider
  $('.divider-results').show();

  event.preventDefault();

  var formData = new FormData();
  formData.append('file', $('input[type=file]')[0].files[0]);
  formData.append('locationId', document.selectedLocationId);

  var formArray = $(this).serializeArray();
  for (var i = 0; i < formArray.length; i++) {

    //TODO add checks for values being passed through

    // Try to parse it as a number, else return the value as is (empty forms will return empty strings)
    formData.append(formArray[i].name, parseFloat(formArray[i].value) || formArray[i].value);
  }

  $.ajax({
    type: 'POST',
    url: '/calculate',
    data: formData,
    contentType: false,
    processData: false,
    beforeSend: function() {
      $('#graph-body').fadeIn('slow');
      $('#graph-buffer').show();
    },
    success: function(data) {
      receivedArray = data;
      showGraphOne(); // defined in app.js
      hideGraphThree();
      hideGraphTwo();
    },
    error: function(jqXHR, textStatus, errorThrown) {
      if (jqXHR.responseJSON.error) {
        console.error(jqXHR.responseJSON.error);
      }
      var errorMessage = jqXHR.responseJSON.errorMessage;
      hideAllGraphs();
      displayErrorModal(errorMessage);
    }
  });

});


/*
 *   Charting
 */

//Draws graph onto div
//Takes inputs from graphData filled in graphOne(), graphTwo() and graphThree()
var drawChart = function() {
  data = new google.visualization.DataTable();
  var i = 0;
  //add axis descriptions
  while (typeof graphData[i] === 'string') {
    data.addColumn('number', graphData[i++]);
  }
  //add array of data
  data.addRows(graphData[i++]);
  //add options
  options = {
    chartArea: {
      left: 130,
      width: '80%',
      height: '77%'
    },
    fontName: 'Roboto',
    fontSize: 25,
    theme: 'material',
    titleTextStyle: {
      fontSize: 15,
      italic: false
    },
    legend: {
      textStyle: {
        fontSize: 21
      },
      position: 'top',
      alignment: 'end'
    },
    hAxis: {
      textPosition: 'out',
      textStyle: {
        fontSize: 20
      },
      title: graphData[0],
      titleTextStyle: {
        fontSize: 23,
        bold: true,
        color: '#555',
        italic: false
      }
    },
    vAxis: {
      textPosition: 'out',
      textStyle: {
        fontSize: 20
      },
      title: graphData[i++],
      titleTextStyle: {
        fontSize: 23,
        bold: true,
        color: '#555',
        italic: false
      }
    },
    pointSize: 15,
    dataOpacity: 0.7,
    lineWidth: 5,
    width: '100%',
    height: '100%'
  };
  chart = new google.visualization.LineChart(document.getElementById(graphData[i]));
  chart.draw(data, options);
};

/* This draw chart is for graphs 2&3 */
var drawChart2 = function() {

  //Make sure additional variable buttons are off
  $('.add-var').removeClass('on').addClass('off');

  data = new google.visualization.DataTable();

  var i = 0;

  while (typeof graphData[i] === 'string') {

    if( i === 0 ){
      data.addColumn('string', graphData[i++]);
    }
    else{
      data.addColumn('number', graphData[i++]);
    }
  }

  //determine right y-axis title
  var yaxisTitle = "";
  if (graphData.length === 8) {
    yaxisTitle = graphData[7];
  } else {
    yaxisTitle = graphData[14];
  }

  //add array of data
  data.addRows(graphData[i++]);

  //add options
  options = {
    chartArea: {
      left: 130,
      width: '75%',
      height: '75%'
    },
    fontName: 'Roboto',
    theme: 'material',
    fontSize: 25,
    titleTextStyle: {
      fontSize: 15,
      italic: false
    },
    legend: {
      textStyle: {
       fontSize: 14
      },
      maxLines: 3,
      position: 'top',
      alignment: 'end'
    },
    hAxis: {
      textPosition: 'out',
      textStyle: {
        fontSize: 20
      },
      title: graphData[0],
      titleTextStyle: {
        fontSize: 23,
        bold: true,
        color: '#555',
        italic: false
      }
    },
    vAxis: {
      textPosition: 'out',
      textStyle: {
        fontSize: 20
      },
      titleTextStyle: {
        fontSize: 23,
        bold: true,
        color: '#555',
        italic: false
      }
    },
    seriesType: 'bars',
    series: {
      // Gives each series an axis name that matches the Y-axis below.
      0: {targetAxisIndex: 0, type: 'line'},
      1: {targetAxisIndex: 0, type: 'line'},
      2: {targetAxisIndex: 1, type: 'line'},
      3: {targetAxisIndex: 0},
      4: {targetAxisIndex: 0},
      5: {targetAxisIndex: 0},
      6: {targetAxisIndex: 0},
      7: {targetAxisIndex: 0},
      8: {targetAxisIndex: 0},
      9: {targetAxisIndex: 0}
    },
    vAxes: {
      // Adds titles to each axis.
      0: {title: graphData[i++]},
      1: {title: yaxisTitle}
    },
    pointSize: 15,
    dataOpacity: 0.7,
    lineWidth: 5,
    width: '100%',
    height: '100%'
  };

  //Hide columns for additional variables
  dataView = new google.visualization.DataView(data);
  dataView.hideColumns([4,5,6,7,8,9,10]);

  //Currently active columns in graph
  var activeColumns = [0,1,2,3];

  chart = new google.visualization.ComboChart(document.getElementById(graphData[i]));
  chart.draw(dataView, options);

  //Toggle additional variables off and on in graph
  var updatePlot = function (addVar) {
    if (addVar.hasClass('off')) {
      activeColumns.push(parseInt(addVar.val()));
      dataView.setColumns(activeColumns);
      chart.draw(dataView, options);
      addVar.removeClass('off');
      addVar.addClass('on');
    } else {
      activeColumns.splice(activeColumns.indexOf(parseInt(addVar.val())), 1);
      dataView.setColumns(activeColumns);
      chart.draw(dataView, options);
      addVar.removeClass('on');
      addVar.addClass('off');
    }
  };
  $('.add-var').unbind('click').bind('click', function () {
    updatePlot($(this));
  });
};
//For first grpah
var initGraph = function() {
  google.charts.load('current', {
    'packages': ['line', 'corechart']
  });
  google.charts.setOnLoadCallback(drawChart);
};

// //Resizes Graph on window resize
// $(window).smartresize(function() {
//   if (data && options && chart) {
//     graphOne();
//     if (currentPondVolume) {
//       graphTwo();
//       if (currentYear) {
//         graphThree();
//       }
//     }
//   }
// });

//Create graph 1
var graphOne = function() {
  graphData = [];
  graphData[0] = 'Pond Volume (acre-feet)';
  graphData[1] = 'Captured Flow';
  graphData[2] = 'Irrigation';
  graphData[3] = document.generateGraphData.allYearsAveraged(receivedArray.graphData, receivedArray.incData);
  graphData[4] = 'Captured Flow and Irrigation Volume\n(acre-feet)';
  graphData[5] = 'graph-1';
  addIncDropdown(receivedArray.incData);
  initGraph();
};

//Create graph 2
var graphTwo = function(pondIncrement) {
  currentPondVolume = parseInt(pondIncrement);
  graphData = [];
  graphData[0] = 'Months (Pond Volume = ' + currentPondVolume + ')';
  graphData[1] = 'Captured Flow (Cumulative acre-feet)';
  graphData[2] = 'Irrigation (Cumulative acre-feet)';
  graphData[3] = 'Pond Water Depth (feet)';
  graphData[4] = document.generateGraphData.allYearsByPondVolume(receivedArray.graphData, receivedArray.incData, currentPondVolume, receivedArray.firstYearData);
  graphData[5] = 'Captured Flow or Irrigation Volume\n(acre-feet)';
  graphData[6] = 'graph-2';
  graphData[7] = 'Pond Water Depth\n(feet)';
  addYearDropdown();
  drawChart2();
};

//Create graph 3
var graphThree = function(year) {
  currentYear = year;
  graphData = [];
  graphData[0] = 'Months (Year = ' + currentYear + ')';
  graphData[1] = 'Captured Flow (Cumulative acre-feet)';
  graphData[2] = 'Irrigation (Cumulative acre-feet)';
  graphData[3] = 'Pond Water Depth (feet)';
  graphData[4] = 'Evaporation (acre-feet)';
  graphData[5] = 'Irrigation (acre-feet)';
  graphData[6] = 'Seepage (acre-feet)';
  graphData[7] = 'Drainflow (acre-feet)';
  graphData[8] = 'Precipitation (acre-feet)';
  graphData[9] = 'Bypass (acre-feet)';
  graphData[10] = 'Deficit (acre-feet)';
  graphData[11] = document.generateGraphData.allMonthsByYear(receivedArray.graphData, receivedArray.incData, receivedArray.firstYearData, currentPondVolume, parseInt(year));
  graphData[12] = 'Volume (acre-feet)';
  graphData[13] = 'graph-3';
  graphData[14] = 'Depth (feet)';
  drawChart2();
};

//Populate pond increment dropdown
var addIncDropdown = function(array) {
  var dropdown = $('#pond-inc-dropdown');
  dropdown.find('option').remove();
  for (var i = 0; i < array.length; i++) {
    dropdown.append($('<option></option>').val(array[i]).html(array[i]));
  }
};

//Populate year dropdown
var addYearDropdown = function() {
  var dropdown = $('#year-dropdown');
  dropdown.find('option').remove();
  var firstYear = receivedArray.firstYearData;
  for (var i = 0; i < receivedArray.graphData.length; i++) {
    dropdown.append($('<option></option>').val(firstYear+i).html(firstYear+i));
  }
};
