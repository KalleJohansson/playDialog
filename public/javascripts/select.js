define('select', function() {
		var selArr = ['#first', '#second', '#third', '#fourth'],
		rocketChainArr = ['#first', '#fourth'],
		unselArr = {},
		reserveArr = {},
		selectedVal;
	
	$('select').change(function() {
		reset(selArr);
	});
	
	function reset (selArr) {
		var selected = false,
			i = 0,
			len = selArr.length,
			selectedVal,
			selectedId,
			inArr;
		
		for (var i = 0; i < len; i++) {
			unselArr = selArr.concat();
			selectedVal = $(selArr[i] + ' option:selected').val();
			
			if (selectedVal !== '') {
				unselArr.splice(i, 1);
				inArr = $.inArray(selArr[i], rocketChainArr);
				if (inArr !== -1) {
					inArr = $.inArray(inArr, unselArr);
					unselArr.splice(inArr, 1);
				}
				selectedId = selArr[i];
				selected = true;
				break;
			} else {
				selected = false;
			}
		}
		console.log(selected);
		if (selected) {
			disableArr(unselArr);
		} else {
			enableArr(selArr);
		}
	}
	
	function disableArr(disArr) {
		$.each(disArr, function(i, arr) {
			$(arr).prop('disabled', 'disabled');
			$(arr).prop('selected', false);
		});
	}
	
	function enableArr(enArr) {
		$.each(enArr, function(i, arr) {
			$(arr).prop('disabled', false);
			$(arr).prop('selected', false);
		});
	}
	
	(function dirtyForm() {
		var allInputs = $("#formToCheck :input")
			.not('input[type=submit]'),
			len = allInputs.length;
	//	alert(len);
	//	return allInputs.length;
	})();
	
	//window.onbeforeunload = function(){
	////    if(!window.btn_clicked){
	////		alert("FLAAL");
	//        return 'You must click "Buy Now" to make payment and finish your order. If you leave now your order will be canceled.';
	////    }
	//};
});