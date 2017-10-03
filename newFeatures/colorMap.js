var colorMap = function(addVariable) {
  if (addVariable.hasClass('on')) {
    return;
  }

  var pondsize = document.getElementsByName("pond-size");
  var water = document.getElementsByName("water");
  var results = document.getElementsByName("results");

  var contain = -1; //0 for pondsize 1 for water 2 for results

  for(var i = 0; i < pondsize.length; i++) {
    if($(pondsize[i]).is(addVariable)){
      contain = 0;
      break;
    }
  }

  if(contain == -1) {
    for(var i = 0; i < water.length; i++) {
      if($(water[i]).is(addVariable)){
        contain = 1;
        break;
      }
    }
    if(contain == -1) {
      for(var i = 0; i < results.length; i++) {
        if($(results[i]).is(addVariable)){
          contain = 2;
          break;
        }
      }
    }
  }

  if(contain == 0) {
    for(var i = 0; i < pondsize.length; i++) {
      if($(pondsize[i]).hasClass('on')){
        $(pondsize[i]).removeClass('on');
        $(pondsize[i]).addClass('off');
      }
    }
  }
  else if(contain == 1) {
    for(var i = 0; i < water.length; i++) {
      if($(water[i]).hasClass('on')){
        $(water[i]).removeClass('on');
        $(water[i]).addClass('off');
      }
    }
  }
  else if(contain == 2) {
    for(var i = 0; i < results.length; i++) {
      if($(results[i]).hasClass('on')){
        $(results[i]).removeClass('on');
        $(results[i]).addClass('off');
      }
    }
  }

  addVariable.removeClass('off');
  addVariable.addClass('on');

  $.getJSON('jsonData.json', function(json) {
    console.log(json); // this will show the info it in firebug console
});

}
