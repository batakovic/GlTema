$(function () {
    
    
    if(screen.height>1079){                    
           
            var newHeight = screen.height - 568;

            $("#increasingDiv").height(newHeight);
            
        }else{
             $("#increasingDiv").height(520);
    }
    
});