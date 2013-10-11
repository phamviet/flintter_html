(function() {
    var app = window.app || {deps: [], init: function(){}};
//    var requirejsBaseUrl = window.requirejsBaseUrl || '../assets/js/vendor';

    var SITE = window.SITE || {
        FACEBOOK_APP_ID: '',
        FACEBOOK_SCOPE: '',
        BASE_URL: '',
        BASE_PATH: '',
        ENV : '',
        VERSION: '',
        deps: [],
        beforeInit: function(){}
    };

    require.config({
//        baseUrl: requirejsBaseUrl,
        waitSeconds: 30,
        paths: {
            '$': '../vendor/jquery/jquery.min',
//            'jquery.ui.widget': 'jquery/jquery.ui.widget',
//            tinyMCE: '//tinymce.cachefly.net/4.0/tinymce.min',
            underscore: '../vendor/underscore-amd/underscore-min',
            backbone: '../vendor/backbone-amd/backbone-min',
            bootstrap: "../vendor/bootstrap/docs/assets/js/bootstrap.min",
            'bootstrap-modal': "../vendor/bootstrap-modal/js/bootstrap-modal",
            'bootstrap-modalmanager': "../vendor/bootstrap-modal/js/bootstrap-modalmanager",
            select2: "../vendor/select2/select2.min",
            'rangy/rangy-core': "../vendor/rangy/rangy-core",
//            text : 'requirejs/plugins/text',
//            async : 'requirejs/plugins/async',
            facebook: '//connect.facebook.net/en_US/all',
            Spirit: 'utility/Spirit'
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
                exports: 'FB'
            },
            'bootstrap': {
                deps: ['$']
            },
            'bootstrap-modalmanager': { deps: ["$"] },
            'bootstrap-modal': { deps: ["bootstrap-modalmanager"] },
            'jquery/jquery.slimscroll.min': { deps: ["$"] },
            'jquery/jquery.mousewheel.min': { deps: ["$"] },
//            'jquery/jquery.fileupload': {deps: ["$", "jquery.ui.widget"]},
            'rangy/rangy-core': {exports: 'rangy'}
        },
        urlArgs: "_=" +  SITE.VERSION || 'nocache'
    });

    // IMPORTANT!
    // Do not merge following .config() call with the one above - it will cause js build fail, because we rely on runtime
    // variables here, which are not available during build step. When parsing this file requirejs takes in account
    // only first .config() call, so contents of following call are ignored and must be duplicated in build.js
    // See https://github.com/jrburke/r.js/issues/270
    requirejs.config({
        paths: {
//            vendor: '../vendor/'
            // Application path prefixes/modules (relative to baseUrl):
            // note: when adding to this hash - also add the same entry to build.js
        }
    });

    require(['$', 'app', 'components/autosubmit'].concat(SITE.deps), function($, MainApp) {
//        if (app.beforeInit) {
//            app.beforeInit($);
//        }

//        MainApp.initialize();
//        require(app.deps, app.init);
    });
})();
