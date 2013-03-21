$(function () {
    
    
    if($("#fieldsCount").val()==8){
        $("#editSubmit").hide();
        $("#table-newContentTypeFormFileds").hide();
    }
    $("#delete").click(function(){
          
            var num = $("#fieldsCount").val();
            num--;
            
            if(num<=8){
                
                $("#editSubmit").hide();
                $("#table-newContentTypeFormFileds").hide();                
            }
            
            $("#fieldsCount").val(num);
      });
    
    
    
});
