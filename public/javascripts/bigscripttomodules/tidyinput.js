define(function() {
	//we might wanna take an entire form as parameter
	//and possibly separate single input (offfocus in input),
	//from entire form validating on submit of form
	var tidyInput = function(input) {
			var SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
			var	inputArray = [],
				key,
				value;
				if (input.indexOf('&') !== -1) {
					inputArray = input.split('&');
				} else {
					inputArray.push(input);
				}

				len = inputArray.length;
				input = "";
				
			for (var i = 0; i < len; i += 1) {
				var elem = inputArray[i];
				var vals = elem.split('=');
				key = vals[0];
				value = vals[1];
				alert(value);
				value = value.replace(SCRIPT_REGEX, '');
				alert(value);
				input += key + '=' + value;
				if (i < (len - 1)) {
					input += '&';
				}
			}
			
    	return input;
    }
	
	return {
		tidyInput: tidyInput
	}
});