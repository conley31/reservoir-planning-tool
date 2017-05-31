// This file contains event handlers for elements displayed

//show map, hide everything else
$('#map-nav').click(function() {

  //show change on pseudo nav
  $('#map-nav').fadeIn('fast', function() {
    //show change on pseudo nav
    $(this).addClass('active-button');
    $('#graph-nav').removeClass('active-button');
  });

  $('#graph-nav-display').fadeOut('fast', function() {
    $('#map-submit').fadeOut('fast');
    $('#map-nav-display').fadeIn('fast');
    var centerBeforeResize = document.map.getCenter();
    google.maps.event.trigger(map, 'resize'); //to make gmap fit to entire div
    document.map.setCenter(centerBeforeResize); //re-center map after resize
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

  $('#map-nav-display').fadeOut('fast', function() {
    $('#graph-nav-display').fadeIn('fast');
  });
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
