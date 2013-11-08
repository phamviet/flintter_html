define([
    '$',
    'App'
], function($, App) {

    var Editor = function() {

    };

    Editor.prototype.initialize = function() {
        console.log('Editor has been loaded');

        $(document).on('event.test', function(e){
            alert('event triggered');
        });

    };

    return Editor;
});