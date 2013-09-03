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
//                $('.ulti .tags-list .list ul').html('');
                console.log('loadMostTopic event');
                //call: $(document).trigger('loadMostTopic.content');
            }
        };

        $(document).on(events.join(' '), function(e) {
            var el = $(e.target),
                entity = el.closest('.entity');
            handlers[e.type](el, entity.data('type'), entity.data('id'));
        });
    };
});