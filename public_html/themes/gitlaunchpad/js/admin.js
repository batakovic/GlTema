$(function () {
    $.preloadCssImages();
    
    $('.addUser').hide();
    $('.closeAddUser').hide();
    $('.loader').hide();
    $('.formSubmitLoader').hide();
    $('.formSubmitSpan').hide();
    $('.addProblem').attr("disabled", "disabled");
    $('.formStatus').delay(3000).fadeOut('slow');
    
    var height = $("#adminPageInfoDiv").height();
    var marginValue = height+16;    
    $("#close").css("top",(-marginValue));
    
    var width = $("#adminPageInfoDiv").width();
    marginValue = width-28;
    $("#close").css("right",(-marginValue));    
    
    
    $("#close").live("click", function(event) {        
        $("#adminPageInfoDiv").fadeTo(500,0,function(){
            $("#close").remove();
            $("#adminPageInfoDiv").remove();
        });
        
        var userID = $("#close").attr('userID');
        var newsID = $("#close").attr('newsID');
        
        $.ajax({
                url: appUrl+'/gl/content/marknewsasread/userID/'+userID+'/newsID/'+newsID,
                async: true,
                type: 'POST',
                success: function(data){
                   
                }
        });
        
    });
    
     
     
     $('#generatelicense').live('click', function(){

         $('#generatelicense').hide();
         $('.loader').show();
         

         
         var url="";
         
         var userID = $(this).attr('userid');
         
         $.ajax({
                url: appUrl+'/gl/content/addlicense/userID/'+userID,
                async: true,
                type: 'POST',
                success: function(data){
                    
                    json = jQuery.parseJSON(data);
                    
                    if(json.status){
                    
                        $('.licensesDiv').append('\n\
\n\                     <div style="width: 100%; height:20px;">'+
'\n\                            <div style="float: left; width: 352px;" class="padding20" >'+
'\n\                                <p class="infoText" id="license-1">'+json.license+'</p>'+
'\n\                            </div>'+
'\n\                            <div style="float: left; width: 268px;"  class="padding20">'+
'\n\                                <p class="infoText urls">No registered instances for this license.</p>'+                                
'\n\                            </div>'+
'\n\                            <div style="float: left; width: 236px;"  class="padding20">'+
'\n\                                 <p class="infoText">'+
'\n\                                    '+json.username+
'\n\                                </p>'+
'\n\                           </div>'+
'\n\                            <div style="float: left; width: 101px;"  class="padding20">'+
'\n\                                <button id="manage-1" licenseKey="'+json.license+'" class="manageUsers">Manage users</button>'+
'\n\                            </div>'+
'\n\                        </div>'+
'\n\                        <div class="border"></div>');
                        
                    } else {
                        
                        window.alert(json.message);
                    }
                    
                    $('#generatelicense').show();
                    $('.loader').hide();
                }
         });
     });
     
     $('.manageUsers').live('click', function(){
         $('#userPanel').html("");
         var licenseKey = $(this).attr('licenseKey');
         
         $.ajax({
                url: appUrl+'/gl/content/getusersforlicense/licenseKey/'+licenseKey,
                async: true,
                type: 'POST',
                success: function(data){
                   $("#userPanel").append(data);
                }
         });
         
     });
     
     $('.closeAddUser').live('click', function(){
         
         $('.addUser').hide();
         $('.closeAddUser').hide();
         $('#userPanel').html("");
     });
     
        
     $('#selectProblem').change(function() {

        var selectedValue = $('#selectProblem').val();

        $('#selectValue').text(selectedValue);
     });
     
     $('.addAuthUserButton').live('click', function(){
         
         var licenseKey = $(this).attr('licenseKey');
         var username = $('.addUserInputField').val();
         username=escape(username);
         
         var fieldNum = $('#userFieldNumber').val();
         
         
         index = hasWhiteSpace(username);
         
         if(index){
             window.alert("Username must be word without any spaces.");
         }else{
            
            $('.addAuthUserButton').hide();            
            $('.userWaitLoader').show(); 
             
            $.ajax({
                   url: appUrl+'/gl/content/adduserforlicense/licenseKey/'+licenseKey+'/username/'+username,
                   async: true,
                   type: 'POST',                   
                   success: function(data){

                       json = jQuery.parseJSON(data);
                       
                       if(json.status){
                           $('.listOfAuthUsers').append('\n\
\n\               <div id="user-'+(fieldNum)+'">'+
'\n\                    <div style="float: left; width: 395px;"  class="padding20">'+
'\n\                        <p class="infoText" id="text-'+(fieldNum)+'">'+username+'</p>'+
'\n\                    </div>'+
'\n\                    <div style="float: left; width: 22px;"  class="padding20">'+
'\n\                         <button class="deleteuser" del_attr="delete-'+(fieldNum)+'" username="'+username+'"> </button>'+
'\n\                    </div>'+                    
'\n\                    <div style="float: left; width: 22px;"  class="padding20">'+
'\n\                         <p class="infoText removeLabel">Remove</p>'+                                  
'\n\                    </div>'+
'\n\                    <div class="border"></div>'+
'\n\               </div>');


                       $('#userFieldNumber').val(fieldNum+1);
                       $('.addUserInputField').val("");
                       
                       var usernames = $('#'+licenseKey).text();                       
                       $('#'+licenseKey).text(usernames+', '+username);
                       } else {
                           $('.userExists').text(json.message);
                           $('.userExists').show().animate({opacity: 1.0}, 1500).fadeOut(750);
                       }
                       
                       $('.userWaitLoader').hide();
                       $('.addAuthUserButton').show();
                   }
                   
            });
         }
     });
     
     $('.uploadFile').live('change', function(){         
         
         $('.attachmentSpan').text($(this).val());
         $('.addProblem').removeAttr("disabled");
     });
     
     $(".cabinetSupport").live("click", function(event){

        if (!$(event.target).is('.active')) { 
            $(this).find(".active").trigger('click');
        }
        
     });
     $('.addProblem').live('click', function(){
         console.log($('.active'));
         var filename = $('.activeFile').val();         
         filename = filename.replace(/^.*(\\|\/|\:)/, '');
         $('.active').removeClass("activeFile");         
         var count = $('#attachmentCount').val();
         count=parseInt(count);
         
         $('.attachmentSpan').text('Select file');
         
         $('.attachmentList').append('<li class="attachmentListItem" id="list-'+count+'">'+filename+'\
\n\                                  <div style="float: right; width: 22px; margin-top: -2px;" >'+
'\n\                                    <button class="deleteattachment" file="'+count+'"> </button>'+
'\n\                                    </div>'+
'\n\                                <div class="border" style="margin-top: 4px;"></div></li>');
         count+=1;
         $('#attachmentCount').val(count);
         
         $('.cabinetSupport').prepend('<span class="attachmentSpan">Select file</span><input type="file" id="file-'+count+'" class="uploadFile activeFile" name="attachment[]">');
         $('.addProblem').attr("disabled", "disabled");
         
         
     });
     
     $('#ticketForm').submit(function(e){
         
         if($('.select465').val()=='What are you having problems with?'){
             
             $('.formSubmitErrorInfo').text("Please select what are you having problems with!");             
             $('.formSubmitSpan').show().animate({opacity: 1.0}, 1500).fadeOut(750);             
             return false;
         }
         
         if($('.supportArea').val()==""){
             
             $('.formSubmitErrorInfo').text("Please describe your problem!");             
             $('.formSubmitSpan').show().animate({opacity: 1.0}, 1500).fadeOut(750);             
             return false;
         }
         $('.submitSupportButton').hide();
         $('.formSubmitLoader').show();         
         return true;
     });
     
     function hasWhiteSpace(s) {
         return s.indexOf(' ') >= 0;
     }
     
     $('.deleteuser').live('click', function(){
         
         $('.addAuthUserButton').hide();            
         $('.userWaitLoader').show();
         
         var licenseKey = $('.addAuthUserButton').attr('licenseKey');
         var username = $(this).attr('username');
         var div       = $(this).attr("del_attr");
         $('.deleteuser').hide();
         var num;
         $.ajax({
                   url: appUrl+'/gl/content/deleteusersforlicense/licenseKey/'+licenseKey+'/username/'+username,
                   async: true,
                   type: 'POST',
                   success: function(data){

                       json = jQuery.parseJSON(data);
                       
                       if(json.status){
                           $.each(json.deleted.user, function(i, oneUser){
                               if (oneUser.status == 1) {
                                  
                                  num = div.split("-");
                                  $('#user-'+num[1]).remove();
                                  
                                  $('#'+licenseKey).text(json.users);
                               }
                               else{
                                   
                                  num = div.split("-");
                                  $('#text-'+num[1]).css('color','red');
                                  $('#text-'+num[1]).text(username+' - Could not delete username');
                               }
                           }); 
                           
                           $('.addAuthUserButton').show();            
                           $('.userWaitLoader').hide();
                           $('.deleteuser').show();
                       }
                    
                   }
            });
         
     });     
    
    
    $('.deleteattachment').live('click', function(event){
        
        event.preventDefault();
        
        var file = $(this).attr('file');
        
        $('#file-'+file).remove();
        $('#list-'+file).remove();
    });
    
});