$(document).ready(function() {
  profile();
  $("#container-settings").hide();

  //Aggiungere le checkbox dinamiche sia per le discipline preferita sia per le competenze preferite
  getTopTopics();
});


function profile() {
  let profile = Cookies.getJSON('profile');
  $("#name").html(profile.first_name);
  $("#surname").html(profile.last_name);
  $("#department").html(profile.department);
  $("#email").html(profile.email);
  $("#website").html(profile.website);
  $("#further-information").empty();
  $("#career-information").empty();
  $.each(profile.further_info, function(key, value) {
    if (key == "career") {
      $("#career-information").append(" <div id=" + key + ">" + value + "</div>");
    } else {
      $("#further-information").append("<div><span class='profile-informations-header'>" + key + ":</span> <span id=" + key + ">" + value + "</span></div>");
    }
  });
}

function settings() {

  $("#topics-list").empty();
  $("#skills-list").empty();

  getTopTopics()
    .then((data) => {
      var topicsNumber = data.length;;
      var skillsNumber = 0;

      if (topicsNumber == 0) {
        $("#topics-list").append("<li class='no-settings'>Nessuna disciplina preferita</li>");
      }
      if (skillsNumber == 0) {
        $("#skills-list").append("<li class='no-settings'>Nessuna competenza preferita</li>");
      }

      for (var i = 0; i < topicsNumber; i++) {
        //Sostituire Topic con l'elemento i-esimo del json
        $("#topics-list").append("<li>" + data[i].count + " topic pubblicati <b>" + data[i]._id + "</b></li>");
      }

      for (var i = 0; i < skillsNumber; i++) {
        //Sostituire Skill con l'elemento i-esimo del json
        $("#skills-list").append("<li>Skill" + i + "</li>");
      }

    })
    .catch((err) => {
      console.log("Failure in top topics retrieval" + err);
    })
}

function getTopTopics() {
  return $.ajax({
    url: api_url + '/api/statistics/profile?token=' + Cookies.getJSON('token'),
    type: 'GET',
    dataType: 'json'
  })
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