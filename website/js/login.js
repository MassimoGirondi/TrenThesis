function login(){
    logged();
}

function logout(){
    $("#navbar-container").load("navbar_user_unknown.html");
    window.location.href = "index.html";
    unknown();
}

function logged(){
    $("#navbar-container").empty();
    $("#navbar-container").load("navbar_user_logged.html"); 
}

function unknown(){
    $("#navbar-container").empty();
    $("#navbar-container").load("navbar_user_unknown.html");
}