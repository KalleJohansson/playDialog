require.config({
	baseUrl: '/public/javascripts/'
   ,paths: {
		'jquery'		: 'jquery-1.11.0'
	   ,'jqueryui'		: 'jquery-ui-1.10.4.custom'
	   ,'select'		: 'select'
	   ,'basedialog'	: 'base-dialog'	
	   ,'dimdialog'		: 'dim-dialog'
	   ,'errorcode'		: 'errorcode'
//	   ,'gremlins'		: 'gremlins.min'	   
	}
   ,shim: {
		jqueryui		: ['jquery']
	   ,select			: ['jquery']
	   ,basedialog		: ['jqueryui', 'dimdialog', 'errorcode']
//       ,gremlins		: ['basedialog']
	}
});


require(
		['jquery', 'jqueryui', 'select', 'basedialog', 'dimdialog', 'errorcode'/*, 'gremlins'*/], 
		function($, jqueryui, select, baseDialog, dimdialog, errorcode/*, gremlins*/) {
//		gremlins.createHorde().unleash();
});