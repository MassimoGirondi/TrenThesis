function editSettings(){
    //salvare le informazioni delle checkbox
    let topics = [];
  $('#checkboxes-topics input:checked').each(function() {
    topics.push($(this).attr('name'));
  });
    let skills = [];
  $('#checkboxes-skills input:checked').each(function() {
    skills.push($(this).attr('name'));
  });
}

function resetSettings(){
    $('#checkboxes-topics input:checked').each(function() {
    $(this).prop("checked", false);
    });
    $('#checkboxes-skills input:checked').each(function() {
    $(this).prop("checked", false);
  });
}