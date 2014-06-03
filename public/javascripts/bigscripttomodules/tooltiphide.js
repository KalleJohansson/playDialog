define(['jquery'], function() {
	/**
	 * This function hides the title/tooltip, while hovering, for a tag with the
	 * given element. Simply add the "hide-title" class to the element having the 
	 * title you want to hide.
	 */
	var element = $('.hide-title'),
		title,
		that;
    $(element).hover(function(){
    	that = this;
	    // Get the current title
	    title = $(that).attr("title");
	    // Store it in a temporary attribute
	    $(that).attr("tmp_title", title);
	    // Set the title to nothing so we don't see the tooltips
	    $(that).attr("title","");
	    },
	    function() { // Fired when we leave the element
	    // Retrieve the title from the temporary attribute
	    title = $(that).attr("tmp_title");
	    // Return the title to what it was
	    $(that).attr("title", title);
    });
});