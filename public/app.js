// This file contains event handlers for elements displayed

var loaded = 0;
var compareMapData;

//show map, hide everything else
$('#map-nav').click(function() {
  disableListener = false;
  //show change on pseudo nav
  $('#map-nav').fadeIn('fast', function() {
    //show change on pseudo nav
    $(this).addClass('active-button');
    $('#graph-nav').removeClass('active-button');
    $('#all-map-nav').removeClass('active-button');
    $('#regional-map').fadeOut('fast');
  });

  $('#graph-nav-display').fadeOut('fast', function() {
    $('#map-submit').fadeOut('fast');
    $('#map-nav-display').fadeIn('fast');
    var centerBeforeResize = document.map.getCenter();
    google.maps.event.trigger(map, 'resize'); //to make gmap fit to entire div
    document.map.setCenter(centerBeforeResize); //re-center map after resize
  });
});

//this shows the all results tab
$('#all-map-nav').click(function() {
  hideCompMap();
  $('#legend-percentage').fadeOut('fast');
  $('#legend-annual').fadeOut('fast');
  $('#all-map-nav').fadeIn('fast', function() {
    $(this).addClass('active-button');
    $('#graph-nav').removeClass('active-button');
  })
  $('#graph-nav-display').fadeOut('fast', function() {
    $('#map-nav-display').fadeOut('fast');
    $('#map-submit').fadeOut('fast');
    $('#map-nav').removeClass('active-button');
    $('#regional-map').fadeIn('fast');
    var centerBeforeResize = document.regionalmap.getCenter();
    google.maps.event.trigger(map2, 'resize'); //to make gmap fit to entire div
    document.regionalmap.setCenter(centerBeforeResize); //re-center map after resize
    
    $('.add-var').unbind('click').bind('click', function () {
      colorMap($(this));
    });
    $('.add-var2').unbind('click').bind('click', function () {
      colorComp($(this));
    });
    $('select').change(function() {
      colorComp($(this));
    });
    disableListener = true;
    //document.map.data.removeListener(poly); //This breaks the code for right now
  });
});

//On any form input change, graphs are hidden
$('form :input').change(function() {
  hideAllGraphs();
});

var hideAllGraphs = function() {
  hideGraphThree();
  hideGraphTwo();
  hideGraphOne();
  hideDownloadButton();
};

//toggle radio button on drain flow options
$('input[type=radio][name=flowOption]').change(function() {
  disableListener = false;
  if ($(this).val() == 'option2') {
    $('#userCSV').val('');
    $('#file-div > input').val('');
    $('#map-nav').click();
  } else {
    $('#map-nav').fadeOut('fast');
  }
});

//show graph nav button
$('#map-submit').click(function() {
  hideAllGraphs();
  $('#graph-nav').fadeIn('fast', function() {
    //show change on pseudo nav
    $(this).addClass('active-button');
    $('#map-nav').removeClass('active-button');
  });
  $('#map-nav-display').fadeOut('fast', function() {
    $('#graph-nav-display').fadeIn('fast');
  });
});

//show form input and graphs, hide map
$('#graph-nav').click(function() {


  //show change on pseudo nav
  $(this).addClass('active-button');
  $('#map-nav').removeClass('active-button');
  $('#all-map-nav').removeClass('active-button');
  $('#regional-map').fadeOut('fast');

  $('#map-nav-display').fadeOut('fast', function() {
    $('#graph-nav-display').fadeIn('fast');
  });
  if(loaded == 0) {
    console.log("load once");
    //downloadJSON();
    //loaded = 1;
  }
});

//show graph for selected pond increment
$('#pond-inc-submit').click(function() {
  $('#download-csv').show();
  $('#download-csv').attr('href', '/download?pondVol=' + $('#pond-inc-dropdown').val());
  hideGraphThree();
  showGraphTwo();
});

//show graph for selected year
$('#year-submit').click(function() {
  showGraphThree();
});

$('#compare-maps').click(function() {
  showCompMap();
});

$('#download individual data').click(function() {

});

$('#download data').click(function() {

});

//hides the comparision map
var hideCompMap = function() {
  $('#comparemap').fadeOut('fast');
}

var showCompMap = function() {
  $('#comparemap').fadeIn('fast');

  var centerBeforeResize = document.comparemap.getCenter();
  google.maps.event.trigger(map3, 'resize'); //to make gmap fit to entire div
  document.comparemap.setCenter(centerBeforeResize); //re-center map after resize
}

//Shows Graph One
var showGraphOne = function() {
  $('#graph-body').fadeIn('slow', function() {
    graphOne();
    $('#graph-buffer').fadeOut('fast');
    $('#pond-inc-card').fadeIn('slow');
  });
};

//Hides Graph One
var hideGraphOne = function() {
  $('#pond-inc-card').fadeOut('fast', function() {
    $('#graph-body').fadeOut('fast');
  });
};

//Shows Graph Two
var showGraphTwo = function() {
  var selected = $('#pond-inc-dropdown').val();
  $('#graph2-body').fadeIn('slow', function() {
    graphTwo(selected);
    $('#year-card').fadeIn('slow', function() {
      $('#year-dropdown').fadeIn('slow');
    });
  });
};

//Hides Graph Two
var hideGraphTwo = function() {
  $('#year-card').fadeOut('fast', function() {
    $('#graph2-body').fadeOut('fast');
  });
};

//Shows Graph Three
var showGraphThree = function() {
  var selected = $('#year-dropdown').val();
  $('#graph3-body').fadeIn('slow', function() {
    graphThree(selected);
  });
};

//Hides Graph Three
var hideGraphThree = function() {
  $('#year-dropdown').fadeOut('fast', function() {
    $('#graph3-body').fadeOut('fast');
  });
};

//Hides download button for CSV
var hideDownloadButton = function() {
  $('#download-csv').fadeOut('fast');
};

// Initialize the error Modal
$('#errorModal').modal({
  keyboard: false,
  show: false
});

// Display the error modal with a given message
var displayErrorModal = function(message) {
  $('#errorModal .modal-body').text(message);
  $('#errorModal').modal('show');
};

$(document).on('change', ':file', function() {
  var input = $(this);
  label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
  $(this).parents('.input-group').find(':text').val(label);
});

// Enable popovers (Boostrap Javascrip  t)
$(function() {
  $("[data-toggle='popover']").popover();
});

var downloadJSON = function() {
  console.log("printing");
  if(loaded == 1){
    return;
  }
  loaded = 1;
  var request = new XMLHttpRequest();
    request.responseType = "blob";
    request.onload = handleFile;
    request.open("GET", "/data_sets/comparison-map-data.json.zip");

    request.send();

    function handleFile(data) {
      //console.log(this.response);
      //console.log(blob);
      zip.workerScriptsPath = '/zip/';
    zip.createReader(new zip.BlobReader(this.response), function(reader) {
      // get all entries from the zip
      //console.log("in reader");
      reader.getEntries(function(entries) {
        //console.log(entries.length);
      if (entries.length) {
        //console.log("getting entries")
       // get first entry content as text
          entries[0].getData(new zip.TextWriter(), function(text) {
           // text contains the entry data as a String
            //console.log(text);
            compareMapData = JSON.parse(text);
            //setColorComp(temp);

            // close the zip reader
            reader.close(function() {
            // onclose callback
          });

        }, function(current, total) {
            // onprogress callback
              //console.log("current: " + current);
              //console.log("total: " + total);
        });
      }
      });
    }, function(error) {
      // onerror callback
        console.log("error: " + error);
    });
    }
}

