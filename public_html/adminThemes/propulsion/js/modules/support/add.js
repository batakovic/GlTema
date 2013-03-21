$(document).ready(function(){

    $("textarea")
    .focus(function() {
        if (this.value === this.defaultValue) {
            this.value = '';
        }
    })
    .blur(function() {
        if (this.value === '') {
            this.value = this.defaultValue;
        }
    });
    
    $(".updateTicket").live('click', function(){
        $("#is_update").val(1);
        return true;
    })
});