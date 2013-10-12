define([
    '$',
    'facebook'
], function($) {

    window.fbAsyncInit = (function() {
        FB.init({
            appId      : SITE.FACEBOOK_APP_ID,
            channelUrl : '/facebook/channel',
            status     : true,
            cookie     : true,
            xfbml      : true
        });

        $('.fblogin').on('click', function(e){
            FB.login(
                function (response) {
                    if (response.authResponse) {
                        window.location.href = SITE.url("security/facebook/check");
                    }
                },
                {
                    scope: SITE.FACEBOOK_SCOPE
                }
            );
            e.preventDefault();
        });
    }());
});