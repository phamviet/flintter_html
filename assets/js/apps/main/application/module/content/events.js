define([ '$', 'App', 'jquery/select2.min' ], function($, App , select2) {

    return function (){
        var events = [
            'newIdea.content',
            'selectTopic.content',
            'loadMostTopic.content',
            'newTopic.content',
            'tagUser.content'
        ];

        var handlers = {
            newIdea: function(el, type, id) {


                alert('Post idea is triggered');
            },

            promote: function(el, type, id) {

            },
            selectTopic: function(el, type, id) {



            },
            loadMostTopic: function(el, type, id) {
                $(".mCSB_container").load(SITE.BASE_URL+'/category/getmosttopic', function (data)
                {
                    $('.ulti .tags-list .list ul').html(jQuery.parseJSON(data).html) ;
                })
            },
            // handler event newTopic.      
            newTopic: function() {
                //console.log('New topic is triggered');
                // load the topic form.
                $.get(SITE.BASE_URL+'/category/create', 
                    function(data) {
                        // show modal popup.
			$(data).modal('show');
		});
                // handler event the post topic.
                $(document).off('submit').on('submit', '#newtopicForm', function(e){
                    e.preventDefault();
                    // post data to create topic action.
                    $.post(SITE.BASE_URL+'/category/create',$(this).serialize(),function(data){
                        // replace old form to new form.
                        var el = $('#modal-newtopic').html($(data).find('#newtopicForm'));
                        // reset form.
                        var form = el.find('#newtopicForm');
                        form[0].reset();
                    });
                    return false;
                });
                // handler event close the topic.
                $(document).off('click').on('click', '#newtopicForm .btn-cancel', function(e){
                    e.preventDefault();
                    $('#modal-newtopic').modal('hide').remove();
                });
            },
            // handler event tag user.        
            tagUser: function() {
                $('#tags').select2({
                    tags:[],
                    ajax: {
                        url: SITE.BASE_URL+'/service/suggest/friend',
                        dataType: 'jsonp',
                        data: function (term) {
                            return {
                                q: term, //search friend
                                user_id: window.USER.id // user id
                            };
                        },
                        results: function(data) {
                            console.log(data);
                        }        
                    }
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
