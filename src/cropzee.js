// gather all cropzee dependencies and append on webpage
var dependencies =
    '<!-- light-modal -->'
    + '<link href="https://cdn.jsdelivr.net/gh/hunzaboy/Light-Modal@latest/dist/css/light-modal.css" rel="stylesheet">'
    + '<!-- animate.css -->'
    + '<link href="https://cdn.jsdelivr.net/gh/daneden/animate.css@latest/animate.css" rel="stylesheet">'
    + '<!-- canvas-toBlob.js -->'
    + '<script src="https://cdn.jsdelivr.net/gh/eligrey/canvas-toBlob.js@latest/canvas-toBlob.js" defer></script>'
    + '<!-- FileSaver.js -->'
    + '<script src="https://cdn.jsdelivr.net/gh/eligrey/FileSaver.js@latest/dist/FileSaver.js" defer></script>'
    + '<!-- Croppr.js -->'
    + '<link href="https://cdn.jsdelivr.net/gh/jamesssooi/Croppr.js@latest/dist/croppr.css" rel="stylesheet">'
    + '<script src="https://cdn.jsdelivr.net/gh/jamesssooi/Croppr.js@latest/dist/croppr.js"></script>';
$("body").after(dependencies);
// used jQuery.fn.extend() method to provide new methods that can be chained to the jQuery() function
// in our case - $(element).cropzee()
jQuery.fn.extend({
  cropzee: function (options = {
        // croppr.js options
        // see https://jamesooi.design/Croppr.js/
        aspectRatio: null,
        maxSize: null,
        minSize: null,
        startSize: [100, 100, '%'],
        onCropStart: null,
        onCropMove: null,
        onCropEnd: null,
        onInitialize: null,
        // lightmodal options
        // see https://hunzaboy.github.io/Light-Modal/#
        modalAnimation: '',
        // cropzee options
        allowedInputs: ['gif','png','jpg','jpeg'], // input extensions supported
        imageExtension: 'image/jpeg', // cropped image/blob file-type 'image/jpeg' | 'image/png' | any other supported by browser
        returnImageMode: 'data-url', // image data mode, 'blob' for blob object or 'data-url' for dataURL
    }) {
        if (options.aspectRatio <= 0) {
            options.aspectRatio = null;
        }
        if (!options.allowedInputs) {
            options.allowedInputs = ['gif','png','jpg','jpeg'];
        }
        if (!options.imageExtension) {
            options.imageExtension = 'image/jpeg';
        }
        if (!options.returnImageMode) {
            options.returnImageMode = 'data-url';
        }
        // function to reset input (value) of input, taking in input id
        // resets input value of cropzee input type=file so that same file can be selected twice
        function resetFileInput(id) {
            $('#' + id).val(null);
        }
        // function to get the cropped/selected image-data as blob or dataURL
        // it takes in the input id to return data for specific input
        // it returns dataURL or blob
        window.cropzeeGetImage = function(id) {
            return cropzeeReturnImage[id];
        }
        // function to rotate image in modal, taking in input id
        // it disables croppr, creates a new image object after rotating the canvas then initializes croppr again
        window.cropzeeRotateImage = function(id) {
            // using hidden canvas and modal image
            cropzeeCroppr.destroy();
            setTimeout(function(){
                var canvas = document.getElementById('cropzee-hidden-canvas');
                var ctx = canvas.getContext('2d');
                // get current image data
                var urlData = canvas.toDataURL();
                // create image object to draw in canvas
                var img = new Image();
                img.src = urlData;
                // save context
                ctx.save();
                // translate so rotation happens at center of image
                ctx.translate(cropzeeCanvasWidth * 0.5, cropzeeCanvasHeight * 0.5);
                // rotate canvas context
                ctx.rotate(1.5708);
                // translate back so next draw happens in upper left corner
                ctx.translate(-cropzeeCanvasWidth * 0.5, -cropzeeCanvasHeight * 0.5);
                // image will now be drawn rotated
                ctx.drawImage(img, 0, 0);
                // restore context
                ctx.restore();
                // settimeout to allow time between destroying and initializing croppr
                setTimeout(function(){
                    // get new image data and set it into created image
                    urlData = canvas.toDataURL();
                    img.src = urlData;
                    // let imageElement = '<img id="cropzee-modal-image" src="' + urlData + '">';
                    // $('div.light-modal-body').append(imageElement);
                    // change modal image data
                    $('#cropzee-modal-image').attr('src', urlData);
                    // initialize croppr.js on modal-image again, with all the specified options
                    cropzeeCroppr = new Croppr('#cropzee-modal-image', {
                        aspectRatio: options.aspectRatio,
                        maxSize: options.maxSize,
                        minSize: options.minSize,
                        startSize: options.startSize,
                        onCropStart: options.onCropStart,
                        onCropMove: options.onCropMove,
                        onCropEnd: options.onCropEnd,
                        onInitialize: options.onInitialize,
                        onCropMove: options.onCropMove,
                    });
                }, 50);
            }, 50);
        }
        // function to crop the modal-image and display it on the hidden canvas and other dynamic canvases (previewers)
        window.cropzeeCreateImage = function(id) {
            // get croppr.js dimensions
            var dimensions = cropzeeCroppr.getValue();
            // get hidden canvas and draw cropped image onto it
            var canvas = document.getElementById('cropzee-hidden-canvas');
            var ctx = canvas.getContext('2d');
            ctx.canvas.width = dimensions.width;
            ctx.canvas.height = dimensions.height;
            var img = document.getElementsByClassName('croppr-image')[0];
            ctx.drawImage(img, dimensions.x, dimensions.y, dimensions.width, dimensions.height, 0, 0, dimensions.width, dimensions.height);
            // draw on previewers
            for (let i = 0; i < cropzeePreviewersLength; i++) {
                cropzeePreviewCanvasContext[i].canvas.width = dimensions.width;
                cropzeePreviewCanvasContext[i].canvas.height = dimensions.height;
                cropzeePreviewCanvasContext[i].drawImage(img, dimensions.x, dimensions.y, dimensions.width, dimensions.height, 0, 0, dimensions.width, dimensions.height);
            }
            // store image data as blob or dataURL for retrieval
            if (options.returnImageMode == 'blob') {
                canvas.toBlob(function(blob){
                    window.cropzeeReturnImage = [];
                    cropzeeReturnImage[id] = blob;
                }, options.imageExtension);
            } else {
                window.cropzeeReturnImage = [];
                cropzeeReturnImage[id] = canvas.toDataURL(options.imageExtension);
            }
            // cropping finished, close modal
            closeModal();
        }
        // function to initialize croppr.js on the image inside modal
        // returnMode option is not supported in cropzee
        // see https://jamesooi.design/Croppr.js/
        function cropzeeTriggerCroppr() {
            window.cropzeeCroppr = new Croppr('#cropzee-modal-image', {
                aspectRatio: options.aspectRatio,
                maxSize: options.maxSize,
                minSize: options.minSize,
                startSize: options.startSize,
                onCropStart: options.onCropStart,
                onCropMove: options.onCropMove,
                onCropEnd: options.onCropEnd,
                onInitialize: options.onInitialize,
                onCropMove: options.onCropMove,
            });
        }
        // function to trigger modal and pass image data to display in the modal
        // function takes in input id and image (to be cropped) data
        function cropzeeTriggerModal(id, src) {
            // take in animation option and add 'animated' before it
            var animation = options.modalAnimation;
            if (animation) {
                if (animation.indexOf('animated') == -1) {
                    animation = 'animated ' + animation;
                }
            }
            // modal element with dynamic image data, dynamic animation class as supported by animate.css and dynamic input id
            // lightmodal see https://hunzaboy.github.io/Light-Modal/#
            var lightmodalHTML =
            '<div class="light-modal" id="cropzee-modal" role="dialog" aria-labelledby="light-modal-label" aria-hidden="false" data-lightmodal="close">'
                + '<div class="light-modal-content ' + animation + '">'
                    + '<!-- light modal header -->'
                    + '<!-- <div class="light-modal-header">'
                        + '<h3 class="light-modal-heading">Cropzee</h3>'
                        + '<a href="#" class="light-modal-close-icon" aria-label="close">&times;</a>'
                    + '</div> -->'
                    + '<!-- light modal body -->'
                    + '<div class="light-modal-body" style="max-height: 500px;">'
                        + '<img id="cropzee-modal-image" src="' + src + '">'
                    + '</div>'
                    + '<!-- light modal footer -->'
                    + '<div class="light-modal-footer" style="justify-content: space-between;">'
                        + '<div onclick="closeModal()" class="light-modal-close-btn" style="cursor: pointer;" aria-label="close">Cancel</div>'
                        + '<div onclick="cropzeeRotateImage(`' + id + '`);" class="light-modal-close-btn" style="cursor: pointer;">Rotate 90deg</div>'
                        + '<div onclick="cropzeeCreateImage(`' + id + '`);" class="light-modal-close-btn" style="cursor: pointer;">Done</div>'
                    + '</div>'
                + '</div>'
                + '<canvas style="position: absolute; top: -99999px; left: -99999px;" id="cropzee-hidden-canvas"></canvas>'
                + '<a style="display:none;" id="cropzee-link"></a>'
            + '</div>';
            // modal element is appended to body
            $("body").append(lightmodalHTML);
            // after which the inserted image is drawn onto the hidden canvas within the modal
            setTimeout(function(){
                var canvas = document.getElementById('cropzee-hidden-canvas');
                var ctx = canvas.getContext('2d');
                ctx.canvas.width = cropzeeCanvasWidth;
                ctx.canvas.height = cropzeeCanvasHeight;
                var img = new Image();
                img.src = src;
                ctx.drawImage(img, 0, 0, cropzeeCanvasWidth, cropzeeCanvasHeight);
                setTimeout(function(){
                    // the css-only modal is called via href see https://hunzaboy.github.io/Light-Modal/#
                    window.location = window.location.pathname + "#cropzee-modal";
                    // function to trigger croppr.js on picture in modal
                    cropzeeTriggerCroppr();
                }, 50);
            }, 50);
        }
        // function to capture input and insert it into various elements for previewing and display
        // function takes in input object and its id
        function cropzeeReadURL(input, id) {
            if (input.files && input.files[0]) {
                var reader = new FileReader();
                // images are drawn on all created canvases from previewers
                reader.onload = function (e) {
                    window.cropzeePreviewersLength = $('[data-cropzee="' + id + '"]').length;
                    window.cropzeePreviewCanvas = [];
                    window.cropzeePreviewCanvasContext = [];
                    if (cropzeePreviewersLength) {
                        for (let i = 0; i < cropzeePreviewersLength; i++) {
                            cropzeePreviewCanvas[i] = $('[data-cropzee="' + id + '"]')[i];
                            cropzeePreviewCanvasContext[i] = cropzeePreviewCanvas[i].getContext('2d');
                            cropzeePreviewCanvasContext[i].canvas.width = $(cropzeePreviewCanvas[i]).width() || 300;
                            window.cropzeeCanvasWidth = $(cropzeePreviewCanvas[i]).width() || 300;
                            cropzeePreviewCanvasContext[i].canvas.height = $(cropzeePreviewCanvas[i]).height() || 300;
                            window.cropzeeCanvasHeight = $(cropzeePreviewCanvas[i]).height() || 300;
                            var img = new Image();
                            img.onload = function(){
                                cropzeePreviewCanvasContext[i].drawImage(img, 0, 0, cropzeeCanvasWidth, cropzeeCanvasHeight);
                            };
                            img.src = e.target.result;
                        }
                    }
                    // modal is triggered and image data is passed to display in the modal, where it is to be cropped
                    // function takes in input id and image (to be cropped) data
                    cropzeeTriggerModal(id, e.target.result);
                }
                reader.readAsDataURL(input.files[0]);
            }
        }
        // function to close modal when user clicks outside modal
        $(document).click(function (e) {
            if ($(e.target).is('#cropzee-modal')) {
                closeModal();
            }
        });
        // function that is called first, when input is triggered
        // it resets input value to enable the reloading of the same image just in case
        $(this).click(function(){
            var cropzeeInputId = $(this).attr('id');
            resetFileInput(cropzeeInputId);
            // when image is selected, the image-previewers are transformed to canvases
            // then the input data is passed to be read for previewing
            $(this).one("change", function(){
                var ext = $('#' + cropzeeInputId).val().split('.').pop().toLowerCase();
                if($.inArray(ext, options.allowedInputs) == -1) {
                    alert('invalid extension! Please check your input file and try again.');
                    resetFileInput(cropzeeInputId);
                } else {
                    var previewerId = $('[data-cropzee="' + cropzeeInputId + '"]').attr("id");
                    var previewerClass = $('[data-cropzee="' + cropzeeInputId + '"]').attr("class");
                    $('[data-cropzee="' + cropzeeInputId + '"]').replaceWith('<canvas id="' + previewerId + '" class="' + previewerClass + '" data-cropzee="' + cropzeeInputId + '"></canvas>');
                    // input data is passed to be read for previewing
                    // function takes in input object and its id
                    cropzeeReadURL(this, cropzeeInputId);
                }
            });
        });
    }
});
// function to close modal
function closeModal() {
    $('#cropzee-modal').remove();
    window.location = window.location.pathname + '#';
}