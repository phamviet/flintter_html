define([ '$', 'App' ], function($, App) {

    return function (){
        var events = [
            'newIdea.content',
            'selectTopic.content',
            'loadMostTopic.content'
        ];

        var handlers = {
            newIdea: function(el, type, id) {


                alert('Post idea is triggered');
            },

            selectTopic: function(el, type, id) {



            },
            loadMostTopic: function(el, type, id) {
                $(".mCSB_container").load(SITE.BASE_URL+'/category/getmosttopic', function (data)
                {
                    $('.ulti .tags-list .list ul').html(jQuery.parseJSON(data).html);
                })
            }
        };

        $(document).on(events.join(' '), function(e) {
            var el = $(e.target),
                entity = el.closest('.entity');
            handlers[e.type](el, entity.data('type'), entity.data('id'));
        });
    };
});
