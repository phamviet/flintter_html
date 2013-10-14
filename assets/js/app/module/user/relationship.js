define(['$'], function($) {


    var events = [
        'requestFriend.relationship'
    ];

    var handlers =  {
        requestFriend: function($el) {
            var friendId = $el.data('user-id');

            $.post(SITE.url('service/relationship/friend/request'), {id: friendId}, function(res){
                if(res.status) {
                    $el.hide();
                }
            }, 'json');
        }
    };

    $(document).on(events.join(' '), function(e) {
        handlers[e.type]($(e.target));
        e.preventDefault();
    });

    return handlers;
});