/**
 * An attempt to build a module to be able
 * to use a jquery ui dialog via this module.
 * Call the dialog module via,
 * in this example, an anchor tag having a class ".dialogTrigger".
 */
define('basedialog', ['dimdialog', 'errorcode'], function(dimdialog, errorcode) {
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
			   duration: 800
		   }
		   ,close: function () {
			   $(this).remove();
		   }
		});
		dialogHandle.load(url, function(response, status, xhr) {
			if (xhr.status == '200' || xhr.status == '201') {
				var responseText = $(xhr.responseText),
					form = responseText.find('form'),
					formId = form.attr('id'),
					pageDiv = $('#' + formId).parent().attr('id'),
					doneMessage = $('#' + pageDiv + ' div#doneMessage'),
					pageTitle = $('title:last').text(),
					title = pageTitle != '' ? pageTitle : 'default title',
					dialogtype = pageDiv == 'login' ? $(form).attr('action').replace('/', '') : url.replace('/', ''),
					redrawUrl = pageDiv == 'login' ? $(form).attr('action') : url;
				
				dialogHandle.dialog('option', 'title', title);
				dialogHandle.dialog('option', 'width', dimdialog.dialogWidth(dialogtype));
				dialogHandle.dialog('option', 'height', dimdialog.dialogHeight(dialogtype));
				
				$('#' + formId).submit(function(e) {
					e.preventDefault();
					var $this = $(this),
						posting,
						formData = $this.serialize(),
						postUrl = $this.attr('action');
						
					posting = $.post(postUrl, formData);
					posting.done(function(data) {
						$('#' + formId).load(redrawUrl + ' #' + formId + '> *', function(){
							$.each($('.form-group'), function(i, val){
								var hasError = $(val).find('span.error').text();
								if (hasError) {
									$(val).addClass('has-error');
								} else {
									$(val).removeClass('has-error');
								}
							});
							
							$('#' + formId + ' input.cancelBtn:button').click(function(e) {
								dialogHandle.dialog('close');
							});
						});
						
						if (data.errors.length === 0 && doneMessage.length === 0) {
							if (pageDiv == 'login') {
								dialogHandle.bind('dialogclose', function(e){
									$('.dialogTrigger').triggerHandler('click', [url]);
								});
							} 
							dialogHandle.dialog('close');
						} else if (data.errors.length === 0 && doneMessage.length > 0) {
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
			} else {
				dialogHandle.html('<i class="ui-state-error">' + errorcode.errorCode(xhr.status) + '</i>');
			}
		});
	});
});