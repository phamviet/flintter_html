define([
    'jquery',
    'facebook',
    'App'
], function($, undefinedObject, App) {

    var FacebookSDK = function() {

    };

    FacebookSDK.prototype.initialize = function() {

    };

    /**
     *  Setup Facebook login
     */
    FacebookSDK.prototype.setup = function() {
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

    }

    return FacebookSDK;
});