function openTab(name) {
    var tabName = "#tab-" + name;
    var containerName = "#container-" + name;
    
    $(".tab-selected").each(function(){
        $(this).removeClass("tab-selected");
    });
    
    $(".tab-container").each(function(){
        $(this).hide();
    });
    
    if(name = "professors")
    {
        professors();
    }
    else if(name = "students")
    {
        students();
    }
    
    $(tabName).addClass("tab-selected");
    $(containerName).show();
}