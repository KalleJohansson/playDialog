/**
 * An attempt to build a module to be able
 * to use a jquery ui dialog via this module.
 * Call the dialog module via,
 * in this example, an anchor tag having a class ".dialogTrigger".
 */
define('basedialog', ['dimdialog', 'errorcode'], function(dimdialog, errorcode) {
	$('.dialogTrigger').on('click', function(e) {
		e.preventDefault();
		
		var $this = $(this),
			title = $this.data('title'),
			url = $this.attr('href'),
			dialogtype = $this.data('dialog'),
			dialogHandle = $('<div/>').addClass('dialogHandle');
		
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
		   ,title: title
		   ,width: dimdialog.dialogWidth(dialogtype)
		   ,height: dimdialog.dialogHeight(dialogtype)
		   ,close: function () {
			   $(this).remove();
		   }
		});
		dialogHandle.load(url, function(response, status, xhr) {
			if (xhr.status == '200' || xhr.status == '201') {
				var formId = $(xhr.responseText).find('form').attr('id'),
					pageDiv = $('#' + formId).parent().attr('id'),
					doneMessage = $('#' + pageDiv + ' div#doneMessage');
				
				$('#' + formId).submit(function(e) {
					e.preventDefault();
					var $this = $(this),
						posting,
						formData = $this.serialize(),
						postUrl = $this.attr('action');
					
					posting = $.post(postUrl, formData);
					posting.done(function(data) {
						$('#' + formId).load(url + ' #' + formId + '> *', function(){
							$('#' + formId + ' input.cancelBtn:button').click(function(e) {
								dialogHandle.dialog('close');
							});
						});
						
						if (data.errors.length === 0 && doneMessage.length === 0) {
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