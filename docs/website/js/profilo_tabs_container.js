$(document).ready(function() {
  profile();
  $("#container-settings").hide();
});

function profile() {
  let profile = Cookies.getJSON('profile');
  $("#name").html(profile.first_name);
  $("#surname").html(profile.last_name);
  $("#department").html(profile.department);
  $("#email").html(profile.email);
  $("#website").html(profile.website);
  $("#further-information").empty();
  $.each(profile.further_info, function(key, value) {
    if (key == "career") {
      $("#further-information").append("<div><span class='profile-informations-header'>" + key + ":</span> <div id=" + key + " class='list'>" + value + "</div></div>");
    } else {
      $("#further-information").append("<div><span class='profile-informations-header'>" + key + ":</span> <span id=" + key + ">" + value + "</span></div>");
    }
  });
}

function settings() {
  $("#topics-list").empty();
  $("#skills-list").empty();
  //Sostituire con il numero totale di topic preferiti dal professore
  var topicsNumber = 0;
  //Sostituire con il numero totale di topic preferiti dal professore
  var skillsNumber = 0;

  if (topicsNumber == 0) {
    $("#topics-list").append("<li class='no-settings'>Nessuna disciplina preferita</li>");
  }
  if (skillsNumber == 0) {
    $("#skills-list").append("<li class='no-settings'>Nessuna competenza preferita</li>");
  }

  for (var i = 0; i < topicsNumber; i++) {
    //Sostituire Topic con l'elemento i-esimo del json
    $("#topics-list").append("<li>Topic" + i + "</li>");
  }

  for (var i = 0; i < skillsNumber; i++) {
    //Sostituire Skill con l'elemento i-esimo del json
    $("#skills-list").append("<li>Skill" + i + "</li>");
  }

}


function unsubscribe() {
  $.ajax({
    url: api_url + '/api/professors/' + Cookies.getJSON('profile').id,
    type: 'DELETE',
    dataType: 'json',
    data: {
      'token': Cookies.get('token')
    },
    success: function(result) {
      logout();
    },
    error: function(err) {
      alert("Unsubscribtion failed: please contact our support team.");
      console.log("Error while unsubscribing: " + err);
    }
  });
}
