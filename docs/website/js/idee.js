function addIdea() {
  //Funzione usata per salvare le informazioni dell'idea aggiunta
  var title = $("#title-idea").val();
  var description = $("#description-idea").val();

  var selected = [];
  $('#checkboxes input:checked').each(function() {
    selected.push($(this).attr('name'));
  });

  for (var i = 0; i < selected.length; i++) {
    //= selected[i];
  }

}

function reset() {
  $("#title-idea").val("");
  $("#description-idea").val("");

  $('#checkboxes input:checked').each(function() {
    $(this).prop("checked", false);
  });
}

function search() {

}
