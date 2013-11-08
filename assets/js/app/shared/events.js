define([ '$', 'App' ], function($, App) {

    return function (){
        var events = [
            'global.shared'
        ];

        var handlers = {
            global: function(el, type, id) {

            }
        };

        $(document).on(events.join(' '), function(e) {
            var el = $(e.target);
            handlers[e.type](el);
        });
    };
});