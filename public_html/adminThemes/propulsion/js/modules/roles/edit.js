$(function(){
//    tabs
    $(".tab").each(function(){
        $(this).click(function(){
          tabeId = $(this).attr('id');
          $(".tab").removeClass("activeTab");
          $(".tab").removeClass("top");
          $(".tab").addClass("inactiveTab");
          $(this).addClass("activeTab");
          $(this).removeClass("inactiveTab")
          $(".form").addClass("hide");
          $("#"+tabeId+"-1").removeClass("hide");
          if(tabeId == "form-1")
            $("#"+tabeId).addClass("top");
          return false;	  
        });
      });

})