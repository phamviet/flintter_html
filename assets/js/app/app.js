define([
    '$',
    "bootstrap",
    "bootstrap-modalmanager",
    "bootstrap-modal",
    "underscore",
    "jquery/jquery.slimscroll.min",
    'jquery/jquery.mousewheel.min',
    'select2',
    'components/autosubmit',
    'components/make-alert',
    "Spirit"
], function($){

    $.fn.modalmanager.defaults.resize = true;
    $(document).on('click', '[data-event]', _raiseEvent);

    if(!$('#ajax-modal').length) {
        $('<div id="ajax-modal" class="modal hide fade" tabindex="-1"></div>').appendTo('body');
    }

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
        }

        e.preventDefault();
    }

    return {};
});