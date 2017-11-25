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

}
