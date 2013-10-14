define(['$'], function($) {
    var events = [
        'requestFriend.relationship'
    ];

    var handlers =  {
        requestFriend: function($el) {
            var friendId = $el.data('user-id');
            $.post(SITE.url('service/relationship/friend/request'), {id: friendId}, function(res){
                if(res.status) {
                    $el.off();
                    if ($el.parent().prop("tagName") == 'LI') {
                        $el.parent().remove();
                    } else {
                        $el.remove();
                    }

                    var me = $('#people-may-know-' + friendId);
                    if(me.length) {
                        me.slideUp(1000, function() {
                            $(this).remove();
                        });
                    }
                }
            }, 'json');
        }
    };

    $(document).on(events.join(' '), function(e) {
        handlers[e.type]($(e.target));
        e.preventDefault();
        return false;
    });

    return handlers;
});