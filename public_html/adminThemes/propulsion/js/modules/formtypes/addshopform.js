$(function() {
  
  $(".addArticleToShopList").live('click',function(){
       var selectedvalue = $('#selectShopPackage option:selected').val();
       $.ajax({
                type: 'POST',
                data: 'selected='+ selectedvalue,
                url: appurl+'/formtypes/listproductattributes',
                async: false,
                success: function(data){
                    $("#ulshopFieldFilst").append(data);
                }
            });
  });
  
  $(".removeLinkEdit").live('click', function(){
        var msg = $(this).attr('delete-confirm-message');
        var idForDelete;
        var formID = $("#formID").val();
        var data = {};
        var isPackage = $(this).attr('ispackage');
        
        if (isPackage) {
            var idForDelete = $(this).attr('packageId');
            data = {formId : formID, packageId : idForDelete}
        } else {
            var prodCT = $(this).attr('product_content_type_id');
            var idForDelete = $(this).attr('productId');
            data = {formId : formID, productId : idForDelete, product_content_type : prodCT}
        }
        var confirmDlg = confirm(msg);
        if (confirmDlg) {
            var deleted = 0;
            $.ajax({
                type: 'POST',
                data: data,
                url: appurl+'/formtypes/deleteshopproduct',
                async: false,
                success: function(data){
                    if (data.status == 'success') {
                        deleted = 1;
                    }
                }
            });
            if (deleted == 1) {
                $(this).parent().parent().remove();
            }
            return false;
        } else {
            return false;
        } 
      
  });
  
  $(".removeLink").live('click', function(){
        var msg = $(this).attr('delete-confirm-message');
       
        var confirmDlg = confirm(msg);
        if (confirmDlg) {
            $(this).parent().parent().remove();
            return false;
        } else {
            return false;
        } 
      
  });
  
    //sort delivery policy
  $("ol.sortableShopForm").sortable({
      disableNesting: 'no-nest',
      forcePlaceholderSize: true,
      handle: 'span.cross',
      helper: 'clone',
      items: '> li',
      maxLevels: 1,
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
          var serialized = $(this).sortable('toArray');
          console.log(serialized);
                var formID = $('#formID').val();
                $.ajax({
                    type: 'POST',
                    url: appurl + "/formtypes/reorder",
                    data: {items: serialized,formID: formID},
                    async: false,
                    success: function(data){
                    }
                }); 
            
        }
  });  
  

 })
