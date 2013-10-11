define(['$', '../../../', 'components/facebooksdk'], function($) {

    //login
    var $formLogin = $('#frmLogin');
    var $formRegistration = $('#frmRegistration');

    $formLogin
        .on('autosubmit.beforesend', function(e) {
            $(this).find('button[type="submit"]').attr('disabled', true);
        })
        .on('autosubmit.validate', function(e) {
            if ($.trim($('#username', $(this)).val()) == '' || $.trim($('#password', $(this)).val()) == '') {
                $('.sign-in-error').makeAlert({message: 'Username or Password could not empty'});
                e.preventDefault();
            }
        })
        .on('autosubmit.success', function(e, res){
            $('.sign-in-error').makeAlert(res);
        })
        .on('autosubmit.failure', function(e, res, code){
            $('.sign-in-error').makeAlert(res);
            $('#password', $(this)).val('')
        })
        .on('autosubmit.complete', function(e){
            $(this).find('button[type="submit"]').attr('disabled', false);
        });


    $formRegistration
        .on('autosubmit.beforesend', function(e) {
            $(this).find('button[type="submit"]').attr('disabled', true);
        })
        .on('autosubmit.validate', function(e) {

        })
        .on('autosubmit.success', function(e, data){
            alert(data.message);
        })
        .on('autosubmit.failure', function(e, data, code){
            alert(data.errors.join('\n'));
        })
        .on('autosubmit.complete', function(e){
            $(this).find('button[type="submit"]').attr('disabled', false);
        });

    return {};
});