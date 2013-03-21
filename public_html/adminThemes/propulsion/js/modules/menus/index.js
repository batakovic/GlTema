//Tabs
$(function() {
        //Sortable menu
    $('ol.sortable').nestedSortable({
        disableNesting: 'no-nest',
        forcePlaceholderSize: true,
        handle: 'span.cross',
        helper: 'clone',
        items: 'li',
        maxLevels: 10,
        opacity: 1,
        placeholder: 'placeholder',
        revert: 250,
        tabSize: 25,
        tolerance: 'pointer',
        toleranceElement: '> div',
        stop: function(event, ui) {
            $(this).find("li div.active").removeClass("active");
        },
        update: function(e, tr) {
            serialized = $('ol.sortable').nestedSortable('serialize');  
            var mid = $(this).attr("mid");
            var lang = $(this).attr("lang");
            if(lang != "") {
                var serialized = $(this).sortable('serialize');
			
                $.post(appurl + "/menus/reorder", serialized + "&lang="+lang,function(data){
				
                    var response = data.split('=');
				
                    //alert(response[0]);
                    $('.'+response[0]).hide();
                    $('#msg_'+mid+' .'+response[0]).html(response[1]);
                    $('#msg_'+mid+' .'+response[0]).show().delay(7000).fadeOut(500);
				
                });
            } else {
                var serialized = $(this).sortable('serialize');
		
                $.post(appurl + "/menus/reorder", serialized,function(data){
				
                    var response = data.split('=');
				
                    //alert(response[0]);
                    $('.'+response[0]).hide();
                    $('#msg_'+mid+' .'+response[0]).html(response[1]);
                    $('#msg_'+mid+' .'+response[0]).show().delay(7000).fadeOut(500);
				
                });
            }
        }
    });
  
  
  if(window.location.hash != "") {
    var menuID = window.location.hash;
    menuID = menuID.replace('#menu-','');
    $(".tab").removeClass("activeTab");
    $(".tab").removeClass("top");
    $(".tab").addClass("inactiveTab");
    var tabeId = $(".tab[menuid='menu-"+menuID+"']").attr("id");
    $("#"+tabeId).addClass("activeTab");
    $("#"+tabeId).removeClass("inactiveTab")
    $(".form").addClass("hide");
    $("#"+tabeId+"-1").removeClass("hide");
    if(tabeId == "form-1")
      $("#"+tabeId).addClass("top");
  }
  
     $(".tab").each(function(){
        $(this).click(function(){
          tabeId = $(this).attr('id');
          var menuId = $(this).attr('menuid');
          $(".tab").removeClass("activeTab");
          $(".tab").removeClass("top");
          $(".tab").addClass("inactiveTab");
          $(this).addClass("activeTab");
          $(this).removeClass("inactiveTab")
          $(".form").addClass("hide");
          $("#"+tabeId+"-1").removeClass("hide");
          window.location.hash = menuId;
          if(tabeId == "form-1")
            $("#"+tabeId).addClass("top");
          return false;	  
        });
      });
      
    //Tab top
    $(".tab_content").hide();
    $(".block").find(".tab_content:first").show();
    $(".form").find(".tab_content:first").show();

    $("#lang_tab").change(function() {
        $(this).parents('.block').find(".tab_content").hide();
        $(this).parents('.form').find(".tab_content").hide();

        var activeTab = $(this).find("a").attr("href");
        var activeTabId = $(this).find("a").attr("id");
        if(window.location.hash.match('tab-')) {
            window.location.hash = activeTab;
        }
        
        var activeTab = $(this).val();

        $("#tab-"+activeTab).show();
        // refresh visualize for IE
        $(activeTab).find('.visualize').trigger('visualizeRefresh');
        //Activate sidebar
        $("#s"+activeTabId).show();

        return false;
    });
    

    
     //edit link
    $("a.editLink").live("click",function(){
        var id = $(this).attr("id");
        var mid = $(this).attr("menuId");
        $.post(appurl + "/menus/editlink",{
            'id':id,
            'mid':mid
        },function(data){
            $("li#list_"+id).html(data);
        });
		return false;
    });
    
    $("a.updateLink").live("click",function(){
        var id = $(this).attr("id");
        var title = $("input[name='link_title_"+id+"']").val();
        var url = $("input[name='link_url_"+id+"']").val();
        var mid = $("input[name='link_mid_"+id+"']").val();
        $.post(appurl + "/menus/updatelink",{
            'id':id, 
            "url":url, 
            "title":title,
            'mid':mid
        },function(data){
            $("li#list_"+id).html(data);
            window.location.reload();
        });
        return false;
    });
	
    $("a.closeLinkUpdate").live("click",function(){
        var id = $(this).attr("id");
        var mid = $(this).attr("menuId");
        $.post(appurl + "/menus/getlinkinfo",{
            'id':id,
            'mid':mid
        },function(data){
            $("li#list_"+id).html(data);
            window.location.reload();
        });
        return false;
    });
    
    //Remove link
    $("a.removeLink").live("click",function(){
        var id = $(this).attr("id");
        var menuId = $(this).attr("menuId");
        var status = confirm($(this).attr('delete-confirm-message'));
        if(status) {
            $.post(appurl + "/menus/removelink",{
                'id':id,
                'menuId':menuId
            },function(data){
			
                var response = data.split('=');
			
                var mid = $("#list_"+id).attr("class");
                if(response[0] == "info")
                {
                    $("li#list_"+id).remove();
				
                }
			
                $('.'+response[0]).hide();
                $('#sb'+mid+' .'+response[0]).html('<p>'+response[1]+'</p>');
                $('#sb'+mid+' .'+response[0]).show().delay(7000).fadeOut(500);
                window.location.reload();
            });

        } else {
            return false;
        }


    });
})