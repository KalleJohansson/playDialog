require.config({
	baseUrl: '/public/javascripts/'
   ,paths: {
		'jquery'		: 'jquery-1.11.0'
	   ,'jqueryui'		: 'jquery-ui-1.10.4.custom'
	   ,'select'		: 'select'
	   ,'basedialog'	: 'base-dialog'	
	   ,'dimdialog'		: 'dim-dialog'
	   ,'errorcode'		: 'errorcode'
	   ,'tooltiphide'   : 'bigscripttomodules/tooltiphide'	
	   ,'tidyinput'     : 'bigscripttomodules/tidyinput'
//	   ,'gremlins'		: 'gremlins.min'	   
	}
   ,shim: {
		jqueryui		: ['jquery']
	   ,select			: ['jquery']
	   ,basedialog		: ['jqueryui', 'dimdialog', 'errorcode', 'tidyinput']
       ,tooltiphide     : ['jquery']
//       ,gremlins		: ['basedialog']
	}
});


require(
		['jquery', 'jqueryui', 'select', 'basedialog', 'dimdialog', 'errorcode', 'tooltiphide', 'tidyinput'/*, 'gremlins'*/], 
		function($, jqueryui, select, baseDialog, dimdialog, errorcode, tooltiphide, tidyinput/*, gremlins*/) {
//			alert(tidyinput.tidyInput(["text", "another text"]));
//			alert(tidyinput.tidyInput("text"));
//		gremlins.createHorde().unleash();
});