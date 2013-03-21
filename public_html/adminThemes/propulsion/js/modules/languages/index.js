/*function() {

//    Disable/Enable lang
    $("a.disableLang").live("click",function(){
        var id = $(this).attr("id");
        var deleteRegionMsg = $("#deleteLangMsg").val();
        var status = confirm(deleteRegionMsg);
        if(status) {
            $.get(appurl+'/languages/disable/id/'+id, handleResponse);       
            $('#langrow-'+id).remove();
            return false;
        }

    });
})*/
