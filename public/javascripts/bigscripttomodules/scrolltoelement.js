define(function() {
	/**
	 * Scrolls back the given element to page top, at a given speed (800ms).
	 */
	var scrollTo = function (scrollToElement) {
	    	$('html, body').animate({
	            scrollTop: $(scrollToElement).offset().top
	        }, 800);
	    }
});