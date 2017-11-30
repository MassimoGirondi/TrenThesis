$(document).ready(function() {
  contentIdea();
  fillModal();
});

function contentIdea() {
  let topic = Cookies.getJSON('topic');

  //Sostituire tutte le stringhe presenti nelle parentesi dopo .html con le informazioni del json
  $("#idea-information-title").html(topic.title);
  $("#idea-information-date").html("dd-mm-yyyy");
  $("#idea-information-topics").html(topic.categories.toString()); // Should format this
  $("#idea-information-assigned").html(topic.assigned);
  if (topic.assigned != false) {
    $("#idea-information-assigned-button").addClass("is-assigned");
  }
  $(".idea-content").html(topic.description);
}

function remove() {
  $.ajax({
    url: api_url + '/api/topics/' + Cookies.getJSON('topic').id + '?token=' + Cookies.get('token'),
    type: 'DELETE',
    success: function() {
      window.location.href = 'idee.html';
    },
    error: (err) => {
      console.log('Failed to delete the topic with error: ' + err);
    }
  });
}

function editIdea() {

  let topic = getModalValuesAsTopic(Cookies.getJSON('topic'));
  topic['assigned'] = $("#modalEditIdea #assigned-idea").val();

  $.ajax({
    url: api_url + '/api/topics/' + Cookies.getJSON('topic').id + "?token=" + Cookies.get('token'),
    type: 'PUT',
    contentType: 'application/json',
    dataType: 'json',
    processData: false,
    data: JSON.stringify(topic),
    success: function() {
      Cookies.remove('topic');
      window.location.href = 'idee.html';
    },
    error: (err) => {
      console.log('Failed to edit the topic with error: ' + err);
    }
  });
}

function ideaAssigned() {
  let topic = Cookies.getJSON('topic');
  topic['assigned'] = $("#modalEditAssigned #assigned-idea").val();

  $.ajax({
    url: api_url + '/api/topics/' + Cookies.getJSON('topic').id + "?token=" + Cookies.get('token'),
    type: 'PUT',
    contentType: 'application/json',
    dataType: 'json',
    processData: false,
    data: JSON.stringify(topic),
    success: function() {
      Cookies.set('topic', topic);
      window.location.href = 'idea_page.html';
    },
    error: (err) => {
      console.log('Failed to assign the topic with error: ' + err);
    }
  });
}