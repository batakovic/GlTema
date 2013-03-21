$(function (){

// File upload
    if ($('#fileupload').length) {
        new AjaxUpload('fileupload', {
            action: 'upload-handler.php',
            autoSubmit: true,
            name: 'userfile',
            responseType: 'text/html',
            onSubmit : function(file , ext) {
                $('.fileupload #uploadmsg').addClass('loading').text('Uploading...');
                this.disable();	
            },
            onComplete : function(file, response) {
                $('.fileupload #uploadmsg').removeClass('loading').text(response);
                this.enable();
            }	
        });
    }
    
    })