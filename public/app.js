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
    $('#graph-body').fadeIn('slow');
    $('#map-submit').fadeIn('fast');
    $('#map-submit').text('Select Another Location');
    $("#pond-inc-card").fadeIn('slow');
    toggleText = 1;
  });
});

$('#upload_submit').click(function() {
  $('#divider').fadeOut('fast', function() {
    $('#upload_submit').fadeOut('fast', function() {
      $('#form-data').fadeIn('fast', function() {
        $('#prompt').text('Please Enter Inputs');
      });
    });
  });
  $('#file-div').fadeIn();
});

$('#uploadButton').click(function() {
  $(this).fadeOut('fast', function() {
    $('#uploadForm').fadeIn("slow", function(){
    });
  });
});

$('#pond-inc-submit').click(function() {
  var selected = $('#pond-inc-dropdown').val();
  graphTwo(selected);
  $('#graph2-body').fadeIn('slow');
});

$('#year-submit').click(function() {
  var selected = $('#year-dropdown').val();
  graphThree(selected);
  $('#graph3-body').fadeIn('slow');
});
