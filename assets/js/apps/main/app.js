define([
    'jquery'
], function($){
    var App, SITE;

    if (window.SITE) {
        SITE = window.SITE;
    }

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

    return App;
});