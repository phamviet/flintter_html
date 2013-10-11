define([
    '$',
    'App'
], function($, App) {

    var WelcomePage = function() {

    };

    WelcomePage.prototype.initialize = function() {
        this.facebookSDKSetup();
    };

    /**
     *  Load Facebook setup
     */
    WelcomePage.prototype.facebookSDKSetup = function() {
        require(['Application/FacebookSDK'], function(FacebookSDK) {
            var fb = new FacebookSDK();

            fb.setup();
        });
    };

    return WelcomePage;
});