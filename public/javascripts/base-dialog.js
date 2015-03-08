/**
 * An attempt to build a module to be able
 * to use a jquery ui dialog via this module.
 * Call the dialog module via,
 * in this example, an anchor tag having a class ".dialogTrigger".
 */
define('basedialog', ['dimdialog', 'errorcode', 'tidyinput'], function(dimdialog, errorcode, tidyinput) {
	//The dialogTrigger class can be used by an anchor to trigger a dialog, convention
	$('.dialogTrigger').on('click', function(e, arg1) {
		e.preventDefault();
		
		var $this = $(this),
			url = typeof arg1 !== 'undefined' ? arg1 : $this.attr('href'),
			dialogHandle = $('<div/>').addClass('dialogHandle'),
			pageDiv,
			redrawUrl;
		
		dialogHandle.dialog({
			modal: true
		   ,show: {
				effect: 'fade',
				duration: 800
			}
		   ,hide: {
			   effect: 'fade',
			   duration: 200
		   }
		   ,close: function () {
			   $(this).remove();
		   }
		});
		dialogHandle.load(url, function(response, status, xhr) {
		var xhrObject = xhr,
		    xhrStatus = xhrObject.status,
		    okHttpStates = {
		        OK: '200',
		        CREATED: '201'
		    };

		    if (xhrStatus != okHttpStates.OK && xhrStatus != okHttpStates.CREATED) {
		        dialogHandle.html('<i class="ui-state-error">' + errorcode.errorCode(xhr.status) + '</i>');
		    }

				var responseText = $(xhrObject.responseText),
					form = responseText.find('form'),
					formId = form.attr('id'),
					pageDiv = $('#' + formId).parent().attr('id'),
					doneMessage = $('#' + pageDiv + ' div#doneMessage'),
					pageTitle = $('title:last').text(),
					title = pageTitle != '' ? pageTitle : 'default title',
					dialogtype = pageDiv == 'login' ? $(form).attr('action').replace('/', '') : url.replace('/', ''),
					redrawUrl = pageDiv == 'login' ? $(form).attr('action') : url;
				
				dialogHandle.dialog('option', {
					title		: title,
					width		: dimdialog.dialogWidth(dialogtype),
					height		: dimdialog.dialogHeight(dialogtype)
				});	
				
				$('#' + formId).submit(function(e) {
					e.preventDefault();
					var $this = $(this),
						posting,
						formData = $this.serialize(),
						postUrl = $this.attr('action'),
						focusArr = [];
					
					formData = tidyinput.tidyInput(formData);
					
					posting = $.post(postUrl, formData);
					posting.done(function(data) {
						var validation = data.validation,
						    baseModels = data.baseModels,
						    errors = validation.errors,
						    ids = baseModels.ids;
						console.log(ids[1].id);
						$('#' + formId).load(redrawUrl + ' #' + formId + '> *', function(){
							$.each($('.form-group'), function(i, val){
								var hasError = $(val).find('span.error').text();
								if (hasError) {
									$(val).addClass('has-error');
									focusArr.push($(val).find('input'));
								} else {
									$(val).removeClass('has-error');
								}
							});
							if (focusArr.length > 0) {
								focusArr[0].focus();
							}
							$('#' + formId + ' input.cancelBtn:button').click(function(e) {
								dialogHandle.dialog('close');
							});
						});
						
						if (errors.length === 0 && doneMessage.length === 0) {
							if (pageDiv == 'login') {
								dialogHandle.bind('dialogclose', function(e){
									$('.dialogTrigger').triggerHandler('click', [url]);
								});
							} 
							dialogHandle.dialog('close');
						} else if (errors.length === 0 && doneMessage.length > 0) {
							$('#' + formId).addClass('hidden');
							$(doneMessage).removeClass('hidden');
							$('#' + $(doneMessage).attr('id') + ' input.cancelBtn:button').click(function(e) {
								dialogHandle.dialog('close');
							});
						}
					});
					
					posting.fail(function(xhr, tst, err) {
						dialogHandle.html('<i class="ui-state-error">' + errorcode.errorCode(xhr.status) + '</i>');
					});
				});
				
				$('#' + formId + ' input.cancelBtn:button').click(function(e) {
					dialogHandle.dialog('close');
				});
		});
	});
});