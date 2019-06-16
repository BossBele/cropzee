/*
Add the Material Design Style Ripple Effect on Click / Touch.
*/
(function ($) {
    var transparent;
    //only run this once. this addes an empty elment in boody root and gets the defintion of the browsers transparent color scheme.
    if (typeof (transparent) == "undefined") {
        // Get this browser's definition of no back ground / transprent, rgba(0,0,0,0) etc..
        // Must be appended else Chrome etc return 'initial'
        var $temp = $('<div style="background:none;display:none;"/>').appendTo('body');
        //now we just get the value given back to use by the browser for its spcific transparent color scheme.
        transparent = $temp.css('backgroundColor');
        //remove the temp object since were done with it.
        $temp.remove();
    }


    //add Material desing style rippple effect to a given element that animates on click / touch.
    $.fn.rippleEffect = function (options) {
        // Extend our default options with those provided.
        var opts = $.extend({}, $.fn.rippleEffect.defaults, options);

        return this.each(function () {

            $(this).on("click", function (e) {
                var $thisElement = $(this),
                eventPageX,
                eventPageY,
                inkX,
                inkY,
                maxDiameter,
                eventType = e.type,
                rippleColor,
                $inkSpan,
                $inkparent;

                //default append
                $inkparent = $thisElement;

                function getRippleColorFromTraverse() {
                    if (opts.inkColor != "") {
                        return opts.inkColor;
                    } else {
                        //try and get from elemnt or parent what ever has a bg color and it will lighten or dark based on color.
                        return getInkColor($inkparent, opts.inkDefaultColor);
                    }
                }
                //check to see if were appending ink to a parent element other than the trigger
                //if you append to a parent item that item will have the ripple span and it may block access to links
                //all i had to do was give any of the siblings of the ripple a z-index of 1, some i had to set position to relative.
                if (opts.appendInkTo != "") {
                    $inkparent = $thisElement.closest(opts.appendInkTo);
                }
                // check to se if we have an ink, if not we need to add it in, we only need to do this once.
                if ($inkparent.find("." + opts.inkClass).length == 0) {
                    //add ink 
                    $inkparent.append('<span class="' + opts.inkContainerClass + '"><span class="' + opts.inkClass + '"></span></span>');
                }
                //set the ink var targeting the ink within the element to prevent dup ink animates.
                $inkSpan = $inkparent.find("." + opts.inkContainerClass + " > " + " ." + opts.inkClass);
                //incase of quick double click or animate is present. remove the animation
                $inkSpan.removeClass("animate");

                //now if the ink has no height set we need to add it in.
                if (!$inkSpan.height() && !$inkSpan.width()) {
                    //use $thisElement width or height whichever is larger for the diameter to make a circle which can cover the entire element.
                    maxDiameter = Math.max($inkparent.outerWidth(), $inkparent.outerHeight());
                    //set width and height and get bg color for the
                    //see if ripple color was provided via data attr.
                    if (typeof ($thisElement.data("ripple")) != "undefined" && $thisElement.data("ripple") != "") {
                        rippleColor = $thisElement.data("ripple");
                    } else {
                        //check if a target element id to get a ripple color from is provided
                        if (typeof ($thisElement.data("ripple-getcolorfromid")) != "undefined" && $thisElement.data("ripple-getcolorfromid") != "") {
                            var idToUse = $thisElement.data("ripple-getcolorfromid");
                            //make sure element is on page.
                            if ($(idToUse).length > 0) {
                                //set from given elmements bgcolor.
                                rippleColor = $(idToUse).css("background-color");
                            } else {
                                //get from default ways
                                rippleColor = getRippleColorFromTraverse();
                            }
                        } else {
                            //get from default ways
                            rippleColor = getRippleColorFromTraverse();
                        }
                    }
                    //set h and w and ripple color.
                    $inkSpan.css({ height: maxDiameter, width: maxDiameter, "background-color": rippleColor });
                }
                
                //now that the ink is taken care of we need to set the position where it starts, which if from click.
                //get event type.
                if(eventType === "click"){
                    eventPageX = e.pageX; 
                    eventPageY = e.pageY;
                } else if(eventType === "touchstart") {
                    var touch = (e.originalEvent.touches[0] || e.originalEvent.changedTouches[0]);
                    eventPageX = touch.pageX;
                    eventPageY = touch.pageY
                }
               
                inkX = (eventPageX - $inkparent.offset().left - $inkSpan.width() / 2);
                inkY = (eventPageY - $inkparent.offset().top - $inkSpan.height() / 2);
                $inkSpan.css({ top: inkY + 'px', left: inkX + 'px' }).addClass("animate");
                //remove animation after a little bit.
                setTimeout(function () {
                    $inkSpan.removeClass("animate")
                }, 800);

            });
        });
    };
    // Plugin defaults – added as a property on our plugin function.
    $.fn.rippleEffect.defaults = {
        inkContainerClass: "ripple",
        inkClass: "ink",
        //to avoid a global default you can add data-ripple="#ff00ff" to the element that will have the ripple and that color will be used.
        //or to use a tagrget elements background color for the ripple you can set the data-ripple="" and data-ripple-getcolorfromid="#elmentWIthBGColorToUSe"
        inkDefaultColor: "#F0F0F0", //falback color to use if using parent traversing to get a bg color.
        inkColor: "", //the ink color you want the element to use, this will override any bg checks for element and parent traversing, but if the ement has data-ripple="#fff" the #fff will be used above all else
        //if you append to a parent item that item will have the ripple span and it may block access to links and child elements
        //all i had to do was give any of the children of the appended element a z-index of 1, some i had to set position to relative.
        appendInkTo: "" //append ink to a diffrent element. will find closest element matching.
    };

    //Now users can include a line like this in their scripts:
    //$.fn.rippleEffect.defaults.inkDefaultColor = "#0000FF";

    // Define our get background color function.
    //this will try and get a background color for the ink color manipulation 
    //by starting with the element provided and going as far back to the body unless a value is found.
    //providing a falback value will make sure that an actual color is returned
    function getBackgroundColorForInk($element, fallback) {
        function getBgColor($elementToCheckForBg) {
            //here we check against the @transparent var that is set on load.
            if ($elementToCheckForBg.css('backgroundColor') == transparent) {
                //here we check if were not at body, if not, then run again on the elments parent, if were at body use fallback or the browers take on transparent.
                return !$elementToCheckForBg.is('body') ? getBgColor($elementToCheckForBg.parent()) : fallback || transparent;
            } else {
                //it was not transparent return this color.
                return $elementToCheckForBg.css('backgroundColor');
            }
        }
        //run the function which will repeate as long as it needs until it hits body to find a color to use.
        return getBgColor($element);
    };

    //create as a property so users can set make there own lum check.
    //returns the direction lumination should go for ink contrast.
    //get the lumination value for a given color.
    $.fn.rippleEffect.getLuminationValue = function (hexcolor) {
        var hexcolor = hexcolor.substring(1);      // strip #
        var rgb = parseInt(hexcolor, 16);   // convert rrggbb to decimal
        var r = (rgb >> 16) & 0xff;  // extract red
        var g = (rgb >> 8) & 0xff;  // extract green
        var b = (rgb >> 0) & 0xff;  // extract blue

        var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
        return luma;
    }

    //create as property, for user override. 
    //this was from a site point article.
    //get a new color luminance -0.15 is darker by 15% and 0.20 is lighter by 20%
    $.fn.rippleEffect.getColorLuminance = function (hexcolor, lum) {
        // validate hex string
        hexcolor = String(hexcolor).replace(/[^0-9a-f]/gi, '');
        if (hexcolor.length < 6) {
            hexcolor = hexcolor[0] + hexcolor[0] + hexcolor[1] + hexcolor[1] + hexcolor[2] + hexcolor[2];
        }
        //set a default lum value.
        lum = lum || 0;

        // convert to decimal and change luminosity
        var resultHex = "#", c, i;
        for (i = 0; i < 3; i++) {
            c = parseInt(hexcolor.substr(i * 2, 2), 16);
            c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
            resultHex += ("00" + c).substr(c.length);
        }

        return resultHex;
    }

    //create property for overide if wanted, this converts an rgb value to hex.
    //it does not work right with rgba though it just returns the bas rgb part so the trans is not claculated in.
    $.fn.rippleEffect.colorToHex = function (rgb) {
        //first echeck to see if we already have a hex color, if so just return.
        if (rgb.substr(0, 1) === '#') {
            return color;
        }
        rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
        return (rgb && rgb.length === 4) ? "#" +
         ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
         ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
         ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : '';
    }

    //this is the base function that does all of the magic, it gets a bkg color, 
    //then changes the colors lumanince so the ink is visiable when being animated.
    function getInkColor($element, fallBackColor) {
        var backgroundOrInhreitedBackGround,
            hex,
            luma,
            returnLumintion;
        //get back ground color of element / or parent with an actual color or use fallback of a lighter gray 
        // Call our getBackgroundColorForInk function.

        backgroundOrInhreitedBackGround = getBackgroundColorForInk($element, fallBackColor);
        //convert to hex, this returns hex if it is already hex.
        //call our colorToHex function
        hex = $.fn.rippleEffect.colorToHex(backgroundOrInhreitedBackGround);
        //now get the lumination value of this bg.
        //call our getLuminationValue function
        luma = $.fn.rippleEffect.getLuminationValue(hex);

        //239 for lighter lumination ok 
        if (luma <= 239) {
            //go lighter alwasy prefered.
            //we need to make sure we are light enough though
            if (luma <= 70) {
                returnLumintion = $.fn.rippleEffect.getColorLuminance(hex, 0.80);
            } else {
                returnLumintion = $.fn.rippleEffect.getColorLuminance(hex, 0.20);
            }
        } else {
            //go darker
            returnLumintion = $.fn.rippleEffect.getColorLuminance(hex, -0.15);
        }
        return returnLumintion;
    };


    //appply 
    $("[data-ripple]").rippleEffect();
})(jQuery);


