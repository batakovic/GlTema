/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
$(function(){
    
    $('#uploadfile').live('change',function(){
        span = $(this).prev();
        span.text($(this).val());
    })
});

