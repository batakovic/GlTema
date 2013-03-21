$(function(){
    
    //tabs
    $(".lang_list li:first-child a").addClass("menuBlue");
    $(".tab_content").hide();
    $(".tab_content:first").show();
    
    //top lang tabs
    $(".lang_tab").live('click',function(){
        $(".lang_tab").removeClass("menuBlue");
        $(this).addClass("menuBlue");
        $(".tab_content").hide();
        $("#tab-"+$(this).attr("id")).show();
        $("#tab-"+$(this).attr("id")+" .formPanel .form:first").show();
        $(".tabs_panel ul li:first-child").addClass("activeTab");
        $(".tabs_panel ul li:first-child").addClass("top");
        $(".tabs_panel ul li:first-child").removeClass("inactiveTab");
        return false;
    });
    
    //side tabs
    $(".tab").live('click',function(){
       var parent = $(this).parent().parent();
       parent.children('li').children('a').removeClass("activeTab");
       $(".tab").removeClass("top");
       $(".tab").addClass("inactiveTab");
       $(this).addClass("activeTab");
       $(this).removeClass("inactiveTab");
       $(".form").hide();
       $("#" + $(this).attr("id") + "-1").show();
       return false;
    });
    
    //Adding rows into widgets table - add content form
	
    $(".addWidget").click(function(){
        
        var errorTitleAllreadyExist = $('#errorTitleAllreadyExist').val();
        var id = $(this).attr("id");
        var tableId = "table-"+id;	
        var tableObj = "#"+tableId;
        var titleid = "add_title_region_"+id;
        var titleObj = $("#"+titleid);
        var region = $("#add_region_"+id).val();
        var widget = $("#add_widget_"+id).val();
        var category = $("#add_category_"+id).val();
        var j = $("#row_count_"+id).val();
        var i = j+1;
        
        var exist = false;        
        
        $("#"+tableId+" tbody tr td.titleTd input").each(function(){
            if($(this).val().toLowerCase() == titleObj.val().toLowerCase()){
                exist = true;
            }
        }); 
        if(exist){
           alert(errorTitleAllreadyExist);
           return false;
        }
		
        if(titleObj.val() == "" || titleObj.val() == titleObj.attr('default')) {
            return false;
        }
        if(region == 0 || widget == 0 || category == 1){
            return false;
        }
		
        var regionSelected = $("select#add_region_"+id+" option:selected").text();
        //alert(regionSelected);
        var widgetSelected = $("select#add_widget_"+id+" option:selected").text();
        var categorySelected = $("select#add_category_"+id+" option:selected").text();
		
        $('#'+tableId+' tbody').append('<tr id="widgets_table_row_'+id+'_'+i+'"><td class="titleTd">'+titleObj.val()+'<input type="hidden" name="region_article_title_'+id+'_'+i+'" value="'+titleObj.val()+'"></td><td>'+regionSelected+'<input type="hidden" name="region_article_region_'+id+'_'+i+'" value="'+region+'"></td><td>'+widgetSelected+'<input type="hidden" name="region_article_widget_'+id+'_'+i+'" value="'+widget+'"></td><td>'+categorySelected+'<input type="hidden" name="region_article_category_'+id+'_'+i+'" value="'+category+'"></td><td class="delete"><a href="#" class="deleteWidget clientDelete clientEdit" id="'+id+'_'+i+'"> Delete</a></td></tr>');
        $("#row_count_"+id).val(i);
		
        return false;
    });
	
	
    $(".deleteWidget").live("click",function(){
        var id = $(this).attr("id");
        var rowid = "widgets_table_row_"+id;
        //alert(rowid);
        $("#"+rowid).remove();
        return false;
    });
	
    $(".deleteWidgetFromList").live("click", function(){
        var msg = $("#widgetDeleteMsg").val();
        var status = confirm(msg);
        if(!status) {
            return false;
        }
    });
	
    $(".deleteExistingWidget").live("click", function(){
	
        var status = confirm("Are you sure?");
		
        if(status) {
            var regionIdTitle = $(this).attr("id");
            var regionArr = regionIdTitle.split("_");
            var id = regionArr[1];
			
            $.get(appurl+'/deliverypolicy/removewidget/id/'+id, function(data) {
                var response = data.split('=');
				
                //alert(response[0]);
                $('#RowregionArticle_'+id).remove();
                $('.'+response[0]).hide();
                $('.'+response[0]).html(response[1]);
                $('.'+response[0]).show().delay(7000).fadeOut(500);
            });
						
        } else {
            return false;
        }
	return false;
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
    
    /* Adding new form type */
    
    $('.newFormTypeFormFileds').click(function(){
        var title = $("#newFormTypeFormFileds_Title").val();
        var fieldType =  $("#newFormTypeFormFileds_FiledType").val();
        var defaultValues =  $("#newFromTypeFormFileds_DefaultValues").val();
        var showInList =  $("#newFormTypeFormFileds_ShowInList ").attr("checked");
        var required =  $("#newFormTypeFormFileds_Required ").attr("checked");
		
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

        if(title != '') {
			
            var htmlToAppend = '<tr id="formTypeFields_table_row_fieldId_'+i+'"><td>'+title+'<input type="hidden" name="fieldTttle_'+i+'" value="'+title+'"></td><td>'+filedTypeSelected+'<input type="hidden" name="fieldType_'+i+'" value="'+fieldType+'"></td><td>'+defaultValues+'<input type="hidden" name="fieldDefaultValues_'+i+'" value="'+defaultValues+'"></td><td>'+showInListTitle+'<input type="hidden" name="fieldShowInList_'+i+'" value="'+showInList+'"></td><td>'+requiredTitle+'<input type="hidden" name="fieldRequired_'+i+'" value="'+required+'"></td><td><input type="radio" class="radio" id="titleField" name="fieldTitleField_123" value="'+title+'"/></td><td class="delete"><a href="#" class="deleteFormTypeFiledAddForm clientEdit clientDelete" id="fieldId_'+i+'"> Delete</a></td></tr>';
				
				
            $('#table-newFormTypeFormFileds tbody').append(htmlToAppend);
            $("#newFormTypeFormFileds_RowCount").val(i);
		
        } else {
            alert(emptyFieldTitleMsg);
        }
		
        return false;
    });
    
    $.fn.serializeObject = function()
    {
      var o = {};
      var a = this.serializeArray();
      $.each(a, function() {
        if (o[this.name] !== undefined) {
          if (!o[this.name].push) {
            o[this.name] = [o[this.name]];
          }
          o[this.name].push(this.value || '');
        } else {
          o[this.name] = this.value || '';
        }
      });
      return o;
    };
    
    $(".addHasManyArticle").click(function(){
      var form = $(this).closest("form");
      
      var id = $(this).attr("id");

      var j = $("#table_"+id+" tr").length + 1;
      var titleField = $(".titleField_"+id).val();
      
      if(j%2 == 0)
        var rowClass = "darker";
      else
        var rowClass = "lighter";
      
      if(titleField == "" || titleField == "Title..."){
        alert("Title field can not be empty!");
        return false;
      }

      var buffer = '';
      $.each($('.show_in_list_'+id), function(i,n){
          var type = $(this).attr('type');
          var showInList = false;
          if(type == 'radio' || type == 'checkbox'){
             if($(this).prev().hasClass('jqTransformChecked')){
               showInList = $(this).val(); 
             }
          }else{
             showInList = $(this).val();   
             if(!showInList)
                 showInList = "&nbsp;";
          }
          
          if(showInList)
            buffer += '<td>'+ showInList +'</td>';
      });

      var htmlAppend = '<tr id="hasManyFields_'+ j +'_'+ id +'" class="'+ rowClass +'">\n\
                        <td>'+ titleField +'</td>\n\
                        '+buffer+'\n\
                        <td><a href="javascript:void(0)" id="'+ j +'_'+ id +'" class="deleteHasManyRow clientEdit clientDelete">Delete</a></td></tr>';
      $("#table_"+id+" tbody").append(htmlAppend);
      
      var str =JSON.stringify($('#form_'+ id +' :input').serializeObject());
      var hiddenInput = '<input type="hidden" id="hidden_'+ j +'_'+ id +'" name="hasMany[]" value=\''+str+'\'>';
      
      $("#hasManyAddedFields").append(hiddenInput);
      
    });
    
    $(".deleteHasManyRow").live("click", function(){
      var status = confirm("Are you sure");
      if(!status)
        return false;
      var rowId = "#hasManyFields_" + $(this).attr("id");
      var dataId = "#hidden_" + $(this).attr("id");
      $(rowId).remove();
      $(dataId).remove();
    });
    
    $(".deleteChildArticle").click(function(){
      var href = $(this).attr("href");
      var remove = 0;
      $.ajax({
          url: href,
          async: false,
          type: 'POST',
          success: function(data) {
              if (data.status == 'success') {
                  remove = 1;  
              }
          }
      });
      if (remove) {
          $(this).parent().parent().remove();
      }
      return false;
    });
    
    //Delete article
    $("a.deleteArticle").live("click",function(){
        var status = confirm($(this).attr("delete-confirm-message"));
        if(status)
            return true;
        else
            return false;
    });
    
    $('.btnApply, .btnSaveAdd').live('click', function(){
       $('input[name="applyHidden"]').val('1'); 
    });
    $('.btnSubmit').live('click', function(){
       $('input[name="applyHidden"]').val('0'); 
    });
    
    $('.downloadRelease').live('click', function(){
        var href = $(this).attr('href');
        $.ajax({
            url: href,
            async: false,
            type: 'POST',
            success: function(data){
                if(data.status == "errormsg") {
                    $(".errormsg").html(data.msg).scrollTop(0);
                    $("html, body").animate({ scrollTop: 0 }, "slow");
                    $(".errormsg").show().delay(5000).fadeOut(500);
                }else{
                    document.location.href= href;
                }
            }
        });        
        return false;
    })
})

$(function () {
    
    var contentTypes = '';
    $.ajax({
                url: appurl+'/contenttypes/getcontenttypelist',
                async: false,
                type: 'POST',
                success: function(data){
                   contentTypes = data;
                }
            });
    //change event -- populate action select
    $(".delivery_policy_event").change(function (){
        var lang = $(this).attr('lang');
        var actionOptions = "";
        var selected = $("#delivery_event_"+lang+" option:selected").val(); 
        $.each($("#delivery_event_"+lang+" option"), function (i, eventOption){
            if (eventOption.value != selected) {
                actionOptions += '<option value="' +eventOption.value+ '">' + eventOption.value+ '</option>';
            }
            $("#delivery_action_"+lang).html(actionOptions);
            $("#delivery_action_"+lang).trigger("liszt:updated");
            
        })
    });
    
   $(".delivery_policy_select_params").live('change',function (){
        var selectObject = $(this);
        var selectObjectId = selectObject.attr('id');
        var selectObjectName = selectObject.attr('name');
        var lang = $(this).attr('lang');
        var selected = $(this).val();
        var isContentType = selected.split('::');
        $("#"+selectObjectId+"_article").remove();
        $("#"+selectObjectId+"_article_chzn").remove();
        if (isContentType[0] == 'content_type') {
            $.ajax({
                    url: appurl+'/contenttypes/getarticlelist',
                    async: false,
                    data: {content_type:selected},
                    type: 'POST',
                    success: function(data){
                        selectObject.after("<select id='"+selectObjectId+"_article' name='"+selectObjectName+"_article' class='select151 chzn-select normal-select'>" + data + "</select>");
                        $("#"+selectObjectId+"_article").chosen();
                        $("#"+selectObjectId+"_chzn").addClass('fl').css('margin-right','10px');
                    }
                    }); 
        }
    });
    
    //on change
    $(".delivery_policy_action").change(function (){
        var lang = $(this).attr('lang');
        var actionOptions = "";
        var selected = $("#delivery_action_"+lang+" option:selected").val();
        var apitype  = selected.split("::");
        $("#configure_params_"+lang).html('');
        $.ajax ({
                url : appurl+"/swagger/index?api="+apitype[0],
                type : 'get',
                success: function (data) {
                    if (typeof data.apis !== "undefined") {
                        $.each(data.apis, function(j, contentMethod){
                            if (contentMethod.operations[0].nickname == apitype[1]) {
                                $.each(contentMethod.operations[0].parameters, function(k, contentMethodParams){
                                    var param_id= contentMethodParams.name.replace(/\[/gi, "");
                                    param_id    = param_id.replace(/\]/gi, "")
                                    var select = "";
                                    select += "<div style='height:50px; margin-bottom:5px;'>";
                                    select += "<label class='fl' style='width:150px; padding-top:10px;'>"+contentMethodParams.name+"</label>"
                                    select += "<select class='select151 chzn-select normal-select delivery_policy_select_params' name='"+contentMethodParams.name+"' id='"+param_id+"'>"
                                    if (typeof contentMethodParams.allowableValues !== "undefined") {
                                        $.each(contentMethodParams.allowableValues.values, function(num, selectValue){
                                            select += "<option value='"+selectValue+"'>"+selectValue+"</option>";
                                        });
                                    } else {
                                        select += "<optgroup label='System' value='system'>\n\
                                                    <option value='default'>Default</option>\n\
                                                    <option value='order'>Order</option>\n\
                                                       <option value='user'>User</option>\n\
                                                   </optgroup>\n\
                                                   " + contentTypes + "\n\
                                                       <optgroup label='Config' value='congif'>\n\
                                                       <option value='license'>License</option>\n\
                                                       <option value='api_user'>Api user</option>\n\
                                                       <option value='api_pass'>Api pass</option>\n\
                                                       <option value='application_name'>Applicatiom name</option>\n\
                                                       <option value='ip_address'>IP address</option>\n\
                                                    </optgroup>";
                                    }
                                    select +="</select></div> <div style='clear:both'></div>";
                                    
                                    $("#configure_params_"+lang).append(select);
                                    $("#"+param_id).chosen();
                                });
                           }
                        });

                    }                    
                }
               });
            
        });
        
        //sort delivery policy
        $(".sortableTable tbody").sortable({
            items: 'tr',
            asixs: 'y', 
            handle: ".reorder",
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
                    url: appurl + "/deliverypolicy/reorderdeliverypolicy",
                    data: {items: serialized, contentTypeId: contID},
                    async: false,
                    type: 'POST',
                    success: function(data){
                    }
                });       
             }
        });
    
        $(".editDeliveryPolicy").live('click',function(){
            
            
            var eventEdit = $(this).parent().prev().prev().html();
            var actionEdit = $(this).parent().prev().html();
            var selectedDeliveryResource = $(this).attr('deliveryId');
            $('#deliveryPolicyId').val(selectedDeliveryResource);
            $.ajax({
                url: appurl + "/deliverypolicy/getdeliverypolicyparams",
                data: {delivery_id: selectedDeliveryResource},
                async: false,
                type: 'POST',
                success: function(data){
                    $("#edit_configure_params").html(data);
                    
                    $.each($("#edit_configure_params select"), function(i, select){
                        $("#"+select.id).chosen();
                    })
                }
            });   
            
            $("#modalDeliveryPolicy").modal('show');
            $("#editDeliveryAction").html("");
            $("#editDeliveryAction").trigger("liszt:updated");
            
            //select event
            $('#editDeliveryEvent option[value="'+eventEdit+'"]').attr('selected', 'selected');
            $('#editDeliveryEvent').trigger("liszt:updated");
            $("#editDeliveryEvent_chzn").css('display','');
            
            var actionOptions = "";
            $.each($("#editDeliveryEvent option"), function (i, eventOption){
                if (eventOption.value != eventEdit) {
                    actionOptions += '<option value="' +eventOption.value+ '">' + eventOption.value+ '</option>';
                }
                $("#editDeliveryAction").html(actionOptions);
                $('#editDeliveryAction option[value="'+actionEdit+'"]').attr('selected', 'selected');
                $("#editDeliveryAction").trigger("liszt:updated");
            });
             return false;
        });
        
        
        //Edit delivery policy
        $("#editDeliveryEvent").change(function (){
            var actionOptions = "";
            var selected = $("#editDeliveryEvent option:selected").val(); 
            $.each($("#editDeliveryEvent option"), function (i, eventOption){
                if (eventOption.value != selected) {
                    actionOptions += '<option value="' +eventOption.value+ '">' + eventOption.value+ '</option>';
                }
                $("#editDeliveryAction").html(actionOptions);
                $("#editDeliveryAction").trigger("liszt:updated");

            })
        });
           
        
        $("#editDeliveryAction").change(function (){
        var actionOptions = "";
        var selected = $("#editDeliveryAction option:selected").val();
        var apitype  = selected.split("::");
        $("#edit_configure_params").html('');
        $.ajax ({
                url : appurl+"/swagger/index?api="+apitype[0],
                type : 'get',
                success: function (data) {
                    if (typeof data.apis !== "undefined") {
                        $.each(data.apis, function(j, contentMethod){
                            if (contentMethod.operations[0].nickname == apitype[1]) {
                                $.each(contentMethod.operations[0].parameters, function(k, contentMethodParams){
                                    var param_id= contentMethodParams.name.replace(/\[/gi, "");
                                    param_id    = param_id.replace(/\]/gi, "")
                                    var select = "";
                                    select += "<div style='height:50px; margin-bottom:5px;'>";
                                    select += "<label class='fl' style='width:150px; padding-top:10px;'>"+contentMethodParams.name+"</label>"
                                    select += "<select class='select151 chzn-select normal-select delivery_policy_select_params_edit' name='"+contentMethodParams.name+"_edit' id='"+param_id+"_edit'>"
                                    if (typeof contentMethodParams.allowableValues !== "undefined") {
                                        $.each(contentMethodParams.allowableValues.values, function(num, selectValue){
                                            select += "<option value='"+selectValue+"'>"+selectValue+"</option>";
                                        });
                                    } else {
                                        select += "<optgroup label='System' value='system'>\n\\n\
                                                        <option value='default'>Default</option>\n\
                                                       <option value='order'>Order</option>\n\
                                                       <option value='user'>User</option>\n\
                                                   </optgroup>\n\
                                                   " + contentTypes + "\n\
                                                       <optgroup label='Config' value='congif'>\n\
                                                       <option value='license'>License</option>\n\
                                                       <option value='api_user'>Api user</option>\n\
                                                       <option value='api_pass'>Api pass</option>\n\
                                                       <option value='application_name'>Applicatiom name</option>\n\
                                                   </optgroup>";
                                    }
                                    select +="</select></div> <div style='clear:both'></div>";
                                    
                                    $("#edit_configure_params").append(select);
                                    $("#"+param_id+"_edit").chosen();
                                });
                           }
                        });

                    }                    
                }
               });
            
        });
        
        $(".delivery_policy_select_params_edit").live('change',function (){
        var selectObject = $(this);
        var selectObjectId = selectObject.attr('id');
        selectObjectId = selectObjectId.split('_edit');
        selectObjectId = selectObjectId[0];
        var selectObjectName = selectObject.attr('name');
        var lang = $(this).attr('lang');
        var selected = $(this).val();
        var isContentType = selected.split('::');
        $("#"+selectObjectId+"_article_edit").remove();
        $("#"+selectObjectId+"_article_edit_chzn").remove();
        if (isContentType[0] == 'content_type') {
            $.ajax({
                    url: appurl+'/contenttypes/getarticlelist',
                    async: false,
                    data: {content_type:selected},
                    type: 'POST',
                    success: function(data){
                        selectObject.after("<select id='"+selectObjectId+"_article_edit' name='"+selectObjectId+"_article_edit' class='select151 chzn-select normal-select'>" + data + "</select>");
                        $("#"+selectObjectId+"_article_edit").chosen();
                        $("#"+selectObjectId+"_edit_chzn").addClass('fl').css('margin-right','10px');
                    }
                    }); 
        }
    });
    
    $(".saveEditetDeliveryPolicy").live('click', function(){
        
        var params = JSON.stringify($('#editDeliveryPolicyForm :input').serializeObject());
        var deliveryId = $("#deliveryPolicyId").val();
                
         $.post(appurl+"/deliverypolicy/fullupdatedeliverypolicy/", { data : params }, function(data) {
            if (data.status == "success") {
                $(".editDeliveryPolicyID_"+deliveryId).parent().prev().html($('#editDeliveryAction option:selected').val());
                $(".editDeliveryPolicyID_"+deliveryId).parent().prev().prev().html($('#editDeliveryEvent option:selected').val());
            } else {
                alert('not ok');
            }
        });
        $("#modalDeliveryPolicy").modal('hide');
        return false;
    });
        
});

