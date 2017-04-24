// This file contains event handlers for elements displayed

//show map, hide everything else
$('#map-nav').click(function() {

  //show change on pseudo nav
  $(this).addClass('active-button');
  $('#graph-nav').removeClass('active-button');

  $('#graph-nav-display').fadeOut('fast', function() {
    $('#map-submit').fadeOut('fast');
    $('#map-nav-display').fadeIn('fast');
    google.maps.event.trigger(map, 'resize'); //to make gmap fit to entire div
  });
});

//On any form input change, graphs are hidden
$('form :input').change(function(){
  hideGraphThree();
  hideGraphTwo();
  hideGraphOne();
});

//show graph nav button
$('#map-submit').click(function() {
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
    $("#pond-inc-card").fadeIn('slow');
  });
};

//Hides Graph One
var hideGraphOne = function() {
  $('#pond-inc-card').fadeOut('fast', function() {
    $("#graph-body").fadeOut('fast');
  });
};

//Shows Graph Two
var showGraphTwo = function() {
  var selected = $('#pond-inc-dropdown').val();
  $('#graph2-body').fadeIn('slow', function() {
    graphTwo(selected);
    $('#year-card').fadeIn('slow');
  });
};

//Hides Graph Two
var hideGraphTwo = function() {
  $('#year-card').fadeOut('fast', function() {
    $("#graph2-body").fadeOut('fast');
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
    $("#graph3-body").fadeOut('fast');
  });
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
