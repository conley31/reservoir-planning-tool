var displayFormError = function(array) {
  var errorContent = $("#error-content");
  if(array == undefined || array == null) {
    $("#form-error").fadeOut('fast', function() {
      errorContent.empty();
    });
  }
  errorContent.empty();
  for(var i = 0; i < array.length; i++) {
    errorContent.append("<p> - " + array[i] + "</p>");
  }
}
