$(function () {
   
   $('.departmentSaveMessage').hide();
   $('.departmentLoading').hide();
   
   $('.userAllowDepartment').live('change', function(){
       
       var id = $(this).attr('id');       
       var departmentID = id.split('-');
       
       $('#loader-'+departmentID[1]).show();

       var checked = 0;
   
       if($(this).is(":checked")){           
           checked=1;           
       }
       
       $.ajax({
                url: appurl+'/support/support/allowdepartment/departmentID/'+departmentID[1]+'/checked/'+checked,
                async: true,
                type: 'POST',
                success: function(data){
                   json = jQuery.parseJSON(data);
                   
                   $('#loader-'+departmentID[1]).hide();
                   $('#message-'+departmentID[1]).text(json.message);
                   
                   if(json.status){
                       
                       if(checked){
                           $("#span-"+departmentID[1]).text('Deny');                           
                       }else{
                           $("#span-"+departmentID[1]).text('Allow');
                       }
                   } else {
                       $('#message-'+departmentID[1]).css('background-color', '#FFEEEE');                       
                   }
                   
                   $('#message-'+departmentID[1]).show().animate({opacity: 1.0}, 1500).fadeOut(750);
                }
       });
   });
});