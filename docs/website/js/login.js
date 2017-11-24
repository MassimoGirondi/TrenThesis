const api_url = 'https://localhost:5000'

$(document).ready(function() {
  token = getQueryParam('token')
  if (token) {
    Cookies.set('token', token, {
      expires: 1
    });
  }
  Cookies.get('token') ? logged() : unknown();
})

function login() {
  window.location.replace(api_url + '/auth/google?callback=' + window.location.href);
}

function logout() {
  $("#navbar-container").load("navbar_user_unknown.html");
  // Invalidate cookie
  Cookies.remove('token');
  window.location.href = "index.html";
}

function logged() {
  // Get profile information if not already stored
  token = Cookies.get('token')
  if (!Cookies.get('profile') && token) {
    $.get(api_url + '/auth/profile/' + token, function(data) {
      if (data) {
        Cookies.set("profile", data);
      } else {
        console.log("Something went wrong during profile retrieval.")
        // Send an error
      }
    });
  } else {
    console.log("Something went wrong during profile retrieval.")
    logout();
  }
  $("#navbar-container").empty();
  $("#navbar-container").load("navbar_user_logged.html");
}

function unknown() {
  $("#navbar-container").empty();
  $("#navbar-container").load("navbar_user_unknown.html");
}

// Get a query param of a GET request
function getQueryParam(name) {
  if (name = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(location.search))
    return decodeURIComponent(name[1]);
}
