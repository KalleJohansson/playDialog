define('storiesbrowser', ['jquery'], function() {
	 'use strict';
     //variables for stories browser
     var ourlist = $('#ourlist').text(),
     	jsonOur = $.parseJSON(ourlist),
     	length = jsonOur.length, 
     	pos = parseInt($('#ourpos').text(), 10),
     	placeid = parseInt($('#ourPlaceId').text()),
     	prev = $('.simplePrevious'),
     	next = $('.simpleNext');
     
     //check if we have prev story
     function hasPrev () {
         if ($(prev).hasClass('simpleActive')) {
             return true;
         } else {
             return false;
         }
     }
     
     //check if we have next story
     function hasNext () {
         if ($(next).hasClass('simpleActive')) {
             return true;
         } else {
             return false;
         }
     }
     
     //show the story selected by the stories-browser
     function showItem (pos) {
         var id = jsonOur[pos];
         
         $('#showOrEditStorySection')
         .load(routes.showStory({storyid: id, placeid: placeid, fromplace: 'false'}) + ' #showOrEditStorySection', function () {
//             PlatsR_GUI.initStoriesBrowser();
//             PlatsR_GUI.initDeleteStory();
         });
     }
     
     $(prev + ' a').click(function (e) {
         e.preventDefault();
         if (hasPrev()) {
             pos -= 1;
             showItem(pos);
         }
     });
     
     $(next + ' a').click(function (e) {
         e.preventDefault();
         if (hasNext()) {
             pos += 1;
             showItem(pos);
         }
     });
     
     //for testing only
     function showPos(pos){
//         console.log(pos);
     }
});