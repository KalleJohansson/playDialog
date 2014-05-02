define(function() {
	/**
	 * This module returns width and height
	 * for a dialog given it´s dialogtype, 
	 * data-attribute, specified in html
	 * ex: <a href="some url" data-dialog="foo">Open Foo Dialog</a>,
	 * holding the "name" for the dialog.
	 */
	var dialogWidth = function width (dialogtype) {
		var width;
		switch (dialogtype) {
		case 'show':
			width = 500;
			break;
		case 'third':
			width = 200;
			break;
		default:
			width = 300;
			break;
		}
		return width;
	}
	
	var dialogHeight = function height (dialogtype) {
		var height;
		switch (dialogtype) {
		case 'show':
			height = 800;
			break;
		case 'third':
			height = 800;
			break;
		default:
			height = 250;
			break;
		}
		return height;
	}
	
	return {
		dialogWidth: dialogWidth,
		dialogHeight: dialogHeight
	}
});