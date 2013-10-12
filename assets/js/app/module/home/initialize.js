define(['$', 'application/bootstrap'], function($) {

    $('select#idea_tags').removeClass('hidden').select2({
        allowClear: true,
        placeholder: 'friend',
        maximumSelectionSize: 3
    });

    $('#frmPost')
        .on('autosubmit.beforesend', function(e) {
            $(this).find('button[type="submit"]').attr('disabled', true);
        })
        .on('autosubmit.validate', function(e) {
            var content = $('#idea_content_body');
            if ($.trim(content.html()) == '') {
                content.focus();
                e.preventDefault();
            }
        })
        .on('autosubmit.initdata', function(e) {
            $('#idea_content').val($('#idea_content_body').html());
        })
        .on('autosubmit.success', function(e, res){
//            $('.sign-in-error').makeAlert(res);
        })
        .on('autosubmit.failure', function(e, res, code){

        })
        .on('autosubmit.complete', function(e){
            $('#idea_title').val('');
            $('#idea_content_body').html('');
            $('select#idea_tags').select2("val", "");
            $(this).find('button[type="submit"]').attr('disabled', false);
        });


    return {};
});