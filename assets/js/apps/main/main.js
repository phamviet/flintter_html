require.config({
    paths: {
        jquery: '../../libs/jquery/jquery-1.9.1.min',
        tinyMCE: '//tinymce.cachefly.net/4.0/tinymce.min',
        underscore: '../../libs/underscore/underscore-min',
        backbone: '../../libs/backbone/backbone-min',
        bootstrap: '../../libs/bootstrap/bootstrap.min',
        text : '../../libs/require/plugins/text',
        'facebook': '//connect.facebook.net/en_US/all',
        'spirit': 'utility/Spirit',
        'App': 'app'
    },
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: ["underscore", "jquery"],
            exports: "Backbone"
        },
        'facebook' : {
            export: 'FB'
        },
        'bootstrap': {
            deps: ['jquery']
        },
        'App': {
            deps: ['spirit']
        }
    }
//    urlArgs: "_=" +  (new Date()).getTime()
});

/*
require(['app'], function(App) {

    App.initialize();
});*/
