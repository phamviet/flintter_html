define([
    'jquery',
    'App'
], function($, undefinedObject, App) {

    var WelcomePage = function() {

    };

    WelcomePage.prototype.initialize = function() {
//        this.facebookSDKSetup();
    };

    /**
     *  Load Facebook setup
     */
    WelcomePage.prototype.facebookSDKSetup = function() {
        require(['App/FacebookSDK'], function(FacebookSDK) {
            var fb = new FacebookSDK();

            fb.setup();
        });
    };

    return WelcomePage;
});