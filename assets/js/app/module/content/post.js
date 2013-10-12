define([ '$', 'select2'], function($) {

    var QuickPost = function($el, $option) {

        $el.find('.default-hide').removeClass('hidden');

        $('select[name="idea[tags][]"]', $el).removeClass('hidden').select2({
            allowClear: true,
            placeholder: 'friend',
            maximumSelectionSize: 3
        });
        $('.body-editor', $el).css('minHeight', '89px');

        $el.autosubmit()
            .on('autosubmit.beforesend', function(e) {
                $(this).find('button[type="submit"]', $el).attr('disabled', true);
            })
            .on('autosubmit.validate', function(e) {
                var body = $(".body-editor", $el);
                if ($.trim(body.html()) == '') {
                    body.focus();
                    e.preventDefault();
                }
            })
            .on('autosubmit.initdata', function(e) {
                $('input[name="idea[content]"]', $el).val($('.body-editor', $el).html());
            })
            .on('autosubmit.success', function(e, res){
            })
            .on('autosubmit.failure', function(e, res, code){

            })
            .on('autosubmit.complete', function(e){
                $('input[name="idea[title]"]', $el).val('');
                $('.body-editor', $el).html('');
                $('select[name="idea[tags][]"]', $el).select2("val", "");
                $(this).find('button[type="submit"]', $el).attr('disabled', false);
            });
    };

    // Data API
    $.fn.extend({
        quickpost: function(option) {
            return this.each(function() {
                var $this = $(this),
                    data = $this.data('quickpost'),
                    options = typeof option == 'object' && option;

                // Setup
                if (!data) {
                    $this.data('quickpost', (data = new QuickPost($this, options)));
                }

                // Method invokation
                if ($.type(option) === 'string') {
                    data[option]();
                }
            });
        }
    });

    $(document).on('focus.quickpost.data-api', '[data-provide="quickpost"]', function(e) {
        var $this = $(this);
        if ($this.data('quickpost')) { return; }
        $this.quickpost($this.data());
    });
});
