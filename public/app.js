var toggleText = 0;

$('#map-submit').click(function() {
  if(toggleText === 0) {
      $(this).fadeOut('fast');
      $('#form-data').fadeIn('slow', function() {
        // $('#map-submit').text('Select Another Location');
        $('#prompt').text('Please Enter Inputs');
      });
      $('html, body').animate({
        scrollTop: $("#form-data").offset().top
      }, 3000, 'easeOutExpo');

      array = [];
      array[0] = "This is an error";
      displayFormError(array);
  } else {
      $('#graph-body').fadeOut('fast', function() {

        //Remove all cards that are on the screen
        $("#pond-inc-card").fadeOut('fast');
        $("#year-card").fadeOut('fast');
        $('#form-data').fadeOut('fast');
        $('#graph2-body').fadeOut('fast');
        $('#graph3-body').fadeOut('fast');
        $('#map-submit').fadeOut("fast");

        //show map and change prompt
        $('#prompt').text('Please Select a Location');
        $('#map-container').fadeIn('slow');
      });
    toggleText = 0;
  }

});

$('#form-submit').click(function() {
  $('#map-container').fadeOut('slow', function() {
    $('#map-submit').fadeIn('fast');
    $('#map-submit').text('Select Another Location');
    toggleText = 1;
  });
});

$('#uploadButton').click(function() {
  $(this).fadeOut('fast', function() {
    $('#uploadForm').fadeIn("slow", function(){
    });
  });
});

$('#pond-inc-submit').click(function() {
  $('#download-csv').show();
  $('#download-csv').attr('href', '/download?pondVol=' + $('#pond-inc-dropdown').val());
  showGraphTwo();
});

$('#year-submit').click(function() {
  showGraphThree();
});

//Shows Graph One
var showGraphOne = function() {
  $('#graph-body').fadeIn('slow', function() {
    graphOne();
    $("#pond-inc-card").fadeIn('slow');
  });
};

//Shows Graph Two
var showGraphTwo = function() {
  var selected = $('#pond-inc-dropdown').val();
  $('#graph2-body').fadeIn('slow', function() {
    graphTwo(selected);
    $("#year-card").fadeIn('slow');
  });
};

//Shows Graph Three
var showGraphThree = function() {
  var selected = $('#year-dropdown').val();
  $('#graph3-body').fadeIn('slow', function() {
    graphThree(selected);
  });
};
