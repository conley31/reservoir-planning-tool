var toggleText = 0;

$('#map-submit').click(function() {
  if(toggleText === 0) {
      $('#form-data').fadeIn('slow', function() {
        // $('#map-submit').text('Select Another Location');
        $('#prompt').text('Please Enter Inputs');
      });
  } else {
      $('#graph-body').fadeOut('slow', function() {
        $('#map').fadeIn('slow');
        $('#form-data').fadeOut('slow');
        $('#map-submit').text('Please Enter Inputs');
        $('#prompt').text('Please Select a Location');
      });
    toggleText = 0;
  }

});

$('#form-submit').click(function() {
  $('#map').fadeOut('slow', function() {
    $('#graph-body').fadeIn('slow');
    $('#map-submit').text('select another location');
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
