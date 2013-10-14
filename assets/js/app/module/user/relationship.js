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
                    $('#people-may-know-' + friendId).slideUp(1000, function(){
                        $(this).remove();
                    });
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