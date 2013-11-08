define([ '$'], function($) {
    var events = [
        'like.content',
        'unlike.content'
    ];

    var handlers = {
        like: function($el) {
            var id = $el.data('content-id');
            handlers._like(id, 1, function(res){
                if(res.status) {
                    $el.data('event', 'unlike.content');
                    $el.addClass('big-red');
                }
            });
        },
        unlike: function($el) {
            var id = $el.data('content-id');
            handlers._like(id, 0, function(res){
                if(res.status) {
                    $el.data('event', 'like.content');
                    $el.removeClass('big-red');
                }
            });
        },
        _like: function(id, type, callback) {
            $.post(SITE.url('service/idea/like'), {id: id, type: type}, function(res){
                callback(res);
            }, 'json');
        }

    };

    $(document).on(events.join(' '), function(e) {
        handlers[e.type]($(e.target));
    });

    return handlers;
});
