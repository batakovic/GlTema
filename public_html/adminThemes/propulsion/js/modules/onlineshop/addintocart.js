
    var currentLayer = 1;

    $(document).ready(function() {    
       for(var i=2; i<=($('#formsCounter').val()+1); i++){

           $("#"+i).hide();    
       }

    });




    function showLayer(lyr) {
        
        
        var counter =0;
        
        var total="";
      /*  $("#"+currentLayer+" input").each(function(){
            var nam = $(this).attr("name");            
            var val = $(this).val();
            
            var name = "att["+counter+"][name]="+nam;
            var value = "&att["+counter+"][value]="+val;
            
            if(counter != 0){
                
                name = "&"+name;                
            }
            total+=name+value;
            
            counter ++;
        });
        
        console.log(total);
        
         $.ajax({
                url: appurl+'/onlineshop/saveattributestosession?'+total,
                async: false,
                type: 'POST',
                success: function(data){
                   
                }
            });*/
        
        var totalURL="";
        
        var counter = 0;
        var ser = $("#"+currentLayer+" :input").serialize();
        console.log(ser);
        
//        $('input[type=checkbox]').each(function () {
//            
//            var thisValue ="";
//            var thisName = "";
//            
//            if(this.checked){
//                
//                 var thisValue = $(this).val();
//                 var thisName = $(this).attr("name");
//                 
//                 console.log("value: "+thisValue);
//                 console.log("name: "+thisName);
//                 
//                 if(counter != 0){
//                     
//                     totalURL+="&";
//                 }
//                 
//                 totalURL+=counter+"[name]="+thisName+"&"+counter+"[value]="+thisValue;
//                 
//                 counter++;
//            }
//           
//            
//        });
//        
//         
         $.ajax({
                url: appurl+'/onlineshop/saveattributestosession?'+ser,
                async: false,
                type: 'POST',
                success: function(data){
                   
                }
            });

        $("#"+currentLayer).hide(); 
        $("#"+lyr).show();       

        currentLayer = lyr;
    }
    
    $("#hideAttributes").click(function ()
    {
        $("#addProductMainDiv").hide(); 
    
    });
    
    $("#showAttributes").click(function ()
    {
        $("#addProductMainDiv").show(); 
    
    });


function updaterow(element) {
    
     var id = element.id;
     
     var forSplit = id.substring(2);
     
     array = forSplit.split("-");
     
     
     var row = array[0];
    
     
     
     var quantity = $("#"+'qu'+forSplit).val(); 
     var discount = $("#"+'di'+forSplit).val(); 
     
     var price = $("#"+'pr'+forSplit).val(); 
     
     console.log("price before "+price);
     price = price.substring(0, price.length-1);
     console.log("price after "+price);
     
     if(isNaN(quantity) || isNaN(discount)){         
         window.alert("Value must be a number!");
         return;
     }
     
     if(quantity<1){
         window.alert("Quantity must be more than 0!");
         return;
     }
     if((price - discount) <0){
         window.alert("You cannot enter discount bigger than price!");
         return;
     }
     
     var cid = array[1];
     var pid = array[2];
     
      $.ajax({
                url: appurl+'/onlineshop/updatecart'+'?cid='+cid+'&pid='+pid+'&quantity='+quantity+'&discount='+discount,
                async: false,
                type: 'POST',
                success: function(data){
                   console.log(data); 
                   if (data.status == 'success') {
                    $("#"+'pr'+forSplit).val(data.data);
                   } else {
                       alert(data.message)
                   }
                   
                }
            });
     

}


