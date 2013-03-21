$(function () {
    
    //hide ddl's	
    $(".hide").hide();
    $(".hide").hide();

    //if selected select from makes ddl for content types
    $(".newContentTypeFormFileds_FiledType").change(function (){
        cont_id = $(this).attr('rel');  
    if($(this).val() == "selectFrom"){
        $("#newContentTypeFormFileds_DefaultValues_"+cont_id).hide();
        $(".selectHasMany_"+cont_id).hide();

        $(".searchable_"+cont_id).parent().show();

        $.ajax({
            url: appurl+'/contenttypes/getcontenttypelist',
            async: false,
            type: 'POST',
            success: function(data){
                $("#selectFromTypes_"+cont_id).html(data);
            }
        });

        $.ajax({
            url: appurl+'/formtypes/getformtypelist',
            async: false,
            type: 'POST',
            success: function(data){
                $("#selectFromTypes_"+cont_id).append(data);
            }
        });    

        $("#selectFromTypes_"+cont_id).append("<optgroup value='system' label='System tables'><option value='user::0'>Users</option><option value='language::0'>Languages</option><option value='countries::0'>Countries</option>");
        var params = $("#selectFromTypes_"+cont_id+" option:selected").val();
        var params = params.split("::");
                       
        $("#articles").show();
        $.get(appurl+'/contenttypes/getarticlelist/table/'+params[0], function(data) {
            $("#articles").html(data);
        });      
        $("#selectHasMany_"+cont_id+"_chzn").hide();
        $("#selectFromTypes_"+cont_id).trigger("liszt:updated");
        $("#selectFromTypes_"+cont_id).change();
       
    } else if($(this).val() == "hasMany") {
        $("#newContentTypeFormFileds_DefaultValues_"+cont_id).hide();
        $(".selectFromTypes_"+cont_id).hide();
        
        $(".searchable_"+cont_id).parent().hide();

        $.ajax({
            url: appurl+'/contenttypes/getcontenttypelist',
            async: false,
            type: 'POST',
            success: function(data){
                $("#selectHasMany_"+cont_id).html(data);
            }
        });
        $("#selectFromTypes_"+cont_id+"_chzn").hide();
        $('#selectFromTypesDefault_'+cont_id+'_chzn').hide();
        
        $("#selectHasMany_"+cont_id).trigger("liszt:updated");
    } else {
        $("#selectFromTypesDefault_"+cont_id+"_chzn").hide();
        $("#selectFromTypes_"+cont_id+"_chzn").hide();
        $("#selectHasMany_"+cont_id+"_chzn").hide();

        $(".searchable_"+cont_id).parent().show();
        $("#newContentTypeFormFileds_DefaultValues_"+cont_id).val("").show();        
        $("span.selectFromTypes").removeAttr("style");        
        $("span.selectHasMany").removeAttr("style");
        $("#articles").hide();       
        
    }      
    });

$(".selectFromTypes").change(function(){
    cont_id = $(this).attr('rel');  
    var selected = $(this).select();
    console.log(selected);
    var selectedType = selected.val().split('::');
    if(selectedType[0] == 'content_type'){
        //$(".selectFromTypesDefault_"+cont_id).show();
        $.ajax({
                    url: appurl+'/contenttypes/getcontentypedata',
                    async: false,
                    data: {data:selected.val()},
                    type: 'POST',
                    success: function(data){

                            $("#selectFromTypesDefault_"+cont_id).html(data);
                            $("#selectFromTypesDefault_"+cont_id).trigger("liszt:updated");
                            if(cont_id != 'new'){
                              $('#newContentTypeFormFileds_DefaultValues_'+cont_id).val($("#selectFromTypesDefault_"+cont_id+" option:selected").val()); 
                            }
                    }
                }); 
         }
         else{
             if(cont_id != 'new'){
                  $('#newContentTypeFormFileds_DefaultValues_'+cont_id).val(selected.val()); 
             }
              $("#selectFromTypesDefault_"+cont_id+"_chzn").hide();
         }
    });
    
  
    $(".newContentTypeFormFileds").click(function(){
        
      $("#table-newContentTypeFormFileds").css("display", "");
      $("#editSubmit").css("display", ""); 
      
		
      $('#contentTypeNoFields').hide();
      $('#contentTypeFieldsTable').show();
    
      var title = $("#newContentTypeFormFileds_Title").val();
      var fieldType =  $("#newContentTypeFormFileds_FiledType_new").val();
      if(fieldType == "selectFrom"){
          var selectType = $("#selectFromTypes_new option:selected").val().split("::");
        if( selectType[0]== "content_type"){		    
            var defaultValues  = $("#selectFromTypesDefault_new option:selected").val();
            var defaultValuesW = $("#selectFromTypesDefault_new option:selected").text();
        }
       else{
            var defaultValues  = $("#selectFromTypes_new option:selected").val();
            var defaultValuesW = $("#selectFromTypes_new option:selected").text();
       }
      } 
      else if(fieldType == "hasMany"){

        var defaultValuesString  = $("#selectHasMany_new option:selected").val();
        var defaultValues = defaultValuesString.split("::");
        defaultValues = defaultValues[1];
          var defaultValuesW = $("#selectHasMany_new option:selected").text();
      } else {
        var defaultValues  =  $("#newContentTypeFormFileds_DefaultValues_new").val();
        var defaultValuesW =  $("#newContentTypeFormFileds_DefaultValues_new").val();
        
         if($("#newContentTypeFormFileds_DefaultValues_new").attr('default') == defaultValues)
                {
                    defaultValues ="";
                    defaultValuesW ="";
                }
      }
      
      var showInList =  $("#newContentTypeFormFileds_ShowInList ").attr("checked");
      var searchable =  $("#newContentTypeFormFileds_Searchable ").attr("checked");
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

      if(searchable) {
        var searchable = 1;
        var searchableTitle = "Yes";
      } else {
        var searchable = 0;
        var searchableTitle = "No";
      }

      var j = $("table#table-newContentTypeFormFileds tr").length;
      var i = j+1;

      var filedTypeSelected = $("select#newContentTypeFormFileds_FiledType_new option:selected").text();
      if(title != '') {
        var patt=/^[a-zA-Z0-9 \\?]{1,64}$/g;
        var result=patt.test(title);
        if(result){	
          if($("#table-newContentTypeFormFileds tbody tr td.titleTd:icontains('"+title+"')").text() == ""){
            var htmlToAppend = '<tr id="contentTypeFields_table_row_fieldId_'+i+'"><td class="dynamicTitleTxt  titleTd">'+title+'<input type="hidden" name="fieldTttle_'+i+'" value="'+title+'"></td><td class="dynamicTitleTxt">'+filedTypeSelected+'<input type="hidden" name="fieldType_'+i+'" value="'+fieldType+'"></td><td class="dynamicTitleTxt">'+defaultValuesW+'<input type="hidden" name="fieldDefaultValues_'+i+'" value="'+defaultValues+'"></td><td>'+showInListTitle+'<input type="hidden" name="fieldShowInList_'+i+'" value="'+showInList+'"></td><td>'+searchableTitle+'<input type="hidden" name="fieldSearchable_'+i+'" value="'+searchable+'"></td>';
            if(fieldType != "hasMany")
              htmlToAppend += '<td><input type="radio" class="radioTransform" id="titleField" name="titleField" value="'+title+'"/></td>';
            else
              htmlToAppend += '<td></td>';
            htmlToAppend += '<td class="delete"><a href="#" class="deleteContentTypeFiledAddForm clientEdit clientDelete" id="fieldId_'+i+'"> Delete</a></td></tr>';
            $('#table-newContentTypeFormFileds tbody').append(htmlToAppend);
            $("#newContentTypeFormFileds_RowCount").val(i);
          }else{
            alert(errorTitleAllreadyExist);
          }
        } else {
          alert(errorRegexpFail);
        }
      }else {
        alert(emptyFieldTitleMsg);
      }

      $("input.radioTransform").jqTransRadio();
      return false;
    });

   $(".selectFromDefaultEdit").change(function(){
       var idContentType = this.id.split("_");
       $('#newContentTypeFormFileds_DefaultValues_'+idContentType[1]).val($(this).val()); 
   });
    
    /*
	   Content type form - edit ctt
    */

    $(".newContentTypeFormFiledsEdit").click(function(){
		
        var title = $("#newContentTypeFormFileds_Title").val();
        var fieldType =  $("#newContentTypeFormFileds_FiledType_new").val();
        if(fieldType == "selectFrom"){
            if(typeof($("#articles option:selected").val()) == 'undefined'){		    
                var selectError = $("#selectFromError").val();
                alert(selectError);
                return false;
            }
            var defaultValues  = $("#articles option:selected").val() + "::" + $("#selectFromTypes option:selected").val();
            var defaultValuesW = $("#selectFromTypes option:selected").text() + "," + $("#articles option:selected").text();
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
                        var filedTypeSelected = $("select#newContentTypeFormFileds_FiledType_new option:selected").text();
                        var htmlToAppend = '<tr id="contentTypeFields_table_row_fieldId_'+i+'"><td class="dynamicTitleTxt  titleTd">'+title+'<input type="hidden" name="fieldTttle_'+i+'" value="'+title+'"></td><td class="dynamicTitleTxt">'+filedTypeSelected+'<input type="hidden" name="fieldType_'+i+'" value="'+fieldType+'"></td><td class="dynamicTitleTxt">'+defaultValuesW+'<input type="hidden" name="fieldDefaultValues_'+i+'" value="'+defaultValues+'"></td><td>'+showInListTitle+'<input type="hidden" name="fieldShowInList_'+i+'" value="'+showInList+'"></td><td>'+searchableTitle+'<input type="hidden" name="fieldSearchable_'+i+'" value="'+searchable+'"></td><td><input type="radio" value="'+title+'" id="titleField" name="titleField" class="radio" /></td><td class="delete"><a href="#" class="deleteContentTypeFiledEditForm" id="fieldId_'+i+'" data-delete-msg="Are you sure you want delete this column?"> Delete</a></td></tr>'
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
    
    //Title field not selected
    $('.contentTypeFormSubmit').click(function(){
      
      var ctTitle = $('#conentTypeTitle');
      var defTitle = ctTitle.attr('default');
      var ctTitleVal = ctTitle.val();
      
      if(ctTitleVal == "" || defTitle == ctTitleVal) {
        var msg = $('#errorContentTypeTitle').val();
        alert(msg);
        return false;
      }
      
      var size = $('a.jqTransformChecked[rel="titleField"]').size();
      if(size == 0) {
        var msg = $('#errorTitleFieldMsg').val();
        alert(msg);
        return false;
      }
    });
    
})