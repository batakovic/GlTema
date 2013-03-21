$(function(){
    
    //tabs
    $(".lang_list li:first-child a").addClass("menuBlue");
    $(".tab_content").hide();
    $(".tab_content:first").show();
    
    //top lang tabs
    $(".lang_tab").click(function(){
        $(".lang_tab").removeClass("menuBlue");
        $(this).addClass("menuBlue");
        $(".tab_content").hide();
        $("#tab-"+$(this).attr("id")).show();
        $("#tab-"+$(this).attr("id")+" .formPanel .form:first").show();
        $(".tabs_panel ul li:first-child").addClass("activeTab");
        $(".tabs_panel ul li:first-child").addClass("top");
        $(".tabs_panel ul li:first-child").removeClass("inactiveTab");
    });
    
    //side tabs
    $(".tab").click(function(){
       $(".tab").removeClass("activeTab");
       $(".tab").removeClass("top");
       $(".tab").addClass("inactiveTab");
       $(this).addClass("activeTab");
       $(this).removeClass("inactiveTab");
       $(".form").hide();
       $("#" + $(this).attr("id") + "-1").show();
    });
})

