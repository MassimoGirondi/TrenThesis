function profile() {
  let profile = Cookies.getJSON('profile');
  $("#name").html(profile.first_name);
  $("#surname").html(profile.last_name);
  $("#department").html(profile.department);
  $("#email").html(profile.email);
  $("#website").html(profile.website);
  $.each(profile.further_info, function(key, value) {
    $("#further-information").append("<div><span class='profile-informations-header'>" + key + ":</span> <span id=" + key + ">" + value + "</span></div>");
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
