$(document).ready(function() {
  token = getQueryParam('token');
  if (token) {
    document.cookie = 'token=' + token + '; max-age = ' + 60 * 60 * 24 + '; path = /';
    logged();
  } else {
    unknown();
  }
})

function login() {
  window.location.replace('http://localhost:5000/auth/google?callback=' + window.location.href);
}

function logout() {
  $("#navbar-container").load("navbar_user_unknown.html");
  // Invalidate cookie
  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  window.location.href = "index.html";
}

function logged() {
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

// Get session cookie
function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
