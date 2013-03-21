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

        var htmlAppend = '<tr id="hasManyFields_'+ j +'_'+ id +'" class="'+ rowClass +'"><td>'+ titleField +'</td><td><a href="javascript:void(0)" id="'+ j +'_'+ id +'" class="deleteHasManyRow clientEdit clientDelete">Delete</a></td></tr>';
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
        $.ajax({
            url: href,
            async: false,
            type: 'POST',
            success: function(data){
            //              $("#contentTypes").html(data);
            }
        });
      
        $(this).closest().closest().remove();
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
    
    
    $(".selectProduct").live("change",function(){
        var lang = $(this).attr("lang");
        var product = $(this).val();
        $.post(appurl + "/contenttypes/getcontentypedata/",{
            'data':'content_type::'+product,
            'lang':lang,
            'package':1
        },function(data){
            $("#add_article_products_"+lang).html(data);
            $("#add_article_products_"+lang).trigger("liszt:updated");
        });
    });
    
    $(".addProductToPackage").click(function(){
        var errorTitleAllreadyExist = $('#errorTitleAllreadyExist').val();
        var id = $(this).attr("id");
        var tableId = "table-"+id;
        var tableObj = "#"+tableId;
        var titleid = "add_title_region_"+id;
        var isFreeText = '';
        var isFreeValue = 0;
        var isFree = $("#add_free_"+id).attr("checked");
        if(isFree) {
            isFreeText = "Yes";
            isFreeValue = 1;
        } else {
            isFreeText = "No";
        }
        var products = $("#add_"+id).val();
        var article = $("#add_article_"+id).val();
        var j = $("#row_count_"+id).val();
        var i = j+1;

        //alert(regionSelected);
        var productsSelected = $("select#add_"+id+" option:selected").text();
        var articleSelected = $("select#add_article_"+id+" option:selected").text();
        var article_resource_id = $("select#add_article_"+id+" option:selected").attr('resource_id');
        $('#'+tableId+' tbody').append('<tr id="articles_table_row_'+id+'_'+i+'">\n\
                                        <td>'+productsSelected+'<input type="hidden" name="region_product_'+id+'_'+i+'" value="'+products+'"/></td>\n\
                                        <td>'+articleSelected+'<input type="hidden" name="region_article_product_'+id+'_'+i+'" value="'+article+'"><input type="hidden" name="region_article_recource_product_'+id+'_'+i+'" value="'+article_resource_id+'"/></td>\n\\n\
                                        <td>'+isFreeText+'<input type="hidden" name="region_free_product_'+id+'_'+i+'" value="'+isFreeValue+'"></td>\n\
                                        <td class="delete"><a href="#" class="deleteProductArticle clientEdit" id="'+id+'_'+i+'"> Delete</a></td>\n\
                                        </tr>');
        $("#row_count_"+id).val(i);
        return false;
    }); 
    
    $(".deleteProductArticle").live("click",function(){
        var status = confirm("Are you sure?");
        if(status) {
            var id = $(this).attr("id");
            var rowid = "articles_table_row_"+id;
            //alert(rowid);
            $("#"+rowid).remove();
        } else { 
            return false;
        }
        return false;
    }); 
    
    $(".deleteExistingArticle").live("click", function(){
        var status = confirm("Are you sure?");
        if(status) {
            var regionIdTitle = $(this).attr("id");
            var regionArr = regionIdTitle.split("_");
            var id = regionArr[1];
            $.get(appurl+'/manage/removeProductFromPackage/id/'+id, function(data) {
                var response = data.split('=');
                //alert(response[0]);
                $('#RowPackage_'+id).remove();
                $('.'+response[0]).hide();
                $('.'+response[0]).html(response[1]);
                $('.'+response[0]).show().delay(7000).fadeOut(500);
            });
        } else {
            return false;
        }
        return false;
    });
    
    $(".isFreeProduct").live('click',function(){
        var isFreeValue = 0;
        var productId = $(this).attr('id');
        var isFree = $(this).attr("checked");
        if(isFree) {
            isFreeValue = 1;
        }
        $("#packageProductFree_"+productId).val(isFreeValue);
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
                    url: appurl + "/manage/reorderpackageproducts",
                    data: {items: serialized, contentTypeId: contID},
                    async: false,
                    type: 'POST',
                    success: function(data){
                    }
                });       
             }
        });
    

})

