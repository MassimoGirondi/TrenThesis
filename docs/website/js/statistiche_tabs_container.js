function professors(){
    
    var ctx = document.getElementById("chartBestTopicsProfessors").getContext('2d');
    var myChart = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: ["Machine learning", "Database", "Reti", "Sistemi operativi", "Sicurezza", "LFC"],
        datasets: [{
            data: [12, 19, 3, 5, 2, 3],
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
    options: {
    }
    });
    
    var ctx = document.getElementById("chartSkills").getContext('2d');
    var myChart = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: ["Java", "C", "C++", "Poly ML", "Javascript", "HTML"],
        datasets: [{
            label: '',
            data: [16, 10, 4, 1, 19, 15],
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
    options: {
    }
    }); 
    
    var ctx = document.getElementById("chartRequest").getContext('2d');
    var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"],
        datasets: [{
            label: '# of Requests',
            data: [12, 19, 3, 5, 2, 3, 7, 8, 3, 10, 14, 15,16],
            backgroundColor: [
                'rgba(0, 165, 255, 0.4)'
                
            ],
            borderColor: [
                'rgba(0, 165, 255, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
    });
}


function students(){
    
    var ctx = document.getElementById("chartBestTopicsStudents").getContext('2d');
    var myChart = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: ["Machine learning", "Database", "Reti", "Sistemi operativi", "Sicurezza", "LFC"],
        datasets: [{
            data: [24, 10, 5, 2, 1, 8],
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
    options: {
    }
    });
    
    var ctx = document.getElementById("chartAvarage").getContext('2d');
    var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ["18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30"],
        datasets: [{
            label: 'Avarage',
            data: [10, 16, 15, 20, 22, 10, 7, 8, 9, 10, 14, 5,4, 1],
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
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
    });
}