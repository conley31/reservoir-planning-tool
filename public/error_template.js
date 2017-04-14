var displayFormError = function(array) {
  var errorContent = $("#error-content");
  if(array == undefined || array == null) {
    $("#form-error").slideUp('fast', function() {
      errorContent.empty();
    });
  }
  $("#form-error").slideDown('slow');
  errorContent.empty();
  errorContent.append("<p>Please fix the following error(s)<p>");
  for(var i = 0; i < array.length; i++) {
    errorContent.append("<p> - " + array[i] + "</p>");
  }
}
