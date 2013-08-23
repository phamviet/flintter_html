(function() {
    var app = window.app || {deps: [], init: function(){}};
    var requirejsBaseUrl = window.requirejsBaseUrl || '../assets/js/vendor';

    require.config({
        baseUrl: requirejsBaseUrl,
        waitSeconds: 30,
        paths: {
            '$': 'jquery/jquery-1.9.1.min',
            tinyMCE: '//tinymce.cachefly.net/4.0/tinymce.min',
            underscore: 'underscore/underscore-min',
            backbone: 'backbone/backbone-min',
            bootstrap: 'bootstrap/bootstrap.min',
            text : 'requirejs/plugins/text',
            async : 'requirejs/plugins/async',
            facebook: '//connect.facebook.net/en_US/all',
            Spirit: '../apps/main/utility/Spirit',
            App: '../apps/main/app'
        },
        shim: {
            '$': { exports: '$' },
            underscore: {
                exports: '_'
            },
            backbone: {
                deps: ["underscore", "$"],
                exports: "Backbone"
            },
            'facebook' : {
                export: 'FB'
            },
            'bootstrap': {
                deps: ['$']
            },
            'jquery/jquery.mCustomScrollbar.min': { deps: ["$"] },
            'jquery/jquery.mousewheel.min': { deps: ["$"] }
        },
        urlArgs: "_=" +  window.SITE.VERSION || 'nocache'
    });

    // IMPORTANT!
    // Do not merge following .config() call with the one above - it will cause js build fail, because we rely on runtime
    // variables here, which are not available during build step. When parsing this file requirejs takes in account
    // only first .config() call, so contents of following call are ignored and must be duplicated in build.js
    // See https://github.com/jrburke/r.js/issues/270
    requirejs.config({
        paths: {
            Application: '../apps/main/application',
            binding: '../apps/main/application/binding'
            // Application path prefixes/modules (relative to baseUrl):
            // note: when adding to this hash - also add the same entry to build.js
        }
    });

    // Setup and run:
    require(['$', 'App'], function($, MainApp) {
        if (app.beforeInit) {
            app.beforeInit($);
        }

        MainApp.initialize();
        require(app.deps, app.init);
    });
})();
