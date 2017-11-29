// This file contains event handlers for elements displayed

var loaded = 0;
var compareMapData;
var tempStor;

//show map, hide everything else
$('#map-nav').click(function() {
  disableListener = false;
  //show change on pseudo nav
  $('#map-nav').fadeIn('fast', function() {
    //show change on pseudo nav
    $(this).addClass('active-button');
    $('#graph-nav').removeClass('active-button');
    $('#all-map-nav').removeClass('active-button');
    $('#regional-map').fadeOut('fast');
  });

  $('#graph-nav-display').fadeOut('fast', function() {
    $('#map-submit').fadeOut('fast');
    $('#map-nav-display').fadeIn('fast');
    var centerBeforeResize = document.map.getCenter();
    google.maps.event.trigger(map, 'resize'); //to make gmap fit to entire div
    document.map.setCenter(centerBeforeResize); //re-center map after resize
  });
});

//this shows the all results tab
$('#all-map-nav').click(function() {
  hideCompMap();
  $('#legend-percentage').fadeOut('fast');
  $('#legend-annual').fadeOut('fast');
  $('#legend-captured').fadeOut('fast');
  $('#legend-sufficiency').fadeOut('fast');
  $('#legend-drain').fadeOut('fast');
  $('#all-map-nav').fadeIn('fast', function() {
    $(this).addClass('active-button');
    $('#graph-nav').removeClass('active-button');
  })
  $('#graph-nav-display').fadeOut('fast', function() {
    $('#map-nav-display').fadeOut('fast');
    $('#map-submit').fadeOut('fast');
    $('#map-nav').removeClass('active-button');
    $('#regional-map').fadeIn('fast');
    var centerBeforeResize = document.regionalmap.getCenter();
    google.maps.event.trigger(map2, 'resize'); //to make gmap fit to entire div
    document.regionalmap.setCenter(centerBeforeResize); //re-center map after resize
    $('#histogram1-body').fadeOut('fast');
    
    //limit the resizeing of the map, this also enables the resizing of the map
    var w = document.getElementById('map-container');
  	var h = document.getElementById('map-container');
  	h = h.clientHeight;
  	h = parseInt(h);
  	w = w.clientWidth;
  	w = parseInt(w);
    $('#map-container').resizable({
    	minHeigh: 200,
    	minWidth: 500,
    	direction: 'bottom'
	});
	$('#map-container').resizable("option", "maxWidth", w);
  	$('#map-container').resizable("option", "maxHight", h*2);
  	$('#map-container').resizable("option", "minHeigh", h);

    $('.add-var').unbind('click').bind('click', function () {
      colorMap($(this));
    });
    $('.add-var2').unbind('click').bind('click', function () {
      colorComp($(this));
    });
    $('select').change(function() {
      //colorComp($(this));
    });
    disableListener = true;
    //document.map.data.removeListener(poly); //This breaks the code for right now
  });
});

//On any form input change, graphs are hidden
$('form :input').change(function() {
  hideAllGraphs();
});

var hideAllGraphs = function() {
  hideGraphThree();
  hideGraphTwo();
  hideGraphOne();
  hideDownloadButton();
};

//toggle radio button on drain flow options
$('input[type=radio][name=flowOption]').change(function() {
  disableListener = false;
  if ($(this).val() == 'option2') {
    $('#userCSV').val('');
    $('#file-div > input').val('');
    $('#map-nav').click();
  } else {
    $('#map-nav').fadeOut('fast');
  }
});

//show graph nav button
$('#map-submit').click(function() {
  hideAllGraphs();
  $('#graph-nav').fadeIn('fast', function() {
    //show change on pseudo nav
    $(this).addClass('active-button');
    $('#map-nav').removeClass('active-button');
  });
  $('#map-nav-display').fadeOut('fast', function() {
    $('#graph-nav-display').fadeIn('fast');
  });
});

//show form input and graphs, hide map
$('#graph-nav').click(function() {


  //show change on pseudo nav
  $(this).addClass('active-button');
  $('#map-nav').removeClass('active-button');
  $('#all-map-nav').removeClass('active-button');
  $('#regional-map').fadeOut('fast');

  $('#map-nav-display').fadeOut('fast', function() {
    $('#graph-nav-display').fadeIn('fast');
  });
  if(loaded == 0) {
    console.log("load once");
    downloadJSON();
    //loaded = 1;
  }
});

//show graph for selected pond increment
$('#pond-inc-submit').click(function() {
  $('#download-csv').show();
  $('#download-csv').attr('href', '/download?pondVol=' + $('#pond-inc-dropdown').val());
  hideGraphThree();
  showGraphTwo();
});

//show graph for selected year
$('#year-submit').click(function() {
  showGraphThree();
});

//show comparison map
$('#compare-maps').click(function() {
  showCompMap();
});

//Downloading data file
$('#download-individual-data').click(function() {
	downloadFile("/data_sets/comparison-map-data.json");
  	saveData(compareKML, "CompareData.kml");
});

//Downloading data file
$('#download-data').click(function() {
	//getFile();
  saveData(tempStor, 'ComputedResults.json');
  saveData(regKML, "RegonalData.kml");
});

//Hides the comparision map
var hideCompMap = function() {
  $('#comparemap').fadeOut('fast');
}

//Shows the comparison map
var showCompMap = function() {
  $('#comparemap').fadeIn('fast');

  var centerBeforeResize = document.comparemap.getCenter();
  google.maps.event.trigger(map3, 'resize'); //to make gmap fit to entire div
  document.comparemap.setCenter(centerBeforeResize); //re-center map after resize
  
  $('#histogram2-body').fadeOut('fast');
  var w = document.getElementById('map-container2');
  var h = document.getElementById('map-container2');
  h = h.clientHeight;
  h = parseInt(h);
  w = w.clientWidth;
  w = parseInt(w);
  $('#map-container2').resizable({
    	minHeigh: 500,
    	minWidth: 500,
    	direction: 'bottom'
	});
  $('#map-container2').resizable("option", "maxWidth", w);
  $('#map-container2').resizable("option", "maxHight", h*2);
  $('#map-container2').resizable("option", "minHeigh", h);
}

//Shows Graph One
var showGraphOne = function() {
  $('#graph-body').fadeIn('slow', function() {
    graphOne();
    $('#graph-buffer').fadeOut('fast');
    $('#pond-inc-card').fadeIn('slow');
  });
};

//Hides Graph One
var hideGraphOne = function() {
  $('#pond-inc-card').fadeOut('fast', function() {
    $('#graph-body').fadeOut('fast');
  });
};

//Shows Graph Two
var showGraphTwo = function() {
  var selected = $('#pond-inc-dropdown').val();
  $('#graph2-body').fadeIn('slow', function() {
    graphTwo(selected);
    $('#year-card').fadeIn('slow', function() {
      $('#year-dropdown').fadeIn('slow');
    });
  });
};

//Hides Graph Two
var hideGraphTwo = function() {
  $('#year-card').fadeOut('fast', function() {
    $('#graph2-body').fadeOut('fast');
  });
};

//Shows Graph Three
var showGraphThree = function() {
  var selected = $('#year-dropdown').val();
  $('#graph3-body').fadeIn('slow', function() {
    graphThree(selected);
  });
};

//Hides Graph Three
var hideGraphThree = function() {
  $('#year-dropdown').fadeOut('fast', function() {
    $('#graph3-body').fadeOut('fast');
  });
};

//Hides download button for CSV
var hideDownloadButton = function() {
  $('#download-csv').fadeOut('fast');
};

// Initialize the error Modal
$('#errorModal').modal({
  keyboard: false,
  show: false
});

// Display the error modal with a given message
var displayErrorModal = function(message) {
  $('#errorModal .modal-body').text(message);
  $('#errorModal').modal('show');
};

$(document).on('change', ':file', function() {
  var input = $(this);
  label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
  $(this).parents('.input-group').find(':text').val(label);
});

// Enable popovers (Boostrap Javascrip  t)
$(function() {
  $("[data-toggle='popover']").popover();
});

/* 
*  Project: FileSaver.js
*  Copyright © 2016 Eli Grey
*  License (MIT) https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md
*  FileSaver.js is used to make files downloadable
*/
var saveAs = saveAs || (function(view) {
	"use strict";
	// IE <10 is explicitly unsupported
	if (typeof view === "undefined" || typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent)) {
		return;
	}
	var
		  doc = view.document
		  // only get URL when necessary in case Blob.js hasn't overridden it yet
		, get_URL = function() {
			return view.URL || view.webkitURL || view;
		}
		, save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a")
		, can_use_save_link = "download" in save_link
		, click = function(node) {
			var event = new MouseEvent("click");
			node.dispatchEvent(event);
		}
		, is_safari = /constructor/i.test(view.HTMLElement) || view.safari
		, is_chrome_ios =/CriOS\/[\d]+/.test(navigator.userAgent)
		, throw_outside = function(ex) {
			(view.setImmediate || view.setTimeout)(function() {
				throw ex;
			}, 0);
		}
		, force_saveable_type = "application/octet-stream"
		// the Blob API is fundamentally broken as there is no "downloadfinished" event to subscribe to
		, arbitrary_revoke_timeout = 1000 * 40 // in ms
		, revoke = function(file) {
			var revoker = function() {
				if (typeof file === "string") { // file is an object URL
					get_URL().revokeObjectURL(file);
				} else { // file is a File
					file.remove();
				}
			};
			setTimeout(revoker, arbitrary_revoke_timeout);
		}
		, dispatch = function(filesaver, event_types, event) {
			event_types = [].concat(event_types);
			var i = event_types.length;
			while (i--) {
				var listener = filesaver["on" + event_types[i]];
				if (typeof listener === "function") {
					try {
						listener.call(filesaver, event || filesaver);
					} catch (ex) {
						throw_outside(ex);
					}
				}
			}
		}
		, auto_bom = function(blob) {
			// prepend BOM for UTF-8 XML and text/* types (including HTML)
			// note: your browser will automatically convert UTF-16 U+FEFF to EF BB BF
			if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
				return new Blob([String.fromCharCode(0xFEFF), blob], {type: blob.type});
			}
			return blob;
		}
		, FileSaver = function(blob, name, no_auto_bom) {
			if (!no_auto_bom) {
				blob = auto_bom(blob);
			}
			// First try a.download, then web filesystem, then object URLs
			var
				  filesaver = this
				, type = blob.type
				, force = type === force_saveable_type
				, object_url
				, dispatch_all = function() {
					dispatch(filesaver, "writestart progress write writeend".split(" "));
				}
				// on any filesys errors revert to saving with object URLs
				, fs_error = function() {
					if ((is_chrome_ios || (force && is_safari)) && view.FileReader) {
						// Safari doesn't allow downloading of blob urls
						var reader = new FileReader();
						reader.onloadend = function() {
							var url = is_chrome_ios ? reader.result : reader.result.replace(/^data:[^;]*;/, 'data:attachment/file;');
							var popup = view.open(url, '_blank');
							if(!popup) view.location.href = url;
							url=undefined; // release reference before dispatching
							filesaver.readyState = filesaver.DONE;
							dispatch_all();
						};
						reader.readAsDataURL(blob);
						filesaver.readyState = filesaver.INIT;
						return;
					}
					// don't create more object URLs than needed
					if (!object_url) {
						object_url = get_URL().createObjectURL(blob);
					}
					if (force) {
						view.location.href = object_url;
					} else {
						var opened = view.open(object_url, "_blank");
						if (!opened) {
							// Apple does not allow window.open, see https://developer.apple.com/library/safari/documentation/Tools/Conceptual/SafariExtensionGuide/WorkingwithWindowsandTabs/WorkingwithWindowsandTabs.html
							view.location.href = object_url;
						}
					}
					filesaver.readyState = filesaver.DONE;
					dispatch_all();
					revoke(object_url);
				}
			;
			filesaver.readyState = filesaver.INIT;

			if (can_use_save_link) {
				object_url = get_URL().createObjectURL(blob);
				setTimeout(function() {
					save_link.href = object_url;
					save_link.download = name;
					click(save_link);
					dispatch_all();
					revoke(object_url);
					filesaver.readyState = filesaver.DONE;
				});
				return;
			}

			fs_error();
		}
		, FS_proto = FileSaver.prototype
		, saveAs = function(blob, name, no_auto_bom) {
			return new FileSaver(blob, name || blob.name || "download", no_auto_bom);
		}
	;
	// IE 10+ (native saveAs)
	if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) {
		return function(blob, name, no_auto_bom) {
			name = name || blob.name || "download";

			if (!no_auto_bom) {
				blob = auto_bom(blob);
			}
			return navigator.msSaveOrOpenBlob(blob, name);
		};
	}

	FS_proto.abort = function(){};
	FS_proto.readyState = FS_proto.INIT = 0;
	FS_proto.WRITING = 1;
	FS_proto.DONE = 2;

	FS_proto.error =
	FS_proto.onwritestart =
	FS_proto.onprogress =
	FS_proto.onwrite =
	FS_proto.onabort =
	FS_proto.onerror =
	FS_proto.onwriteend =
		null;

	return saveAs;
}(
	   typeof self !== "undefined" && self
	|| typeof window !== "undefined" && window
	|| this.content
));
// `self` is undefined in Firefox for Android content script context
// while `this` is nsIContentFrameMessageManager
// with an attribute `content` that corresponds to the window

if (typeof module !== "undefined" && module.exports) {
  module.exports.saveAs = saveAs;
} else if ((typeof define !== "undefined" && define !== null) && (define.amd !== null)) {
  define("FileSaver.js", function() {
    return saveAs;
  });
}

//Function that implements saveAs from FileSaver.js to download files
var downloadFile = function(filename) {
	console.log('downloading');

	//Use jquery request to get file - for now
	$.getJSON(filename, function(json) {
		var blob = new Blob([JSON.stringify(json)], {type: "application/json"});
		saveAs(blob, filename);
    });
}

var saveData = function (data, fileName) {
  //console.log("printing");
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
      //console.log(data);
        var json = data,
            blob = new Blob([json], {type: "octet/stream"}),
            url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
};

var hide = function(object){
	$(this).fadeOut('fast');
}
