// Logic to govern the user page

// Unique namespace
var USR = USR || {};

// Show user profile information
USR.showProfile = function() {};

// Log out user
USR.logoutUser = function() {};

// JQuery functions

jQuery(document).ready(function($) {
    $(".clickable-row").click(function() {
        window.location = $(this).data("href");
    });
});
