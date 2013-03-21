$(document).ready(function(){
//updater
    $('.viewDetails a').live("click", function(){
    	$(this).closest('div').find('ul').toggle(500);
    });
    
    if($('.fullname > a').html() == "updater" || $('.fullname > a').html() == "Updater"){
    	$.ajax({
            url: appurl + "/updater/updater/downloadupdates",
            async: false,
            type: 'POST',
            success: function(data){
            	if(!data){
                	window.location.replace(appurl + "/manage");
                }
                var versions = jQuery.parseJSON(data);
                console.log(versions);
                upgradeVersions(versions);
            }
        });
    }
    
    function upgradeVersions(versions){
    	var append = "";
    	version = versions[0];
    	console.log(version);
    	versions.shift();
    	var counter = $('#updateList > div.update').size() + 1;
    	append  = "<div class='update'>";
		append += "    <p class='updateInfo'>";
		append += "			<span class='circle'>" + counter + "</span>";
		append += "			<span class='version'>Update-" + version + ".zip</span>";
		append += "			<span class='status ajaxLoader'></span>";
		append += "    </p>";
		append += "</div>";
		$('#updateList').append(append);
    	$.ajax({
    		url: appurl + "/updater/updater/upgradetoversion/version/" + version,
    		 async: true,
             type: 'POST',
             success: function(data){
            	 var result = jQuery.parseJSON(data);
            	 var status = result["status"];
            	 var list   = result["list"];
            	 $('#updateList div.update:last p span.status').removeClass("ajaxLoader");
            	 append = "<p class='viewDetails'>";
        		 append += 	"<a href='javascript:void(0)'>View details</a>";
        		 append += "</p>"
        		 $('#updateList div.update:last').append(append+list);
        		 console.log(versions);
            	 if(status != false){
            		 $('#updateList div.update:last p span.status').html('<img src="http://cenkovic.gitlaunchpad.com/GitLaunchpad/public_html/adminThemes/userDeploy/images/success.png">');
            		 if(versions.length > 0) {
            			 upgradeVersions(versions);
            		 } else {
            			 $('.proceedToDashboard').show();
            		 }
            	 } else {
            		 $('.proceedToDashboard').show();
            		 $('#updateList div.update:last p span.status').html('<img src="http://cenkovic.gitlaunchpad.com/GitLaunchpad/public_html/adminThemes/userDeploy/images/error.png">');
            	 }
            	 
             }
    	});
    }
});