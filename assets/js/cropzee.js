// get full height of window
// will be used to make sure that the modal container is atleast as tall as the height of the webpage
window.windowHeight = $(window).outerHeight();
// hide modal by default so that it will be opened by .show() when required
window.cropzeeModalCover = $('#cropzee-modal-cover');
$(cropzeeModalCover).hide();
// get hidden canvas by id, setup context and initialize hidden canvas image object
const cropzeeHiddenCanvas = document.getElementById('cropzee-hidden-canvas');
const cropzeeHiddenCanvasContext = cropzeeHiddenCanvas.getContext('2d');
window.cropzeeHiddenCanvasImageObject = new Image();
// make sure to put data-cropzee="" attribute to the input element that is next or previous (sibling) to the image-previewer
// the image-previewer is a <div> that will display the final output of the photo for the user's accord
window.cropzeeTargetDisplay = $('*[data-cropzee=""]');
// get display-picture container, its (inner) height and width
window.cropzeeDisplayContainer = document.getElementById('cropzee-modal-display-container');
window.cropzeeDisplayContainerHeight = $(cropzeeDisplayContainer).innerHeight();
window.cropzeeDisplayContainerWidth = $(cropzeeDisplayContainer).innerWidth();
// get the picture-display in the modal
window.cropzeeModalDisplay = $('.cropzee-modal-display');
// get the dashed outline in the picture-display
window.cropzeeOutline = document.getElementById('cropzee-cropper-outline');
// get left, top, right, bottom, x, y, width, height of cropzee-cropper-outline
window.cropzeeOutlineDimensions = cropzeeOutline.getBoundingClientRect();
// get position of cropzee-cropper-outline
window.cropzeeOutlinePosition = $(cropzeeOutline).position();
// list of cropper outline handles (holders for the user to use in resizing the cropping view)
// there are 8 handles in total representing points at the top, bottom, left, right, top-left, top-right, bottom-left and bottom-right
window.cropzeeOutlineHandles = 
	'<div class="cropzee-outline-handle ui-resizable-handle ui-resizable-nw" id="nw-outline-handle"></div>' +
	'<div class="cropzee-outline-handle ui-resizable-handle ui-resizable-ne" id="ne-outline-handle"></div>' +
	'<div class="cropzee-outline-handle ui-resizable-handle ui-resizable-sw" id="sw-outline-handle"></div>' +
	'<div class="cropzee-outline-handle ui-resizable-handle ui-resizable-se" id="se-outline-handle"></div>' +
	'<div class="cropzee-outline-handle ui-resizable-handle ui-resizable-n" id="n-outline-handle"></div>' +
	'<div class="cropzee-outline-handle ui-resizable-handle ui-resizable-s" id="s-outline-handle"></div>' +
	'<div class="cropzee-outline-handle ui-resizable-handle ui-resizable-e" id="e-outline-handle"></div>' +
	'<div class="cropzee-outline-handle ui-resizable-handle ui-resizable-w" id="w-outline-handle"></div>'
;
// get left, top, right, bottom, x, y, width, height of cropzee-modal-display-container
window.cropzeeDisplayContainerDimensions = cropzeeDisplayContainer.getBoundingClientRect();
// get the modal close button
window.cropzeeCloseButton = $('#cropzee-close');
// get the modal crop button
window.cropzeeCropButton = $('#cropzee-crop-button');
// get the modal rotate button
window.cropzeeRotateButton = $('#cropzee-rotate-button');
// get the modal save button
window.cropzeeSaveButton = $('#cropzee-save-button');
// get anchor <a> around download button which will be used in downloading cropped image
window.cropzeeDownloadButton = $("#cropzee-download-button");
// initialize cropzee by calling cropzee("#id"); with "#id" being the id of the input type=file that promps the user for the image
function cropzee(inputID) {
	$(inputID).click(function() {
		// reset input value to allow same file selection and manipulation
		resetFileInput(inputID);
		// take in input id, check for changes in user input which must be true since it is reset (above)
		cropzeeTakeInput(inputID);
	});
}
// function to reset input (value) of input
// resets input value of cropzee input type=file so that same file can be selected twice
function resetFileInput(inputID) {
  $(inputID).val(null);
}
// function that triggers other functions through file-input's onchange event
function cropzeeTakeInput(inputID) {
	$(inputID).change(function(event) {
		// display the selected image on the image previewer
		readURL(this, $(this).siblings(cropzeeTargetDisplay));
	});
}
// function to display the selected image on the image previewer
function readURL(input, targetDisplay) {
	if (input.files && input.files[0]) {
		var reader = new FileReader();

		reader.onload = function(e) {
		    $(input).siblings(cropzeeTargetDisplay).css("background-image", "url(" + e.target.result + ")");
			cropzeeOpenModal(e.target.result);
		}

        reader.readAsDataURL(input.files[0]);
    }
}
// function to draw image on hidden canvas when image is first selected (via input type=file). This canvas is used as a model to produce the final cropped image on another canvas
function drawimg(imageData) {
	cropzeeHiddenCanvasImageObject.onload = function(){
	    // setup canvas width and height
	    cropzeeHiddenCanvasImageObject.width = cropzeeDisplayContainerWidth;
	    cropzeeHiddenCanvasImageObject.height = cropzeeDisplayContainerHeight;
	    cropzeeHiddenCanvas.width = cropzeeDisplayContainerWidth;
	    cropzeeHiddenCanvas.height = cropzeeDisplayContainerHeight;
		// draw image data on canvas
	    cropzeeHiddenCanvasContext.drawImage(cropzeeHiddenCanvasImageObject, 0, 0, cropzeeDisplayContainerWidth, cropzeeDisplayContainerHeight);
	};
	cropzeeHiddenCanvasImageObject.src = imageData;
	cropzeeHiddenCanvas.toDataURL("image/png");
}
// function to draw image on canvas whenever executed. This is used to draw image on a dynamic canvas (canvas created on each execution)
function drawNewImage(imageData) {
	// setup the output canvas
    const cropzeeCroppingCanvas = document.getElementById('cropzee-cropping-canvas');
    const cropzeeCroppingCanvasContext = cropzeeCroppingCanvas.getContext('2d');
    // initialize output image object
    var cropzeeCroppedCanvasImage = new Image();
    // setup canvas width
    cropzeeCroppedCanvasImage.width = $(cropzeeOutline).outerWidth();
    cropzeeCroppedCanvasImage.height = $(cropzeeOutline).outerHeight();
    cropzeeCroppingCanvas.width = $(cropzeeOutline).outerWidth();
    cropzeeCroppingCanvas.height = $(cropzeeOutline).outerHeight();
    // put image data on canvas
    cropzeeCroppingCanvasContext.putImageData(imageData, 0, 0);
    // get dataUrl value of canvas
    var cropzeeCroppingCanvasImageUrl = cropzeeCroppingCanvas.toDataURL();
    // display cropped image on image-previewer (element with data-cropzee="" attribute)
    cropzeeTargetCastCroppedImage(cropzeeCroppingCanvasImageUrl);
    // link cropped image dataUrl to anchor so that user can download it by clicking on anchor
    cropzeeLinkImageToAnchor(cropzeeCroppingCanvasImageUrl);
}
// function to rotate hidden canvas by specified (input) degrees
function drawRotated(degrees){
	// clearRect() method clears the specified pixels within a given rectangle
	cropzeeHiddenCanvasContext.clearRect(0,0,cropzeeHiddenCanvas.width,cropzeeHiddenCanvas.height);
	// save the unrotated context of the canvas so we can restore it later
	// the alternative is to untranslate & unrotate after drawing
	cropzeeHiddenCanvasContext.save();
	// move to the center of the canvas
	cropzeeHiddenCanvasContext.translate(cropzeeHiddenCanvas.width/2,cropzeeHiddenCanvas.height/2);
	// rotate the canvas to the specified degrees
	cropzeeHiddenCanvasContext.rotate(degrees*Math.PI/180);
	// draw the image
	// since the context is rotated, the image will be rotated also
	cropzeeHiddenCanvasContext.translate(-cropzeeHiddenCanvas.width / 2, -cropzeeHiddenCanvas.height / 2);
	cropzeeHiddenCanvasContext.drawImage(cropzeeHiddenCanvasImageObject, 0, 0, cropzeeHiddenCanvas.width, cropzeeHiddenCanvas.height);
	// we’re done with the rotating so restore the unrotated context
	cropzeeHiddenCanvasContext.restore();
}
// function to get the current angle of rotation of an element, taking in element-object
function getRotateValue (element) {                   
	var st = window.getComputedStyle(element, null);
	var tr = st.getPropertyValue("-webkit-transform") ||
			 st.getPropertyValue("-moz-transform") ||
			 st.getPropertyValue("-ms-transform") ||
			 st.getPropertyValue("-o-transform") ||
			 st.getPropertyValue("transform") ||
			 "FAIL";

	// With rotate(30deg)... // matrix(0.866025, 0.5, -0.5, 0.866025, 0px, 0px)
	// console.log('Matrix: ' + tr);
	// rotation matrix - http://en.wikipedia.org/wiki/Rotation_matrix

	var values = tr.split('(')[1].split(')')[0].split(',');
	var a = values[0];
	var b = values[1];
	var c = values[2];
	var d = values[3];

	var scale = Math.sqrt(a*a + b*b);
	// console.log('Scale: ' + scale);
	// arc sin, convert from radians to degrees, round
	var sin = b/scale;
	// next line works for 30deg but not 130deg (returns 50);
	// var angle = Math.round(Math.asin(sin) * (180/Math.PI));
	var angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
	// console.log('Rotate: ' + angle + 'deg');
	return angle;
}
// function to match cropper-outline dimensions with cropzee-modal-display2 clip-rect dimensions when resizing cropper-outline
function cropzeeOutlineResizing(e, ui) {
	// get width and height
	var width = ui.size.width,
	height = ui.size.height;
	// get position of cropzee-cropper-outline
	var cropzeeOutlinePosition = $(cropzeeOutline).position();
	// get left, top, right, bottom, x, y, width, height of cropzee-cropper-outline
	var cropzeeOutlineDimensions = cropzeeOutline.getBoundingClientRect();
	// get cropzee-modal-display-container height and width
	var cropzeeDisplayContainerHeight = $(cropzeeDisplayContainer).innerHeight();
	var cropzeeDisplayContainerWidth = $(cropzeeDisplayContainer).innerWidth();
	// get angle of rotation of the modal display-pictures
	var rotationAngle = getRotateValue(document.getElementById('cropzee-modal-display'));
	// clip cropzee-modal-display2 to match the dimensions and position of the cropper outline
	// each rotation changes the clipped image position and has to be dealt with accordingly
	// see https://tympanus.net/codrops/2013/01/16/understanding-the-css-clip-property/ to learn more
	switch(rotationAngle) {
	  case -90:
	    $('#cropzee-modal-display2').css('clip', "rect(" + cropzeeOutlinePosition.left + "px," + (cropzeeDisplayContainerHeight - cropzeeOutlinePosition.top) + "px," + (cropzeeOutlinePosition.left + cropzeeOutlineDimensions.width) + "px," + (cropzeeDisplayContainerHeight - (cropzeeOutlinePosition.top + cropzeeOutlineDimensions.height)) + "px)");
	    break;
	  case -180:
	    $('#cropzee-modal-display2').css('clip', "rect(" + (cropzeeDisplayContainerHeight - (cropzeeOutlinePosition.top + cropzeeOutlineDimensions.height)) + "px," + (cropzeeDisplayContainerWidth - cropzeeOutlinePosition.left) + "px," + (cropzeeDisplayContainerHeight - cropzeeOutlinePosition.top) + "px," + (cropzeeDisplayContainerWidth - (cropzeeOutlineDimensions.width + cropzeeOutlinePosition.left)) + "px)");
	    break;
	  case 90:
	    $('#cropzee-modal-display2').css('clip', "rect(" + (cropzeeDisplayContainerWidth - (cropzeeOutlinePosition.left + cropzeeOutlineDimensions.width)) + "px," + (cropzeeOutlinePosition.top + cropzeeOutlineDimensions.height) + "px," + (cropzeeDisplayContainerWidth - cropzeeOutlinePosition.left) + "px," + cropzeeOutlinePosition.top + "px)");
	    break;
	  default:
	    $('#cropzee-modal-display2').css('clip', "rect(" + cropzeeOutlinePosition.top + "px," + (cropzeeOutlineDimensions.width + cropzeeOutlinePosition.left) + "px," + (cropzeeOutlineDimensions.height + cropzeeOutlinePosition.top) + "px," + cropzeeOutlinePosition.left + "px)");
	}
}
// function to match cropper-outline dimensions with cropzee-modal-display2 clip-rect dimensions when dragging cropper-outline
function cropzeeOutlineDraging() {
	// get position of cropzee-cropper-outline
	var cropzeeOutlinePosition = $(cropzeeOutline).position();
	// get left, top, right, bottom, x, y, width, height of cropzee-cropper-outline
	var cropzeeOutlineDimensions = cropzeeOutline.getBoundingClientRect();
	// get cropzee-modal-display-container height and width
    var cropzeeDisplayContainerHeight = $(cropzeeDisplayContainer).innerHeight();
	var cropzeeDisplayContainerWidth = $(cropzeeDisplayContainer).innerWidth();
	// get angle of rotation of the modal display-pictures
	var rotationAngle = getRotateValue(document.getElementById('cropzee-modal-display'));
	// clip cropzee-modal-display2 to match the dimensions and position of the cropper outline
	// each rotation changes the clipped image position and has to be dealt with accordingly
	// see https://tympanus.net/codrops/2013/01/16/understanding-the-css-clip-property/ to learn more
	switch(rotationAngle) {
	  case -90:
	    $('#cropzee-modal-display2').css('clip', "rect(" + cropzeeOutlinePosition.left + "px," + (cropzeeDisplayContainerHeight - cropzeeOutlinePosition.top) + "px," + (cropzeeOutlinePosition.left + cropzeeOutlineDimensions.width) + "px," + (cropzeeDisplayContainerHeight - (cropzeeOutlinePosition.top + cropzeeOutlineDimensions.height)) + "px)");
	    break;
	  case -180:
	    $('#cropzee-modal-display2').css('clip', "rect(" + (cropzeeDisplayContainerHeight - (cropzeeOutlinePosition.top + cropzeeOutlineDimensions.height)) + "px," + (cropzeeDisplayContainerWidth - cropzeeOutlinePosition.left) + "px," + (cropzeeDisplayContainerHeight - cropzeeOutlinePosition.top) + "px," + (cropzeeDisplayContainerWidth - (cropzeeOutlineDimensions.width + cropzeeOutlinePosition.left)) + "px)");
	    break;
	  case 90:
	    $('#cropzee-modal-display2').css('clip', "rect(" + (cropzeeDisplayContainerWidth - (cropzeeOutlinePosition.left + cropzeeOutlineDimensions.width)) + "px," + (cropzeeOutlinePosition.top + cropzeeOutlineDimensions.height) + "px," + (cropzeeDisplayContainerWidth - cropzeeOutlinePosition.left) + "px," + cropzeeOutlinePosition.top + "px)");
	    break;
	  default:
	    $('#cropzee-modal-display2').css('clip', "rect(" + cropzeeOutlinePosition.top + "px," + (cropzeeOutlineDimensions.width + cropzeeOutlinePosition.left) + "px," + (cropzeeOutlineDimensions.height + cropzeeOutlinePosition.top) + "px," + cropzeeOutlinePosition.left + "px)");
	}
}
// function to rotate the modal picture-displays and their children to counter-clockwise direction by 90 degrees
function rotateCounterClockwise(angle) {
	// get the current angle value and minus 90
	angle = angle - 90;
	// rotate the modal picture-displays and their children by the new angle
	$(cropzeeModalDisplay).css("transform", "rotate(" + angle + "deg)");
	$(cropzeeModalDisplay).children().css("transform", "rotate(" + angle + "deg)");
	// execute function to neutralize the offset on the cropper-outline with respect to the clip-rect dimensions of cropzee-modal-display2
	cropzeeOutlineRotateOffset(angle);
	return angle;
}
// function to neutralize the offset on the cropper-outline with respect to the clip-rect dimensions of cropzee-modal-display2
function cropzeeOutlineRotateOffset(angle) {
	// get left, top, right, bottom, x, y, width, height of cropzee-cropper-outline
	var cropzeeOutlineDimensions = cropzeeOutline.getBoundingClientRect();
	// get position of cropzee-cropper-outline
	var cropzeeOutlinePosition = $(cropzeeOutline).position();
	// get left, top, right, bottom, x, y, width, height of cropzee-cropper-outline
	var cropzeeOutlineDimensions = cropzeeOutline.getBoundingClientRect();
	// get cropzee-modal-display-container height and width
	var cropzeeDisplayContainerHeight = $(cropzeeDisplayContainer).innerHeight();
	var cropzeeDisplayContainerWidth = $(cropzeeDisplayContainer).innerWidth();
	// get angle of rotation of the modal display-pictures
	var rotationAngle = getRotateValue(document.getElementById('cropzee-modal-display'));
	// clip cropzee-modal-display2 to match the dimensions and position of the cropper outline
	// each rotation changes the clipped image position and has to be dealt with accordingly
	// see https://tympanus.net/codrops/2013/01/16/understanding-the-css-clip-property/ to learn more
	switch(rotationAngle) {
		case -90:
			$('#cropzee-modal-display2').css('clip', "rect(" + cropzeeOutlinePosition.left + "px," + (cropzeeDisplayContainerHeight - cropzeeOutlinePosition.top) + "px," + (cropzeeOutlinePosition.left + cropzeeOutlineDimensions.width) + "px," + (cropzeeDisplayContainerHeight - (cropzeeOutlinePosition.top + cropzeeOutlineDimensions.height)) + "px)");
				break;
		case -180:
			$('#cropzee-modal-display2').css('clip', "rect(" + (cropzeeDisplayContainerHeight - (cropzeeOutlinePosition.top + cropzeeOutlineDimensions.height)) + "px," + (cropzeeDisplayContainerWidth - cropzeeOutlinePosition.left) + "px," + (cropzeeDisplayContainerHeight - cropzeeOutlinePosition.top) + "px," + (cropzeeDisplayContainerWidth - (cropzeeOutlineDimensions.width + cropzeeOutlinePosition.left)) + "px)");
				break;
		case 90:
			$('#cropzee-modal-display2').css('clip', "rect(" + (cropzeeDisplayContainerWidth - (cropzeeOutlinePosition.left + cropzeeOutlineDimensions.width)) + "px," + (cropzeeOutlinePosition.top + cropzeeOutlineDimensions.height) + "px," + (cropzeeDisplayContainerWidth - cropzeeOutlinePosition.left) + "px," + cropzeeOutlinePosition.top + "px)");
				break;
		default:
			$('#cropzee-modal-display2').css('clip', "rect(" + cropzeeOutlinePosition.top + "px," + (cropzeeOutlineDimensions.width + cropzeeOutlinePosition.left) + "px," + (cropzeeOutlineDimensions.height + cropzeeOutlinePosition.top) + "px," + cropzeeOutlinePosition.left + "px)");
	}
}
// function to rotate the modal picture-displays and the hidden canvas to counter-clockwise direction by 90 degrees
function cropzeeRotateImage() {
	// get the current angle of rotation of one of the modal picture-displays and execute rotateCounterClockwise() which will rotate them both
	rotateCounterClockwise(getRotateValue(document.getElementById('cropzee-modal-display')));
	// get angle of rotation of the modal display-pictures
	var rotationAngle = getRotateValue(document.getElementById('cropzee-modal-display'));
	// rotate hidden canvas to counter-clockwise direction by 90 degrees
	drawRotated(rotationAngle);
}
// function to crop the hidden canvas image and display it on the dynamic canvas
function cropzeeCropImage() {
	// get left, top, right, bottom, x, y, width, height of cropzee-cropper-outline
	var cropzeeOutlineDimensions = cropzeeOutline.getBoundingClientRect();
	// get position of cropzee-cropper-outline
	var cropzeeOutlinePosition = $(cropzeeOutline).position();
	// get angle of rotation of the modal display-pictures
	var rotationAngle = getRotateValue(document.getElementById('cropzee-modal-display'));
	// get/copy hidden-canvas image data on the areas inside the cropper-outline
	var imageData = cropzeeHiddenCanvasContext.getImageData(cropzeeOutlinePosition.left, cropzeeOutlinePosition.top, cropzeeOutlineDimensions.width, cropzeeOutlineDimensions.height);
	// draw image on a dynamic canvas (canvas created on each execution)
	drawNewImage(imageData);
}
// function to open modal taking in the image-url of the input image
function cropzeeOpenModal(imageUrl) {
	// function to capture click event on rotate button and execute other functions (rotate image)
	$(cropzeeRotateButton).click(function(){
		cropzeeRotateImage();
	});
	// function to capture click event on crop button and execute other functions (crop image)
	$(cropzeeCropButton).click(function(){
		cropzeeCropImage();
	});
	// capture document onclick event and hide modal if user clicks on close button, save button or outside the modal
	$(document).click(function(modalClickEvent) {
		if (modalClickEvent.target.id == $(cropzeeCloseButton).attr("id")) {
			// hide modal if document click event is targeted on the close button
			$(cropzeeModalCover).hide();
		} else if (modalClickEvent.target.parentNode.id == $(cropzeeSaveButton).attr("id")) {
			// hide modal if document click event is targeted on the save/check button
			// parent node is used as the target since data-ripple="" object will override the object making it unaccessible
			// we therefore target the ripple <span> and redirect to its parent (the save button)
			$(cropzeeModalCover).hide();
		} else if (modalClickEvent.target.id == $(cropzeeModalCover).attr("id")) {
			// hide modal if document click event is targeted on the modal cover (outside the modal and outside the cropping canvas)
			$(cropzeeModalCover).hide();
		}
	});
	// function to show modal and then make cropper-outline both draggable and resizable
	$(cropzeeModalCover).show("medium", function() {
		// perform other tasks after modal is shown
		// make sure that the height of the modal cover is at least the height of the window
		$(cropzeeModalCover).css("min-height", windowHeight);
		// append handles to cropper outline
		// handles act as holders for the user to use in resizing the cropping view
		$(cropzeeOutline).append(cropzeeOutlineHandles);
		// make the crop-outline make draggable and resizeable to its parent (the display)
		$(cropzeeOutline).draggable({
			containment: "parent",
			drag: cropzeeOutlineDraging,
			stop: cropzeeOutlineDraging,
		}).resizable({
			handles: {
				'nw': '#nw-outline-handle',
				'ne': '#ne-outline-handle',
				'sw': '#sw-outline-handle',
				'se': '#se-outline-handle',
				'n': '#n-outline-handle',
				'e': '#e-outline-handle',
				's': '#s-outline-handle',
				'w': '#w-outline-handle',
			},
			containment: "parent",
			resize: cropzeeOutlineResizing,
			stop: cropzeeOutlineResizing,
			// aspectRatio: 16 / 16,
		});
	});
	// display inputed image on the modal picture-displays
	$(cropzeeModalDisplay).css("background-image", "url(" + imageUrl + ")");
	// draw image on hidden canvas (only executed once)
	drawimg(imageUrl);
}
// function to display cropped image on image-previewer
// it takes in the cropped canvas dataUrl
function cropzeeTargetCastCroppedImage(cropzeeCroppingCanvasImageUrl) {
	$(cropzeeTargetDisplay).css("background-image", "url(" + cropzeeCroppingCanvasImageUrl + ")");
}
// function to link cropped image dataUrl to anchor so that user can download it by clicking on anchor
// it takes in the cropped canvas dataUrl
function cropzeeLinkImageToAnchor(cropzeeCroppingCanvasImageUrl) {
	// set download attribute of anchor with specified name of image to be downloaded
	$(cropzeeDownloadButton).attr("download", "cropzee-cropped-image.png");
	// set href value to dataUrl value of dynamic canvas (canvas that changes on events)
	$(cropzeeDownloadButton).attr("href", cropzeeCroppingCanvasImageUrl);
}