# Cropzee | Image Cropper
Load the following supporting libraries on page.

```
    <!-- cropzee CSS bundle -->
    <link rel="stylesheet" href="assets/css/ripple.css">
    <link rel="stylesheet" href="assets/css/normalize.css">
    <link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
    <link rel="stylesheet" href="assets/css/cropzee.css">
    <!-- cropzee JS bundle -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
    <script src="assets/js/jquery.ui.touch-punch.min.js" defer></script>
    <script src="assets/js/ripple.js" defer></script>
    <script src="assets/js/cropzee.js" defer></script>
```

## HTML
Create file upload box with image preview container which will display final image preview.
```
 <div>
        <div id="" class="image-previewer" data-cropzee=""></div>
        <input id="cropzee-input" type="file" name="">
</div>
```

Create a modal window in which you can resize/rotate/crop the image.
```
    <!-- The Modal -->
    <div id="cropzee-modal-cover" class="cropzee-modal-cover">
    <!-- Modal content -->
        <div id="cropzee-modal" class="cropzee-modal">
            <div id="cropzee-close" class="cropzee-close">&times;</div>
            <div id="cropzee-modal-display-container" class="cropzee-modal-display-container">
                <div id="cropzee-modal-display" class="cropzee-modal-display"></div>
                <div id="cropzee-modal-cropper" class="cropzee-modal-cropper"></div>
                <div id="cropzee-modal-display2" class="cropzee-modal-display" style="clip: rect(46px, 205px, 205px, 46px);"></div>
                <div id="cropzee-cropper-outline" class="cropzee-cropper-outline" style="left:45px; top:45px; width: 160px; height: 160px;"></div>
            </div>
            <div class="cropzee-modal-buttons-container">
                <a id="cropzee-download-button" class="cropzee-modal-button" data-ripple="">
                        <img class="cropzee-svg" src="assets/icons/feather/download.svg">
                </a>
                <a id="cropzee-rotate-button" class="cropzee-modal-button" data-ripple="">
                    <!-- <svg class="feather">
                        <use xlink:href="assets/icons/feather/feather-sprite.svg#circle"/>
                    </svg> -->
                    <img class="cropzee-svg" src="assets/icons/feather/rotate-ccw.svg">
                </a>
                <a id="cropzee-crop-button" class="cropzee-modal-button" data-ripple="">
                    <img class="cropzee-svg" src="assets/icons/feather/crop.svg">
                </a>
                <a id="cropzee-save-button" class="cropzee-modal-button" data-ripple="">
                    <img class="cropzee-svg" src="assets/icons/feather/check-square.svg">
                </a>
            </div>
    </div>
```

Create canvas element to preview the cropped image in the modal.

```
<div class="cropzee-cropping-canvas-container">
            <canvas id="cropzee-cropping-canvas"></canvas>
</div>
```

## JS
Finally Initialize the image cropper by calling the function on the file input.

```javascript
$(function() {   
  cropzee("#cropzee-input");
});
```
See live demo and download source code.
