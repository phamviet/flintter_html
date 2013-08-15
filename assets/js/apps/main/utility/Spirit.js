define([
    '$',
    'bootstrap',
    'jquery/jquery.mCustomScrollbar.min',
    'jquery/jquery.mousewheel.min'
], function($) {
    var Spirit;
    Spirit = {
        initialize: function() {

            this.global();
        },

        global: function() {
            $('.navi a').tooltip({
                placement: 'right'
            });

            $('.post-foot ul li a').click(function(){
                $('.post-foot ul li').removeClass("current");
                $(this).closest("li").addClass("current");
                var key = $(this).attr("rel");
                var sprTab = '.post-' + key;
                $(".post-tab").removeClass("active");
                $(sprTab).addClass("active");
                if (key != 'tags')
                {
                    $('.post').removeClass("active-tags");
                } else {
                    $('.post').addClass("active-tags");
                }
            });
            $('.ulti .tags-list .list ul').mCustomScrollbar();
        },

        /**
         *  Code related to homepage
         */
        homepage: function() {

        }
    };

    return Spirit;
});