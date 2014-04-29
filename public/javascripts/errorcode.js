define(function() {
	var errorCode = function errorCode (status) {
		var errorcode;
		switch (status) {
		case 404:
			errorcode = 'Kunde inte hitta sidan, försök igen senare.';
			break;

		default:
			errorcode = 'Något gick fel, försök igen senare.';
			break;
		}
		
		return errorcode;
	} 
	
	return {
		errorCode: errorCode
	}
});