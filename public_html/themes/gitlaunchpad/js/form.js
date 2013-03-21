$(function () {
    
    $("#submitForm input[type=text]")
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
    $("#submitForm textarea")
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
    
    $(".submitContact").live('click', function(){
        
        var name  = $("#nameInput").val();
        var email = $("#emailInput").val();
        var subject = $("#subjectInput").val();
        var message = $("#messageInput").val();
        if (name == "" || name == $("#nameInput").attr("defVal")) {
            $("#nameInput").parent().find(".labelErrorInput").html("Provide name").height("20px");
        }
        $(".submitContact").hide();
        $(".formSubmitLoader").css("right",'0px').show();

        return false;
    })
});

