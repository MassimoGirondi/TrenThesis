function editProfile(){
  let dipartment = $("#dipartment-profile").val();
  let email = $("#email-profile").val();
  let website = $("#website-profile").val();
    

   let keys = []; //Contiene tutte le etichette dei nuovi campi
   let values = []; //Contiene tutti i valori delle nuove etichette
    //Per keys[0] il valore corrispondente è values[0]
   $('#other-informations div input').each(function(i){
        if($(this).hasClass("keys modal-input")){
            keys.push($(this).val());
        }
        else{
           values.push($(this).val());
        }
    });
}

function reset(){
  $("#dipartment-profile").val("");
  $("#email-profile").val("");
  $("#website-profile").val("");

  $('#other-informations').empty();
}

function addInformation(){
    
    $("#other-informations").append("<div class='new-information'><span>Etichetta: </span><input id='' type='text' class='keys modal-input'/><span>Informazione: </span><input id='' type='text' class='values modal-input'/></div>");
    
    $('#other-informations div input').each(function(i){
        if($(this).hasClass("keys modal-input")){
            $(this).attr("id", "key_" + (i/2));
        }
        else{
            $(this).attr("id", "value_" + ((i - 1)/2));
        }
    });
}