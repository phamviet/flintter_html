define([ '$', 'App' ], function($, App) {

    return function (){
        var events = [
            'newIdea.content',
            'selectTopic.content'
        ];

        var handlers = {
            newIdea: function(el, type, id) {


                alert('Post idea is triggered');
            },

            selectTopic: function(el, type, id) {



            }
        };

        $(document).on(events.join(' '), function(e) {
            var el = $(e.target),
                entity = el.closest('.entity');
            handlers[e.type](el, entity.data('type'), entity.data('id'));
        });
    };
});