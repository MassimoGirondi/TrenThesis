function editProfile() {
  let department = $("#department-profile").val();
  let email = $("#email-profile").val();
  let website = $("#website-profile").val();


  let keys = []; //Contiene tutte le etichette dei nuovi campi
  let values = []; //Contiene tutti i valori delle nuove etichette
  //Per keys[0] il valore corrispondente è values[0]
  console.log($('#other-informations div input'))
  $('#other-informations div input').each(function(index) {
    if ($(this).hasClass("keys modal-input")) {
      keys.push($(this).val());
    } else {
      values.push($(this).val());
    }
  });

  let profile = Cookies.getJSON('profile');

  if (department) {
    profile['department'] = department
  }
  if (email) {
    profile['email'] = email
  }
  if (website) {
    profile['website'] = website
  }

  for (let i = 0; i < keys.length; i++) {
    if (keys[i]) {
      profile['further_info'][keys[i]] = values[i];
    }
  }

  $.ajax({
    url: api_url + '/api/professors/' + profile.id + "?token=" + Cookies.get('token'),
    type: 'PUT',
    contentType: 'application/json',
    dataType: 'json',
    processData: false,
    data: JSON.stringify(profile),
    success: function() {
      Cookies.set('profile', profile);
      window.location.href = 'profilo.html';
    },
    error: (err) => {
      console.log('Failed to edit profile with error: ' + err);
    }
  });

}

function reset() {
  $("#dipartment-profile").val("");
  $("#email-profile").val("");
  $("#website-profile").val("");

  $('#other-informations').empty();
}

function addInformation() {

  $("#other-informations").append("<div class='new-information'><span>Etichetta: </span><input id='' type='text' class='keys modal-input'/><span>Informazione: </span><input id='' type='text' class='values modal-input'/></div>");

  $('#other-informations div input').each(function(i) {
    if ($(this).hasClass("keys modal-input")) {
      $(this).attr("id", "key_" + (i / 2));
    } else {
      $(this).attr("id", "value_" + ((i - 1) / 2));
    }
  });
}
