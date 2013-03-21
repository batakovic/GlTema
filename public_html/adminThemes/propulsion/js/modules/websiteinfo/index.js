$(function(){
    
    //tabs
  if(window.location.hash){
        $(".form").addClass("hide");
        $(window.location.hash+"-1").removeClass("hide");
        $(window.location.hash).addClass("activeTab");
        $(window.location.hash).removeClass("inactiveTab");
        $(".tab").removeClass("activeTab");
        $(".tab").addClass("inactiveTab");
        if(window.location.hash != "#form-1")
            $("#form-1-1").removeClass("top");
        $(window.location.hash).addClass("activeTab");
        $(window.location.hash).removeClass("inactiveTab");
    } else {
        $(".tabsPanel ul li:first-child a").addClass("activeTab top");
        $(".tabsPanel ul li:first-child a").removeClass("inactiveTab");
    }
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
          if($(this).attr("id") == $(".tabsPanel ul li:first-child a").attr("id"))
            $(this).addClass("top");
          window.location.hash = $(this).attr("href");
          return false;
        });
      });

})