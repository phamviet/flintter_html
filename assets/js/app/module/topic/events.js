define([ '$', 'bootstrap-modal'], function($) {

    return {
        newTopic: function($el) {
            var $modal = $('#ajax-modal');

            $('body').modalmanager('loading');

            $modal.load(SITE.url('static/new-topic'), '', function(){
                $modal.modal({'focusOn': '#form_name', keyboard: false});
                $('body').modalmanager('removeLoading');

                $('#frmNewTopic')
                    .on('autosubmit.success', function(e, res){
                        $modal.modal('hide');
                    })
                    .on('autosubmit.failure', function(e, res, code){

                    })
                    .on('autosubmit.complete', function(e){
                        $('#form_name').val('');
                        $('#form_description').val('');
                    });

            });
        }
    };

});
