/*
*Receives array of errors
*Prints each error in a #error-content in calculator-input.ejs
*If array is undefined or null, removes the error div from display
*/
document.displayFormError = function(array) {
  var errorContent = $("#error-content");
  if(array.length === 0) {
    $("#form-error").slideUp('fast', function() {
      errorContent.empty();
    });
  }
  else {
    $("#form-error").slideDown('slow');
    errorContent.empty();
    if(array.length > 1)
      errorContent.append("<p>Please fix the following errors:<p>");
    else
      errorContent.append("<p>Please fix the following error:<p>");
    for(var i = 0; i < array.length; i++) {
      errorContent.append("<p> - " + array[i] + "</p>");
    }
  }
};
