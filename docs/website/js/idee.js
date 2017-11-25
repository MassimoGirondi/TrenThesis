function submit()
{
    //Funzione usata per salvare le informazioni dell'idea aggiunta
    var title = $("#title-idea").val();
    var assigned = $("#assigned-idea").val();
    var description = $("#description-idea").val();
    
    var selected = [];
    $('#checkboxes input:checked').each(function() {
        selected.push($(this).attr('name'));
    });
    
    for(var i = 0; i < selected.length; i++)
    {
        //= selected[i]; 
    }
    
    //Se non c'è stata nessuna assegnazione
    if(assigned == ""){
        assigned = "no";
    }
    
}

function reset(){
    $("#title-idea").val("");
    $("#assigned-idea").val("");
    $("#description-idea").val("");
    
    $('#checkboxes input:checked').each(function() {
       $(this).prop("checked", false);
    });
}

function search(){
    
}