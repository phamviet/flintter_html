define(['$'], function($) {

    var namespace = 'ns:';

    function EventBus(o) {
        if (!o || !o.el) {
            $.error('EventBus initialized without el');
        }

        if(o.ns) {
            namespace = o.ns;
        }

        this.$el = $(o.el);
    }

    $.extend(EventBus.prototype, {
        // public methods
        // --------------

        trigger: function(type) {
            var args = [].slice.call(arguments, 1);

            this.$el.trigger(namespace + type, args);
        }
    });

    return EventBus;
});