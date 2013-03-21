$(function(){
         
     if ($(".tinymceControl").length > 0)
         {
              tinyMCE.init({
                // General options
                mode : "none",
                theme : "advanced",
                width: 631,
                plugins : "safari,spellchecker,pagebreak,style,layer,table,save,advhr,advimage,advlink,emotions,iespell,inlinepopups,insertdatetime,preview,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,template",
                // Theme options
                theme_advanced_buttons1 : "bold,italic,underline,|,justifyleft,justifycenter,justifyright,justifyfull,|,formatselect,fontselect,fontsizeselect,cut,copy,paste,pasteword,|,search,replace",
                theme_advanced_buttons2 : "link,unlink,anchor,image,cleanup,code,|,undo,redo,|,tablecontrols,|,hr,removeformat,visualaid,iespell,media",
                theme_advanced_buttons3 : "fullscreen,|,bullist,numlist,spellchecker,styleprops,|,outdent,indent,blockquote",
                theme_advanced_buttons4 : "",
                theme_advanced_toolbar_location : "top",
                theme_advanced_toolbar_align : "left",
                theme_advanced_statusbar_location : "bottom",
                theme_advanced_resizing : false,
                force_br_newlines : true,
                force_p_newlines : false,
                forced_root_block : '',
 
                // Example content CSS (should be your site CSS)
                // Drop lists for link/image/media/template dialogs
                template_external_list_url : "js/template_list.js",
                external_link_list_url : "js/link_list.js",
                external_image_list_url : "js/image_list.js",
                media_external_list_url : "js/media_list.js",
                convert_urls : false,
                // Replace values for the template plugin
                template_replace_values : {
                    username : "Some User",
                    staffid : "991234"
                }
            });
         }
    // Preload images
    $.preloadCssImages();
    
    //icontains
    $.expr[':'].icontains = function(obj, index, meta, stack){
        return (obj.textContent || obj.innerText || jQuery(obj).text() || '').toLowerCase().indexOf(meta[3].toLowerCase()) >= 0;
    };
    
    //jqTransform
    $(function() {
//        $("select.selectTransform").jqTransSelect();
        $("input.radioTransform").jqTransRadio();
        $("input.checkTransform").jqTransCheckBox();
    });
    
    //select
    $(function(){	

    if (!$.browser.opera) {

        $('.select').each(function(){
            var title = $(this).attr('title');
            var c = $(this).attr('class');
            if( $('option:selected', this).val() != ''  ) title = $('option:selected',this).text();
            $(this)
                .css({'z-index':10,'opacity':0,'-khtml-appearance':'none'})
                .after('<span class="'+ c +'">' + title + '</span>')
                .change(function(){
                    val = $('option:selected',this).text();
                    $(this).next().text(val);
                    })
                    
            
        });

    };
    
    $(".chzn-select").chosen();
		
    });
    
     //Tabs
     /*$(".tab").each(function(){
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
      
    //Tab top
    $(".tab_content").hide();
    $("ul.tabs li:first-child a").addClass("menuBlue").show();
    $(".block").find(".tab_content:first").show();
    $(".form").find(".tab_content:first").show();

    $("ul.tabs li").click(function() {
        $(this).parent().find('li a').removeClass("menuBlue");
        $(this).find("a").addClass("menuBlue");
        $(this).parents('.block').find(".tab_content").hide();
        $(this).parents('.form').find(".tab_content").hide();

        var activeTab = $(this).find("a").attr("href");
        var activeTabId = $(this).find("a").attr("id");
        if(window.location.hash.match('tab-')) {
            window.location.hash = activeTab;
        }

        $(activeTab).show();
        // refresh visualize for IE
        $(activeTab).find('.visualize').trigger('visualizeRefresh');
        //Activate sidebar
        $("#s"+activeTabId).show();

        return false;
    });
    
    //tabs with languages
    $(".tab_content").hide();
    $(".tab_content:first").show();
    $("ul.lang_tabs li:first-child a").addClass('menuBlue');
    $("ul.lang_tabs li a").click(function() {
        $('.tab_content').hide();
        var code = $(this).attr('id');
        $('#tab-'+code).show();
        $("ul.lang_tabs li a").removeClass("menuBlue");
        $(this).addClass('menuBlue');
//        $('.tabsPanel_lang ul li a').removeClass('activeTab top');
//        $('.tabsPanel_lang ul li a').addClass('inactiveTab');
//        $('.tabsPanel_lang ul li:first-child a').addClass('top activeTab');
//        $('.tabsPanel_lang ul li:first-child a').removeClass('inactiveTab');
        $('.form').hide();
        $('#form-1-'+code+'-1').show();
    });
    
    $('.tabsPanel_lang ul li a').click(function(){
       $('.form').hide();
       var id = $(this).attr('id');
       $('#'+id+'-1').show();
       $('.tabsPanel_lang ul li a').addClass('inactiveTab');
       $('.tabsPanel_lang ul li a').removeClass('activeTab');
       $(this).addClass('activeTab');
       $(this).removeClass('inactiveTab');
       if(id == $('#tabsPanel_lang ul li:first-child a').attr('id'))
            $(this).addClass('top');
    });*/
    
    $('#nav > li > a').click(function(){
      if($(this).attr('href')=="#" || $(this).attr('href')=="") {
        return false;
      }
    });
        
    $('.cross').mousedown(function(){
        $(this).closest("div").parent().find("div").addClass("active");
    });

    $('.cross').mouseup(function(){
        $(this).closest("div").parent().find("div").removeClass("active");
    });
    
//    $(".tabsPanel  .formPanel#"+window.location.hash).show();
    
    //Adding new menu link
    $("a.addNewLink").live("click",function(){
        var id = $(this).attr("id");
        var lang = $(this).attr("lang");
        var title = $("input[name='newLinkTitle_"+id+"_"+lang+"']").val();
        var url = $("input[name='newLinkUrl_"+id+"_"+lang+"']").val();
        var addNewLinkTitleMsg = $('#addNewLinkTitleMsg').val();
        if(title != "") {
            $.post(appurl + "/menus/createnewlink",{
                'id':id, 
                "url":url, 
                "title":title, 
                "lang":lang
            },function(data){
                //alert(data);
                $("#ol_"+id).append(data);
                window.location.reload();
            });
        } else {
            alert(addNewLinkTitleMsg);
        }
    });
    
    $("a.addNewLinkAdmin").live("click",function(){
        var id = $(this).attr("id");
        var title = $("input[name='newLinkTitle_"+id+"']").val();
        var url = $("input[name='newLinkUrl_"+id+"']").val();
        var addNewLinkTitleMsg = $('#addNewLinkTitleMsg').val();
        if(title != "") {
            $.post(appurl + "/menus/createnewlink",{
                'id':id, 
                "url":url, 
                "title":title
            },function(data){
                //alert(data);
                $("#ol_"+id).append(data);
                window.location.reload();
            });
        } else {
            alert(addNewLinkTitleMsg);
        }
    });
	
    $("a.addNewLinkFromContent").live("click", function(){
        var id = $(this).attr("id");
        var lang = $(this).attr("lang");
        var infos = $(".newLinkSelectContent_"+id+"_"+lang).val();
        var infoArr = infos.split("::");
        var aid = infoArr[0];
        var cid = infoArr[1];
		
        var addNewLinkTitleMsg = $('#addNewLinkTitleMsg').val();
        if(infos != "0") {
            $.post(appurl + "/menus/createnewlinkcontent",{
                'id':id, 
                "aid":aid, 
                "cid":cid, 
                "lang":lang
            },function(data){
                $("#ol_"+id+"_"+lang).append(data);
                window.location.reload();
            });
        } else {
            alert(addNewLinkTitleMsg);
        }
	
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
            //alert(data);
            $("li#list_"+id).html(data);
            window.location.reload();
        });
        return false;
    });
	
//    $("a.closeLinkUpdate").live("click",function(){
//        var id = $(this).attr("id");
//        var mid = $(this).attr("menuId");
//        $.post(appurl + "/menus/getlinkinfo",{
//            'id':id,
//            'mid':mid
//        },function(data){
//            //alert(data);
//            $("li#list_"+id).html(data);
//            window.location.reload();
//        });
//        return false;
//    });
    

    $('a.clientDelete').click(function(){
      var msg = $(this).attr('msg');
      var confirmDlg = confirm(msg);
      if(confirmDlg) {
      } else {
        return false;
      }
    });

    //Remove menu confirmation
    $("a.deleteMenuLink").live("click",function(){
       if(!confirm($(this).attr("delete-confirm-message")))
           return false;
    });
                
    
    //TinyMce selecots
    $('textarea.tinymceControl:visible, textarea.tinymceControl:hidden').each(function(){
        var tinyId = $(this).attr("id");
        tinyMCE.execCommand('mceAddControl',false,tinyId);
    }); 
     
    // File upload
    if ($('#fileupload').length) {
        new AjaxUpload('fileupload', {
            action: 'upload-handler.php',
            autoSubmit: true,
            name: 'userfile',
            responseType: 'text/html',
            onSubmit : function(file , ext) {
                $('.fileupload #uploadmsg').addClass('loading').text('Uploading...');
                this.disable(); 
            },
            onComplete : function(file, response) {
                $('.fileupload #uploadmsg').removeClass('loading').text(response);
                this.enable();
            }   
        });
    } 
         
    // IE6 PNG fix
    $(document).pngFix(); 
    
    //Focus default on input text
    $('input[type="text"],input[type="password"]').focus(function(){
      if(typeof $(this).attr("default") != "undefined" && $(this).val() == $(this).attr("default")) {
          $(this).val("");
      }
    });
    
    //Blur default on input text
    $('input[type="text"],input[type="password"]').blur(function(){
      if(typeof $(this).attr("default") != "undefined" && $(this).val() == "") {
          $(this).val($(this).attr("default"));
      }
    });
        
    //Messages fade out
    $(".message").delay(7000).fadeOut(500);
    
    $(".showLoader").live('click',function(){
        var submitPossition = $(this).css('position');
        var submitwidth = $(this).width();
        var submitheight = $(this).height();
        var submitFloat = $(this).css('float');
        $(this).after('<div class="ajax_loader" style="float:'+submitFloat+';position:'+ submitPossition+'"></div>');
        $(this).hide();
    });
    
    $(".formSubmit").live('click',function(){
        if ($(".tinymceControl").length > 0) {
            tinyMCE.triggerSave();
        }
    });
    //CMS form submit
    $('#cmsForm').ajaxForm(handleResponse);
    
    //Regions
    $("a.deleteRegion").click(function(){
        var deleteRegionMsg = $(this).attr("delete-confirm-message");
        var status = confirm(deleteRegionMsg);
        if(status) {
            var id = $(this).attr("id");
            $.get(appurl+'/regions/delete/id/'+id, handleResponse);
            $('#regionrow-'+id).remove();
        }
        return false;
    });
    

//    Disable/Enable lang
    $("a.disableLang").live("click",function(){
        var id = $(this).attr("id");
        var deleteRegionMsg = $("#deleteLangMsg").val();
        var status = confirm(deleteRegionMsg);
        if(status) {
            $.get(appurl+'/languages/disable/id/'+id, handleResponse);       
            $('#langrow-'+id).remove();
            return false;
        }

    });
    
    //Role
    $("a.deleteRole").live("click", function(){
        var id = $(this).attr("id");
        if(confirm($(this).attr("delete-confirm-message"))){
            $.get(appurl+'/roles/delete/id/'+id, handleResponse);
            $("#rolerow-"+id).remove();
            return false;
        }
    });
    
    function handleResponse(data) {
      //Status redirect need to redirect to url
      if(data.status == "redirect") {
          if(window.location.hash != "")
              window.location.replace(data.url+window.location.hash);
          else
              window.location.replace(data.url);
      }
      //Show error msg
      if(data.status == "errormsg") {
          $('.showLoader').next().remove();
          $('.showLoader').show();
          $(".errormsg").html(data.msg);
          $(".errormsg").show().delay(1000).fadeOut(500);
      }
      //Show infor msg
      if(data.status == "info") {
          $(".info").html(data.msg);
          $(".info").show().delay(1000).fadeOut(500);
      }
      return false;
    }
    }); 
    
    //Delete category confirmation
    $("a.deleteCategory").live("click",function(){
        var deleteCategoryMsg = $(this).attr('delete-confirm-message');
        var status = confirm(deleteCategoryMsg);
        if(status) {
            return true;
        } else {
            return false;
        }
    });
    
    //Delete article
    $("a.deleteArticle").live("click",function(){
        var status = confirm($(this).attr("delete-confirm-message"));
        if(status)
            return true;
        else
            return false;
    });
    
    //Adding rows into widgets table - add content form
	
    $(".addWidget").click(function(){
        var id = $(this).attr("id");
        var tableId = "table-"+id;
				
        var titleid = "add_title_region_"+id;
        var title = $("#"+titleid).val();
        var region = $("#add_region_"+id).val();
        var widget = $("#add_widget_"+id).val();
        var category = $("#add_category_"+id).val();
        var j = $("#row_count_"+id).val();
        var i = j+1;
		
        if(title == "") {
            return false;
        }
		
        var regionSelected = $("select#add_region_"+id+" option:selected").text();
        //alert(regionSelected);
        var widgetSelected = $("select#add_widget_"+id+" option:selected").text();
        var categorySelected = $("select#add_category_"+id+" option:selected").text();
		
        $('#'+tableId+' tbody').append('<tr id="widgets_table_row_'+id+'_'+i+'"><td>'+title+'<input type="hidden" name="region_article_title_'+id+'_'+i+'" value="'+title+'"></td><td>'+regionSelected+'<input type="hidden" name="region_article_region_'+id+'_'+i+'" value="'+region+'"></td><td>'+widgetSelected+'<input type="hidden" name="region_article_widget_'+id+'_'+i+'" value="'+widget+'"></td><td>'+categorySelected+'<input type="hidden" name="region_article_category_'+id+'_'+i+'" value="'+category+'"></td><td class="delete"><a href="#" class="deleteWidget" id="'+id+'_'+i+'"> Delete</a></td></tr>');
        $("#row_count_"+id).val(i);
		
        return false;
    });
	
    $("a.deleteWidget").click(function(){
        var deleteRegionMsg = $(this).attr("delete-confirm-message");
        var status = confirm(deleteRegionMsg);
        if(status) {
            var id = $(this).attr("id");
            $.get(appurl+'/widget/delete/id/'+id, handleResponse);
            $('#widgetrow-'+id).remove();
        }
        return false;
    });
	
    $(".deleteWidgetFromList").live("click", function(){
        var msg = $(this).attr("delete-confirm-message");
        var status = confirm(msg);
        if(!status) {
            return false;
        }
    });
	
    //hide ddl's	
    $(".hide").hide();
    $(".hide").hide();
	 
    //if selected select from makes ddl for content types
    $("#newContentTypeFormFileds_FiledType").change(function (){
        if($("#newContentTypeFormFileds_FiledType option:selected").val() == "selectFrom"){
            $("#newContentTypeFormFileds_DefaultValues").hide();
            $("#contentTypes").show();       
            
            $.ajax({
                url: appurl+'/contenttypes/getcontenttypelist',
                async: false,
                type: 'POST',
                success: function(data){
                   $("#contentTypes").html(data);
                }
            });
            
            $.ajax({
                url: appurl+'/formtypes/getformtypelist',
                async: false,
                type: 'POST',
                success: function(data){
                   $("#contentTypes").append(data);
                }
            });    
                    
            $("#contentTypes").append("<optgroup value='system' label='System tables'><option value='users::0'>Users</option><option value='languages::0'>Languages</option><option value='countries::0'>Countries</option>");
            var params = $("#contentTypes option:selected").val();
            var params = params.split("::");
            $("#articles").show();
            $.get(appurl+'/contenttypes/getarticlelist/table/'+params[0], function(data) {
                $("#articles").html(data);
            });           
              
        } else {
            $("#newContentTypeFormFileds_DefaultValues").show();
            $("#contentTypes").hide();
            $("#articles").hide();
        }
    });
     
    //if changed value gives ddl or textbox
    $(".fieldType").change(function(){
        var type = $("option:selected", this).val();
        var name = $(this).attr("name").split("_");
        if(type == "selectFrom"){
            $("#defaultValues_"+name[1]).hide();
            $("#contentTypes_"+name[1]).show();                          
            $.get(appurl+'/contenttypes/getarticlelist/table/'+$("#contentTypes_"+name[1]).val(), function(data) {
                $("#articles_"+name[1]).html(data);
            });             
            $("#articles_"+name[1]).show();
        } else {
            $("#defaultValues_"+name[1]).show();
            $("#contentTypes_"+name[1]).hide();
             
            $("#articles_"+name[1]).hide();
        }
    });
    
    
    //populates ddl dependig on select
    $("#contentTypes").change(function (){
        var params = $("#contentTypes option:selected").val();
        var params = params.split("::");
        $("#articles").show();
        $.get(appurl+'/contenttypes/getarticlelist/table/'+params[0], function(data) {
            $("#articles").html(data);
        });
    });
     
    //populates ddl edit cty on edit filed select
    $(".contentTypeAj").change(function(){         
        var id = $(this).attr("id").split("_");
        var id = id[1];
        var param = $("option:selected", this).val();

        $.get(appurl+'/contenttypes/getarticlelist/table/'+param, function(data) {
            $("#articles_"+id).html(data);
        });
    });     
    
    $('a.deleteColumn').live('click',function(){
      var data = $(this).data();
      var status = confirm(data.deleteMsg);
      if(!status) {
        return false;
      }
    });
    


    
    
    /*
	   Content type form - edit ctt
    */

    $(".newContentTypeFormFiledsEdit").click(function(){
		
        var title = $("#newContentTypeFormFileds_Title").val();
        var fieldType =  $("#newContentTypeFormFileds_FiledType").val();
        if(fieldType == "selectFrom"){
            if(typeof($("#articles option:selected").val()) == 'undefined'){		    
                var selectError = $("#selectFromError").val();
                alert(selectError);
                return false;
            }
            var defaultValues  = $("#articles option:selected").val() + "::" + $("#contentTypes option:selected").val();
            var defaultValuesW = $("#contentTypes option:selected").text() + "," + $("#articles option:selected").text();
        } else {
            var defaultValues  =  $("#newContentTypeFormFileds_DefaultValues").val();
            var defaultValuesW =  $("#newContentTypeFormFileds_DefaultValues").val();		    
        }
		
        var showInList =  $("#newContentTypeFormFileds_ShowInList ").attr("checked");
        var emptyFieldTitleMsg = $('#emptyFieldTitleMsg').val();
        var errorTitleAllreadyExist = $('#errorTitleAllreadyExist').val();
        var errorRegexpFail = $("#errorRegexpFail").val();
		var showInList =  $("#newContentTypeFormFileds_ShowInList ").attr("checked");
		var emptyFieldTitleMsg = $('#emptyFieldTitleMsg').val();
		var errorTitleAllreadyExist = $('#errorTitleAllreadyExist').val();
		var errorRegexpFail = $("#errorRegexpFail").val();
		
		if(showInList) {
			var showInList = 1;
			var showInListTitle = "Yes";
		} else {
			var showInList = 0;
			var showInListTitle = "No";
		}
		
		var searchable =  $("#newContentTypeFormFileds_Searchable ").attr("checked");
		if(searchable) {
			var searchable = 1;
			var searchableTitle = "Yes";
		} else {
			var searchable = 0;
			var searchableTitle = "No";
		}
		
		//var j = $("#newContentTypeFormFileds_RowCount").val();
		var j = $("table#table-newContentTypeFormFileds tr").length;
		var i = j+1;
		var ifExist = false;
        $("#table-newContentTypeFormFileds tbody tr td input.titleTd'").each(function(){
            if($(this).val().toLowerCase() == title.toLowerCase()){
                ifExist = true;
            }
        });
        if(title != '') {
            var patt=/^[a-zA-Z0-9 \\?]{1,64}$/g;
            var result=patt.test(title);
            if(result){		        		   
                if($("#table-newContentTypeFormFileds tbody tr td.titleTd:icontains('"+title+"')").text() == ""){
                    if(!ifExist){		               
                        var filedTypeSelected = $("select#newContentTypeFormFileds_FiledType option:selected").text();
                        var htmlToAppend = '<tr id="contentTypeFields_table_row_fieldId_'+i+'"><td class="titleTd">'+title+'<input type="hidden" name="fieldTttle_'+i+'" value="'+title+'"></td><td>'+filedTypeSelected+'<input type="hidden" name="fieldType_'+i+'" value="'+fieldType+'"></td><td>'+defaultValuesW+'<input type="hidden" name="fieldDefaultValues_'+i+'" value="'+defaultValues+'"></td><td>'+showInListTitle+'<input type="hidden" name="fieldShowInList_'+i+'" value="'+showInList+'"></td><td>'+searchableTitle+'<input type="hidden" name="fieldSearchable_'+i+'" value="'+searchable+'"></td><td><input type="radio" value="'+title+'" id="titleField" name="titleField" class="radio" /></td><td class="delete"><a href="#" class="deleteContentTypeFiledEditForm" id="fieldId_'+i+'"> Delete</a></td></tr>'
                        $('#table-newContentTypeFormFileds tbody').append(htmlToAppend);
                        $("#newContentTypeFormFileds_RowCount").val(i);
                    } else {
                        alert(errorTitleAllreadyExist);
                    }
                } else {
                    alert(errorTitleAllreadyExist);
                }
            }else{
                alert(errorRegexpFail);
            }
        } else {
            alert(emptyFieldTitleMsg);
        }	    
        return false;
    });
	
			
    /* Edit form type */
	
    $('.newFormTypeFormFiledsEdit').click(function(){
		
        var title = $("#newFormTypeFormFileds_Title").val();
        var fieldType =  $("#newFormTypeFormFileds_FiledType").val();
        var defaultValues =  $("#newFormTypeFormFileds_DefaultValues").val();
        var showInList =  $("#newFormTypeFormFileds_ShowInList ").attr("checked");
        var required =  $("#newFormTypeFormFileds_Required").attr("checked");
        var emptyFieldTitleMsg = $('#emptyFieldTitleMsg').val();
        var errorTitleAllreadyExist = $('#errorTitleAllreadyExist').val();
		
        if(showInList) {
            var showInList = 1;
            var showInListTitle = "Yes";
        } else {
            var showInList = 0;
            var showInListTitle = "No";
        }
		
        if(required) {
            var required = 1;
            var requiredTitle = "Yes";
        } else {
            var required = 0;
            var requiredTitle = "No";
        }
		
        var j = $("table#table-newFormTypeFormFileds tr").length;
        var i = j+1;
		
        var filedTypeSelected = $("select#newFormTypeFormFileds_FiledType option:selected").text();

        var htmlToAppend = '<tr id="formTypeFields_table_row_fieldId_'+i+'"><td>'+title+'<input type="hidden" name="fieldTttle_'+i+'" value="'+title+'"></td><td>'+filedTypeSelected+'<input type="hidden" name="fieldType_'+i+'" value="'+fieldType+'"></td><td>'+defaultValues+'<input type="hidden" name="fieldDefaultValues_'+i+'" value="'+defaultValues+'"></td><td>'+showInListTitle+'<input type="hidden" name="fieldShowInList_'+i+'" value="'+showInList+'"></td><td>'+requiredTitle+'<input type="hidden" name="fieldRequired_'+i+'" value="'+required+'"></td><td></td><td class="delete"><a href="#" class="deleteFormTypeFiledEditForm" id="fieldId_'+i+'"> Delete</a></td>/tr>';
				
        $('#table-newFormTypeFormFileds tbody').append(htmlToAppend);
        $("#newFormTypeFormFileds_RowCount").val(i);
		
        return false;
    });

    $(".deleteContentTypeFiledAddForm").live("click",function(){
        var id = $(this).attr("id");
        var rowid = "contentTypeFields_table_row_"+id;
        $("#"+rowid).remove();
        if($('#table-newContentTypeFormFileds > tbody').find('tr').size() == 0) {
          $('#contentTypeFieldsTable').hide();
          $('#contentTypeNoFields').show();
        }
        return false;
    });
	
    $(".deleteFormTypeFiledAddForm").live("click",function(){
        var id = $(this).attr("id");
        var rowid = "formTypeFields_table_row_"+id;             
        $("#"+rowid).remove();
        if($('#table-newFormTypeFormFileds > tbody').find('tr').size() == 0) {
          $('#formTypeFormFiledsTable').hide();
          $('#contentTypeNoFields').show();
        }  
        return false;
    });
	
    $(".deleteContentTypeFiledEditForm").live("click",function(){
        var id = $(this).attr("id");
        var rowid = "contentTypeFields_table_row_"+id;
        //alert(rowid);
        $("#"+rowid).remove();
        return false;
    });
	
    $(".deleteFormTypeFiledEditForm").live("click",function(){
        var id = $(this).attr("id");
        var rowid = "formTypeFields_table_row_"+id;
        $("#"+rowid).remove();
        return false;
    });
    
    
    
    
    /*
	   Content type form - edit ctt
    */

    $(".newContentTypeFormFiledsEdit").click(function(){
		
        var title = $("#newContentTypeFormFileds_Title").val();
        var fieldType =  $("#newContentTypeFormFileds_FiledType").val();
        if(fieldType == "selectFrom"){
            if(typeof($("#articles option:selected").val()) == 'undefined'){		    
                var selectError = $("#selectFromError").val();
                alert(selectError);
                return false;
            }
            var defaultValues  = $("#articles option:selected").val() + "::" + $("#contentTypes option:selected").val();
            var defaultValuesW = $("#contentTypes option:selected").text() + "," + $("#articles option:selected").text();
        } else {
            var defaultValues  =  $("#newContentTypeFormFileds_DefaultValues").val();
            var defaultValuesW =  $("#newContentTypeFormFileds_DefaultValues").val();		    
        }
		
        var showInList =  $("#newContentTypeFormFileds_ShowInList ").attr("checked");
        var emptyFieldTitleMsg = $('#emptyFieldTitleMsg').val();
        var errorTitleAllreadyExist = $('#errorTitleAllreadyExist').val();
        var errorRegexpFail = $("#errorRegexpFail").val();
		var showInList =  $("#newContentTypeFormFileds_ShowInList ").attr("checked");
		var emptyFieldTitleMsg = $('#emptyFieldTitleMsg').val();
		var errorTitleAllreadyExist = $('#errorTitleAllreadyExist').val();
		var errorRegexpFail = $("#errorRegexpFail").val();
		
		if(showInList) {
			var showInList = 1;
			var showInListTitle = "Yes";
		} else {
			var showInList = 0;
			var showInListTitle = "No";
		}
		
		var searchable =  $("#newContentTypeFormFileds_Searchable ").attr("checked");
		if(searchable) {
			var searchable = 1;
			var searchableTitle = "Yes";
		} else {
			var searchable = 0;
			var searchableTitle = "No";
		}
		
		//var j = $("#newContentTypeFormFileds_RowCount").val();
		var j = $("table#table-newContentTypeFormFileds tr").length;
		var i = j+1;
		var ifExist = false;
        $("#table-newContentTypeFormFileds tbody tr td input.titleTd'").each(function(){
            if($(this).val().toLowerCase() == title.toLowerCase()){
                ifExist = true;
            }
        });
        if(title != '') {
            var patt=/^[a-zA-Z0-9 \\?]{1,64}$/g;
            var result=patt.test(title);
            if(result){		        		   
                if($("#table-newContentTypeFormFileds tbody tr td.titleTd:icontains('"+title+"')").text() == ""){
                    if(!ifExist){		               
                        var filedTypeSelected = $("select#newContentTypeFormFileds_FiledType option:selected").text();
                        var htmlToAppend = '<tr id="contentTypeFields_table_row_fieldId_'+i+'"><td class="titleTd">'+title+'<input type="hidden" name="fieldTttle_'+i+'" value="'+title+'"></td><td>'+filedTypeSelected+'<input type="hidden" name="fieldType_'+i+'" value="'+fieldType+'"></td><td>'+defaultValuesW+'<input type="hidden" name="fieldDefaultValues_'+i+'" value="'+defaultValues+'"></td><td>'+showInListTitle+'<input type="hidden" name="fieldShowInList_'+i+'" value="'+showInList+'"></td><td>'+searchableTitle+'<input type="hidden" name="fieldSearchable_'+i+'" value="'+searchable+'"></td><td><input type="radio" value="'+title+'" id="titleField" name="titleField" class="radio" /></td><td class="delete"><a href="#" class="deleteContentTypeFiledEditForm" id="fieldId_'+i+'"> Delete</a></td></tr>'
                        $('#table-newContentTypeFormFileds tbody').append(htmlToAppend);
                        $("#newContentTypeFormFileds_RowCount").val(i);
                    } else {
                        alert(errorTitleAllreadyExist);
                    }
                } else {
                    alert(errorTitleAllreadyExist);
                }
            }else{
                alert(errorRegexpFail);
            }
        } else {
            alert(emptyFieldTitleMsg);
        }	    
        return false;
    });
	
			
    
    $(".deleteContentTypeFiledAddForm").live("click",function(){
        var id = $(this).attr("id");
        var rowid = "contentTypeFields_table_row_"+id;
        //alert(rowid);
        $("#"+rowid).remove();
        return false;
    });
	
    $(".deleteFormTypeFiledAddForm").live("click",function(){
        var id = $(this).attr("id");
        var rowid = "formTypeFields_table_row_"+id;
        $("#"+rowid).remove();
        return false;
    });
	
    $(".deleteContentTypeFiledEditForm").live("click",function(){
        var id = $(this).attr("id");
        var rowid = "contentTypeFields_table_row_"+id;
        //alert(rowid);
        $("#"+rowid).remove();
        return false;
    });
	
    $(".deleteFormTypeFiledEditForm").live("click",function(){
        var id = $(this).attr("id");
        var rowid = "formTypeFields_table_row_"+id;
        $("#"+rowid).remove();
        return false;
    });
    
    $(".changeWidget").live("change",function(){
        var name = $(this).attr("name");
        var params = name.split("_");

        var id = params[1];
        var widget = $(this).val();
        $.post(appurl + "/widgets/changeoptions/",{'id':id,'widgetId':widget},function(data){
            $("select[name='regionArticleWidgetParam_"+id+"']").html(data);
        });
    });
    
    $(".selectWidget").live("change",function(){
        var lang = $(this).attr("lang");
        var id = 0;
        var widget = $(this).val();
        $.post(appurl + "/widgets/changeoptions/",{'id':id,'widgetId':widget},function(data){
            $("#add_category_widgets_"+lang).html(data);
            $("#add_category_widgets_"+lang).trigger("liszt:updated");
        });
    });
     
    $(function() {
        $(".contentTable tbody").sortable({
            items: 'tr',
            asixs: 'y', 
            handle: ".handle",
            helper: function(e, tr) {
                      var $originals = tr.children();
                      var $helper = tr.clone();
                      $helper.children().each(function(index)
                      {
                        // Set helper cell sizes to match the original sizes
                        $(this).width($originals.eq(index).width())
                      });
                      return $helper;
                    },
            update: function (event, ui) {
                var serialized = $(this).sortable( "toArray" );
                contID = $('input#contentType').val();
                $.ajax({
                    url: appurl + "/manage/reorder",
                    data: {items: serialized, contentTypeId: contID},
                    async: false,
                    type: 'POST',
                    success: function(data){
                    }
                });       
             }
        });
        $(".contentTable tbody").disableSelection();
    });
    
    //Paginations items per page
    $('select.showsPerPage').live("change", function(){
            var itemsPerPage = $(this).val();
            var link = $(this).attr("link");
            window.location.href = appurl + link + '/showsPerPage/'+itemsPerPage;

    });

$('.addAttachment').live("click", function(){
       var leng = $('.newClassAttach').length;
           $('.fileupload').append('<div class="uploadDiv"><span>Attach files...</span><input id="uploadfile" style="margin-top:0px" class="attachButton file" type="file" name="attachment[]"/><div style="clear:both"></div><br/><br/>');

    });
    $('#uploadfile').live('change',function(){
        span = $(this).prev();
        span.text($(this).val());	
   }); 

   //support deparrment... add  user information to textarea
   $('.addUserInfoLink').live("click", function(){
        var val = $('#userInfoSelect').val();
        tinyMCE.execCommand('mceInsertContent',false,val);
  });
