var statistics;

$(document).ready(function() {
  getStatistics().done((data) => {
    statistics = data
    students(statistics);
    $("#container-professors").hide();
  }).fail(function(err) {
    console.log('Something failed in statistics retrieval: ' + err);
  })
});

function openTab(name) {
  var tabName = "#tab-" + name;
  var containerName = "#container-" + name;

  $(".tab-selected").each(function() {
    $(this).removeClass("tab-selected");
  });

  $(".tab-container").each(function() {
    $(this).hide();
  });

  if (name = "professors") {
    professors(statistics);
  } else if (name = "students") {
    students(statistics);
  }
  $(tabName).addClass("tab-selected");
  $(containerName).show();

}

function getStatistics() {
  return $.ajax({
    url: api_url + '/api/statistics',
    type: 'GET',
    dataType: 'json'
  });
}