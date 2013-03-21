

$(function () {
    
    
    if(screen.height>1079){                    
           
            var newHeight = screen.height - 568;

            $("#increasingDiv").height(newHeight);
            
        }else{
             $("#increasingDiv").height(520);
    }
    
    
    
    if (isLogedUser) {
        $("#watchMoreVideos, #tweeterImg").hide();
        $("#tweeterImageContainer #downloadNow").css('float', 'none');
        $('.downloadNow').attr('href', '#');
    }
    
    $('#downloadNow').live('click', function(){
        var terms = $('input[name="'+shopTermsFieldID+'"]:checked').val();
        if (terms != 1) {
          $(".alert").html('You did not accept General Terms and Conditions');
          $(".alert").show().delay(1000).fadeOut(5000);
          return false;
        } else {
           var username = $('input[name="'+shopUserFieldID+'"]').val();
           if (username == '') {
               $(".alert").html('Enter GitHub username');
               $(".alert").show().delay(1000).fadeOut(5000);
               return false;
           } else {
               $(".alert").html('Please wait ...');
               $(".alert").show();
                var url = appUrl+"/onlineshop/addshopformsproduct";
                $.ajax({
                         type: "POST",
                         url: url,
                         data: $("#glShopFrom").serialize(), // serializes the form's elements.
                         success: function(data)
                         {
                             if (data.status == 'success') {
                                 $(".alert").html('Download will start in a moment...');
                                 $.post(appUrl+"/onlineshop/shopstoreorder",function(data){
                                     if (data) {
                                        window.location= appUrl+"gl/content/download/orderId/"+data+"/page/thank-for-downloading";
                                     }
                                 })
                                //
                             } // show response from the php script.
                         }
                       });

                  return false;
           }
        }
    });
});
