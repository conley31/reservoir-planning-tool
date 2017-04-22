// This file contains event handlers for elements displayed

//show map, hide everything else
$('#map-nav').click(function() {

  //show change on pseudo nav
  $(this).addClass('active-button');
  $('#graph-nav').removeClass('active-button');

  $('#graph-nav-display').fadeOut('fast', function() {
    $('#map-nav-display').fadeIn('fast');
    google.maps.event.trigger(map, 'resize'); //to make gmap fit to entire div
  });
});

//show graph nav button
$('#map-submit').click(function() {
  $('#graph-nav').fadeIn('fast');
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
    $('#pond-inc-card').fadeIn('slow');
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

//Shows Graph Three
var showGraphThree = function() {
  var selected = $('#year-dropdown').val();
  $('#graph3-body').fadeIn('slow', function() {
    graphThree(selected);
  });
};
