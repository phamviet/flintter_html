define([
    '$',
    'app',
    'facebook'
], function($, App) {

    window.fbAsyncInit = function() {
        FB.init({
            appId      : App.FACEBOOK_APP_ID,
            channelUrl : '/facebook/channel',
            status     : true,
            cookie     : true,
            xfbml      : true
        });

        $('.fblogin').on('click', function(e){
            FB.login(
                function (response) {
                    if (response.authResponse) {
                        window.location.href = App.url("security/facebook/check");
                    }
                },
                {
                    scope: App.FACEBOOK_SCOPE
                }
            );
            e.preventDefault();
        });
    };
});