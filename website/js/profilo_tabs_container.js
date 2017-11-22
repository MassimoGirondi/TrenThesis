function profile()
{
    //Sostituire tutte le stringhe presenti nelle parentesi dopo .html con le informazioni del json
    $("#name").html("John");
    $("#surname").html("Smith");
    $("#birthday").html("dd/mm/yyyy");
    $("#career").html("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.");
}

function settings(){
    
    $("#topics-list").empty();
    $("#skills-list").empty();
    //Sostituire con il numero totale di topic preferiti dal professore
    var topicsNumber = 0;
    //Sostituire con il numero totale di topic preferiti dal professore
    var skillsNumber = 0;
    
    if(topicsNumber == 0)
    {
        $("#topics-list").append("<li class='no-settings'>Nessuna disciplina preferita</li>");  
    }
    if(skillsNumber == 0){
        $("#skills-list").append("<li class='no-settings'>Nessuna competenza preferita</li>");  
    }
    
    for(var i = 0; i < topicsNumber; i++){
        //Sostituire Topic con l'elemento i-esimo del json
            $("#topics-list").append("<li>Topic" + i +"</li>");   
        }
    
    for(var i = 0; i < skillsNumber; i++){
        //Sostituire Skill con l'elemento i-esimo del json
            $("#skills-list").append("<li>Skill" + i +"</li>");   
        }
    
}