function getStatistic(target) {
  let result = statistics.filter(function(obj) {
    return $.inArray(target, Object.keys(obj)) > -1;
  });
  return result[0][target]
}

function professors(statistics) {

  let labels = []
  let data = []

  let target = 'top_categories'
  let statistic = getStatistic(target)

  for (elem of statistic) {
    labels.push(elem['_id']);
    data.push(elem['count'])
  }

  var ctx = document.getElementById("chartBestTopicsProfessors").getContext('2d');
  var myChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: [
          'rgba(255, 99, 132, 0.4)',
          'rgba(54, 162, 235, 0.4)',
          'rgba(255, 206, 86, 0.4)',
          'rgba(75, 192, 192, 0.4)',
          'rgba(153, 102, 255, 0.4)',
          'rgba(255, 159, 64, 0.4)'
        ],
        borderColor: [
          'rgba(255,99,132,1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {}
  });
}

function students(statistics) {

  let labels = []
  let data = []

  let target = 'top_student_categories'
  let statistic = getStatistic(target)

  for (elem of statistic) {
    labels.push(elem['_id'])
    data.push(elem['count'])
  }

  var ctx = document.getElementById("chartBestTopicsStudents").getContext('2d');
  var myChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        borderWidth: 1,
        backgroundColor: [
          'rgba(237, 51, 30, 0.4)',
          'rgba(255, 0, 110, 0.4)',
          'rgba(255, 238, 0, 0.4)',
          'rgba(0, 165, 255, 0.4)',
          'rgba(136, 79, 221, 0.4)',
          'rgba(255, 136, 33, 0.4)',

          'rgba(35, 8, 168, 0.4)',
          'rgba(95, 214, 36, 0.4)',
          'rgba(29, 195, 214, 0.4)',
          'rgba(214, 90, 29, 0.4)',
          'rgba(61, 211, 139, 0.4)',
          'rgba(59, 94, 104, 0.4)',
          'rgba(59, 94, 104, 0.4)'

        ],
        borderColor: [
          'rgba(237, 51, 30,1)',
          'rgba(255, 0, 110, 1)',
          'rgba(255, 238, 0, 1)',
          'rgba(0, 165, 255, 1)',
          'rgba(136, 79, 221, 1)',
          'rgba(255, 136, 33, 1)',

          'rgba(35, 8, 168,1)',
          'rgba(95, 214, 36, 1)',
          'rgba(29, 195, 214, 1)',
          'rgba(214, 90, 29, 1)',
          'rgba(61, 211, 139, 1)',
          'rgba(59, 94, 104, 1)',
          'rgba(59, 94, 104, 1)'
        ]
      }]
    },
    options: {}
  });
}