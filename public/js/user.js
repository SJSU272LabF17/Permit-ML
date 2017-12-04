// Logic to govern the user page

// Unique namespace
var USR = USR || {};

USR.dataObj = {};
USR.objMap = {};
USR.numCols = 5;
USR.adminCols = 6;
USR.scrollbarWidth = 17;

// Get the data from the server on load, and store it.
USR.setDataObj = function(data) {
  console.log("on load applications");
  console.log(data);
  this.dataObj = data;

  // Fill the map.
  var appList = data.applicationList;
  for(var i=0; i<appList.length; i++) {
    var app = appList[i];
    this.objMap[app.id] = app;
  }

  this.populateTable();
};

// Show user profile information.
USR.showProfile = function() {};

// Log out user.
USR.logoutUser = function() {};

// Populate the application summary table.
USR.populateTable = function() {
  var bdy = $("#adminTblBody");

  for(var i=0; i<this.dataObj.applicationList.length; i++) {
    var app = this.dataObj.applicationList[i];

    var row = $("<tr/>")
      .addClass("trSelectable clickable-row");

    // ID
    $("<td/>")
      .addClass("adminTblColId ccell")
      .html(app.id)
      .appendTo(row);

    // User
    $("<td/>")
      .addClass("adminTblColUser ccell")
      .html(app.user)
      .appendTo(row);

    // Date
    $("<td/>")
      .addClass("adminTblColDate ccell")
      .html(app.date)
      .appendTo(row);

    // Prediction
    $("<td/>")
      .addClass("adminTblColPrediction ccell")
      .html(this.interpretPrediction(app.prediction_result))
      .appendTo(row);

    // Status
    var sel = this.getStatusSelect(app.status, row);
    $("<td/>")
      .addClass("adminTblColStatus")
      .html(sel)
      .appendTo(row);

    // Comment
    var txt = this.getCommentTextarea(app.comment, row);
    $("<td/>")
      .addClass("adminTblColComment")
      .html(txt)
      .appendTo(row);

    bdy.append(row);
  }

  // Make table rows links
  $(".ccell").click(function() {
    USR.post('/details', {
      applicationId: $(this).parent().children().first().html()
    });
  });

  // Fix header width
  if(bdy.length > 0) {
    var bodyCellWidth;
    for(var i=1; i<USR.adminCols; i++) {
      bodyCellWidth = $("#adminSummaryTable td:nth-child("+i+")").width();
      $("#adminSummaryTable th:nth-child("+i+")").width(bodyCellWidth);
    }
    bodyCellWidth = $("#adminSummaryTable td:last-child()").width();
    $("#adminSummaryTable th:last-child()").width(bodyCellWidth+USR.scrollbarWidth);
  } else {
    $("#adminSummaryTable th").width("16.666%");
  }
};

// Interpret the boolean prediction and return a string.
USR.interpretPrediction = function(prediction) {
  if(prediction !== undefined &&
     prediction !== null &&
     prediction.toLowerCase() === "true") {
    return "Accepted";
  } else {
    return "Denied";
  }
}

// Build the status select dropdown.
USR.getStatusSelect = function(selectedValue, row) {
  var valToUse = (selectedValue !== undefined &&
    selectedValue !== null) ? selectedValue.toLowerCase() : "";
  var sel = $("<select/>");

  var optPending = $("<option/>")
    .val("pending")
    .html("Pending")
    .appendTo(sel);

  var optAccepted = $("<option/>")
    .val("accepted")
    .html("Accepted")
    .appendTo(sel);

  var optDenied = $("<option/>")
    .val("denied")
    .html("Denied")
    .appendTo(sel);

  if(valToUse === "accepted") {
    optAccepted.prop("selected", true);
  } else if(valToUse === "denied") {
    optDenied.prop("selected", true);
  } else {
    optPending.prop("selected", true);
  }

  sel.on("change", function() {
    $.post("/save", {
      id: row.children().first().html(),
      status: $(this).find(":selected").html(),
      comment: row.children().last().children().first().val()
    });
  });

  return sel;
};

// Build the comment textarea field.
USR.getCommentTextarea = function(commentText, row) {
  var txt = $("<textarea/>");

  txt.val(commentText);

  txt.on("blur", function() {
    $.post("/save", {
      id: row.children().first().html(),
      status: row.children().eq(4).find(":selected").html(),
      comment: $(this).val()
    });
  });

  return txt;
};

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
};

$(document).ready(function($) {

  // Make table rows links
  $(".clickable-row").click(function() {
    USR.post('/details', {
      applicationId: $(this).children().first().html()
    });
  });



  // Set the table body cell width
  var tableWidth = $("#applicationSummaryTable").width();
  var cellWidth = tableWidth / USR.numCols;
  $("#applicationSummaryTable td").width(cellWidth);



  // Set the table header cell width based on the body cells, if they exist
  var numRows = $("#applicationSummaryTable tr").length - 1;
  if(numRows) {
    var bodyWidth;
    for(var i=1; i<USR.numCols; i++) {
      bodyWidth = $("#applicationSummaryTable td:nth-child("+i+")").width();
      $("#applicationSummaryTable th:nth-child("+i+")").width(bodyWidth);
    }

    bodyWidth = $("#applicationSummaryTable td:last-child()").width();
    if(numRows > 6) {
      $("#applicationSummaryTable th:last-child").width(bodyWidth+USR.scrollbarWidth);
    } else {
      $("#applicationSummaryTable th:last-child").width(bodyWidth);
    }
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
  var numRows = $("#applicationSummaryTable tr").length - 1;
  if(numRows) {
    var bodyWidth;
    for(var i=1; i<USR.numCols; i++) {
      bodyWidth = $("#applicationSummaryTable td:nth-child("+i+")").width();
      $("#applicationSummaryTable th:nth-child("+i+")").width(bodyWidth);
    }

    bodyWidth = $("#applicationSummaryTable td:last-child()").width();
    if(numRows > 6) {
      $("#applicationSummaryTable th:last-child").width(bodyWidth+USR.scrollbarWidth);
    } else {
      $("#applicationSummaryTable th:last-child").width(bodyWidth);
    }
  } else {
    $("#applicationSummaryTable th").width(cellWidth);
  }


  // Fix admin table header width
  if($("#adminTblBody").length > 0) {
    var bodyCellWidth;
    for(var i=1; i<USR.adminCols; i++) {
      bodyCellWidth = $("#adminSummaryTable td:nth-child("+i+")").width();
      $("#adminSummaryTable th:nth-child("+i+")").width(bodyCellWidth);
    }
    bodyCellWidth = $("#adminSummaryTable td:last-child()").width();
    $("#adminSummaryTable th:last-child()").width(bodyCellWidth+USR.scrollbarWidth);
  } else {
    $("#adminSummaryTable th").width("16.666%");
  }

}).resize(); // Trigger the resize handler once the script runs










