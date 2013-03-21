$(function(){       
    
    $("#addmodule").click(function ()
    {        
      var letters = /^[a-zA-Z ]*$/;  
      
      var moduleName = $('#moduleName').val();
      
      if(moduleName.match(letters)) {        
        return true;  
      } else {
        alert('Please input alphabet characters only');
        return false;  
      }  
    });
    
    
    
    
});

