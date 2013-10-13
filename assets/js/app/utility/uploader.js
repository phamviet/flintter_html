define([
    'plupload'
], function(plupload) {


    var uploader = new plupload.Uploader({
        runtimes : 'gears,html5,flash,silverlight,browserplus',
        browse_button : 'pickfiles',
        max_file_size : '10mb',
//        resize : {width : 320, height : 240, quality : 90},
        url : SITE.url('upload'),
        flash_swf_url : '/public/assets/js/vendor/plupload/js/Moxie.swf',
        silverlight_xap_url : '/public/assets/js/vendor/plupload/js/Moxie.xap',
        filters : [
            {title : "Image files", extensions : "jpg,gif,png"}
        ]
    });

    uploader.init();
    uploader.bind('FilesAdded', function(up, files) {
        up.refresh(); // Reposition Flash/Silverlight
        uploader.start();
    });

    uploader.bind('UploadProgress', function(up, file) {
        console.log('[Upload in progress]');
//        $('#' + file.id + " b").html(file.percent + "%");
    });

    uploader.bind('Error', function(up, err) {
        /*$('#filelist').append("<div>Error: " + err.code +
            ", Message: " + err.message +
            (err.file ? ", File: " + err.file.name : "") +
            "</div>"
        );*/
        console.log('[Upload error]');
        console.log(err);
        up.refresh(); // Reposition Flash/Silverlight
    });

    uploader.bind('FileUploaded', function(up, file, response) {
        var res = $.parseJSON(response.response);

        $('.upload-image').attr('src', res.result.url);
        console.log(res);
        console.log(file);
//        $('#' + file.id + " b").html("100%");
    });

    return plupload;
});
