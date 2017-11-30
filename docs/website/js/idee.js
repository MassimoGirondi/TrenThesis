function addIdea() {

  let topic = getModalValuesAsTopic();

  $.ajax({
    url: api_url + '/api/topics?token=' + Cookies.get('token'),
    type: 'POST',
    contentType: 'application/json',
    dataType: 'json',
    processData: false,
    data: JSON.stringify(topic),
    success: function() {
      window.location = 'idee.html';
    }
  });
}

function search() {}
}
