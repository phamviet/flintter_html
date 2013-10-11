define(['$', 'module/topic/events'], function($, handlers) {


    var events = [
        'newTopic.topic'
    ];

    $(document).on(events.join(' '), function(e) {
        handlers[e.type]($(e.target));
    });

    return {};
});