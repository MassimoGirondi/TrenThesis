function openTab(name) {
  var tabName = "#tab-" + name;
  var containerName = "#container-" + name;

  $(".tab-selected").each(function() {
    $(this).removeClass("tab-selected");
  });

  $(".tab-container").each(function() {
    $(this).hide();
  });

  getStatistics.then((statistics) => {
    if (name = "professors") {
      professors(statistics);
    } else if (name = "students") {
      students(statistics);
    }
  })

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