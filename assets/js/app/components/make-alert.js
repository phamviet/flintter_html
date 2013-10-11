define(['$'], function($) {
    $.fn.extend({
        makeAlert: function(option) {
            var defaults = { message: ''};
            $.extend(true, defaults, option);

            return this.each(function() {
                var $this = $(this);
                $('.alert', $this).alert('close');
                $('<div class="alert" />')
                    .append('<button type="button" class="close" data-dismiss="alert">&times;</button>' + option.message)
                    .appendTo($this);
            });
        }
    });
});