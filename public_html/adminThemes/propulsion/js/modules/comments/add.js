$(function(){
    
    //tabs

    $(".tab_content").hide();
    $(".tab_content:first").show();
    
    
    //side tabs
    $(".tab").live('click',function(){
        var parent = $(this).parent().parent();
        parent.children('li').children('a').removeClass("activeTab");
        $(".tab").removeClass("top");
        $(".tab").addClass("inactiveTab");
        $(this).addClass("activeTab");
        $(this).removeClass("inactiveTab");
        $(".form").hide();
        $("#" + $(this).attr("id") + "-1").show();
        return false;
    });
    $(".deleteComment").live("click", function(){
        var commentId = $(this).attr("commentId");
        var msg = $(this).attr("msg");
        var status = confirm(msg);
        if(status) {
            $.post(appurl + "/comments/deletecomment/",{
                'commentId':commentId
            },function(data){
                $('tr#'+commentId).remove();
                if(data != "no") {
                    var replays = data.split(",");
                    for(var i = 0; i<replays.length; i++) {
                        $('tr#'+replays[i]).remove();
                    }
                }
            });
        }
        return false;
    });
    $('.unapproveComment').live("click", function(){
        var commentId = $(this).attr("commentId");
        var msg = $(this).attr("msg");
        var status = confirm(msg);
        if(status) {
            $.post(appurl + "/comments/setcommentstatus/",{
                'commentId':commentId,
                'status':'0'
            },function(data){
                $('tr#'+commentId).remove();
            });
        }
        return false;
    });
    $('.approveComment').live("click", function(){
        var commentId = $(this).attr("commentId");
        var msg = $(this).attr("msg");
        var status = confirm(msg);
        if(status) {
            $.post(appurl + "/comments/setcommentstatus/",{
                'commentId':commentId,
                'status':'1'
            },function(data){
                $('tr#'+commentId).remove();
            });
        }
        return false;
    }); 
    
    $('.replayToComment').live("click", function(){
        var commentId = $(this).attr("commentId");
        var commentType = $(this).attr("commentType");
        var resourceId = $(this).attr("resourceId");
        var table = $(this).parent().parent().parent().parent().attr("id");
        $('tr.replay').remove();
        $.post(appurl + "/comments/generatereplayrow/",{
            'commentId':commentId,
            'comment_type':commentType,
            'resourceId':resourceId
        },function(data){
            $('#'+commentId).after(data);
        });
        return false;
    }); 
    
    $('.cancelReplay').live("click", function(){
        $('tr.replay').remove();
    }); 
})

