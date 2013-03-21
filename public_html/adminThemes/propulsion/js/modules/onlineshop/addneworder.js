
$(function(){
           
    $("#addintocart").click(function ()
    {
       
       $("#formHolder").html('');
       
       var value = $("select#productSelect option:selected").val();
       var userID = $("#userID").val();
        
       $("#emptyCartInfo").hide();
       
       $.ajax({
                url: appurl+'/onlineshop/addintocart'+'?product='+value+"&userID="+userID,
                async: false,
                type: 'POST',
                success: function(data){
                   $("#formHolder").html(data);
                }
            });   


    });
    
    
 });
 
 


