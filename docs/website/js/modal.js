function showModal(id) {
  $(id).show();
  $(id).on("click", function(event) {
    if ($(event.target).hasClass("modal"))
      $(this).hide();
  });
}

function getModalValuesAsTopic() {
  let title = $("#title-idea").val();
  let short_abstract = $("#short-abstract-idea").val();
  let description = $("#description-idea").val();

  let selected = [];
  $('#checkboxes input:checked').each(function() {
    selected.push($(this).attr('name'));
  });

  return {
    'professor_id': Cookies.getJSON('profile').id,
    'title': title,
    'short_abstract': short_abstract,
    'description': description,
    'resource': "", //How to handle resources
    'assigned': false,
    'categories': selected
  }
}

function reset() {
  $("#title-idea").val("");
  $("#short-abstract-idea").val("");
  $("#description-idea").val("");

  $('#checkboxes input:checked').each(function() {
    $(this).prop("checked", false);
  });
}

function fillModal(newCategories) {
  if (newCategories) {
    Cookies.set('categories', newCategories);
  }

  let categories = Cookies.getJSON('categories');

  if (!categories) {
    console.log('Something failed in modal filling: ' + err);
    return;
  }

  let ideaHtml = "";
  let elemPerColumn = Math.ceil(categories.length / 4) // number of columns

  ideaHtml += "<div class='row'>";
  ideaHtml += "<div class='col-md-3'>";

  for (let i = 0; i < categories.length; i++) {
    if (elemPerColumn > 1) {
      if ((i != 0) && (i % elemPerColumn === 0)) {
        ideaHtml += "</div>";
        ideaHtml += "<div class='col-md-3'>";
        ideaHtml += '<input type="checkbox" name=' + categories[i] + '>' + categories[i] + "<br>";
      } else {
        ideaHtml += '<input type="checkbox" name=' + categories[i] + '>' + categories[i] + "<br>";
      }
    } else {
      ideaHtml += '<input type="checkbox" name=' + categories[i] + '>' + categories[i] + "<br>";
      ideaHtml += "</div>";
      ideaHtml += "<div class='col-md-3'>";
    }

  }
  ideaHtml += "</div></div>";
  $("#checkboxes").append(ideaHtml);
}
