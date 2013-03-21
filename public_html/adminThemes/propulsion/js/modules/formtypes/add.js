$(function() {
    $('.newFormTypeFormFileds').click(function(){
        $('#contentTypeNoFields').hide();
        $('#formTypeFormFiledsTable').show();
        
        var title = $("#newFormTypeFormFileds_Title").val();
        var fieldType =  $("#newFormTypeFormFileds_FiledType_new").val();
        var defaultValues =  $("#newFormTypeFormFileds_DefaultValues").val();
        var showInList =  $("#newFormTypeFormFileds_ShowInList ").attr("checked");
        var required =  $("#newFormTypeFormFileds_Required ").attr("checked");
        var labelField = $('#labelField').val();
        var otherLabel = $("#otherLabel").val();
        var minVal = $('#minField').val(); 
        var maxVal = $('#maxField').val();
        
        if($('#labelField').attr('default') == labelField){
            labelField = "";
        }
        if($('#minField').attr('default') == minVal){
            minVal = "";
        }
        if($('#maxField').attr('default') == maxVal){
            maxVal = "";
        }        
        if($("#otherLabel").attr('default') == otherLabel){
            otherLabel = "";
        }
        
        if($('#newFormTypeFormFileds_DefaultValues').attr('default') == defaultValues){
            defaultValues = "";
        }
        if($('#newFormTypeFormFileds_Title').attr('default') == title){
            return false;
        }

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

        var filedTypeSelected = $("select#newFormTypeFormFileds_FiledType_new option:selected").text();
        
        if(title != '') {
        
                         var htmlToAppend = '<tr id="formTypeFields_table_row_fieldId_'+i+'"><td>'+title+'<input type="hidden" name="fieldTttle_'+i+'" value="'+title+'"></td><td>'+filedTypeSelected+'<input type="hidden" name="fieldType_'+i+'" value="'+fieldType+'"></td><td>'+defaultValues+'<input type="hidden" name="fieldDefaultValues_'+i+'" value="'+defaultValues+'"></td><td>'+labelField+'<input type="hidden" name="fieldLabelField_'+i+'" value="'+labelField+'"></td><td>'+otherLabel+'<input type="hidden" name="fieldOtherLabel_'+i+'" value="'+otherLabel+'"></td><td>'+minVal+'<input type="hidden" name="fieldMin_'+i+'" value="'+minVal+'"></td><td>'+maxVal+'<input type="hidden" name="fieldMax_'+i+'" value="'+maxVal+'"></td><td>'+showInListTitle+'<input type="hidden" name="fieldShowInList_'+i+'" value="'+showInList+'"></td><td>'+requiredTitle+'<input type="hidden" name="fieldRequired_'+i+'" value="'+required+'"></td><td><input type="radio" class="radioTransform" id="titleField" name="fieldTitleField_123" value="'+title+'"/></td><td class="delete"><a href="#" class="deleteFormTypeFiledAddForm clientEdit clientDelete" id="fieldId_'+i+'"> Delete</a></td></tr>';


            $('#table-newFormTypeFormFileds tbody').append(htmlToAppend);
            $("#newFormTypeFormFileds_RowCount").val(i);
            $("input.radioTransform").jqTransRadio();

        } else {
            alert(emptyFieldTitleMsg);
        }
        
        $('#newFormTypeFormFileds_DefaultValues').val($('#newFormTypeFormFileds_DefaultValues').attr('default'));
        $("#labelField").val($("#labelField").attr('default'));
        $("#otherLabel").val($("#otherLabel").attr('default'));
        $('#minField').val($('#minField').attr('default'));
        $('#maxField').val($('#maxField').attr('default'));
        

        return false;
    });


    $('a.deleteColumn').live('click',function(){
      var data = $(this).data();
      var status = confirm(data.deleteMsg);
      if(!status) {
        return false;
      }
    });
    
     
    // callback: The function to call
    // wait: The number of milliseconds to wait after the the last key press before firing the callback
    // highlight: Highlights the element when it receives focus
    // captureLength: Minimum # of characters necessary to fire the callback
    var options = {
        callback:function(){
            var query = $('#redirectUrl').val()
            $.ajax({
                type: 'POST',
                data: 'query='+query,
                url: appurl+'/formtypes/listcontent',
                async: false,
                success: function(data){
                    $('#typeTitleOfThePage').hide();
                    $('.selectFromContentH3First').remove();
                    $('.selectFromContentH3').remove();
                    $('.selectFromContentUl').remove();
                    $("#redirectUrl").closest("p.form-row").append(data);
                    if(data == "")
                        $("#redirectUrl").closest("p.form-row").append("<h3 class ='selectFromContentH3'>"+$('#articleNotFound').val()+"</h3>");
                }
            });        
            
        }, 
        wait:250,
        highlight:true,
        captureLength:0
    }

    $("#redirectUrl").typeWatch( options );

    
    $(".selectFromContent").live("click", function(){
        var articleTitle = $(this).text();
        $("#redirectUrl").val(articleTitle);
        
        var resourceID = $(this).attr("aid");
        $("#redirectArticle").val(resourceID);
        var contentTypeID = $(this).attr("cid");
        $("#redirectContentType").val(contentTypeID);
         
        $('#typeTitleOfThePage').remove();
        $('.selectFromContentH3First').remove();
        $('.selectFromContentH3').remove();
        $('.selectFromContentUl').remove();
        return false;

    });
    
    $("#redirectUrl").live("blur", function(){
        var rdrUrlText = $(this).val();
        if (rdrUrlText==""){
            $('#typeTitleOfThePage').show();
            $('.selectFromContentH3First').remove();
            $('.selectFromContentH3').remove();
            $('.selectFromContentUl').remove();
        }
    });
    
    $('.formReset').live('click', function(){
        $('input[name="filterReset"]').val('1');
    });
    
    $('#newFilterFiled_Add').live('click', function(){
       var id = $('.selFilter option:selected').val();
       
       $('.selFilter option:selected').attr('disabled', 'disabled').trigger("liszt:updated");       
       $('tr[rel="'+id+'"]').show();
       
       return false;
    });
    
    $('.deleteFilter').live('click', function(){
       var id = $(this).attr('rel'); 
       var option = $(this).attr('option'); 
       $('tr[rel="'+id+'"]').hide();
       
       if(option == 'select'){
           $('select[rel="'+id+'"]').val('-1').trigger("liszt:updated");
       }
       if(option == 'input'){
           $('input[rel="'+id+'"]').val("");
       }
       $('.selFilter option[value="'+id+'"]').removeAttr("disabled").trigger("liszt:updated");

       return false;
    });
    
    $('.configureFilters a').live('click', function(){
        $('.optionsChozen').slideToggle('slow');
        return false;
    });
    
    $('.selectFormTypeForm').live('change', function(){
      var id = $(this).attr('rel');
      var value = $('option:selected',this).val(); 
      
      if(value == 'radio_other' || value == 'checkbox_other'){
         $('.otherLabel_'+id).val($('input.otherLabel_'+id).attr('default')).show();
      }else{
         $('.otherLabel_'+id).val($('input.otherLabel_'+id).attr('default')).hide();
      }
      
      if(value == 'checkbox_other'){
          $('.min_'+id).val($('input.min_'+id).attr('default')).show();
          $('.max_'+id).val($('input.max_'+id).attr('default')).show();
      }else{
          $('.min_'+id).val($('input.min_'+id).attr('default')).hide();
          $('.max_'+id).val($('input.max_'+id).attr('default')).hide();
      }
      
    });
 })
