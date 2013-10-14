// r.js -o build.js paths.facebook=empty:

var app = window.app || {deps: [], init: function(){}};
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

(function() {
    require.config({
        waitSeconds: 45,
        paths: {
            '$': '../vendor/jquery/jquery.min',
//            tinymce: '//tinymce.cachefly.net/4.0/tinymce.min',
            underscore: '../vendor/underscore-amd/underscore-min',
            backbone: '../vendor/backbone-amd/backbone-min',
            bootstrap: "../vendor/bootstrap/docs/assets/js/bootstrap.min",
            'bootstrap-modal': "../vendor/bootstrap-modal/js/bootstrap-modal",
            'bootstrap-modalmanager': "../vendor/bootstrap-modal/js/bootstrap-modalmanager",
            select2: "../vendor/select2/select2.min",
            plupload: "../vendor/plupload/js/plupload.full.min",
            'rangy/rangy-core': "../vendor/rangy/rangy-core",
//            text : 'requirejs/plugins/text',
//            async : 'requirejs/plugins/async',
            facebook: '//connect.facebook.net/en_US/all',
            Spirit: 'utility/Spirit'
        },
        shim: {
            '$': { exports: '$' },
            'plupload': { exports: 'plupload' },
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
            'select2': { deps: ["$"] },
            'bootstrap-modalmanager': { deps: ["$"] },
            'bootstrap-modal': { deps: ["bootstrap-modalmanager"] },
            'jquery/jquery.slimscroll.min': { deps: ["$"] },
            'jquery/jquery.mousewheel.min': { deps: ["$"] },
            'rangy/rangy-core': {exports: 'rangy'}
        }
    });

    require(['$', 'app'].concat(SITE.deps), function($) {

    });
})();




