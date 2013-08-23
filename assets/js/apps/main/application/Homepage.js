define([
    '$',
    'App',
    'binding/Editor'
], function($, App, Editor) {
    var editor = new Editor();

    var Homepage = function() {

    };

    Homepage.prototype.initialize = function() {
        editor.initialize();
    };

    return Homepage;
});