define([ '$', 'App', 'jquery/select2.min', 'jquery/jquery.fileupload'], function($, App , select2, fileupload) {

    return function (){
        var events = [
            'newIdea.content',
            'selectTopic.content',
            'loadMostTopic.content',
            'newTopic.content',
            'postTag.content',
            'loadBestTopic.content',
            'postPhoto.content'

        ];

        var handlers = {
            newIdea: function() {
                var title = $('#post_title').val();
                var content = $('#post_content').html();
                // get all tags is selected.
                var tags = $('#tags').val();
                var mediaId = $('#media-id').val();
                // get all topic is selected.
                var categories = '';
                // post data to create a idea via service.
                $.post(SITE.BASE_URL+'/idea/create',{
                        title: title,
                        content: content,
                        tags: tags,
                        media_id: mediaId,
                        categories: categories
                    }
                    ,
                    function(data){
                    console.log(data);
                });
            },

            promote: function(el, type, id) {

            },
            loadBestTopic: function() {
                $(".best_topic").load(SITE.BASE_URL+'/category/besttopic', function (data)
                {
                    $(this).html(data);
                });
            },
            loadMostTopic: function() {
                $(".mCSB_container").load(SITE.BASE_URL+'/category/getmosttopic', function (data)
                {
                    $('.ulti .tags-list .list ul').html(jQuery.parseJSON(data).html) ;
                });
            },
            // handler process the new topic.      
            newTopic: function() {
                //console.log('New topic is triggered');
                // Clear form fields in a designated area of a page
                $.clearFormFields = function(area) {
                  $(area).find('input[type="text"],textarea,select').val('');
                };
                // load the topic form.
                $.get(SITE.BASE_URL+'/category/create', 
                    function(data) {
                        // show modal popup.
			$(data).modal('show');
		});
                // handler event the post topic.
                $(document).off('submit').on('submit', '#form-newtopic', function(e){
                    e.preventDefault();
                    // post data to create topic action.
                    $.post(SITE.BASE_URL+'/category/create',$(this).serialize(),function(data){
                        // replace old form to new form.
                        var _data = $(data).find('#form-newtopic');
                        // reset form.
                        $.clearFormFields(_data);
                        // append new html to modal.
                        $('#modal-newtopic').html(_data);
                    });
                    return false;
                });
                // handler event close the topic.
                $(document).off('click').on('click', '#form-newtopic .btn-cancel', function(e){
                    e.preventDefault();
                    $('#modal-newtopic').modal('hide').remove();
                });
            },
            // handler process post tag.        
            postTag: function() {
                // show editor area when trigger this event.
                $('.post .post-tags').removeClass('active').addClass('active');
                // add class active when trigger this event.
                $('.post #tabs').removeClass('active').find('.imed-tag').parent().addClass('active');
                // hide div tag friend.
                $('.post .post-tags .post-alt').hide();
                // handler event on click icon imed-tag.
                $(document).on('click','.imed-tag',function(){
                    $('.post .post-tags .post-alt').show();
                    $('.post .post-tags').removeClass('active').addClass('active');
                    $('.post #tabs').removeClass('active').find('.imed-tag').parent().addClass('active');
                });
                // implement select2 plugin.
                $("#tags").select2({
                    minimumInputLength: 1, // more 1 character to suggest friends.
                    multiple: true,
                    //containerCssClass: 'tags',
                    id: function(data) { 
                        return data.value+":"+data.label; 
                    },
                    ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
                        url: SITE.BASE_URL + '/service/suggest/friend',
                        dataType: 'json',
                        data: function (value) {
                            return {
                                q: value, // suggest friends of user.
                                user_id: window.USER.id
                            };
                        },
                        results: function (data) { // parse the results into the format expected by Select2.
                            // since we are using custom formatting functions we do not need to alter remote JSON data
                            var dt = $.parseJSON(data);
                            return {results: dt};
                        }
                    },
                    formatSelection: function(data) {
                        return data.label;
                    },
                    formatResult: function(data) {
                        return '<div>' + data.label + '</div>';
                    },
                    initSelection: function(element, callback) {
                        var data = [];
                        $(element.val().split(",")).each(function(i) {
                            var item = this.split(':');
                            data.push({
                                value: item[0],
                                label: item[1]
                            });
                        });
                        callback(data);
                    }
                });
            },
            // handler process post photo.
            postPhoto: function() {
                console.log('handler process post photo');
                // show file upload when trigger this event.
                //$('.post .post-photo').removeClass('active').addClass('active');
                // add class active when trigger event file upload.
                //$('.post #tabs').removeClass('active').find('.imed-photo').parent().addClass('active');
                // handler event on click icon imed-tag.
                $(document).on('click','.imed-photo',function(){
                    $('.post .post-photo').removeClass('active').addClass('active');
                    $('.post #tabs').removeClass('active').find('.imed-tag').parent().addClass('active');
                });
                // find "choose from computer" button.
                var uploadBtn = $('.post-photo').find('.big-button').eq(0);
                // handler event when click.
                uploadBtn.on('click',function(e) {
                    e.preventDefault();
                    //console.log('choose from computer button is trigger');
                    // trigger file upload.
                    $('#upload').trigger('click');
                });
                var fileInput = $('#upload');
                fileInput.off('change').on('change',function(e) {
                    e.preventDefault();
                    //console.log('choose from computer button is trigger');
                    // get file resource.
                    var file = $(this)[0].files[0];
                    // file extension is allowed.
                    var imageType = /image.(png|jpg|gif|jpeg|pjpeg|x-png)/;
                    // regex match file entension.
                    if(!file.type.match(imageType)) {
                        //reset value.
                        fileInput.val('');
                        alert('File extension invalid');
                        return false;
                    }
                    // get file size.
                    var size = (file.size||file.fileSize);
                    // check the file max is 10MB.
                    if(size>10485760) {
                        fileInput.val('');
                        alert('Max file is 10MB');
                        return false;
                    }
                    var userId = window.USER.id;
                    // get media id to check in case new or edit action.
                    var mediaId = $('#media-id').val();
                    if(!mediaId) {
                        mediaId = 0;
                    }
                    var mediaType = 'topic';
                    console.log('file change is trigger');
                    // handler event submit the post photo form.
                    $(this).fileupload({
                        url: SITE.BASE_URL + '/service/upload',
                        add: function (e, data) {
                            data.formData = {user_id: userId, media_id: mediaId, media_type: mediaType};
                            data.submit();
                        },
                        done: function (e, data) {
                            var dt = $.parseJSON(data.result);
                            // check if the file uploaded successfull.
                            if(!dt.hasOwnProperty('errors')) {
                                 var mediaId = dt.id;
                                // set media id for hidden input.
                                $('#media-id').val(mediaId);
                            }
                        }
                    });
                });
                // find "cancel" button.
                var cancelBtn = $('.post-photo').find('.big-button').eq(1);
                cancelBtn.on('click',function(e) {
                    e.preventDefault();
                    console.log('cancel button is trigger');
                });
            }
        };

        $(document).on(events.join(' '), function(e) {
            var el = $(e.target),
                entity = el.closest('.entity');
            handlers[e.type](el, entity.data('type'), entity.data('id'));
        });
    };
});
