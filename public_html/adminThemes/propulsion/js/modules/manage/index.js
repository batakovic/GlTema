$(function () {
    
    $(".chartPanel").hide();
    $(".chartPanel:first").show();
    $(".chart-tab").click(function(){
        $(".chart-tab").removeClass("menuBlue");
        $(this).addClass("menuBlue");
        $(".chartPanel").hide();
        var id = $(this).attr("id");
        $("#"+id+"-chart").show();
    });
    
    
})

