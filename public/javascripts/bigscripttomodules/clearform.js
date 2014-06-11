define(function() {
    /**
     * This module clears the form, so that 
     * we do not commit multiple times due to
     * multiple clicks.
     */
    var clearForm = function (formname) {
    	$(formname)[0].reset();	
    }
});