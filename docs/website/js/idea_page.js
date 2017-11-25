$(document).ready(function() {
  contentIdea();
});

function contentIdea() {
  let topic = Cookies.getJSON('topic');

  //Sostituire tutte le stringhe presenti nelle parentesi dopo .html con le informazioni del json
  $("#idea-information-title").html(topic.title);
  $("#idea-information-date").html("dd-mm-yyyy");
  $("#idea-information-topics").html(topic.categories.toString()); // Should format this
  $("#idea-information-assigned").html(topic.assigned);
  $(".idea-content").html(topic.description);
}

function remove() {
  $.ajax({
    url: api_url + '/api/topics/' + Cookies.getJSON('topic').id,
    type: 'DELETE',
    data: {
      'professor_id': Cookies.getJSON('profile').id,
      'token': Cookies.get('token')
    },
    success: function() {
      window.location.href = 'idee.html';
    },
    error: (err) => {
      console.log('Failed to delete the topic with error: ' + err);
    }
  });
}
