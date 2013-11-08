define([
    '$',
    'Spirit',
    'Application/components/overlay'
], function($, Spirit){
    var App;
    var global = window.SITE || {
        FACEBOOK_APP_ID: '',
        FACEBOOK_SCOPE: '',
        BASE_URL: '',
        BASE_PATH: '',
        ENV : 'dev',
        VERSION: '123456'
    };

    function _raiseEvent(e) {
        var el = $(this);
        if (!el.prop('disabled')) {

            var params = {},
                attribs = $.grep($(el[0].attributes), (function(el, index) {
                    return /^data-param/.test(el.name);
                }));

            for (var i = 0; i < attribs.length; i++) {
                params[attribs[i].name.replace('data-param-', '')] = attribs[i].value;
            }

            el.trigger(el.data('event'), [e, params]);
        } else {
            e.preventDefault();
        }
    }

    App = {
        initialize: function() {

            Spirit.initialize();

            //raise event
            $(document).on('click', '[data-event]', _raiseEvent);
        },

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