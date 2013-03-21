$(function () {
  
  $('.productList').live("change",function(){
    var optionData = $(this).find('option[value="'+$(this).val()+'"]').data();
    
    if($('.orderContainer').find("#"+$(this).val()+"-"+optionData.contentTypeId).size() == 0 && $(this).val()!='0') {
    
      var html = "<div class='itemRow' id='"+$(this).val()+"-"+optionData.contentTypeId+"'>" +
                  "<input type='text' name='item_title[]' value='"+optionData.title+"' /> " + 
                  "<input type='text' name='item_quantity[]' value='1' /> " + 
                  "<input type='text' name='item_title[]' value='"+optionData.price+"' /> " + 
                  "<input type='hidden' name='item_cid[]' value='"+optionData.contentTypeId+"' /> " + 
                  "<input type='hidden' name='item_id[]' value='"+$(this).val()+"' /> " + 
                  " - <a href='#' class='removeRowItem'>Remove</>" +
                  "</div>";

      $('.orderContainer').append(html);
    }
  });
  
  $('.removeRowItem').live("click",function(){
    $(this).parent().remove();
  });
})