const api_url = 'https://trenthesis.herokuapp.com'

$(document).ready(function() {
  let token = getQueryParam('token')
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
  Cookies.remove('profile');
  window.location.href = "index.html";
}

function logged() {
  // Get profile information if not already stored
  let token = Cookies.get('token');
  let profile = Cookies.get('profile');

  if (!profile) {
    $.get(api_url + '/auth/profile/' + token, function(data) {
      if (data) {
        Cookies.set("profile", data, {
          expires: 1
        });
      } else {
        console.log('Logging out here');
        logout(); //Might show something here
      }
    });
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
