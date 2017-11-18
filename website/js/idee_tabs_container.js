function all(){
    $("#container-all").empty();
    
    var elementsNumberForRow = 6;
    var totalElement = 12; //Mettere la lunghezza del json
    var rowNumber = Math.ceil(totalElement/elementsNumberForRow);
    
    for(var i = 0; i < rowNumber; i++)
    {
        $("<div id='row-all" + i + "' class='row'></div>").appendTo("#container-all");
        for(var j = 0; j < elementsNumberForRow; j++)
        {
            //Aggiungere un controllo per vedere se gli elementi in json esistono
            $("<div id='col-all" + i + j + "' class='col-md-2'></div>").appendTo("#row-all" + i);
            $("<div id='elem-all" + i + j + "' class='idea-element'></div>").appendTo("#col-all" + i + j);
            //Cambiare Titolo-Data-Testo con i dati presenti nel json
            $("#elem-all" + i + j).append("<div class='idea-element-title'>Titolo</div>");
            $("#elem-all" + i + j).append("<div class='idea-element-data'>18/11/2017</div>");
            $("#elem-all" + i + j).append("<div class='idea-element-text'>consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</div>");
            
            document.getElementById("elem-all" +i +j).onclick = function(){
                window.location.href = 'idea_page.html';
            }
        }
    }
}

function available(){
    $("#container-available").empty();
    
    var elementsNumberForRow = 6;
    var totalElement = 12; //Mettere la lunghezza del json
    var rowNumber = Math.ceil(totalElement/elementsNumberForRow);
    
    for(var i = 0; i < rowNumber; i++)
    {
        $("<div id='row-available" + i + "' class='row'></div>").appendTo("#container-available");
        for(var j = 0; j < elementsNumberForRow; j++)
        {
            //Aggiungere un controllo per vedere se gli elementi in json esistono
            $("<div id='col-available" + i + j + "' class='col-md-2'></div>").appendTo("#row-available" + i);
            $("<div id='elem-available" + i + j + "' class='idea-element'></div>").appendTo("#col-available" + i + j);
            //Cambiare Titolo-Data-Testo con i dati presenti nel json
            $("#elem-available" + i + j).append("<div class='idea-element-title'>Titolo</div>");
            $("#elem-available" + i + j).append("<div class='idea-element-data'>18/11/2017</div>");
            $("#elem-available" + i + j).append("<div class='idea-element-text'>consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</div>");
            
            document.getElementById("elem-available" +i +j).onclick = function(){
                window.location.href = 'idea_page.html';
            }
        }
    }
}

function assigned(){
    $("#container-assigned").empty();
    
    var elementsNumberForRow = 6;
    var totalElement = 12; //Mettere la lunghezza del json
    var rowNumber = Math.ceil(totalElement/elementsNumberForRow);
    
    for(var i = 0; i < rowNumber; i++)
    {
        $("<div id='row-assigned" + i + "' class='row'></div>").appendTo("#container-assigned");
        for(var j = 0; j < elementsNumberForRow; j++)
        {
            //Aggiungere un controllo per vedere se gli elementi in json esistono
            $("<div id='col-assigned" + i + j + "' class='col-md-2'></div>").appendTo("#row-assigned" + i);
            $("<div id='elem-assigned" + i + j + "' class='idea-element'></div>").appendTo("#col-assigned" + i + j);
            //Cambiare Titolo-Data-Testo con i dati presenti nel json
            $("#elem-assigned" + i + j).append("<div class='idea-element-title'>Titolo</div>");
            $("#elem-assigned" + i + j).append("<div class='idea-element-data'>18/11/2017</div>");
            $("#elem-assigned" + i + j).append("<div class='idea-element-text'>consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</div>");
            
            document.getElementById("elem-assigned" +i +j).onclick = function(){
                window.location.href = 'idea_page.html';
            }
        }
    }
}