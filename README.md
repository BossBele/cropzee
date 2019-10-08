# Cropzee.js

![Made with love in Wakanda](https://madewithlove.now.sh/tz?heart=true&text=Wakanda)
![Issues](https://img.shields.io/github/issues/BossBele/cropzee) ![Forks](https://img.shields.io/github/forks/BossBele/cropzee) ![Stars](https://img.shields.io/github/stars/BossBele/cropzee) ![License](https://img.shields.io/github/license/BossBele/cropzee)  [![](https://data.jsdelivr.com/v2/package/gh/BossBelle/cropzee/badge)](https://www.jsdelivr.com/package/gh/BossBelle/cropzee)
![Language](https://img.shields.io/badge/language-JavaScript-tomato) ![JS Library](https://img.shields.io/badge/library-jQuery-orchid)

Cropzee (image cropper) is a free, and open source customizable jQuery plugin to crop and rotate pictures before submitting for upload.

## Installation
To include cropzee in your website do one of the following:
### 1. CDN
This project can be easily added to your webpages through jsDelivr - A free, fast, and reliable Open Source CDN for npm & GitHub.
You only need a single JavaScript file: cropzee.js
```html 
<script src="https://cdn.jsdelivr.net/gh/BossBele/cropzee@latest/dist/cropzee.js" defer></script>
```
#### OR
Add a minified version of the file: cropzee.min.js
```html 
<script src="https://cdn.jsdelivr.net/gh/BossBele/cropzee@latest/dist/cropzee.min.js" defer></script>
```
### 2. Download
The alternative is to download this repository and add cropzee.js according to the file structure associated with your webpages. You only need a single JavaScript file: cropzee.js
```html 
<script src="path/to/cropzee/dist/cropzee.js" defer></script>
```
#### NB:
Make sure you also include jQuery before you include *cropzee.js*

## Usage
After linking *cropzee.js* and jQuery, you can use cropzee like:
```javascript
<script>
    $(document).ready(function(){
      $("#input").cropzee(); // cropzee function without options // i.e with default option values
      $("#input2").cropzee({option: value}); // cropzee function with options // see available options and their values in 'Options' table below
    });
 </script>
```
The ```'#input'``` and ```'#input2'``` in the above code represents an id of any input of ```type=file``` whose picture input is to be cropped and/or captured (```'#my-input'```).
### Image Previewing
In the case where you want to preview the selected image and the cropped image after cropping, add the ```data-cropzee``` attribute on the HTML element you want to preview the image on.<br/>
The ```data-cropzee``` attribute should contain a value equal to the id of the input element to which cropzee is initialized on.
Based on the initializations above, the following is the way to change elements into cropzee image previewers:
```html
<div data-cropzee="input"></div>
<section data-cropzee="input"></section>
<label data-cropzee="input2"></label>
```
#### NB:
There can be as many image previewers to a specific input as you would like. Also, the id name in the value of data-cropzee attribute should not start with "#".

## Options
| Option  | Explanation | Value Type | Values | Default |
| ------------- | :-: | :-: | :-: | :-: |
| allowedInputs | supported input files (by extension names) | Array of strings | * ```'gif'```<br/>* ```'png'```<br/>* ```'jpg'```<br/>* ```'jpeg'``` | ```['gif','png','jpg','jpeg']``` |
| imageExtension | cropped image file-type (extension) | String | * ```'image/jpeg'```<br/>* ```'image/png'``` | ```'image/jpeg'``` |
| returnImageMode | image data to be returned, 'blob' for blob object or 'data-url' for dataURL | String | * ```'data-url'```<br/>* ```'blob'``` | ```'data-url'``` |
### From Croppr
| Option  | Explanation | Value Type | Values | Default |
| ------------- | :-: | :-: | :-: | :-: |
| aspectRatio | Constrain the crop region to an aspect ratio. | Number |  ```all positive whole numbers or decimals``` | ```null``` |
| maxSize | Constrain the crop region to a maximum size. | [width, height, unit?] |  ```eg [200, 200, 'px'] or [20, 20, '%']``` | ```null``` |
| minSize | Constrain the crop region to a minimum size. | [width, height, unit?] |  ```eg [200, 200, 'px'] or [20, 20, '%']``` | ```null``` |
| startSize | The starting size of the crop region when it is initialized. | [width, height, unit?] |  ```eg [200, 200, 'px'] or [20, 20, '%']``` | ```[100, 100, '%']``` |
| onCropStart | A callback function that is called when the user starts modifying the crop region. | Function |  ```eg function(data) { console.log(data.x, data.y, data.width, data.height); }``` | ```null``` |
| onCropMove | A callback function that is called when the crop region changes. | Function |  ```eg function(data) { console.log(data.x, data.y, data.width, data.height); }``` | ```null``` |
| onCropEnd | A callback function that is called when the user stops modifying the crop region. | Function |  ```eg function(data) { console.log(data.x, data.y, data.width, data.height); }``` | ```null``` |
| onInitialize | A callback function that is called when the Croppr instance is fully initialized. | Function |  ```eg function(instance) { // do things here }``` | ```null``` |
### From light-modal
| Option  | Explanation | Value Type | Values | Default |
| ------------- | :-: | :-: | :-: | :-: |
| modalAnimation | animate.css animation on modal when opening/showing and closing/hiding | String |  ```eg bounce``` * use animate.css animation names | ```''``` |

## Methods
| Method  | Explanation | Parameter Type | Parameter | Return |
| ------------- | :-: | :-: | :-: | :-: |
| cropzeeGetImage(input) | method to get the cropped or inserted image. cropzee doesn't return the image as the input value | String |  input selector eg ```'#my-input'``` | ```blob``` or ```dataURL``` (depends on returnImageMode option) |

## Dependencies
- [Croppr.js](https://github.com/jamesssooi/Croppr.js)
- [light-modal](https://hunzaboy.github.io/Light-Modal)
- [animate.css](https://github.com/daneden/animate.css)
- [FileSaver.js](https://github.com/eligrey/FileSaver.js)
- [canvas-toBlob.js](https://github.com/eligrey/canvas-toBlob.js)
