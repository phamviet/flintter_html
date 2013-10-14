define([ '$', 'bootstrap-modal', 'plupload'], function($) {

    return {
        newTopic: function($el) {
            var $modal = $('#ajax-modal');

            $('body').modalmanager('loading');

            $modal.load(SITE.url('static/new-topic'), '', function(){
                $modal.modal({'focusOn': '#form_name', keyboard: false});
                $('body').modalmanager('removeLoading');

                var $form = $('#frmNewTopic');
                $form
                    .on('autosubmit.success', function(e, res){
                        $modal.modal('hide');
                    })
                    .on('autosubmit.failure', function(e, res, code){

                    })
                    .on('autosubmit.complete', function(e){
                        $('#form_name').val('');
                        $('#form_description').val('');
                    });

                var uploader = new plupload.Uploader({
                    runtimes : 'gears,html5,flash,silverlight,browserplus',
                    browse_button : 'pickfiles',
                    max_file_size : '10mb',
                    url : SITE.url('upload/topic'),
                    flash_swf_url : '/public/assets/js/vendor/plupload/js/Moxie.swf',
                    silverlight_xap_url : '/public/assets/js/vendor/plupload/js/Moxie.xap',
                    filters : [
                        {title : "Image files", extensions : "jpg,gif,png"}
                    ]
                });
                var uploadResult = $('#upload-result');

                uploader.init();
                uploader.bind('FilesAdded', function(up, files) {
                    up.refresh(); // Reposition Flash/Silverlight
                    uploader.start();
                });

                uploader.bind('UploadProgress', function(up, file) {
                    uploadResult.text('[Upload in progress...] ' + file.percent + '%');
                });

                uploader.bind('Error', function(up, err) {
                    /*$('#filelist').append("<div>Error: " + err.code +
                     ", Message: " + err.message +
                     (err.file ? ", File: " + err.file.name : "") +
                     "</div>"
                     );*/
                    uploadResult.text('[Upload error]');
                    console.log(err);
                    up.refresh(); // Reposition Flash/Silverlight
                });

                uploader.bind('FileUploaded', function(up, file, response) {
                    var res = $.parseJSON(response.response);

                    uploadResult.text('[Upload sucess!] ').append($('<a></a>').attr('target', '_blank').attr('href', res.result.url).attr('class', 'link-default').text('view'));

                    var media = $('input[name="form[media]"]', $form);
                    if(media.length) {
                        media.val(res.result.media_id);
                    } else {
                        $('<input />').attr('type', 'hidden').attr('name', 'form[media]').attr('value', res.result.media_id).appendTo($form);
                    }
                });

            });
        }
    };

});
