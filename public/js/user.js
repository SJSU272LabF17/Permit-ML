// Logic to govern the user page

// Unique namespace
var USR = USR || {};

USR.dataObj = {};
USR.numCols = 4;
USR.scrollbarWidth = 17;

// Get the data from the server on load, and store it
USR.setDataObj = function(data) {
  this.dataObj = data;
};

// Show user profile information
USR.showProfile = function() {};

// Log out user
USR.logoutUser = function() {};

// JQuery functions

// Post to the provided URL with the specified parameters.
USR.post = function (path, parameters) {
    var form = $('<form></form>');

    form.attr("method", "post");
    form.attr("action", path);

    $.each(parameters, function(key, value) {
        var field = $('<input></input>');

        field.attr("type", "hidden");
        field.attr("name", key);
        field.attr("value", value);

        form.append(field);
    });

    // The form needs to be a part of the document in
    // order for us to be able to submit it.
    $(document.body).append(form);
    form.submit();
}

jQuery(document).ready(function($) {

  // Make table rows links
  $(".clickable-row").click(function() {
    //window.location = $(this).data("href");
    //alert($(this).children().first().html())
    /*
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/details", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
      applicationId: $(this).children().first().html()
    }));*/
    USR.post('/details', {
      applicationId: $(this).children().first().html()
    });
  });



  // Set the table body cell width
  var tableWidth = $("#applicationSummaryTable").width();
  var cellWidth = tableWidth / USR.numCols;
  $("#applicationSummaryTable td").width(cellWidth);



  // Set the table header cell width based on the body cells, if they exist
  if($("#applicationSummaryTable td").length) {
    var bodyWidth;
    for(var i=1; i<USR.numCols; i++) {
      bodyWidth = $("#applicationSummaryTable td:nth-child("+i+")").width();
      $("#applicationSummaryTable th:nth-child("+i+")").width(bodyWidth);
    }
    $("#applicationSummaryTable th:last-child").width(bodyWidth+USR.scrollbarWidth);
  } else {
    $("#applicationSummaryTable th").width(cellWidth);
  }

});

// Adjust the width of table cells when window resizes
$(window).resize(function() {

  // Set the table body cell width
  var tableWidth = $("#applicationSummaryTable").width();
  var cellWidth = tableWidth / USR.numCols;
  $("#applicationSummaryTable td").width(cellWidth);



  // Set the table header cell width based on the body cells, if they exist
  if($("#applicationSummaryTable td").length) {
    var bodyWidth;
    for(var i=1; i<USR.numCols; i++) {
      bodyWidth = $("#applicationSummaryTable td:nth-child("+i+")").width();
      $("#applicationSummaryTable th:nth-child("+i+")").width(bodyWidth);
    }
    $("#applicationSummaryTable th:last-child").width(bodyWidth+USR.scrollbarWidth);
  } else {
    $("#applicationSummaryTable th").width(cellWidth);
  }

}).resize(); // Trigger the resize handler once the script runs









