define(['$'], function($) {

    var events = [
        'newTopic.topic',
        'follow.topic',
        'unfollow.topic'
    ];

    var handlers = {
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
                    browse_button : 'topic-pickfiles',
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
                    uploadResult.text('[Upload error]');
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
        },

        follow: function ($el) {
            this._follow($el.data('topic-id'), 1, function(res){
                if(res.status) {
                    $el.data('event', 'unfollow.topic');
//                    $el.addClass('big-red');
                    $el.find('span.text').text('FOLLOWED');
                }
            });
        },
        unfollow: function ($el) {
            this._follow($el.data('topic-id'), 0, function(res){
                if(res.status) {
                    $el.data('event', 'follow.topic');
//                    $el.removeClass('big-red');
                    $el.find('span.text').text('FOLLOW');
                }
            });
        },
        _follow: function(id, type, callback) {
            $.post(SITE.url('service/topic/follow'), {id: id, type: type}, function(res){
                callback(res);
            }, 'json');
        }
    };


    $(document).on(events.join(' '), function(e) {
        handlers[e.type]($(e.target));
    });

    return handlers;
});