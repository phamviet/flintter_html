define([
    '$',
    'bootstrap',
    'jquery/jquery.mCustomScrollbar.min',
    'jquery/jquery.mousewheel.min',
	'jquery/select2.min'
], function($) {
    var Spirit;
    Spirit = {
        initialize: function() {

            this.global();
        },

        /**
         *  Code apply to all pages
         */
        global: function() {
            $('.navi a').tooltip({
                placement: 'right'
            });

//            $('.post-foot ul li a').click(function(){
//                $('.post-foot ul li').removeClass("current");
//                $(this).closest("li").addClass("current");
//                var key = $(this).attr("rel");
//                var sprTab = '.post-' + key;
//                $(".post-tab").removeClass("active");
//                $(sprTab).addClass("active");
//                if (key != 'tags')
//                {
//                    $('.post').removeClass("active-tags");
//                } else {
//                    $('.post').addClass("active-tags");
//                }
//            });
            $('.tags-list .list ul').mCustomScrollbar();
			$('.sub-menu a').click(function(){
				$('.sub-menu li').removeClass("current");
				$(this).closest("li").addClass("current");
				var activeClass = $(this).attr("rel");
				$('.filter-block').removeClass("active");
				$(activeClass).addClass("active");
			});
			$('.modal').on('hidden', function () {
			  $(this).removeData('modal');
			});
			$('select').select2({
				allowClear: true,
				placeholder: true
			});
        },

        /**
         *  Code related to homepage
         */
        homepage: function() {

        }
    };

    return Spirit;
});