define([
    '$',
    'bootstrap',
    'jquery/jquery.mCustomScrollbar.min',
    'jquery/jquery.mousewheel.min',
	'jquery/colorbox-min'
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
			$('.sub-menu a').click(function(){
				$('.sub-menu li').removeClass("current");
				$(this).closest("li").addClass("current");
				var activeClass = $(this).attr("rel");
				$('.filter-block').removeClass("active");
				$(activeClass).addClass("active");
			});

            $('#myModal').on('show', function () {
                $(this).css({
                    width:'auto',
                    height:'auto',
                    'max-height':'100%',
                    'left': '50%'
//                    'margin-left': (($(this).data('width') / 2) * -1) + 'px'
                });
            })
                .on('hidden', function () {
                    $(this).removeData('modal');
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
function sprNewpost(cls){
				var $popCls = $(cls);
				$.colorbox({
					inline: true,
					href: $popCls
				});
}
function sprPopClose(){
	$.colorbox.close();
}


