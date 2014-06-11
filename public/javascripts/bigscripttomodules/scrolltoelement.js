define(function() {
	/**
	 * Scrolls back the given element to page top, at a given speed (delay, in ms).
	 */
	var scrollTo = function (scrollToElement, delay) {
	    	$('html, body').animate({
	            scrollTop: $(scrollToElement).offset().top
	        }, delay);
	    }
});