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
        $('#map').fadeIn('slow');
        $('#form-data').fadeOut('slow');
        $('#prompt').text('Please Select a Location');
        $(this).text('Confirm Selection');
      });
    toggleText = 0;
  }

});

$('#form-submit').click(function() {
  $('#map').fadeOut('slow', function() {
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
