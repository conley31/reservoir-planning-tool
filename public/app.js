var toggleText = 0;

$('#map-submit').click(function() {
  if(toggleText === 0) {
      $(this).fadeOut('fast');
      $('#form-data').fadeIn('slow', function() {
        // $('#map-submit').text('Select Another Location');
        $('#prompt').text('Please Enter Inputs');
      });
  } else {
      $('#graph-body').fadeOut('slow', function() {
        $('#map-container').fadeIn('slow');
        $('#form-data').fadeOut('slow');
        $('#prompt').text('Please Select a Location');
        $('#map-submit').fadeOut("fast");
      });
    toggleText = 0;
  }

});

$('#form-submit').click(function() {
  $('#map-container').fadeOut('slow', function() {
    $('#graph-body').fadeIn('slow');
    $('#map-submit').fadeIn('fast');
    $('#map-submit').text('Select Another Location');
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
});
