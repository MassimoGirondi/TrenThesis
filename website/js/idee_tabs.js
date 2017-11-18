function openTab(name) {
    var tabName = "#tab-" + name;
    var containerName = "#container-" + name;
    
    $(".tab-selected").each(function(){
        $(this).removeClass("tab-selected");
    });
    
    $(".tab-container").each(function(){
        $(this).hide();
    });
    
    if(name == "all"){
        all();
    }
    else if(name == "available"){
        available();
    }
    else if(name == "assigned"){
        assigned();
    }
    
    $(tabName).addClass("tab-selected");
    $(containerName).show();
}