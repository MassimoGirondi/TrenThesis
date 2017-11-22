var url = 'http://localhost:5000/auth/google'

$.ajaxSetup({
  crossDomain: true,
  xhrFields: {
    withCredentials: true
  }
});

function login() {
  //location.href = url;
  //console.log(window.location);
  $.ajax({
    type: 'GET',
    url: url
  }).done(function(data) {
    alert(data);
    logged();
  });
}

function logout() {
  $("#navbar-container").load("navbar_user_unknown.html");
  window.location.href = "index.html";
  unknown();
}

function logged() {
  $("#navbar-container").empty();
  $("#navbar-container").load("navbar_user_logged.html");
}

function unknown() {
  $("#navbar-container").empty();
  $("#navbar-container").load("navbar_user_unknown.html");
}
