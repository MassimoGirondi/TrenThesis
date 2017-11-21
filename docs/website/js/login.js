function login() {
  $.get(window.location, function(data, status) {
    alert("Data: " + data + "\nStatus: " + status);
  });
  logged();
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
