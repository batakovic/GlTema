$(function () {

    $(".addUserInputField")
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
    
    $('.userExists').hide();
    $('.userWaitLoader').hide();
    
});