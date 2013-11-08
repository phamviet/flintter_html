define(['$', 'bootstrap'], function($) {
    /**
     * @summary
     * Full-screen overlay with scrolling capability.
     * Extends [bootstrap modal](http://twitter.github.io/bootstrap/javascript.html#modals).
     *
     * @usage
     * All options, events and methods are the same as in
     * [bootstrap modal](http://twitter.github.io/bootstrap/javascript.html#modals).
     *
     * But there are also notable differences:
     *
     *  - jQuery plugin name is `.overlay()`
     *  - Options `keyboard` and `backdrop` are disabled by default
     *  - New option `focus` - selector of element being focused on open (Default: __input[type=text]:first__)
     */
    var Overlay = function(element, options) {
        this.options = options;
        this.$element = $(element);

        var self = this;
        this.$element = $(element)
            .delegate('[data-dismiss="overlay"]', 'click.dismiss.overlay', $.proxy(this.hide, this));

        this.$element.on('shown.overlay', function(e) {
            if (e.target !== self.$element.get(0)) {
                return ;
            }
            $('body').addClass('overlay-open');

            if (options.focus) {
                self.$element.find(options.focus).focus();
            }
        });
        this.$element.on('hidden.overlay', function(e) {
            if (e.target !== self.$element.get(0)) {
                return ;
            }
            $('body').removeClass('overlay-open');
        });

        this.options.remote && this.$element.find('.modal-body').load(this.options.remote, function(){
            self.$element.css({
                width:'auto',
                height:'auto',
                'max-height':'100%',
                'left': '50%',
                'margin-left': ((self.$element.outerWidth() / 2) * -1) + 'px'
            });
        })
        console.log(self.$element.outerWidth());
    };

    function inherits(Child, Parent) {
        var F = function() { };
        F.prototype = Parent.prototype;
        Child.prototype = new F();
        Child.prototype.constructor = Child;
        Child.SUPER = Parent.prototype;
    }

    // Inherit from bootstrap modal
    inherits(Overlay, $.fn.modal.Constructor);

    Overlay.prototype.enforceFocus = function() {
        // Enforcing focus causes lots of bugs in IE9-: with flash, with multiple modals or in case of overlay+modal combo
        // (it simply falls into endless recursion), so disable it at all.
        // See https://github.com/twitter/bootstrap/issues/5114 and many other issues
        // (search for "enforceFocus" in bootstrap issue tracker)
        // FIXME: maybe it's worth to remove enforceFocus for bootstrap modal as well.
    };

    // jQuery plugin
    $.fn.overlay = function (option) {
        var args = arguments;
        return this.each(function () {
            var $this = $(this),
                data = $this.data('overlay'),
                options = $.extend({}, $.fn.overlay.defaults, $this.data(), typeof option == 'object' && option);

            if (!data) {
                $this.data('overlay', (data = new Overlay(this, options)));
            }

            if (typeof option == 'string') {
                data[option].apply(data, Array.prototype.slice.call(args, 1));
            }
            else if (options.show) {
                data.show();
            }
        });
    };

    $.fn.overlay.defaults = {
        focus: 'input[type="text"]:first',
        backdrop: true,
        keyboard: true,
        show: true
    };

    // Data API
    $(document).on('click.overlay.data-api', '[data-toggle="overlay"]', function (e) {
        var $this = $(this),
            $target = $($this.attr('data-target') || $this.attr('href')),
            option = $target.data('overlay') ? 'toggle' : $.extend({}, $target.data(), $this.data());

        e.preventDefault();
        $target.overlay(option);
    });

    return Overlay;
});
