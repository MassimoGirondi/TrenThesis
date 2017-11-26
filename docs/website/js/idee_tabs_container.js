//Login should be imported before this file

var topics;

$(document).ready(function() {
  getTopics();
  // Fill the modal use to add topics
  getCategories().done(function(categories) {
      fillAddIdeaModal(categories);
    })
    .fail(function(err) {
      console.log('Something failed in category retrieval: ' + err);
    })
});


function filterTopics(name) {
  let topics_list;
  switch (name) {
    case 'available':
      topics_list = topics.filter((item) => {
        return !item.assigned
      });
      break;
    case 'assigned':
      topics_list = topics.filter((item) => {
        return item.assigned
      })
      break;
    case 'all':
    default:
      topics_list = topics;
  }
  return topics_list;
}

/**
 * Options for name are all, available and assigned
 */
function fillTabsContainer(name) {
  $("#container-" + name).empty();

  let topics_list = filterTopics(name);

  let totalElement = topics_list.length;
  let elementsNumberForRow = totalElement < 4 ? totalElement : 4;
  let columnDimension = Math.floor(12 / elementsNumberForRow); // Choose format here
  let rowNumber = Math.ceil(totalElement / elementsNumberForRow);

  let row = 0;
  let column = 0;

  for (let element = 0; element < totalElement; element++) {
    column = (column + 1) % elementsNumberForRow;
    // If we reached the max number of elements per row, create a new row
    if (element % elementsNumberForRow === 0) {
      row = row + 1;
      $("<div id='row-" + name + row + "' class='row'></div>").appendTo("#container-" + name);
    }
    // Add the element to the row
    $("<div id='col-" + name + row + column + "' class='col-md-" + columnDimension + "'></div>").appendTo("#row-" + name + row);
    $("<div id='elem-" + name + row + column + "' class='idea-element'></div>").appendTo("#col-" + name + row + column);
    $("#elem-" + name + row + column).append("<div class='idea-element-title'>" + topics_list[element].title + "</div>");
    $("#elem-" + name + row + column).append("<div class='idea-element-data'>18/11/2017</div>"); // Still missing
    $("#elem-" + name + row + column).append("<div class='idea-element-text'>" + topics_list[element].short_abstract + "</div>");

    document.getElementById("elem-" + name + row + column).onclick = function() {
      Cookies.set('topic', topics_list[element]);
      window.location.href = 'idea_page.html';
    }
  }
}

function fillAddIdeaModal(categories) {

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

function getTopics() {
  let profile = Cookies.getJSON('profile');
  if (!profile) {
    console.log('Logging out because there is no profile');
    logout();
  } else {
    $.ajax({
      url: api_url + '/api/topics',
      type: 'GET',
      dataType: 'json',
      data: {
        'professor_id': profile.id,
        'token': Cookies.get('token')
      },
      success: function(result) {
        topics = result;
        fillTabsContainer('all');
        $(".container-available").hide();
        $(".container-assigned").hide();
      }
    });
  }
}

function getCategories() {
  return $.ajax({
    url: api_url + '/api/categories',
    type: 'GET',
    dataType: 'json',
    data: {
      'get_defaults': true,
      'token': Cookies.get('token')
    }
  });
}
