define([
    'jquery'
], function($){
    var App;
    var global = window.SITE || {
        FACEBOOK_APP_ID: '',
        FACEBOOK_SCOPE: '',
        BASE_URL: '',
        BASE_PATH: '',
        ENV : 'dev',
        VERSION: '123456'
    };

    App = {
        url: function (path) {
            var url = SITE.BASE_URL + ((path[0] || '') == '/' ? path : '/' + path);
            return url.replace(/\/\//g,'/');
        },

        hashUrl: function (path) {
            var url = SITE.BASE_URL + '#' + ((path[0] || '') == '/' ? path : '/' + path);
            return url.replace(/\/\//g,'/');
        }
    };

    $.extend(App, global);

    return App;
});