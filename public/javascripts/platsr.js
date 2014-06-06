var PlatsR_GUI = {
		
	IMAGE_META_DATA_SUBMIT : false,	
    /**
    * Initialize GUI when DOM is ready...
    */
    init: function () {
        'use strict';
        /*global $, jQuery, PlatsR_map, Modernizr, routes, document, window, setTimeout, PlatsR_REST */
        try {
            PlatsR_GUI.log("DOM ready - begin GUI init calls");
            /**
             * These conditions loads parts/functions from
             * the namnespace (PlatsR_GUI), as related to 
             * the of the body element.
             */
            PlatsR_GUI.initStarttopFunctions();
            PlatsR_GUI.initEventListLink();
            PlatsR_GUI.initWebAddressHandling();
            PlatsR_GUI.initRecommendationHandling();
            PlatsR_GUI.initTagsHandling();
            PlatsR_GUI.initSourcesHandling();
            PlatsR_GUI.initCommentHandling();
            PlatsR_GUI.initCommonsHandling();
            PlatsR_GUI.initWikipediaHandling();
            PlatsR_GUI.initSearchAutocompleter();
//            PlatsR_GUI.fireGoogleAnalyticsScript();            
            if ($('body').hasClass('plats story new')) {
            	PlatsR_GUI.initPlacePageMap();
                PlatsR_GUI.initNewStoryForm();
            } else if ($('body').hasClass('start')) {
                PlatsR_GUI.initFeatured();
                PlatsR_GUI.initLeaderBoard();
                PlatsR_GUI.initTagCloud();
                PlatsR_GUI.initIndexPageMap();
            } else if ($('body').hasClass('plats story edit')) {
            	PlatsR_GUI.initPlacePageMap();
            	PlatsR_GUI.initLargeImagePopup();
            	PlatsR_GUI.initNewStory();
                PlatsR_GUI.initStoryLargePopup();
                PlatsR_GUI.initEditStoryForm();
                PlatsR_GUI.initDeleteStory();
                PlatsR_GUI.initStoriesBrowser();
            } else if ($('body').hasClass('plats story')) {
            	PlatsR_GUI.initPlacePageMap();
                PlatsR_GUI.initNewStory();
                PlatsR_GUI.initDeleteStory();
                PlatsR_GUI.initStoriesBrowser();
                PlatsR_GUI.initLargeImagePopup();
                PlatsR_GUI.initStoryLargePopup();
            } else if ($('body').hasClass('plats')) {
            	if ($('body').hasClass('samling')) {
                    PlatsR_GUI.initCollectionPageMap();
                } else {
                    PlatsR_GUI.initPlacePageMap();
                }
                PlatsR_GUI.initNewStory();
                PlatsR_GUI.initDeleteStory();
                PlatsR_GUI.initVideoBrowser();
                PlatsR_GUI.initImageBrowser();
                PlatsR_GUI.initLargeImagePopup();
                PlatsR_GUI.initStoryLargePopup();
                PlatsR_GUI.initSoundBrowser();
                PlatsR_GUI.initArchiveBrowser();
                
            } else if ($('body').hasClass('platser')) {
                PlatsR_GUI.initTagCloud();
                PlatsR_GUI.initPlacesPageMap();
            } else if ($('body').hasClass('profil') || $('body').hasClass('adminsida')) {
                PlatsR_GUI.initTabsHandling();
            } else if ($('body').hasClass('sok')) {
                PlatsR_GUI.initSearchMap();
            }
            if ($('body').hasClass('profil')) {
                PlatsR_GUI.initProfilePageMap();
            }
            if ($('body').hasClass('activate')) {
                PlatsR_GUI.initRenewPassword();
            }
            if ($('html').hasClass('ie8') || $('html').hasClass('ie9')) {
//            	PlatsR_GUI.initCheckMBrowsers();
            }            
            PlatsR_GUI.initNewCollectionPage();
            PlatsR_GUI.restoreScrollPos();
            PlatsR_GUI.log("Done with GUI init calls");
        } catch (e) {
            PlatsR_GUI.log("******   ERROR initializing GUI:   ******");
            PlatsR_GUI.log(e.message);
            PlatsR_GUI.NO_ERRORS = false;
        }
        PlatsR_GUI.log("**************************************************************");
        PlatsR_GUI.log("\tGUI initialized in " + (new Date() - PlatsR_GUI.BOOT_TIME) + " milliseconds.");
        PlatsR_GUI.log("**************************************************************");
    },
    
    initNewCollectionPage : function () {
    	if ($(".editableNewCollectionName").length!=0){
    		//setConfirmUnload(true);
    	}
    },
    
    
    /**
     * sets upp the ajax autocompleter for search
     */
    initSearchAutocompleter : function() {
    	$( "#searchText" ).autocomplete({
    		source: routes.getWords(),
    		minLength: 2,
    		select: function( event, ui ) {
    			$( "#searchText" ).val( ui.item.value );
    			return false;
    		}
    	});
    },
    
    /**
     * Shows an ajax spinner while ajax request is done,
     * attached to the element.
     */
    showloader : function (element, elementToHide) {
    	$(element +' div.loading').fadeOut('slow', function(){
    		if (elementToHide !== undefined) {
    			$(elementToHide).addClass('hidden');
    		}
    		$(this).toggleClass('hidden');
    	});
    },
    
    /**
     * Removes the ajax spinner when the ajax request is done.
     */
    hideloader : function (element, elementToHide) {
    	$(element + ' div.loading').fadeIn('fast', function(){
    		$(this).toggleClass('hidden');
    		if (elementToHide !== undefined) {
    			$(elementToHide).removeClass('hidden');
    		}
    	});
    },

    /**
     * This function calls the map
     * function in defaultMap.js, to
     * build the startpage map
     */
    initIndexPageMap : function () {
        'use strict';
        PlatsR_map.mapInit('START_PAGE_MAP', -1, null, null, null);
    },

    /**
     * This function calls the map
     * function in defaultMap.js, to
     * build the places(and collections)page map
     */
    initPlacesPageMap : function () {
        'use strict';
        PlatsR_map.mapInit('LARGE_MAP', -1, null, null, null);
    },
    /**
     * This function calls the for
     * the collection page
     */
    initCollectionPageMap : function () {
        'use strict';
        var collectionMapParams,
            mapType,
            coords;
        collectionMapParams = $('#map');
        mapType = $(collectionMapParams).data('maptype');
        coords = $(collectionMapParams).data('coords');
        if (mapType === "COLLECTION_NO_PLACES_MAP") {
            PlatsR_map.mapInit(mapType, 0, null, null, null);
        } else {
            PlatsR_map.mapInit(mapType, -1, coords, null, null);
        }
    },
    /**
     * This function calls the map
     * function in defaultMap.js, to
     * build the placepage map
     */
    initPlacePageMap : function () {
        'use strict';
        var miniMapParams,
            placeid,
            firstCoord,
            secondCoord;
        miniMapParams = $('#miniMapParams');
        placeid = $(miniMapParams).data('placeid');
        firstCoord = $(miniMapParams).data('firstcoord');
        secondCoord = $(miniMapParams).data('secondcoord');
        PlatsR_map.mapInit('SMALL_MAP', placeid, null, firstCoord, secondCoord);
    },
    /**
     * This function calls the map
     * function in defaultMap.js, to
     * build the searchpage map
     */
    initSearchMap : function () {
        'use strict';
        var searchResult,
            searchMapParams,
            placeid,
            xcoord,
            ycoord,
            searchResultLength;
        searchResult = $('#searchResult').text();
        searchResult = $.parseJSON(searchResult);
        searchResultLength = searchResult.length; 
        searchMapParams = $('#searchMapParams');
        placeid = $(searchMapParams).data('placeid');
        xcoord = $(searchMapParams).data('xcoord');
        ycoord = $(searchMapParams).data('ycoord');
        searchResult = (searchResultLength === 0) ? null : searchResult;
        PlatsR_map.mapInit('LARGE_MAP', placeid, searchResult, xcoord, ycoord);
    },
    /**
     * This function calls the 
     * map in the profile page
     */
    initProfilePageMap : function () {
        'use strict';
        var placeIds,
            objectId,
            placesIdsLength;
        placeIds = $('#profilePlaceIds').text();
        placeIds = $.parseJSON(placeIds);
        placesIdsLength = placeIds.length;
        objectId = (placesIdsLength === 0) ? 0 : -1;
        placeIds = (placesIdsLength === 0) ? null : placeIds;
        PlatsR_map.mapInit('LARGE_MAP', objectId, placeIds, null, null);

    },
    
    /**
     * Provides the default options for
     * the dialogs.
     */
    dialogDefaultOptions : function () {
    	'use strict';
    	var defaults = {
    		autoOpen: false,
            resizable: false,
            draggable: false,
            modal: true,
            show: 'fade',
            hide: 'fade'
    	};
    	
    	return defaults;
    },
    
    /**
     * This function handles Modernizr
     * checking if browser supports 
     * specific functions
     */
    initCheckMBrowsers : function () {
        'use strict';
        Modernizr.load({
            test: Modernizr.input.placeholder && Modernizr.textarea.placeholder,
            nope: ["http://cdnjs.cloudflare.com/ajax/libs/jquery-placeholder/2.0.7/jquery.placeholder.min.js"],//let's load the placeholder plugin from CDN
            complete: function () {
                $('input, textarea').placeholder();
            }
        }); 
    },
    /**
     * This functions gets the number of private events for the logged in user
     */
    checkEventList : function() {
    	'use strict';
        $.ajax({
        	url: routes.countPrivateEvents(),
        	dataType: 'json'
        		
        })
        .done(function (data) {
        	if (data > 0) {
				$('.eventListLink a span').remove();	
        		$('.eventListLink a').append(" <span><span>" + data + "</span></span>");
        	}
        })
        .fail(function (xhr, textStatus, thrownError) {
            PlatsR_GUI.ajaxError(xhr, textStatus, thrownError);
        });
    },
    
    /**
     * This function gets the number of events related to the user,
     * and displays them in a JQuery UI Dialog
     */
    initEventListLink : function () {
        'use strict';
        PlatsR_GUI.checkEventList();
        setInterval(function(){
        	$.ajax({
        		url: routes.countPrivateEvents(),
        		dataType: 'json'
        			})
        			.done(function (data) {
        				if (data > 0) {
        					$('.eventListLink a span').remove();
        					$('.eventListLink a').append(" <span><span>" + data + "</span></span>");
        					}
        				})
    				.fail(function (xhr, textStatus, thrownError) {
    					PlatsR_GUI.ajaxError(xhr, textStatus, thrownError);
    					});
        	},60000);
        $('.eventListLink a').on('click', function () {
            
                var eventDialog = $('<div/>').addClass('eventDialog');
                var url = routes.getPrivateEvents();
                eventDialog.dialog({
                    autoOpen: false,
                    resizable: false,
                    draggable: false,
                    modal: false,
                    dialogClass: 'myEvents',
                    position: {my: "left top", at: "left bottom", of: "li.eventListLink"},
                    width: 280,
                    height: 'auto',
                    open: function (event, ui) {
                    	$(this).load(url, function(response, status, xhr){
                        	if (status === "error") {
                        		PlatsR_GUI.ajaxError(xhr, status, null);
                        	} else {
                        		$.post(routes.privateEventsRead());
                        	}
                        });
                    },
                    close:  function (event, ui) {
                    		$(document).unbind("mouseup");
                            $('.eventListLink a span').remove();
                            $(this).remove();
                        }
                });
        		eventDialog.dialog('open');
                $('.myEvents .ui-dialog-titlebar').hide();
                $(document).mouseup(function (e) {
                	eventDialog.dialog("close");
                	if ('href' in e.target){
                		location.href=e.target.href;
                	}
                });
            });
            
    }, 
        
    /**
     * This function activates some common links,
     * mostly used.
     */ 
    initStarttopFunctions : function () {
        'use strict';
        //hide topsearch title/tooltip
        PlatsR_GUI.tooltipHide('#searchText');
        //open login-dialog from pagetop
        $('.login-link').on('click', function (e) {
            e.preventDefault();
            var title = $(this).data('title'),
                url = $(this).attr('href');
            PlatsR_GUI.openLoginDialog(title, url, null);
        });
        
        //open create-place dialog from pagetop or places/collections page
        $('.create-place').on('click', function (e) {
            e.preventDefault();
            var title = $(this).data('loginmsg'), 
                url = $(this).data('url');
            PlatsR_GUI.openLoginDialog(title, url, null);
        });
        
        //open create-collection dialog from pagetop or places/collections page
        $('.create-collection').on('click', function (e) {
            e.preventDefault();
            var title = $(this).data('loginmsg'), 
                url = $(this).data('url');
            PlatsR_GUI.openLoginDialog(title, url, null);
        });
        
        //open register-dialog from pagetop
        $('.register-link').on('click', function (e) {
            e.preventDefault();
            var title = $(this).data('title'),
                url = $(this).attr('href');
            PlatsR_GUI.openRegDialog(title, url);
        });
        
        //open copyright-dialog for story/image
        $('.copyright-link').on('click', function (e) {
            e.preventDefault();
            var title = $(this).data('title'),
                storyid = $(this).data('storyid'),
                placeid = $(this).data('placeid');
            PlatsR_GUI.openCopyrightDialog(title, storyid, placeid);
        });
        
        //open dialog for editing places map-position
        $('.edit-map-position').on('click', function (e) {
            e.preventDefault();
            var placeid = $(this).data('placeid');
            var title = $(this).data('title');
            PlatsR_GUI.openEditPlaceMapDialog(placeid, title);
        });
        
        //open dialog for connecting place with collection and vice-versa
        $('.connect-place-collection').on('click', function (e) {
            e.preventDefault();
            var collectionid = $(this).data('collectionid');
            var placeid = $(this).data('placeid');
            var title = $(this).data('title');
            var isAlreadyBookmarked = $(this).data('isalreadybookmarked');
            PlatsR_GUI.connectPlaceCollectionDialog(collectionid, placeid, title, isAlreadyBookmarked);
        });
        
        //link for adding bookmarks
        $('.do-bookmark').on('click', function (e) {
            e.preventDefault();
            var placeid = $(this).data('placeid');
            var collectionid = $(this).data('collectionid');
            PlatsR_GUI.addBookmark(placeid, collectionid);
        });

        //open dialog for reporting place, collection or comment
        $('.report-comment-place-collection').on('click', function (e) {
            e.preventDefault();
            var commentid = $(this).data('commentid');
            var placeid = $(this).data('placeid');
            var collectionid = $(this).data('collectionid');
            var title = $(this).data('title');
            PlatsR_GUI.openReportDialog(commentid, placeid, collectionid, title);
        });
        
        //open dialog for sending messages
        $('.send-mail-user').on('click', function (e) {
            e.preventDefault();
            var userid = $(this).data('userid');
            var title = $(this).data('title');
            PlatsR_GUI.openMessageDialog(userid, title);
        });
    },
    
    /**
     * This function initializes
     * functionality for the
     * leaderboard on the startpage
     */
    initLeaderBoard : function () {
        'use strict';
        //originates from a separate script leaderboard.js
        $("#latestUpdated").on('click', function () {
            $("#latestUpdated").prop("class", "button-filter-selected");
            $("#mostPopular").prop("class", "button-filter");
            $("#mostComments").prop("class", "button-filter");
            $("#latestImages").prop("class", "button-filter");
            $("#mostActiveUsers").prop("class", "button-filter");
            $("#latestUpdatedArticle").show("fast");
            $("#mostPopularArticle").hide("fast");
            $("#mostCommentArticle").hide("fast");
            $("#mostRecentImagesArticle").hide("fast");
            $("#mostActiveUsersArticle").hide("fast");
        });
        
        $("#mostPopular").on('click', function () {
            $("#latestUpdated").prop("class", "button-filter");
            $("#mostPopular").prop("class", "button-filter-selected");
            $("#mostComments").prop("class", "button-filter");
            $("#latestImages").prop("class", "button-filter");
            $("#mostActiveUsers").prop("class", "button-filter");
            $("#latestUpdatedArticle").hide("fast");
            $("#mostPopularArticle").show("fast");
            $("#mostCommentArticle").hide("fast");
            $("#mostRecentImagesArticle").hide("fast");
            $("#mostActiveUsersArticle").hide("fast");
        });
        
        $("#mostComments").on('click', function () {
            $("#latestUpdated").prop("class", "button-filter");
            $("#mostPopular").prop("class", "button-filter");
            $("#mostComments").prop("class", "button-filter-selected");
            $("#latestImages").prop("class", "button-filter");
            $("#mostActiveUsers").prop("class", "button-filter");
            $("#latestUpdatedArticle").hide("fast");
            $("#mostPopularArticle").hide("fast");
            $("#mostCommentArticle").show("fast");
            $("#mostRecentImagesArticle").hide("fast");
            $("#mostActiveUsersArticle").hide("fast");
        });
        
        $("#latestImages").on('click', function () {
            $("#latestUpdated").prop("class", "button-filter");
            $("#mostPopular").prop("class", "button-filter");
            $("#mostComments").prop("class", "button-filter");
            $("#latestImages").prop("class", "button-filter-selected");
            $("#mostActiveUsers").prop("class", "button-filter");
            $("#latestUpdatedArticle").hide("fast");
            $("#mostPopularArticle").hide("fast");
            $("#mostCommentArticle").hide("fast");
            $("#mostRecentImagesArticle").show("fast");
            $("#mostActiveUsersArticle").hide("fast");
        });
        
        $("#mostActiveUsers").on('click', function () {
            $("#latestUpdated").prop("class", "button-filter");
            $("#mostPopular").prop("class", "button-filter");
            $("#mostComments").prop("class", "button-filter");
            $("#latestImages").prop("class", "button-filter");
            $("#mostActiveUsers").prop("class", "button-filter-selected");
            $("#latestUpdatedArticle").hide("fast");
            $("#mostPopularArticle").hide("fast");
            $("#mostCommentArticle").hide("fast");
            $("#mostRecentImagesArticle").hide("fast");
            $("#mostActiveUsersArticle").show("fast");
        });
    },
    
    /**
     * This function intializes the
     * slider.js for showing featured 
     * places images.
     */
    initFeatured : function () {
        'use strict';
        //originates from a separate script featured.js
        $('#slides').slides({
            generatePagination : true,
            preload : true,
            preloadImage : '/public/images/slides/loading.gif',
            play : 10000,
            pause : 2500,
            fadeSpeed : 350,
            slideSpeed : 600,
            hoverPause : true,
            paginationClass : 'featurePagination',
            animationStart : function (current) {
                $('.caption').animate({
                    bottom : -35
                }, 100);
            },
            animationComplete : function (current) {
                $('.caption').animate({
                    bottom : 0
                }, 200);
            },
            slidesLoaded : function () {
                $('.caption').animate({
                    bottom : 0
                }, 200);
            }
        });
    },
    
    /**
     * This function is
     * responsible for refreshing
     * one or more sections of a page
     * using one $.get, parameters are,
     * url for getting refreshed html,
     * elementsArray is an array elements to be updated,
     * functionsArray is an array of "functions" (reinitiating
     * events for the refreshed html parts)
     */
    contentRefresh : function (url, elementsArray, functionsArray) {
        'use strict';
        $.get(url, function (data) {
            $.each(elementsArray, function (index, element) {
                $('#' + element).html($(data).find('#' + element));
            });
        }, 'html')
        .done(function () {
            $.each(functionsArray, function (index, func) {
                func.call();
            });
        })
        .fail(function (xhr, textStatus, thrownError) {
            PlatsR_GUI.ajaxError(xhr, textStatus, thrownError);
        });
    },
    
    /**
     * This method opens a JQuery UI Dialog
     * for reporting a place, collection or
     * comment
     */
    openReportDialog : function (commentid, placeid, collectionid, title) {
        'use strict';
        var url,
            reportDialog,
            arr;
        url = routes.openReportDialog({commentid: commentid, placeid: placeid, collectionid: collectionid});
        reportDialog = $('<div/>').addClass('reportDialog');
        reportDialog.load(url).dialog({
            autoOpen: false,
            resizable: false,
            modal: true,
            width: 575,
            height: 'auto',
            title: title,
            dialogClass: 'customDialog',
            open: function (e, ui) {
            	//setConfirmUnload(true);
            },
            close: function (e, ui) {
            	//setConfirmUnload(false);
                $('.reportDialog').unbind('.reports');
                $(this).remove();
            }
        });
        
        arr = [];
        arr.push(commentid);
        arr.push(placeid);
        arr.push(collectionid);
        arr.push(title);
        
        PlatsR_GUI.assureLoggedOn(PlatsR_GUI.openReportDialog, reportDialog, arr);
            
        $('.reportDialog').on('click.reports', '.cancel-link', function (e) {
                e.preventDefault();
                PlatsR_GUI.closeDialog($('.reportDialog'));
            });
            
        $('.reportDialog').on('submit.reports', '#sendReportForm', function (e) {
                e.preventDefault();
                var reportObject = $('#reportObject');
                var value = reportObject.val();
                var name = reportObject.attr('name');
                var commentid = 0;
                var placeid = 0;
                var collectionid = 0;
                var reportcause = PlatsR_GUI.tidyInput($('textarea[name="reportCause"]').val());
                var reportData = "";
                
                if (name === "comment") {
                    commentid = value;
                    reportData += "commentid=" + commentid + "&"; 
                } else if (name === "place") {
                    placeid = value;
                    reportData += "placeid=" + placeid + "&";  
                } else if (name === "collection") {
                    collectionid = value;
                    reportData += "collectionid=" + collectionid + "&";
                }
                reportData += "reportcause=" + reportcause;
                
                var posting = $.post(routes.sendReport(), reportData);
                
                posting.done(function (data) {
                    if ($.isEmptyObject(data)) {
                        $('form#sendReportForm').addClass('hidden');
                        $('section#reportInfo').removeClass('hidden');
                    } else {
                        $('#updateReportDialog').load(url + ' #updateReportDialog > *');
                    }   
                })
                .fail(function (xhr, textStatus, thrownError) {
                    PlatsR_GUI.closeDialog($('.reportDialog'));
                    PlatsR_GUI.ajaxError(xhr, textStatus, thrownError);
                });
            });
    },
    
    initImageBrowser : function () {
        'use strict';
        var imageWrapper = $('.imageScroller'),
            imageCount = $('.image-list-item').size();
       
        if (imageCount > 0) {
            PlatsR_GUI.generalScroller(imageWrapper);
            PlatsR_GUI.initGallery('#gallery');
        }
    },
    
    /**
     * Initializes the image popup,
     * on the id passed in.
     */
    initLargeImagePopup : function () {
    	'use strict';
    	PlatsR_GUI.initGallery('#largeImagePopup');
    },
    
    /**
     * 
     * Initializes the story image popup,
     * on the id passed in.
     */
    initStoryLargePopup : function () {
    	'use strict';
    	PlatsR_GUI.initGallery('#storyLargeImagePopup');
    },
    
    
    /**
     * Initializes the image popup,
     * on the id passed in.
     */
    initGallery : function (galleryid) {
    	'use strict';
    	$(galleryid).imagegallery({
            // selector given to jQuery's delegate method:
            selector: 'a[data-gallery="gallery"]',
            // event handler namespace:
            namespace: 'imagegallery',
            // Shows the next image after the given time in ms (0 = disabled):
            slideshow: 0,
            // Offset of image width to viewport width:
            offsetWidth: 100,
            // Offset of image height to viewport height:
            offsetHeight: 100,
            // Display images fullscreen (overrides offsets):
            fullscreen: false,
            // Display images as canvas elements:
            canvas: false,
            // body class added on dialog display:
            bodyClass: 'gallery-body',
            // element id of the loading animation:
            loaderId: 'gallery-loader',
            // list of available dialog effects,
            // used when show/hide is set to "random":
            effects: [
                'blind',
                'clip',
                'drop',
                'explode',
                'fade',
                'fold',
                'puff',
                'slide',
                'scale'
            ],
            // The following are jQuery UI dialog options, see
            // http://jqueryui.com/demos/dialog/#options
            // for additional options and documentation:
            modal: true,
            resizable: false,
            width: 'auto',
            height: 'auto',
            show: 'fade',
            hide: 'fade',
            closeOnEscape: true,
            dialogClass: 'gallery-dialog',
            create: function (event, ui) {
                var widget = $(this).dialog('widget');
                $('.ui-dialog-titlebar-close span', widget)
                .removeClass('ui-icon-closethick')
                .addClass('imageCustomCloseButton');
                $('.gallery-dialog').append("<div class='imageInfo'></div>");
                $('.imageInfo').attr("style", "width:" + $('.gallery-dialog img').attr("width") + "px;");
                $('.imageInfo').append("<div class='imageDescription'></div>");
                $('.imageDescription').append("<h4>" + $("[data-url='" + $('.gallery-dialog img').attr('src') + "']").attr('data-title') + "</h4>");
                $('.imageDescription').append("<p>" + $("[data-url='" + $('.gallery-dialog img').attr('src') + "']").attr('data-description') + "</p>");
                $('.imageInfo').append("<div class='imageCopyright'></div>");
                $('.imageCopyright').append("<p >Upphovsman: " + $("[data-url='" + $('.gallery-dialog img').attr('src') + "']").attr('data-author') + "</p>");
                $('.imageCopyright').append("<p class='copyrightDescription left'>UpphovsrÃ¤tt: " + $("[data-url='" + $('.gallery-dialog img').attr('src') + "']").attr('data-copyright') + " - " + $("[data-url='" + $('.gallery-dialog img').attr('src') + "']").attr('data-copyrightDescription') + "</p>");
                $('.imageCopyright').append("<p class='imageNumber right'>Bild " + $("[data-url='" + $('.gallery-dialog img').attr('src') + "']").attr('data-imageNumber') + " av " + $("[data-url='" + $('.gallery-dialog img').attr('src') + "']").attr('data-numberOfImages') + "</p>");
            }
        });
    },
    
    /**
     * This function just setup the parameters for 
     * scrolling, for images, videos and archiveobjects, 
     * and activates the extended version of the
     * JQuery UI Slider.
     */
    generalScroller : function (scrollWrapper) {
        'use strict';
        var scrollPane = scrollWrapper.find(".scroll-pane"),
        scrollContent = scrollWrapper.find(".scroll-content"),
        imagesSize = scrollWrapper.find('div.scroll-content-item').length,
        scrollContentItemWidth = parseInt(scrollWrapper.find('.scroll-content-item').css('width').replace(/px/g, ''), 10),
        scrollContentMarginLeft = parseInt(scrollWrapper.find('.scroll-content-item').css('marginLeft').replace(/px/g, ''), 10),
        scrollContentMarginRight = parseInt(scrollWrapper.find('.scroll-content-item').css('marginRight').replace(/px/g, ''), 10);
        
        //this sets the width for the images-container ('.scroll-content'), so one cannot scroll beyond the last image
        scrollContent.width((imagesSize + 1.5) * (scrollContentItemWidth + scrollContentMarginLeft + scrollContentMarginRight));
        var stepSize = 10;
        if (scrollContentItemWidth > 0) {
            stepSize = Math.floor(Math.abs(100 / (scrollContent.width() / scrollPane.width())));
        }
    
    
        function checkScrollCtrl(pos) {
            if (pos < 1) {
                scrollWrapper.find(".prev").addClass("inactiveScroll");
                scrollWrapper.find(".prev").parent().addClass("inactiveScroll");
                scrollWrapper.find(".next").removeClass("inactiveScroll");
                scrollWrapper.find(".next").parent().removeClass("inactiveScroll");
            } else if (pos >= 1 && pos <= 99) {
                scrollWrapper.find(".prev").removeClass("inactiveScroll");
                scrollWrapper.find(".prev").parent().removeClass("inactiveScroll");
                scrollWrapper.find(".next").removeClass("inactiveScroll");
                scrollWrapper.find(".next").parent().removeClass("inactiveScroll");
            } else if (pos > 99) {
                scrollWrapper.find(".next").addClass("inactiveScroll");
                scrollWrapper.find(".next").parent().addClass("inactiveScroll");
            }
        }

    
        //build slider
        var scrollbar = scrollWrapper.find(".scroll-bar").slider({
            step: stepSize,
            change: function (event, ui) {
                if (scrollContent.width() > scrollPane.width()) {
                    scrollContent.animate({ "margin-left": Math.round(
                    ui.value / 100 * (scrollPane.width() - scrollContent.width())
             )}, 'slow');
                } else {
                    scrollContent.css("margin-left", 0);
                }
            }
        });
    
        $.extend($.ui.slider.prototype, {
            next: function () {
                    this.value(this.value() + this.options.step);
                    checkScrollCtrl(this.value());
                },
            prev: function () {
                    this.value(this.value() - this.options.step);
                    checkScrollCtrl(this.value());
                }
        });
    
        scrollWrapper.find(".prev").on('click.sliderClick', function (e) {
            scrollWrapper.find(".scroll-bar").slider("prev");
        });
        scrollWrapper.find(".next").on('click.sliderClick', function (e) {
            scrollWrapper.find(".scroll-bar").slider("next");
        });
     
        //append icon to handle
        var handleHelper = scrollbar.find(".ui-slider-handle")
            .mousedown(function () {
            scrollbar.width(handleHelper.width());
        })
            .mouseup(function () {
            scrollbar.width("100%");
        })
        .append("<span class='ui-icon ui-icon-grip-dotted-vertical'></span>")
        .wrap("<div class='ui-handle-helper-parent'></div>").parent();
     
        //change overflow to hidden now that slider handles the scrolling
        scrollPane.css("overflow", "hidden");
     
        //size scrollbar and handle proportionally to scroll distance
        function sizeScrollbar() {
            var remainder = scrollContent.width() - scrollPane.width();
            var proportion = remainder / scrollContent.width();
            var handleSize = scrollPane.width() - (proportion * scrollPane.width());
            scrollbar.find(".ui-slider-handle").css({
                width: handleSize,
                "margin-left": -handleSize / 2
            });
            handleHelper.width("").width(scrollbar.width() - handleSize);
        }
     
        //reset slider value based on scroll content position
        function resetValue() {
            var remainder = scrollPane.width() - scrollContent.width();
            var leftVal = scrollContent.css("margin-left") === "auto" ? 0 :
                parseInt(scrollContent.css("margin-left"), 10);
            var percentage = Math.round(leftVal / remainder * 100);
            scrollbar.slider("value", percentage);
        }
     
        //if the slider is 100% and window gets larger, reveal content
        function reflowContent() {
            var showing = scrollContent.width() + parseInt(scrollContent.css("margin-left"), 10);
            var gap = scrollPane.width() - showing;
            if (gap > 0) {
                scrollContent.css("margin-left", parseInt(scrollContent.css("margin-left"), 10) + gap);
            }
        }
     
        //change handle position on window resize
        $(window).resize(function () {
            resetValue();
            sizeScrollbar();
            reflowContent();
        });
        //init scrollbar size
        setTimeout(sizeScrollbar, 10);//safari wants a timeout  
    },
    
    /**
     * This function intializes browsing capabilities
     * for videos (thumbnails), and buttons/function-calls for edit/add/view
     * video/videos
     */
    initVideoBrowser : function () {
        'use strict';
        //updates the videobrowser section, since iframe breaks the layout
        //this call inserts the iframe(if any) into the DOM after the DOM has loaded
        var videoWrapper = "";
        var videoCount = 0;
        
        $('#videoWrapper').one('click.videoEvents', '.new-video-dialog', function (e) {
            e.preventDefault();
            var title = $(this).data('title');
            var placeid = $(this).data('placeid');
            PlatsR_GUI.openNewVideoDialog(placeid, title);
        });
        
        $('#videoWrapper').one('click.videoEvents', '.edit-video-dialog', function (e) {
            e.preventDefault();
            var title = $(this).data('title');
            var placeid = $(this).data('placeid');
            PlatsR_GUI.openShowEditDeleteVideoDialog(placeid, title);
        });
        
        $('#videoWrapper').one('click.videoEvents', 'a.open-single-video', function (e) {
            e.preventDefault();
            var videoid = $(this).data('videoid');
            PlatsR_GUI.openSingleVideoDialog(videoid);
        });
        
        videoWrapper = $('.videoScroller');        
        videoCount = $('figure.video-list-item').size();
 
        if (videoCount > 0) {
            PlatsR_GUI.generalScroller(videoWrapper);
        }
    },
    
    /**
     * This function opens a dialog for
     * adding a video, for a place
     */
    openNewVideoDialog : function (placeid, title) {
        'use strict';
        var url = routes.newVideo({placeid: placeid}),
            defaults = PlatsR_GUI.dialogDefaultOptions(),
            options = {
        	    'width': 575,
        	    'height': 'auto',
        	    'title': title,
                'dialogClass': 'customDialog',
        	    'open': function (e, ui) {
                	//setConfirmUnload(true);
                },
                'close': function (e, ui) {
                	//setConfirmUnload(false);
                    $('#videoWrapper').unbind('.videoEvents');
                    PlatsR_GUI.initVideoBrowser();
                    $(this).remove();
                }
            }; 
        var videoDialog = $('<div/>').addClass('newVideoDialog').dialog($.extend({}, defaults, options));
        videoDialog.load(url).dialog();
        
        var arr = [];
        arr.push(placeid);
        arr.push(title);
        
        PlatsR_GUI.assureLoggedOn(PlatsR_GUI.openNewVideoDialog, videoDialog, arr);
        
        $('.newVideoDialog').on('click', '.cancel-link', function (e) {
            e.preventDefault();
            PlatsR_GUI.closeDialog($('.newVideoDialog'));
        });
        
        $('.newVideoDialog').on('submit', '#newVideoForm', function (e) {
            e.preventDefault();
            var newData,
            	url,
            	name,
            	upphovsman,
                posting;
            newData = $('#newVideoForm').serialize();
            
            $.each(newData, function(i, fd) {
            	if (fd.name === 'url') {
            		url = PlatsR_GUI.tidyInput(fd.value);
            		fd.value = url
            	} else if (fd.name === 'name') {
            		name = PlatsR_GUI.tidyInput(fd.value);
            		fd.value = name;
            	} else if (fd.name === 'upphovsman') {
            		upphovsman = PlatsR_GUI.tidyInput(fd.value);
            		fd.value = upphovsman;
            	}
            });
            
            if (url === '' || name === '' || upphovsman === '') {
            	alert("Du mÃ¥ste skriva in riktiga vÃ¤rden.");
            	return false;
            }
            
            posting = $.post(routes.addVideo(), newData);
            
            posting.done(function (data) {
                if ($.isEmptyObject(data)) {
                    $('#videoWrapper').load(routes.showPlace({id: placeid}) + ' #videoWrapper > *', function () {
                        PlatsR_GUI.closeDialog($('.newVideoDialog'));
                    });
                } else {
                    $('#updateNewVideoForm').load(routes.newVideo({placeid: placeid}) + ' #updateNewVideoForm > *');
                }   
            })
            .fail(function (xhr, textStatus, thrownError) {
                PlatsR_GUI.closeDialog($('.newVideoDialog'));
                PlatsR_GUI.ajaxError(xhr, textStatus, thrownError);
            });
        });
    },
    
    /**
     * This method opens a JQuery UI Dialog,
     * used for displaying videos for
     * editing or deleting 
     */
    openShowEditDeleteVideoDialog : function (placeid, title) {
        'use strict';
        var url = routes.showVideo({placeid: placeid}); 
        var editOrDeleteVideoDialog = $('<div/>').addClass('editOrDeleteVideoDialog');
        editOrDeleteVideoDialog.load(url).dialog({
            autoOpen: false,
            resizable: false,
            modal: true,
            width: 350,
            height: 'auto',
            title: title,
            dialogClass: 'customDialog',
            open: function (e, ui) {
            	//setConfirmUnload(true);
            },
            close: function (e, ui) {
            	//setConfirmUnload(false);
                $('#videoWrapper').unbind('.videoEvents');
                PlatsR_GUI.initVideoBrowser();
                $(this).remove();
            }
        });
        
        var arr = [];
        arr.push(placeid);
        arr.push(title);
        
        PlatsR_GUI.assureLoggedOn(PlatsR_GUI.openShowEditDeleteVideoDialog, editOrDeleteVideoDialog, arr);
        
        $('.editOrDeleteVideoDialog').on('click', '.cancel-link', function (e) {
            e.preventDefault();
            PlatsR_GUI.closeDialog($('.editOrDeleteVideoDialog'));
        });
        
        $('.editOrDeleteVideoDialog').on('click', '.edit-video', function (e) {
            e.preventDefault();
            var placeid = $(this).data('placeid');
            var videoid = $(this).data('videoid');
            var title = $(this).data('title');
            PlatsR_GUI.closeDialog($('.editOrDeleteVideoDialog'));
            PlatsR_GUI.openEditVideoDialog(videoid, placeid, title);
        });
        
        $('.editOrDeleteVideoDialog').on('click', '.delete-video', function (e) {
            e.preventDefault();
            var placeid = $(this).data('placeid');
            var videoid = $(this).data('videoid');
            var deleteData = "";
            deleteData += "placeid=" + placeid + "&";
            deleteData += "videoid=" + videoid;
            var posting = $.post(routes.deleteVideo(), deleteData);
            
            posting.done(function (data) {
                $('#showVideo').load(routes.showVideo({placeid: placeid}) + ' #showVideo > *');
                $('#videoWrapper').load(routes.showPlace({id: placeid}) + ' #videoWrapper > *');
            })
            .fail(function (xhr, textStatus, thrownError) {
                PlatsR_GUI.closeDialog($('.editOrDeleteVideoDialog'));
                PlatsR_GUI.ajaxError(xhr, textStatus, thrownError);
            });
            
        });
    },
    
    /**
     * This method opens a dialog for
     * editing a specific video
     */
    openEditVideoDialog : function (videoid, placeid, title) {
        'use strict';
        var url = routes.editVideoForm({videoid: videoid});
        var editVideoDialog = $('<div/>').addClass('editVideoDialog');
        editVideoDialog.load(url).dialog({
            autoOpen: false,
            resizable: false,
            modal: true,
            width: 575,
            height: 'auto',
            title: title,
            dialogClass: 'customDialog',
            open: function (e, ui) {
            	//setConfirmUnload(true);
            },
            close: function (e, ui) {
            	//setConfirmUnload(false);
                $('#videoWrapper').unbind('.videoEvents');
                PlatsR_GUI.initVideoBrowser();
                $(this).remove();
            },
            create: function (e, ui) {
         
            }
        });
        
        editVideoDialog.dialog('open');
         
        $('.editVideoDialog').on('click', '.cancel-link', function (e) {
            e.preventDefault();
            PlatsR_GUI.closeDialog($('.editVideoDialog'));
        });
        
        $('.editVideoDialog').on('submit', '#editVideoForm', function (e) {
            e.preventDefault();
            var editData = $('#editVideoForm').serialize();            
            var placeid = $('input[name="placeid"]').val();
            var videoid = $('input[name="videoid"]').val();
            
            $.each(editData, function(i, fd) {
            	if (fd.name === 'url') {
            		url = PlatsR_GUI.tidyInput(fd.value);
            		fd.value = url
            	} else if (fd.name === 'name') {
            		name = PlatsR_GUI.tidyInput(fd.value);
            		fd.value = name;
            	} else if (fd.name === 'upphovsman') {
            		upphovsman = PlatsR_GUI.tidyInput(fd.value);
            		fd.value = upphovsman;
            	}
            });
            
            if (url === '' || name === '' || upphovsman === '') {
            	alert("Du mÃ¥ste skriva in riktiga vÃ¤rden.");
            	return false;
            }
            
            var posting = $.post(routes.saveEditedVideo(), editData);
            
            posting.done(function (data) {
                if ($.isEmptyObject(data)) {
                    $('#videoWrapper').load(routes.showPlace({id: placeid}) + ' #videoWrapper > *', function () {
                        PlatsR_GUI.closeDialog($('.editVideoDialog'));
                    });
                } else {
                    $('#updateEditVideoForm').load(routes.editVideoForm({videoid: videoid}) + ' #updateEditVideoForm > *');
                }   
            })
            .fail(function (xhr, textStatus, thrownError) {
                PlatsR_GUI.closeDialog($('.editVideoDialog'));
                PlatsR_GUI.ajaxError(xhr, textStatus, thrownError);
            });
            
            
        });
        
    },
    
    initSingleVideoDialog : function (dialogClass, url) {
        'use strict';
        var singleVideoDialog = $('<div/>').addClass('singleVideoDialog');
        singleVideoDialog.load(url).dialog({
            autoOpen: false,
            resizable: false,
            modal: true,
            width: 580,
            height: 390,
            dialogClass: dialogClass,
            create: function (event, ui) {
                $(".ui-dialog-titlebar-close").addClass('custom-close-icon');
                $(".ui-dialog").addClass('custom-dialog');
                $('.ui-icon').addClass('hide-default-icon');
            },
            open: function (e, ui) {
            	//setConfirmUnload(true);
            },
            close: function (event, ui) {
            	//setConfirmUnload(false);
                $('#videoWrapper').unbind('.videoEvents');
                PlatsR_GUI.initVideoBrowser();
                $('iframe.single-youtube-player').remove();
                $(this).remove();
            }
        });
        return singleVideoDialog;
    },
    
    openSingleVideoDialog : function (videoid) {
        'use strict';
        var url = routes.showSingleVideo() + "?videoid=" + videoid;
        var dialogClass = 'singleVideoPlayer',
            singleVideoDialog = PlatsR_GUI.initSingleVideoDialog(dialogClass, url);
        
        singleVideoDialog.dialog('open');
    },
    
    /**
     * This method initializes the sound
     * add, edit buttons
     */
    initSoundBrowser : function () {
        'use strict';
        $('#soundsection').on('click', '.add-sound-dialog', function (e) {
            e.preventDefault();
            var placeid = $(this).data('placeid');
            var title = $(this).data('title');
            PlatsR_GUI.openSoundDialog(placeid, title);
        });
        
        $('#soundsection').on('click', '.edit-sound-dialog', function (e) {
            e.preventDefault();
            var placeid = $(this).data('placeid');
            var title = $(this).data('title');
            PlatsR_GUI.openEditOrDeleteSoundDialog(placeid, title);
        });
    },
    
    /**
     * This method opens a JQuery UI Dialog
     * for adding a new soundclip
     */
    openSoundDialog : function (placeid, title) {
        'use strict';
        var url = routes.newSoundForm({placeid: placeid});
        var soundDialog = $('<div/>').addClass('soundDialog');
        soundDialog.load(url).dialog({
            autoOpen: false,
            resizable: false,
            modal: true,
            width: 575,
            height: 'auto',
            title: title,
            dialogClass: 'customDialog',
            open: function (e, ui) {
            	//setConfirmUnload(true);
            },
            close: function (e, ui) {
            	//setConfirmUnload(false);
                $(this).remove();
            }
        });
        
        var arr = [];
        arr.push(placeid);
        arr.push(title);
            
        PlatsR_GUI.assureLoggedOn(PlatsR_GUI.openSoundDialog, soundDialog, arr);
            
        $('.soundDialog').on('click', '.cancel-link', function (e) {
                e.preventDefault();
                PlatsR_GUI.closeDialog($('.soundDialog'));
        });
            
        $('.soundDialog').on('submit', '#newSoundForm', function (e) {
            e.preventDefault();
            var newData = $('#newSoundForm').serialize(),
            	placeid = $('input[name="placeid"]').val(),
            	url,
            	name;
            
            $.each(newData, function(i, fd) {
            	if (fd.name === 'url') {
            		url = PlatsR_GUI.tidyInput(fd.value);
            		fd.value = url
            	} else if (fd.name === 'name') {
            		name = PlatsR_GUI.tidyInput(fd.value);
            		fd.value = name;
            	}
            });
            
            if (url === '' || name === '') {
            	alert("Du mÃ¥ste skriva in riktiga vÃ¤rden.");
            	return false;
            }
            
            var posting = $.post(routes.addSound(), newData);
            
            posting.done(function (data) {
                if ($.isEmptyObject(data)) {
                    PlatsR_GUI.closeDialog($('.soundDialog'));
                } else {
                    $('#updateNewSoundForm').load(routes.newSoundForm({placeid: placeid}) + ' #updateNewSoundForm');
                }
                PlatsR_GUI.updateSoundBrowserSection(placeid);
            })
            .fail(function (xhr, textStatus, thrownError) {
                PlatsR_GUI.closeDialog($('.soundDialog'));
                PlatsR_GUI.ajaxError(xhr, textStatus, thrownError);
            });
        });
    },
    
    /**
     * This method opens a JQuery UI Dialog
     * to view sounds for a place, edit or delete sound
     */
    openEditOrDeleteSoundDialog : function (placeid, title) {
        'use strict';
        var url = routes.showSound({placeid: placeid}); 
        var editOrDeleteSoundDialog = $('<div/>').addClass('editOrDeleteSoundDialog');
        editOrDeleteSoundDialog.load(url).dialog({
            autoOpen: false,
            resizable: false,
            modal: true,
            width: 620,
            height: 'auto',
            title: title,
            dialogClass: 'customDialog',
            open: function (e, ui) {
            	//setConfirmUnload(true);
            },
            close: function (e, ui) {
            	//setConfirmUnload(false);
                $(this).remove();
            }
        });
        
        var arr = new Array();
        arr.push(placeid);
        arr.push(title);
        
        PlatsR_GUI.assureLoggedOn(PlatsR_GUI.openEditOrDeleteSoundDialog, editOrDeleteSoundDialog, arr);
        
        $('.editOrDeleteSoundDialog').on('click', '.cancel-link', function (e) {
            e.preventDefault();
            PlatsR_GUI.closeDialog($('.editOrDeleteSoundDialog'));
        });
        
        $('.editOrDeleteSoundDialog').on('click', '.edit-sound', function (e) {
            e.preventDefault();
            var placeid = $(this).data('placeid');
            var soundid = $(this).data('soundid');
            var title = $(this).data('title');
            PlatsR_GUI.closeDialog($('.editOrDeleteSoundDialog'));
            PlatsR_GUI.openEditSoundDialog(soundid, placeid, title);
        });
        
        $('.editOrDeleteSoundDialog').on('click', '.delete-sound', function (e) {
            e.preventDefault();
            var placeid = $(this).data('placeid');
            var soundid = $(this).data('soundid');
            var deleteData = "placeid=" + placeid + "&soundid=" + soundid;
            var posting = $.post(routes.deleteSound(), deleteData);
            
            posting.done(function (data) {
                if ($.isEmptyObject(data)) {
                    $('#showSound').load(routes.showSound({placeid: placeid}) + ' #showSound', function () {
                        PlatsR_GUI.updateSoundBrowserSection(placeid);
                    });
                }   
            })
            .fail(function (xhr, textStatus, thrownError) {
                PlatsR_GUI.closeDialog($('.editOrDeleteSoundDialog'));
                PlatsR_GUI.ajaxError(xhr, textStatus, thrownError);
            });
        });
    },
    
    /**
     * This method open a JQuery UI Dialog
     * for editing a sound-clip
     */
    openEditSoundDialog : function (soundid, placeid, title) {
        'use strict';
        var url = routes.editSoundForm({soundid: soundid});
        var editSoundDialog = $('<div/>').addClass('editSoundDialog');
        editSoundDialog.load(url).dialog({
            autoOpen: false,
            resizable: false,
            modal: true,
            width: 575,
            height: 'auto',
            title: title,
            dialogClass: 'customDialog',
            open: function (e, ui) {
            	//setConfirmUnload(true);
            },
            close: function (e, ui) {
            	//setConfirmUnload(false);
                $(this).remove();
            },
            create: function (e, ui) {
              
            }
        });
        
        editSoundDialog.dialog('open');
        
        $('.editSoundDialog').on('click', '.cancel-link', function (e) {
            e.preventDefault();
            PlatsR_GUI.closeDialog($('.editSoundDialog'));
        });
        
        $('.editSoundDialog').on('submit', '#editSoundForm', function (e) {
            e.preventDefault();
            var editData = $('#editSoundForm').serialize(),            
            	placeid = $('input[name="placeid"]'),
            	soundid = $('input[name="soundid"]'),
            	url,
            	name;
        
	        $.each(newData, function(i, fd) {
	        	if (fd.name === 'url') {
	        		url = PlatsR_GUI.tidyInput(fd.value);
	        		fd.value = url
	        	} else if (fd.name === 'name') {
	        		name = PlatsR_GUI.tidyInput(fd.value);
	        		fd.value = name;
	        	}
	        });
        
	        if (url === '' || name === '') {
	        	alert("Du mÃ¥ste skriva in riktiga vÃ¤rden.");
	        	return false;
	        }
            
            var posting = $.post(routes.editSound(), editData);
            
            posting.done(function (data) {
                if ($.isEmptyObject(data)) {
                    PlatsR_GUI.closeDialog($('.editSoundDialog'));
                } else {
                    $('#updateEditSoundForm').load(routes.editSoundForm({soundid: soundid}) + ' #updateEditSoundForm');
                }
                PlatsR_GUI.updateSoundBrowserSection(placeid);
            })
            .fail(function (xhr, textStatus, thrownError) {
                PlatsR_GUI.closeDialog($('.editSoundDialog'));
                PlatsR_GUI.ajaxError(xhr, textStatus, thrownError);
            });
        });
    },
    
    /**
     * This method updates places content with the
     * changes caused by adding, editing, deleting
     * sound
     */
    updateSoundBrowserSection : function (placeid) {
        'use strict';
        $('#soundWrapper').load(routes.showPlace({id: placeid}) + ' #soundWrapper');
    },
    
    
    /**
     * This function intializes a JQuery UI Dialog
     * for editing the places position on the map
     */
    openEditPlaceMapDialog : function (placeid, title) {
        'use strict';
        var url,
            editPlaceMapDialog,
            urlRefresh; 
        url = routes.editPlaceMap({placeid: placeid});
        urlRefresh = routes.showPlace({id: placeid});
        editPlaceMapDialog = $('<div/>').addClass('editPlaceMapDialog');
        editPlaceMapDialog.load(url).dialog({
            autoOpen: false,
            resizable: false,
            modal: true,
            width: 800,
            zIndex: 2000,
            position: ['center', 'top'],
            height: 'auto',
            title: title,
            dialogClass: 'customDialog',
            open: function (e, ui) {
            	//setConfirmUnload(true);
            	editPlaceMapDialog.load(url,function (response, status, xhr) {
            		if (status==="success"){
            	        'use strict';
            	        var editPlaceParams,
            	            placeid,
            	            xcoord,
            	            ycoord;
            	        editPlaceParams = $('#editPlaceParams');
            	        placeid = $(editPlaceParams).data('placeid');
            	        xcoord = $(editPlaceParams).data('xcoord');
            	        ycoord = $(editPlaceParams).data('ycoord');
            	        PlatsR_mapOne.mapInitOne('EDIT_PAGE_MAP', placeid, null, xcoord, ycoord);
            		} else {
            			PlatsR_GUI.ajaxError(xhr, status, null);
            		}
            	})
            },
            close: function (e, ui) {
            	//setConfirmUnload(false);
                $(this).remove();
            }
        });
        
        var arr = [];
        arr.push(placeid);
        arr.push(title);
        
        PlatsR_GUI.assureLoggedOn(PlatsR_GUI.openEditPlaceMapDialog, editPlaceMapDialog, arr);
        
        $('.editPlaceMapDialog').on('click', '.cancel-link', function (e) {
            e.preventDefault();
            PlatsR_GUI.closeDialog($('.editPlaceMapDialog'));
            window.location.replace(routes.showPlace({id: placeid}));
        });
        
        $('.editPlaceMapDialog').on('submit', '#editPlaceForm', function (e) {
            e.preventDefault();
            var editMapData = $('#editPlaceForm').serialize();
            var posting = $.post(routes.updatePlace(), editMapData);
            
            posting.done(function (data) {
                if ($.isEmptyObject(data)) {
                    PlatsR_GUI.closeDialog($('.editPlaceMapDialog'));
                    window.location.replace(routes.showPlace({id: placeid}));
                }   
            })
            .fail(function (xhr, textStatus, thrownError) {
                PlatsR_GUI.closeDialog($('.editPlaceMapDialog'));
                PlatsR_GUI.ajaxError(xhr, textStatus, thrownError);
            });
        });
    },
    
    /**
     * This function initilizes the button-links
     * for add/editing/deleting archiveobjects in
     * their respective JQuery UI Dialogs
     */
    initArchiveBrowser : function () {
        'use strict';
        var archiveWrapper = "";
        var archiveCount = 0;
        
        $('#archiveWrapper').on('click.archiveEvents', '.edit-archive-dialog', function (e) {
            e.preventDefault();
            var placeid = $(this).data('placeid');
            var title = $(this).data('title');
            PlatsR_GUI.openShowEditDeleteArchiveDialog(placeid, title);
        });
        
        $('#archiveWrapper').on('click.archiveEvents', '.add-archive-dialog', function (e) {
            
            e.preventDefault();
            var placeid = $(this).data('placeid');
            var title = $(this).data('title');
            PlatsR_GUI.openAddOrSearchArchiveObjectsDialog(placeid, title);
        });
        
        $('#archiveWrapper').on('click.archiveEvents', '.open-single-archive', function (e) {
            e.preventDefault();
            var archiveobjectid = $(this).data('archiveobjectid');
            PlatsR_GUI.openSingleArchiveObjectDialog(archiveobjectid);
        });
        
        archiveWrapper = $('.archiveScroller');        
        archiveCount = $('figure.archive-list-item').size();
        
        if (archiveCount > 0) {
        	PlatsR_GUI.generalScroller(archiveWrapper);
        }
    },  
    
    /**
     * This function open a JQuery UI Dialog for 
     * adding an archiveobject to a place
     */
    openAddOrSearchArchiveObjectsDialog : function (placeid, title) {
        'use strict';
        var url = routes.addArchiveObjectsDialog({placeid: placeid});
        
        var addArchiveObjectsDialog = $('<div/>').load(url).addClass('addArchiveObjectsDialog');
        addArchiveObjectsDialog.dialog({
            autoOpen: false,
            resizable: false,
            modal: true,
            width: 650,
            zIndex: 4000,
            position: ['center', 20],
            height: 'auto',
            title: title,
            dialogClass: 'customDialog',
            close: function (e, ui) {
                $(this).remove();
            }
        });
        
        var arr = [];
        arr.push(placeid);
        arr.push(title);
        
        PlatsR_GUI.assureLoggedOn(PlatsR_GUI.openAddOrSearchArchiveObjectsDialog, addArchiveObjectsDialog, arr);
        
        
    },
    
    /**
     * Does a check if
     * were getting the loginRedirect.html, in which case
     * the logindialog is presented, else the dialog being passed
     * as a parameter, takes use of the secure modules functionality
     * in Play Framework
     */
    assureLoggedOn : function (originalFunction, callingDialog, paramsArray) {
        'use strict';
        var url = routes.checkLogedIn();
        var xScroll, yScroll, scrollPos;
        
        $.get(url, function (data) {
            var $response = $(data);
            
            if ($response.filter('form#loginform').length) {
                PlatsR_GUI.openLoginDialog(i18n("views.tags.common.starttop.quicklogin.form.label"), "", function () {
                	//Save scroll position
                	xScroll = (window.pageXOffset ? window.pageXOffset : document.body.scrollLeft);
                	yScroll =  (window.pageYOffset ? window.pageYOffset : document.body.scrollTop);
                	scrollPos = xScroll + "_" + yScroll;
                	PlatsR_GUI.setCookie("scrollPosition", scrollPos, null);
                	paramsArray.push(function () {
                		location.reload('true');
                	});
                    originalFunction.apply(this, paramsArray);
                });
            } else {
                if (callingDialog !== null) {
                    callingDialog.dialog('open');
                } else if (callingDialog === null) {
                    originalFunction.apply(this, paramsArray);
                }
            }               
        });
    },
    
    /**
     * This function open a JQuery UI Dialog
     * for viewing an archiveobject in detail
     */
    openSingleArchiveObjectDialog : function (archiveobjectid) {
        'use strict';
        var url = routes.singleArchiveObjectsDialog({archiveobjectid: archiveobjectid});
        var singleArchiveObjectDialog = $('<div/>').addClass('singleArchiveObjectDialog');
        singleArchiveObjectDialog.load(url).dialog({
            autoOpen: false,
            resizable: false,
            modal: true,
            width: 550,
            zIndex: 4000,
            position: ['center', 20],
            height: 'auto',
            dialogClass: 'singleArchiveView archiveObjectDialog',
            open: function (e, ui) {
            	
            },
            close: function (e, ui) {
                $(this).remove();
            },
            create: function (e, ui) {
            	$(".ui-dialog-titlebar-close").addClass('custom-close-icon');
                $(".ui-dialog").addClass('custom-dialog');
                $('.ui-icon').addClass('hide-default-icon');
            }
        });
        
        singleArchiveObjectDialog.dialog('open');
    },
    
    /**
     * This method opens a JQuery UI Dialog,
     * used for displaying archiveobjects for
     * editing or deleting 
     */
    openShowEditDeleteArchiveDialog : function (placeid, title) {
        'use strict';
        var url = routes.showArchives({placeid: placeid}); 
        var editOrDeleteArchiveDialog = $('<div/>').addClass('editOrDeleteArchiveDialog');
        editOrDeleteArchiveDialog.load(url).dialog({
            autoOpen: false,
            resizable: false,
            modal: true,
            width: 450,
            height: 'auto',
            title: title,
            dialogClass: 'customDialog',
            open: function (e, ui) {
            	//setConfirmUnload(true);
            },
            close: function (e, ui) {
            	//setConfirmUnload(false);
                $('#archiveWrapper').unbind('.archiveEvents');
                PlatsR_GUI.initArchiveBrowser();
                $(this).remove();
            }
        });
        
        var arr = [];
        arr.push(placeid);
        arr.push(title);
        
        PlatsR_GUI.assureLoggedOn(PlatsR_GUI.editOrDeleteArchiveDialog, editOrDeleteArchiveDialog, arr);
        
        $('.editOrDeleteArchiveDialog').on('click', '.cancel-link', function (e) {
            e.preventDefault();
            PlatsR_GUI.closeDialog($('.editOrDeleteArchiveDialog'));
        });
        
        $('.editOrDeleteArchiveDialog').on('click', '.edit-archive', function (e) {
            e.preventDefault();
            var placeid = $(this).data('placeid');
            var archiveobjectid = $(this).data('archiveobjectid');
            var title = $(this).data('title');
            PlatsR_GUI.closeDialog($('.editOrDeleteArchiveDialog'));
            PlatsR_GUI.openEditArchiveDialog(archiveobjectid, placeid, title);
        });
        
        $('.editOrDeleteArchiveDialog').on('click', '.delete-archive', function (e) {
            e.preventDefault();
            var placeid = $(this).data('placeid');
            var archiveobjectid = $(this).data('archiveobjectid');
            var deleteData = "archiveobjectid=" + archiveobjectid;
            var posting = $.post(routes.deleteArchive(), deleteData);
            
            posting.done(function (data) {
                if ($.isEmptyObject(data)) {
                    $('#archiveWrapper').load(routes.showPlace({id: placeid}) + ' #archiveWrapper > *');    
                }
                $('#showArchive').load(routes.showArchives({placeid: placeid}) + ' #showArchive > *');
            })
            .fail(function (xhr, textStatus, thrownError) {
                PlatsR_GUI.closeDialog($('.editOrDeleteArchiveDialog'));
                PlatsR_GUI.ajaxError(xhr, textStatus, thrownError);
            });
            
        });
    },
    
    /**
     * This method opens a dialog for
     * editing a specific archiveobject
     */
    openEditArchiveDialog : function (archiveobjectid, placeid, title) {
        'use strict';
        var url = routes.editArchiveForm({placeid: placeid, archiveobjectid: archiveobjectid});
        var editArchiveDialog = $('<div/>').addClass('editArchiveDialog');
        editArchiveDialog.load(url).dialog({
            autoOpen: false,
            resizable: false,
            modal: true,
            width: 600,
            height: 'auto',
            title: title,
            dialogClass: 'customDialog',
            open: function (e, ui) {
            	//setConfirmUnload(true);
            },
            close: function (e, ui) {
            	//setConfirmUnload(false);
                $('#archiveWrapper').unbind('.archiveEvents');
                PlatsR_GUI.initArchiveBrowser();
                $(this).remove();
            },
            create: function (e, ui) {
         
            }
        });
        
        editArchiveDialog.dialog('open');
        
        $('.editArchiveDialog').on('click', '.cancel-link', function (e) {
            e.preventDefault();
            PlatsR_GUI.closeDialog($('.editArchiveDialog'));
        });
        
        $('.editArchiveDialog').on('submit', '#editArchiveForm', function (e) {
            e.preventDefault();
            var editData = $('#editArchiveForm').serialize();
            var placeid = $('input[name="placeid"]').val();
            var posting = $.post(routes.saveEditedArchive(), editData);
            
            posting.done(function (data) {
                if ($.isEmptyObject(data)) {
                    $('#archiveWrapper').load(routes.showPlace({id: placeid}) + ' #archiveWrapper > *', function () {
                        PlatsR_GUI.closeDialog($('.editArchiveDialog'));
                    });
                } else {
                    $('#updateEditArchiveForm').load(routes.editArchiveForm({placeid: placeid, archiveobjectid: archiveobjectid}) + ' #updateEditArchiveForm > *');
                }   
            })
            .fail(function (xhr, textStatus, thrownError) {
                PlatsR_GUI.closeDialog($('.editArchiveDialog'));
                PlatsR_GUI.ajaxError(xhr, textStatus, thrownError);
            });
            
            
        });
        
    },
    
    /**
     * This function populates the actual
     * tagclouds in their respective places.
     */
    initTagCloud: function () {
        'use strict';
        PlatsR_GUI.callTagCloud();
        $('article.latest #tagcloud a').tagcloud({
            size: {
                start: 9,
                end: 16,
                unit: "pt"
            }
        });
        $('body.platser section.tagcloudBig #tagcloud a').tagcloud({
            size: {
                start: 8,
                end: 24,
                unit: "pt"
            }
        });
        $('nav.alltags #tagcloud a').tagcloud({
            size: {
                start: 8,
                end: 24,
                unit: "pt"
            }
        });
    },
    
    /**
     * This function loads the functionality
     * for creating a jquery tag cloud, using
     * the jquery.tagcloud.js plugin in this
     * function instead off loading a separate javascript.
     */
    callTagCloud : function () {
        //Do not use 'use strict' here fucks up tags and maps
        (function ($) {

              $.fn.tagcloud = function(options) {
                var opts = $.extend({}, $.fn.tagcloud.defaults, options);
                tagWeights = this.map(function(){
                  return $(this).data('tagweight');
                })
                tagWeights = jQuery.makeArray(tagWeights).sort(compareWeights);
                lowest = tagWeights[0];
                highest = tagWeights.pop();
                range = highest - lowest;
                // Sizes
                if (opts.size) {
                  fontIncr = (opts.size.end - opts.size.start)/range;
                }
                // Colors
                if (opts.color) {
                  colorIncr = colorIncrement (opts.color, range);
                }
                return this.each(function() {
                  weighting = $(this).data('tagweight') - lowest;
                  if (opts.size) {
                    $(this).css({"font-size": opts.size.start + (weighting * fontIncr) + opts.size.unit});        
                  }
                  if (opts.color) {
                    $(this).css({"color": tagColor(opts.color, colorIncr, weighting)});
                  }
                })
              }
              
              $.fn.tagcloud.defaults = {
                size: {start: 14, end: 18, unit: "pt"}
              };
              
              // Converts hex to an RGB array
              function toRGB (code) {
                if (code.length == 4) {
                  code = jQuery.map(/\w+/.exec(code), function(el) {return el + el }).join("");
                }
                hex = /(\w{2})(\w{2})(\w{2})/.exec(code);
                return [parseInt("0x" + hex[1]), parseInt("0x" + hex[2]), parseInt("0x" + hex[3])];
              }

              // Converts an RGB array to hex
              function toHex (ary) {
                return "#" + jQuery.map(ary, function(int) {
                  hex =  int.toString(16);
                  hex = (hex.length == 1) ? "0" + hex : hex;
                  return hex;
                }).join("");
              }

              function colorIncrement (color, range) {
                return jQuery.map(toRGB(color.end), function(int, i) {
                  return (int - toRGB(color.start)[i])/range;
                });
              }

              function tagColor (color, increment, weighting) {
                rgb = jQuery.map(toRGB(color.start), function(int, i) {
                  ref = Math.round(int + (increment[i] * weighting));
                  if (ref > 255) {
                    ref = 255;
                  } else {
                    if (ref < 0) {
                      ref = 0;
                    }
                  }
                  return ref;
                });
                return toHex(rgb);
              }
              
              function compareWeights(a, b)
              {
                return a - b;
              }
              

            })(jQuery);

    },
    
    /**
     * This function actually deletes a place or
     * collection.
     */
    deletePlaceOrCollection : function (name) {
        'use strict';
        if (confirm(i18n("sure.removing.place.or.collection", name))) {
            $("#deletePlaceOrCollection").submit();
        }
    },
    
    /**
     * This function restores a place
     * or collection.
     */
    restorePlaceOrCollection : function (name, id) {
        'use strict';
        if (confirm(i18n("sure.restore.place.or.collection", name))) {
            $("#restorePlaceOrCollection" + id).submit();
        }
    },
    
    /**
     * This function,
     * Dialog used to add puffs for start-pages "featured" image-scroller
     */
    initPuffDialog : function () {
        'use strict';
        //removes a puff
        $(".remove-slide").on("click",function (e) {
                var slideNumber = $(this).attr("id").split("=");
                var removeData = "slidenumber=" + slideNumber[slideNumber.length-1];
                var posting = $.post(routes.removePuff(), removeData);
                posting.done(function (data) {
                    $("#puffs").replaceWith(data);
                })
                .fail(function (xhr, textStatus, thrownError) {
                    PlatsR_GUI.ajaxError(xhr, textStatus, thrownError);
                });

        });
        
        //Shows a dialog for adding a puff
        $(".showPuffDialog").on("click",function (e) {
             if ($("#placeid").val() > 1) {
                 $("#placeid").removeClass("errorFieldStyle");
                 $("#puffDialog").dialog("open");
                 $("#puffDialog").load(routes.getImagesPuff({placeid: $("#placeid").val()}));
             } else {
                 $("#placeid").addClass("errorFieldStyle");
             }
        });
        
        var $puffDialog = $("#puffDialog")
        .dialog({
            title       :   i18n("add.a.new.puff"),
            autoOpen    :   false,
            draggable   :   true,
            height      :   "auto",
            width       :   "800",
            modal       :   true,
            position    :   "center",
            resizable   :   true,
            closeOnEscape:  true,
            dialogClass :   "customDialog", 
            buttons     : {
                            "Spara": function () {
                                    $("#newPuff").submit();
                                    $(this).dialog("close");
                                    },
                                    
                            "Avbryt": function () {
                                    $(this).dialog("close");
                                    }
                            },          
            open        : function (event, ui) {
                            $('.ui-dialog-buttonpane').find('button:contains("Spara")').removeClass('ui-button-text-only')
                            .addClass('dialog-button-blue');
                            $('.ui-dialog-buttonpane').find('button:contains("Avbryt")')
                            .removeClass('ui-button-text-only')
                            .addClass('cancelDialog').css('margin', '10px');
                        }
            });
    },
    
    /**
     * This function initializes handling of content for creation off a puff.
     */
    initPuffDialogContent : function(){
        'use strict';
        $("#getPlacesImages").on("click",function (e) {
            
        });
        
        $(".imgcontainer").on("click",function (e) {
            $("#puffImage").empty();
            $(this).clone().appendTo($("#puffImage"));
            var imageId=($("#puffImage").children().children().attr("alt"));
            $("[name='imageid']").val(imageId)
        });
        
        $("#previewBtn").on("click",function (e) {
            var imageId=($("#puffImage").children().children().attr("alt"));
            var previewPostData = "placeid=" + $("#placeid").val() + "&" + "imageid=" + imageId + "&" + "puffdescription=" + $("[name='puffdescription']").val();
            var posting = $.post(routes.previewImagePuff(), previewPostData);
            
            posting.done(function(data){
            	$("#puffDialog").dialog('option','width','auto');
                $("#puffDialog").empty().append(data);
                PlatsR_GUI.initFeatured();
            })
            .fail(function (xhr, textStatus, thrownError) {
                PlatsR_GUI.ajaxError(xhr, textStatus, thrownError);
            });

        });
    },
    
    /**
     * This function is used for pagination of users,
     */
    initAdminUserTab : function () {
        'use strict';
        $(".sort-order").on("click",function (e) {
            var dataSort = "sortOrder=" + $(this).attr("id") + "&offset=" + 0;
            $("#ui-tabs-6").load(routes.usersAdmin(), dataSort);

        });
        $("#searchUser").autocomplete({
            source: routes.searchUserAdmin(),
            minLength: 2,
            select: function (event,ui) {
                if (ui.item !== null) {
                    $.post(routes.searchUserAdmin({term:ui.item.value}), function(data){
                        $("#ui-tabs-6").html(data);
                    });
                }
            }
        });
        $("#searchUserBtn").on("click",function(e){
            if ($("#searchUser").val().length > 1) {
                $.post(routes.searchUserAdmin({term:$("#searchUser").val()}), function (data) {
                    $("#ui-tabs-6").html(data);
                });
                
            }
        });
        
        $(".pagination-Ctrl").on("click",function (e) {
            //page pagination
            e.preventDefault();
            var sortorder = $("#sortOrder").val();
            var offset = "";
            var argList = "";
            switch ($(this).attr("id"))
            {           
            case "previousPage":
                offset = $("#previousPage").val();
                break;
            case "nextPage":
                offset = $("#nextPage").val();
                break;
            case "lastPage":
                offset = $("#lastPage").val();
                break;
            default:
                //"firstPage"
                offset = 0;
                break;
            }
            
            argList = "sortOrder=" + sortorder + "&offset=" + offset;
            $("#ui-tabs-6").load(routes.usersAdmin(),argList);
        });
        
        $(".toggle-lock-user-account").on("click",function(e){
            if ($(this).attr("checked") !== null) {
                    //lock useraccount
                    if (confirm(i18n("are.you.sure.lock.account", $(this).val()))) {
                        $.post(routes.lockUserAccount({userid:$(this).val()}), function(data){
                            if(data.match("true") === null) {
                                $(this).removeAttr("checked");
                            }
                        });
                        
                    } else {
                            $(this).removeAttr("checked");
                        }
                } else {
                    //unlock useraccount
                    if (confirm(i18n("are.you.sure.unlock.account", $(this).val()))) {
                            $.post(routes.unlockUserAccount({userid:$(this).val()}), function(data){
                                if(data.match("true") === null) {
                                    $(this).attr("checked", "checked");
                                }
                            });
                        } else {
                            $(this).attr("checked", "checked");
                        }
                }
        });
    },
    
    /**
     * This function initilizes
     * comment handling
     */
    initCommentHandling : function () {
        'use strict';
        $('.create-comment').on('click', function (e) {
            e.preventDefault();
            var title,
                url;
            title = $(this).data('title');
            url = "";
            PlatsR_GUI.openLoginDialog(title, url, function(){
            	location.href=location.href+"#commentaries";
            	location.reload();
            });
        });
        
        $('.delete-comment').on('click', function (e) {
            e.preventDefault();
            var commentid = $(this).data('commentid'),
                placeid = $(this).data('placeid'),
                collectionid = $(this).data('collectionid');
            PlatsR_GUI.deleteComment(commentid, placeid, collectionid);
        });
        
        $('.report-comment').on('click', function (e) {
            e.preventDefault();
            var commentid = $(this).data('commentid'),
                placeid = $(this).data('placeid'),
                title = $(this).data('title'),
                url = $(this).data('reporturl');
            PlatsR_GUI.reportComment(commentid, placeid, title, url);
        });
        
        $('#createCommentForm').submit(function (e) {
        	e.preventDefault();
        	$('#newstoryform').dirtyForms('setClean');
        	var commentData,
        		placeid,
        		collectionid,
        		comment;
        	
        	comment = PlatsR_GUI.tidyInput($('textarea[name="comment"]').val());
            placeid = $('input[name="placeid"]').val();
            collectionid = $('input[name="collectionid"]').val();
            commentData = 'placeid=' + placeid + '&collectionid=' + collectionid + '&comment=' + encodeURI(comment);
            
            PlatsR_GUI.addComment(commentData, placeid, collectionid);
        });
    },
    
    /**
     * This function adds a comment for
     * a place or a collection
     */
    addComment : function(commentData, placeid, collectionid){
        'use strict';
        var renewUrl = placeid > 0 ? routes.showPlace({id: placeid}) : routes.showCollection({id: collectionid}),
            posting = $.post(routes.addComment(), commentData),
            elementsArray = [],
            functionsArray = [];
        
        PlatsR_GUI.showloader('#updateComments', '#createCommentForm');
        
        posting.done(function (data) {
    	    //use the contentRefresh to refresh, only one get
    	    //to update two different positions on the page
            elementsArray.push('updateComments');
            elementsArray.push('placeTopHeading');
            functionsArray.push(PlatsR_GUI.initCommentHandling);
            PlatsR_GUI.clearForm('#createCommentForm');
            PlatsR_GUI.hideloader('#updateComments', '#createCommentForm');
            PlatsR_GUI.contentRefresh(renewUrl, elementsArray, functionsArray);
        })
        .fail(function (xhr, textStatus, thrownError) {
            PlatsR_GUI.ajaxError(xhr, textStatus, thrownError);
        });
    },
    
    /**
     * This function deletes a comment in the
     * place or collection page
     */
    deleteComment : function(commentid, placeid, collectionid){
        'use strict';
        var renewUrl = placeid > 0 ? routes.showPlace({id: placeid}) : routes.showCollection({id: collectionid});
        var deleteComment = "commentid=" + commentid;
        var posting = $.post(routes.deleteComment(), deleteComment);
        var elementsArray = [],
            functionsArray = [];
        
        posting.done(function (data) {
            //use the contentRefresh to refresh, only one get
    	    //to update two different positions on the page
            elementsArray.push('updateComments');
            elementsArray.push('placeTopHeading');
            functionsArray.push(PlatsR_GUI.initCommentHandling);
            PlatsR_GUI.contentRefresh(renewUrl, elementsArray, functionsArray);
            })
            .fail(function (xhr, textStatus, thrownError) {
                PlatsR_GUI.ajaxError(xhr, textStatus, thrownError);
            });
    },

    /**
     * This function initializes the login dialog
     */
    initLoginDialog : function (title, dialogUrl) {
        'use strict';
        var loginDialog = $('<div/>').addClass('loginDialog');  
        loginDialog.load(dialogUrl).dialog({
            height: PlatsR_GUI.dynamicHeight("login"),
            width: PlatsR_GUI.dynamicWidth("login"),
            title: title,
            bgiframe: true,
            autoOpen: false,
            modal: true,
            resizable: false,
            draggable: false,
            closeOnEscape: false,
            zIndex: 10000,
            dialogClass: 'customDialog',
            close: function (event, ui) {
                $(this).remove();
            },
            create: function (e, ui) {
            	
            },
            open: function (e, ui) {
            }
        });
    },

    /**
     * This function opens the login dialog
     */
    openLoginDialog : function (title, url, callback) {
        'use strict';
        var dialogUrl = routes.loginRedirect();
        var hasRedirect = (url === dialogUrl || url === '') ? false : true;
        var hasCallback = (callback === null) ? false : true;
        
        PlatsR_GUI.initLoginDialog(title, dialogUrl);
        $('.loginDialog').dialog('open');
        
        
        $('.loginDialog').on('click.login', 'a#cancelDialog', function () {
            PlatsR_GUI.closeDialog($('.loginDialog'));
        });
        
        $('.loginDialog').on('click.login', 'a#forgotLogin', function (e) {
            e.preventDefault();
            //initialize forgot password part
            var passwordTitle = $(this).data('title'),
                passwordUrl = $(this).attr('href');
            
            PlatsR_GUI.closeDialog($('.loginDialog'));
            PlatsR_GUI.openPasswordDialog(passwordTitle, passwordUrl);
        });

        $('.loginDialog').on('submit.login', '#loginform', function (e) {
            e.preventDefault();
            var username = $(this).find('#username').val();
            var password = $(this).find('#password').val();
            password = PlatsR_Security.md5.digest(password);
            PlatsR_GUI.loginValidation(username, password, url, hasRedirect, callback, hasCallback);
        });
        
        $('.loginDialog').on('click.login', 'a.quick-register-link', function(e){
            e.preventDefault();
            var url = $(this).attr('href');
            var title = $(this).data('title');
            
            PlatsR_GUI.closeDialog($('.loginDialog'));
            PlatsR_GUI.openRegDialog(title, url);
        });
    },
    
    /**
     * This function validates data from the login dialog
     */
    loginValidation : function (username, password, redirectUrl, hasRedirect, callback, hasCallback) {          
        'use strict';
        var posting = $.post(routes.loginValidation(), {username: username, password: password});
        
        posting.done(function (data) {
            if ($.isEmptyObject(data)) {
                if ($('.loginDialog').dialog('isOpen')) {
                       $('#loginform').hide();
                       $('.dialogFooter').hide();
                        $('.progressMsg').show(500, function () {
                        PlatsR_GUI.closeDialog($('.loginDialog'));  
                        });
                }
                    if (!hasCallback) {
                        (hasRedirect) ? window.location.replace(redirectUrl) : window.location.href = document.URL;
                    } else if(hasCallback) {
                        callback.call(this);
                    }
                    
            } else {
                $('#loginSection').load(routes.loginRedirect() + ' #loginSection');
            }
        })
        .fail(function (xhr, textStatus, thrownError) {
            PlatsR_GUI.closeDialog($('.loginDialog'));
            PlatsR_GUI.ajaxError(xhr, textStatus, thrownError);
        });
    },
    
    /**
     * This function is general for closing a dialog 
     */
    closeDialog : function (currentDialog) {
        'use strict';
        currentDialog.dialog('close');
    },
    
    /**
     * This function set width
     * for dialog
     */
    dynamicWidth : function (dialog) {
        'use strict';
        var w,
            browserName,
            MS;
        w = -1;
        browserName = navigator.appName;
        MS ="Microsoft Internet Explorer";
        switch (dialog) {
        case "login":
            w = (browserName == MS) ? 550 : 550;  
            break;

        case "register":
            w = (browserName == MS) ? 565 : 550;
            break;
        case "password":
            w = (browserName == MS) ? 565 : 550;
            break;
        case "renewpassword":
            w = (browserName == MS) ? 580 : 565;
            break;
        case "copyright":
            w = (browserName == MS) ? 580 : 565;
            break;  
        case "placecollection":
            w = (browserName == MS) ? 580 : 565;
            break;
        case "errormessage":
            w = (browserName == MS) ? 470 : 450;
            break;  
        default:
            w = 550;
        } 
        return w;
    },
    
    /**
     * This function sets height 
     * for dialog
     */
    dynamicHeight : function (dialog) {
        'use strict';
        var h,
            browserName,
            MS;
        h = -1;
        browserName = navigator.appName;
        MS = "Microsoft Internet Explorer";
        switch (dialog) {
        case "login":
            h = (browserName == MS) ? 560 : 530;  
            break;
        case "register":
            h = (browserName == MS) ? 775 : 775;
            break;          
        case "password":
            h = (browserName == MS) ? 560 : 530;
            break;
        case "renewpassword":
            h = (browserName == MS) ? 315 : 300;
            break;  
        case "copyright":
            h = (browserName == MS) ? 700 : 700;
            break;
        default:
            h = 530;
        }
        
        return h;
    },
    
    /**
     * This function initilizes the Dialog
     * for renewing the users password
     */
    initPasswordDialog : function (passwordTitle, passwordUrl) {
        'use strict';
        var passwordDialog = $('<div/>').addClass('passwordDialog');
        passwordDialog.load(passwordUrl).dialog({
            height: PlatsR_GUI.dynamicHeight("password"),
            width: PlatsR_GUI.dynamicWidth("password"),
            title: passwordTitle,
            bgiframe: true,
            autoOpen: false,
            modal: true,
            resizable: false,
            draggable: false,
            closeOnEscape: false,
            zIndex: 10000,
            dialogClass: 'customDialog',
            close: function(event, ui){
                $(this).remove();
            },
            create: function(e, ui) {
            
            }
        });
    },
    
    /**
     * This function opens a JQuery UI Dialog
     * for renewing users password
     */
    openPasswordDialog : function (passwordTitle, passwordUrl) {
        'use strict';
        PlatsR_GUI.initPasswordDialog(passwordTitle, passwordUrl);
        $('.passwordDialog').dialog('open');
        
        $('.passwordDialog').on('click', 'a#cancelDialog', function (e) {
            e.preventDefault();
            PlatsR_GUI.closeDialog($('.passwordDialog'));
        });
        $('.passwordDialog').on('submit', '#passwordform', function (e) {
            e.preventDefault();
            var forgotten = $(this).find('#forgotten').val();
            PlatsR_GUI.forgotValidation(forgotten);
        });
    },  
    
    /**
     * This function handles the validation of
     * the form inside the renew password dialog
     */
    forgotValidation : function (forgotten) {
        'use strict';
        var forgottenData = "forgotten=" + forgotten;
        var posting = $.post(routes.forgotValidation(), forgottenData);
        
        posting.done(function (data) {
            if ($.isEmptyObject(data)) {
                $('#forgottenDialog').hide();
                $('#renewMessage').show();
                
                $('.passwordDialog').on('click', '.cancelPasswordMessage', function (e) {
                    e.preventDefault();
                    PlatsR_GUI.closeDialog($('.passwordDialog'));
                });
            } else {
                $('#forgottenDialog').load(routes.forgotPassword() + ' #forgottenDialog');
            }       
        })
        .fail(function (xhr, textStatus, thrownError) {
            PlatsR_GUI.closeDialog($('#forgottenDialog'));
            PlatsR_GUI.ajaxError(xhr, textStatus, thrownError);
        });
    },
    
    /**
     * This function activates the jquery functionality
     * for the password activation page
     */
    initRenewPassword : function () {
        'use strict';
        $('#forgottenPassword').on('click.renew', 'a#forgotLogin', function (e) {
            e.preventDefault();
            //initialize forgot password part
            var passwordTitle = $(this).data('title'),
                passwordUrl = $(this).attr('href');
            
            PlatsR_GUI.openPasswordDialog(passwordTitle, passwordUrl);
        });
        
        $('#renewPassword').on('submit.renew', '#newpasswordform', function(e){
            e.preventDefault();
            var renewData = $(this).serializeArray();
            
            $.each(renewData, function(i, fd){
                if(fd.name == "renewpassword"){
                    fd.value = PlatsR_Security.md5.digest(fd.value);
                }else if(fd.name == "confirmrenewpassword"){
                    fd.value = PlatsR_Security.md5.digest(fd.value);
                }
            });
            
            PlatsR_GUI.newPasswordValidation(renewData);
        });
    },
    
    /**
     * This function performs the validation
     * on the server for renewal of the users password
     */
    newPasswordValidation : function(renewData){
        'use strict';
        var randomID = "";
        var refreshUrl = "";
        $.each(renewData, function (i, fd) {
            if (fd.name === "randomID") {
                randomID = fd.value;
            }
        });     
        
        refreshUrl = routes.activatePassword({randomID: randomID});
        var posting = $.post(routes.newPasswordValidation(), renewData);
        
        posting.done(function (data) {
            if($.isEmptyObject(data)){
                $('#renewSection').hide();
                PlatsR_GUI.openRenewPasswordSuccess();
            }else{
                $('#renewPassword').load(refreshUrl + ' #renewPassword');
            }
        })
        .fail(function (xhr, textStatus, thrownError) {
            PlatsR_GUI.ajaxError(xhr, textStatus, thrownError);
        });
    },
    
    /**
     * Show the user that his/her's password has been 
     * renewed
     */
    openRenewPasswordSuccess : function () {
        'use strict';
        var successDialog = $('<div/>').addClass('successDialog');
        successDialog.load(routes.renewPassword()).dialog({
            height: PlatsR_GUI.dynamicHeight("renewpassword"),
            width: PlatsR_GUI.dynamicWidth("renewpassword"),
            title: i18n('restore.password.success.title'),
            bgiframe: true,
            autoOpen: false,
            modal: true,
            resizable: false,
            draggable: false,
            closeOnEscape: false,
            zIndex: 10000,
            dialogClass: 'customDialog',
            close: function (event, ui) {
                $(this).remove();
            },
            create: function (e, ui) {
            
            }
        });
        
        successDialog.dialog('open');
        
        $('.successDialog').on('click', 'a.renew-pw-done', function (e) {
            e.preventDefault();
            PlatsR_GUI.closeDialog($('.successDialog'));
            //head on back to the start-page
            window.location.replace(routes.indexPage());
        });
    },
    
    /**
     * Enables editing mode for a story
     */
    openEditStory : function (storyid, placeid, fromplace) {
        'use strict';
        var url = routes.editStory({placeid: placeid, storyid: storyid, fromplace: fromplace});
        
        var arr = [];
        arr.push(url);
        PlatsR_GUI.assureLoggedOn(PlatsR_GUI.doInitEditStory, null, arr);
    },
    
    /**
     * Acctually intializes the EditStoryForm
     */
    doInitEditStory : function (url) {
        'use strict';
        window.location.replace(url);
    },
    
    /**
     * This function intializes
     * the opening of adding new story page,
     * and performs a check if we are logged
     * in or not, and thus acts accordingly
     */
    initNewStory : function () {
        'use strict';
        $('.add-story-page').on('click', function (e) {
            e.preventDefault();
            var url = $(this).attr('href');
            var arr = [];
            arr.push(url);
            PlatsR_GUI.assureLoggedOn(PlatsR_GUI.openAddStoryPage, null, arr);
        });
        
        $('.edit-story').on('click', function (e) {
            e.preventDefault();
            var storyid = $(this).data('storyid');
            var placeid = $(this).data('placeid');
            var fromplace = $(this).attr('data-fromplace');         
            PlatsR_GUI.openEditStory(storyid, placeid, fromplace);
        });
    },
    
    /**
     * This function directs to the 
     * add story page
     */
    openAddStoryPage : function (url) {
        'use strict';
        window.location.href=url;
    },
    
    /**
     * Initilizes the form used for 
     * creating a new story for a place
     */
    initNewStoryForm : function () {
        'use strict';
        PlatsR_GUI.initMCE();

        $('.cancel-link').on('click', function (e) {
            e.preventDefault();
            var url = $(this).data('url');
            window.location.replace(url);
        });
        
        $('#newStorySection').on('submit', '#newstoryform', function (e) {
            e.preventDefault();
            var editor = tinymce.activeEditor;
            var placeid = $('input[name="placeid"]').val();
            var copyrightid = $('input[name="copyrightid"]').val();
            var storyName = $('input[name="storyName"]').val();
            var storyDescription = editor.getContent();
            var upphovsman = $('input[name="upphovsman"]').val();
            var newData = "placeid=" + placeid + "&copyrightid=" + copyrightid + "&storyName=" + storyName + "&storyDescription=" + storyDescription + "&upphovsman=" + upphovsman;
            
            var posting = $.post(routes.saveStory(), newData);
            
            posting.done(function (data) {
                if (data.hasOwnProperty('newStoryid')) {
                    var refreshUrl = routes.showStory({storyid: parseInt(data.newStoryid, 10), placeid: placeid, fromplace: 'false'});
                    window.location.replace(refreshUrl);
                }else if(!$.isEmptyObject(data) && !data.hasOwnProperty('newStoryid')){
                    $('#newStorySection').load(routes.addStory({id: placeid}) + ' #newStorySection', function () {
                        PlatsR_GUI.initNewStoryForm();
                    });
                }
            })
            .fail(function (xhr, textStatus, thrownError) {
                PlatsR_GUI.ajaxError(xhr, textStatus, thrownError);
            });
        });
    },
    
    /**
     * Initilizes the form used for 
     * editing an existing story for a place
     */
    initEditStoryForm : function () {
        'use strict';
        var storyid = $('input[name="storyid"]').val(), 
            placeid = $('input[name="placeid"]').val(), 
            fromplace = $('#fromBool').attr('data-fromplace');
        
        PlatsR_GUI.initMCE();
        //turn a string representation of bool into proper bool,
        //hinting if we're editing story from placepage or storybrowserpage.
        var fromBool = fromplace === 'true' ? true : false;
        
        $('#editstoryform').on('click', '.cancel-link', function (e) {
            e.preventDefault();
            var url = "";
            if (fromBool) {
                url = routes.showPlace({id: placeid});
            } else if (!fromBool) {
                url = routes.showStory({storyid: storyid, placeid: placeid, fromplace: fromplace});
            }
            //force page reload to avoid scary things from happening when refreshing the page
            window.location.replace(url);
        });
        
        $('#editStorySection').on('submit', '#editstoryform', function (e) {
            e.preventDefault();
            var editor = tinymce.activeEditor;
            editor.save();
            var editData = $('#editstoryform').serialize();
            var posting = $.post(routes.saveEditedStory(), editData);
            
            posting.done(function (data){
                //force page reload to avoid scary things from happening when refreshing the page
                var url = routes.showStory({storyid: storyid, placeid: placeid, fromplace: fromplace});
                window.location.replace(url);
            })
            .fail(function (xhr, textStatus, thrownError) {
                PlatsR_GUI.ajaxError(xhr, textStatus, thrownError);
            });
        });
    },
    
    /**
     * This function initializes
     * delete buttons
     */
    initDeleteStory : function(){
        'use strict';
        $('.delete-story').on('click', function(e){
            e.preventDefault();
            var storyid = $(this).data('storyid');
            var placeid = $(this).data('placeid');
            var fromplace = $(this).attr('data-fromplace');
            var url = $(this).data('url');
            var stortname = $(this).attr('data-storyname');
            
            
            var arr = [];
            arr.push(storyid);
            arr.push(placeid);
            arr.push(url);
            arr.push(fromplace);
            arr.push(stortname);
            
            PlatsR_GUI.assureLoggedOn(PlatsR_GUI.deleteStory, null, arr);
        });
    },
    
    /**
     * This function deletes a story
     */
    deleteStory : function (storyid, placeid, url, fromplace, stortname) {
        'use strict';
        //turn a string representation of bool into proper bool,
        //hinting if we're deleting story from placepage or storybrowserpage.
        var fromBool = fromplace === 'true' ? true : false;
        var deleteData = "storyid=" + storyid + "&fromplace=" + fromBool;
        
        if (confirm(i18n("sure.removing.place.or.collection", stortname))) {
	        var posting = $.post(routes.deleteStory(), deleteData);
	        
	        posting.done(function (data) {
	            //all went well, story is deleted, and proper page is refreshed/reloaded
	            if (!fromBool) {
	                var ourlist = $('#ourlist').text();
	                var jsonOur = $.parseJSON(ourlist);
	                var length = jsonOur.length; 
	                var pos = parseInt($('#ourpos').text());
	                if (length === 1) {
	                    //reload the placepage, since there are no more stories to browse.
	                    window.location.replace(routes.showPlace({id: placeid}));
	                } else if (length > 1) {
	                    //we're deleting the first browsable story, refresh using the next storyid in line
	                    // or, we're deleting a story, being not the first story, 
	                    //refresh using the previous storyid in line.
	                    var repositionid = pos === 0 ? jsonOur[pos + 1] : jsonOur[pos - 1];
	                    
	                    $('#showOrEditStorySection')
	                    .load(routes.showStory({storyid: repositionid, placeid: placeid, fromplace: 'false'}) + ' #showOrEditStorySection', function () {
	                    PlatsR_GUI.initStoriesBrowser();
	                    PlatsR_GUI.initDeleteStory();
	                    });
	                }
	                
	            } else if (fromBool) {
	                //reload storysection on placepage, we're deleting from the place page.
	                $('#storysection')
	                .load(url + ' #storysection', function () {
	                    PlatsR_GUI.initStarttopFunctions();
	                    PlatsR_GUI.initDeleteStory();
	                });
	            }
	        })
	        .fail(function (xhr, textStatus, thrownError) {
	            PlatsR_GUI.ajaxError(xhr, textStatus, thrownError);
	        });
        }
    },
    
    /**
     * Intializes the story paginator function
     */
    initStoriesBrowser : function () {
        'use strict';
        //variables for stories browser
        var ourlist = $('#ourlist').text();
        var jsonOur = $.parseJSON(ourlist);
        var length = jsonOur.length; 
        var pos = parseInt($('#ourpos').text());
        var placeid = parseInt($('#ourPlaceId').text());
        
        //check if we have prev story
        function hasPrev () {
            if ($('.simplePrevious').hasClass('simpleActive')) {
                return true;
            } else {
                return false;
            }
        }
        
        //check if we have next story
        function hasNext () {
            if ($('.simpleNext').hasClass('simpleActive')) {
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
                PlatsR_GUI.initStoriesBrowser();
                PlatsR_GUI.initDeleteStory();
            });
        }
        
        $('.simplePrevious a').click(function (e) {
            e.preventDefault();
            if (hasPrev()) {
                pos--;
                showItem(pos);
            }
        });
        
        $('.simpleNext a').click(function (e) {
            e.preventDefault();
            if (hasNext()) {
                pos++;
                showItem(pos);
            }
        });
        
        //for testing only
        function showPos(pos){
//            console.log(pos);
        }
    },
    
    
    /**
     * Intialize TinyMCE function for appliable fields
     */
    initMCE : function(){
        'use strict';
        tinyMCE.init({
              entity_encoding           : "raw",
              language                  : "sv",
              mode                      : "exact",
              elements                  : "storyDescription",
              plugins                   : "paste",
              convert_newlines_to_brs   : false,
              force_p_newlines          : false,
              theme                     : "advanced",
              theme_advanced_buttons1   : "bold,italic,link,unlink",
              theme_advanced_buttons2   : "",
              theme_advanced_buttons3   : "",
              height                    : "550",
              width                     : "620",
              onchange_callback 		: "setTinyMceDirty",
              theme_advanced_path       : true,
              theme_advanced_statusbar_location : "none",
              theme_advanced_resizing   : true,
              content_css               : '/public/stylesheets/tinymce_custom_content.css',
              feedbackId                : "storyFeedback",
              handle_event_callback     : "PlatsR_GUI.editorEventCallback",
              add_form_submit_trigger   : false,
              setup                     : function (ed) {
            	  	
                    // Set placeholder
                    var tinymce_placeholder = $('#'+ed.id);
                    var attr = tinymce_placeholder.attr('placeholder');
                    
                    if (typeof attr !== 'undefined' && attr !== false) {
                        var is_default = false;

                        ed.onInit.add(function(ed) {                            
                            // get the current content
                            var cont = ed.getContent();
                            
                            // If its empty and we have a placeholder set the value
                            if (cont.length === 0) {
                                ed.setContent(tinymce_placeholder.attr("placeholder"));

                                // Get updated content
                                cont = tinymce_placeholder.attr("placeholder");
                                //cont = ed.getContent(); - too slow
                            }

                            // convert to plain text and compare strings
                            is_default = (cont === tinymce_placeholder.attr("placeholder"));                 

                            // nothing to do
                            if (!is_default){
                                return;
                            }
                        });

                        ed.onMouseDown.add(function(ed,e) {
                            // replace the default content on focus if the same as original placeholder
                            if (is_default){
                                ed.setContent('');
                                is_default = false;
                            }
                        });
                    }
              }
        });
        
        $.fn.tinymce = function (options) {
               return this.each(function () {
                  tinyMCE.execCommand("mceAddControl", true, this.id);
               });
        }
    },

    /**
     * This function initializes the reg dialog
     */
    initRegDialog : function (title, registerDialogUrl) {
        'use strict';
        var registerDialog = $('<div/>').addClass('registerDialog');
        registerDialog.load(registerDialogUrl).dialog({
            width:  PlatsR_GUI.dynamicWidth("register"),
            height: PlatsR_GUI.dynamicHeight("register"),
            title: title,
            bgiframe: true,
            autoOpen: false,
            modal: true,
            resizable: false,
            draggable: false,
            closeOnEscape: false,
            zIndex: 10000,
            dialogClass: 'customDialog',
            close: function (event, ui) {
                $(this).remove();
            },
            create: function (e, ui) {
            
            }
        });
    },
    
    
    /**
     * This function opens the JQuery UI Dialog
     * for registration of a new user
     */
    openRegDialog : function (title, url) {
        'use strict';
        var registerDialogUrl,
            hasRedirect,
            formData;
        registerDialogUrl = routes.register();
        hasRedirect = registerDialogUrl == url ? false : true;
        PlatsR_GUI.initRegDialog(title, registerDialogUrl);
        $('.registerDialog').dialog('open');
        
        $('.registerDialog').on('click.register', 'a#cancelDialog', function () {
            PlatsR_GUI.closeDialog($('.registerDialog'));
        });
        
        $('.registerDialog').on('click.register', '.newCaptchaLink', function (e) {
            e.preventDefault();
            $('.dialogSection.captcha').load(routes.register() + ' .dialogSection.captcha > *');
        });

        $('.registerDialog').on('submit.register', '#regform', function (e) {
            e.preventDefault();
            
            formData = $('#regform').serializeArray();
            
                $.each(formData, function (i, fd) {
                    if(fd.name == "password"){
                        fd.value = PlatsR_Security.md5.digest(fd.value);
                    }else if(fd.name == "confirmpassword"){
                        fd.value = PlatsR_Security.md5.digest(fd.value);
                    }
                });
                
            PlatsR_GUI.registerValidation(formData);
        });
        
    },
    
    /**
     * Validates the registration of a new member
     */
    registerValidation : function (formData) {
        'use strict';
        var total = formData.length;
        var regData = "";
        $.each(formData, function (i, fd) {
            regData += fd.name + "=" + fd.value;
            if (i === (total - 1)) {
                regData += "";
            } else {
                regData += "&";
            }
        });
        
        var posting = $.post(routes.registerValidation(), regData);
        
        posting.done(function(data){
            if($.isEmptyObject(data)){
                window.scrollTo(0,0);
                $('#regDialog').load(routes.registerSuccessWelcome() + ' #regSuccess');
                $('.registerDialog').dialog('option', 'title', i18n('registration.done'));
                $('.registerDialog').dialog('option', 'height', 350);
                $('.registerDialog').on('click', 'a.close-dialog', function(e){
                    e.preventDefault();
                    PlatsR_GUI.closeDialog($('.registerDialog'));
                    location.reload(true);
                });
            }else{
                $('#regFormErrorResponse').show();
                $('#registerSection').load(routes.register() + ' #registerSection');
                PlatsR_GUI.errorMessage($('#regform'), $('#regFormErrorMessage'), data);
            }
        })
        .fail(function (xhr, textStatus, thrownError) {
            PlatsR_GUI.closeDialog($('.registerDialog'));
            PlatsR_GUI.ajaxError(xhr, textStatus, thrownError);
        });
    },
    
    /**
     * This function is responsible for errormessaging
     * in register dialog
     */
    errorMessage : function (postElement, targetElement, errormessages) {
        'use strict';
        targetElement.html(i18n('reg.error.notification'));
        if(errormessages['username']){
        	$('#username').focus();
        	targetElement.html(errormessages['username']);
        }
        postElement.on('mousedown', 'input', function () {
            var inputId = $(this).attr('id');   
            if($(this).attr('type') != 'submit'){
                targetElement.html(errormessages[inputId]);
            }
        });
    },
    
    /**
     * This function handles adding of error-
     * messages, push error-html into DOM,
     * for all calling that fails in JQuery ajax calls.
     */
    ajaxError : function (xhr, textStatus, thrownError) {
        'use strict';
        //setConfirmUnload(false);
        $('body').html(xhr.responseText);
    },
    
    /**
     * Dialog for handling copyright
     */
    openCopyrightDialog : function (title, storyid, placeid) {
        'use strict';
        var url,
            copyrightDialog;
        url = routes.chooseCopyright({storyid: storyid});
        copyrightDialog = $('<div/>').addClass('copyrightDialog');
        copyrightDialog.dialog({
            height: PlatsR_GUI.dynamicHeight("copyright"),
            width: PlatsR_GUI.dynamicWidth("copyright"),
            title: title,
            bgiframe: true,
            autoOpen: false,
            modal: true,
            resizable: false,
            draggable: false,
            closeOnEscape: false,
            zIndex: 10000,
            dialogClass: 'customDialog',
            open: function (e, ui) {
            	copyrightDialog.load(url,function(){
            		var copyrightid;
            		if ($("#newstoryform").length===1){
            			copyrightid=$("#newstoryform > [name='copyrightid']").val()
            			$("[value='"+copyrightid+"']").attr("checked","checked").button("refresh");
            			
            		}
            	});
            },
            close: function (event, ui) {
                $(this).remove();
            },
            create: function (e, ui) {
            
            }
        });
        
        copyrightDialog.dialog('open');
        
        $('.copyrightDialog').on('click', '.cancel-link', function (e) {
            e.preventDefault();
            PlatsR_GUI.closeDialog($('.copyrightDialog'));
        });
        
        $('.copyrightDialog').on('submit.copyright', '#copyrightform', function (e) {
            e.preventDefault();
            var copyRData,
                posting,
                url,
                urlRefresh,
                urlGetCopyright,
                copyrightid;
            
            if ($("#newstoryform").length===1){
            	copyrightid=$("input:checked").val();
            	urlGetCopyright=routes.viewCopyright({copyrightid: copyrightid, placeid: placeid});
            	$("#newstoryform > [name='copyrightid']").val($("input:checked").val());
            	$("#storyFooter").load(urlGetCopyright + ' #storyFooter > *', function(){
                	PlatsR_GUI.closeDialog($('.copyrightDialog'));
                    PlatsR_GUI.initStarttopFunctions();
                });
            } else {
                copyRData = $(this).serialize();
                posting = $.post(routes.updateCopyright(), copyRData);
                url = routes.showStory({storyid: storyid, placeid: placeid, fromplace: 'false'});
                urlRefresh = routes.chooseCopyright({storyid: storyid});
                
                posting.done(function (data){
                    if ($.isEmptyObject(data)) {
                        PlatsR_GUI.closeDialog($('.copyrightDialog'));
                        $('#storyFooter')
                        .load(url + ' #storyFooter > *', function(){
                            PlatsR_GUI.initStarttopFunctions();
                        });
                    } else {
                        $('.editField').load(urlRefresh + ' .editField');
                    }
                })
                .fail(function (xhr, textStatus, thrownError) {
                    PlatsR_GUI.closeDialog($('.copyrightDialog'));
                    PlatsR_GUI.ajaxError(xhr, textStatus, thrownError);
                });

            }
            
        });
    },

    /**
     * This function enables 
     * functionality for handling 
     * add/edit/delete webaddresses
     * (webaddresslinks)
     */
    initWebAddressHandling : function () {
        'use strict';
        $('.add-links').on('click.webAddress', function (e) {
            e.preventDefault();
            var placeid = $(this).data('placeid');
            var collectionid = $(this).data('collectionid');
            var arr = [];
            PlatsR_GUI.assureLoggedOn(PlatsR_GUI.doOpenWebAddressLinkForm, null, arr);
        });
        
        $('#cancelWebAdressLink').on('click.webAddress', function (e) {
            e.preventDefault();
            PlatsR_GUI.cancelWebAddressLink();
        });
        
        $('.deleteWebAdressLink').on('click.webAddress', function (e) {
            e.preventDefault();
            var webaddressid = $(this).data('webaddressid');
            var placeid = $(this).data('placeid');
            var collectionid = $(this).data('collectionid');
            var arr = [];
            arr.push(webaddressid);
            arr.push(placeid),
            arr.push(collectionid);
            
            PlatsR_GUI.assureLoggedOn(PlatsR_GUI.doDeleteWebAddressLink, null, arr);
        });
        
        $('.deleteWebAdressLink').change(function () {
        	$('#addWebAdressLinkForm').dirtyForms('setDirty');
        });
        
        $("#webAdressLinks").on('submit.webAddress', '#addWebAdressLinkForm', function (e) {
            e.preventDefault();
            var placeid = $("form#addWebAdressLinkForm").find('[name="placeid"]').val();
            var collectionid = $("form#addWebAdressLinkForm").find('[name="collectionid"]').val();
            var webadressurl = PlatsR_GUI.tidyInput($("#webAdressUrl").val());
            
            $("#addWebAdressLinkForm").addClass('hidden');
            $("#showWebAdressLinkForm").html(i18n("paste.link"));
            PlatsR_GUI.showloader('#webAdresses');
            var posting = $.post(routes.addWebAdressLink(), 
            		{webadressurl: webadressurl, placeid: placeid, collectionid: collectionid});
            
            posting.done(function (data) {
            	PlatsR_GUI.hideloader('#webAdresses');
                PlatsR_GUI.updateWebAddressLinks(placeid, collectionid);
            })
            .fail(function (xhr, textStatus, thrownError) {
                PlatsR_GUI.ajaxError(xhr, textStatus, thrownError);
            });
        });
    },
    
    /**
     * This function opens the
     * form for adding links 
     */
    doOpenWebAddressLinkForm : function () {
        'use strict';
        $("#webAdressUrl").val("");
        $("#showWebAdressLinkForm").html(i18n("paste.link"));
        $("#addWebAdressLinkForm").removeClass('hidden');
    },
    
    /**
     * This function closes the
     * add webaddresslinks form
     */
    cancelWebAddressLink : function () {
        'use strict';
        $("#webAdressUrl").val("");
        $("#addWebAdressLinkForm").addClass('hidden');
        $("#showWebAdressLinkForm").html(i18n("paste.link"));
        $("#addWebAdressLinkForm").dirtyForms('setClean');
    },
    
    /**
     * This function deletes a webaddress link
     */
    doDeleteWebAddressLink : function(id, placeid, collectionid){
        'use strict'; 
        var posting = $.post(routes.deleteWebAddressLink(), 
        		{webadressid: id, placeid: placeid, collectionid: collectionid});
        
        posting.done(function (data) {
            PlatsR_GUI.updateWebAddressLinks(placeid, collectionid);
        })
        .fail(function (xhr, textStatus, thrownError) {
            PlatsR_GUI.ajaxError(xhr, textStatus, thrownError);
        });
    },
    
    /**
     * This function updates the
     * section showing the external
     * webaddresses
     */
    updateWebAddressLinks : function (placeid, collectionid) {
        'use strict';
        var url = placeid > 0 ? routes.showPlace({id: placeid}) : routes.showCollection({id: collectionid});
         
        $('#webAdressLinks').load(url + ' #webAdressLinks > *', function () {
            //unbinds events, to avoid multiple posts later on
            $('#webAdressLinks').unbind('.webAddress');
            PlatsR_GUI.initWebAddressHandling();
        });
    },
    
    /**
     * This function controls the handling
     * of recommendations for a place
     */
    initRecommendationHandling : function(){
        'use strict';   
        $('.add-recommendation').on('click', function(e){
            e.preventDefault();
            var placeid = $(this).data('placeid');
            var collectionid = $(this).data('collectionid');
            PlatsR_GUI.addRecommendation(placeid, collectionid);
        });
        
        $('.delete-recommendation').on('click', function(e){
            e.preventDefault();
            var recommendationid = $(this).data('recommendationid');
            var placeid = $(this).data('placeid');
            var collectionid = $(this).data('collectionid');
            PlatsR_GUI.deleteRecommendation(recommendationid, placeid, collectionid);
        });
    },
    
    /**
     * This function couples a place with a collection
     * via a JQuery UI Dialog
     */
    connectPlaceCollectionDialog : function (collectionid, placeid, title, isAlreadyBookmarked) {
        'use strict';
        var url = routes.connectPlaceCollectionInDialog({collectionid: collectionid, placeid: placeid, isAlreadyBookmarked: isAlreadyBookmarked});
        var connectPlaceCollectionDialog = $('<div/>').addClass('connectPlaceCollectionDialog');
        connectPlaceCollectionDialog.load(url).dialog({
            height: 'auto',
            width: PlatsR_GUI.dynamicWidth("placecollection"),
            title: title,
            bgiframe: true,
            autoOpen: false,
            modal: true,
            resizable: false,
            draggable: false,
            closeOnEscape: false,
            zIndex: 10000,
            dialogClass: 'customDialog',
            open: function (event, ui) {
            	//setConfirmUnload(true);
            	PlatsR_GUI.initCheckMBrowsers();
            	
            },
            close: function (event, ui) {
            	//setConfirmUnload(false);
                $(this).remove();
            },
            create: function (e, ui) {
            
            }
        });
        
        var arr = [];
        arr.push(collectionid);
        arr.push(placeid);
        arr.push(title);
        arr.push(isAlreadyBookmarked);
        
        PlatsR_GUI.assureLoggedOn(PlatsR_GUI.connectPlaceCollectionDialog, connectPlaceCollectionDialog, arr);
        
        $("#choosecollection").change(function(){
        	$("addPlaceToCollectionForm :submit").removeAttr("disabled");
        })
        $('.connectPlaceCollectionDialog').on('click.placeCollectionRelation', '.create-placecollection-relation', function (e) {
            e.preventDefault();
            var url = $(this).attr('href');
            PlatsR_GUI.closeDialog($('.connectPlaceCollectionDialog'));
            window.location.href = url;
        });
        
        $('.connectPlaceCollectionDialog').on('click.placeCollectionRelation', '.cancel-link', function (e) {
            e.preventDefault();
            PlatsR_GUI.closeDialog($('.connectPlaceCollectionDialog'));
        });
        
        $('.connectPlaceCollectionDialog').on('submit.placeCollectionRelation', '#addPlaceToCollectionForm', function (e) {
            e.preventDefault();
            var placeid = $('#addPlaceToCollectionForm').find('[name="placeid"]').val();
            var collectionid = $('#addPlaceToCollectionForm').find('#choosecollection').val();
            var description = PlatsR_GUI.tidyInput($('#addPlaceToCollectionForm').find('#description').val());
            if (description === '') {
            	alert('Du mÃ¥ste skriva in riktigt vÃ¤rde.');
            	return false;
            }
            var addPlactToCollectionData = "placeid=" + placeid + "&collectionid=" + collectionid;
            var posting = $.post(routes.connectPlaceCollectionDialog(), addPlactToCollectionData);
            
            posting.done(function (data) {
                if ($.isEmptyObject(data)) {
                    PlatsR_GUI.closeDialog($('.connectPlaceCollectionDialog'));
                    var url = routes.showPlace({id: placeid});
                    $('#belongsToCollections').load(url + ' #belongsToCollections > *', function () {
                        PlatsR_GUI.initStarttopFunctions();
                    });
                } else {
                    var urlReload = routes.connectPlaceCollectionInDialog({collectionid: collectionid, placeid: placeid, isAlreadyBookmarked: isAlreadyBookmarked});
                    $('#updateAddPlaceToCollection').load(urlReload, ' #updateAddPlaceToCollection > *', function (){
                        PlatsR_GUI.initStarttopFunctions();
                    });
                }
            })
            .fail(function (xhr, textStatus, thrownError) {
                PlatsR_GUI.closeDialog($('.connectPlaceCollectionDialog'));
                PlatsR_GUI.ajaxError(xhr, textStatus, thrownError);
            });         
        });
    },
    
    /**
     * This function starts with checking if
     * the bookmarking user is logged on, if not
     * prompting for login
     */
    addBookmark : function(placeId, collectionId){
        'use strict';
        var arr = [];
        arr.push(placeId);
        arr.push(collectionId);
        PlatsR_GUI.assureLoggedOn(PlatsR_GUI.doAddBookmark, null, arr);
    },
    
    /**
     * This function really does bookmark the 
     * place or collection.
     */
    doAddBookmark : function (placeId, collectionId, callback) {      
        'use strict';
        var posting,
            elementsArray,
            functionsArray,
            url;
        posting = $.post(routes.addBookmarkAjax(), {placeid: placeId, collectionid: collectionId});
        
        posting.done(function (data) {
        	if (typeof callback != 'undefined') {
        		callback();
        	} else {
        		url = placeId > 0 ? routes.showPlace({id: placeId}) : routes.showCollection({id: collectionId});
                
                elementsArray = [];
                elementsArray.push('placeTopHeading');
                functionsArray = [];
                functionsArray.push(PlatsR_GUI.initStarttopFunctions);
                
                PlatsR_GUI.contentRefresh(url, elementsArray, functionsArray);
        	}
        })
        
        .fail(function (xhr, textStatus, thrownError) {
            PlatsR_GUI.ajaxError(xhr, textStatus, thrownError);
        });
        
        
    },
    
    /**
     * TODO!! Skall denna anvÃ¤ndas eller skall fel visas pÃ¥  annat generellt sÃ¤tt?
     * This function opens a general JQuery UI Dialog
     * showing messages/errors from an ajax callback
     */
    errorMessageDialog : function (title, msg) {
        'use strict';
        var url = routes.errorMessageDialog();
        
        var errorMessageDialog = $('<div/>').addClass('errorMessageDialog');
        errorMessageDialog.load(url).dialog({
            height: 'auto',
            width: PlatsR_GUI.dynamicWidth("errormessage"),
            title: title,
            bgiframe: true,
            autoOpen: false,
            modal: true,
            resizable: false,
            draggable: false,
            closeOnEscape: false,
            zIndex: 10000,
            dialogClass: 'customDialog',
            close: function (event, ui) {
                $(this).remove();
            },
            create: function (e, ui) {
            
            },
            open: function (e, ui) {
                $('input').data('error-text', msg);
                $('#error-data').text($('input').data('error-text'));               
            }
        }); 
        errorMessageDialog.dialog('open');
        
        $('.errorMessageDialog').on('click', '.cancel-error-dialog',  function(e){
            e.preventDefault();
            PlatsR_GUI.closeDialog(errorMessageDialog);
        });
    },
    
    /**
     * This function starts handling for adding a recommendation
     */
    addRecommendation : function (placeid, collectionid) {
        'use strict';
        var arr = [];
        arr.push(placeid);
        arr.push(collectionid);
        
        PlatsR_GUI.assureLoggedOn(PlatsR_GUI.doAddRecommendation, null, arr);
    },
    
    /**
     * This function really persists the recommendation,
     * after proper login
     */
    doAddRecommendation : function (placeid, collectionid) {
        'use strict';
        var addRecData = "placeid=" + placeid + "&collectionid=" + collectionid;
        var posting = $.post(routes.addRecommendation(), addRecData);
        
        posting.done(function (data) {
            PlatsR_GUI.updateRecommendations(placeid, collectionid);
        })
        .fail(function (xhr, textStatus, thrownError) {
            PlatsR_GUI.ajaxError(xhr, textStatus, thrownError);
        });

    },
    
    /**
     * This function starts handling of deletion off a recommendation
     */
    deleteRecommendation : function (recommendationid, placeid, collectionid) {
        'use strict';
        var arr = [];
        arr.push(recommendationid);
        arr.push(placeid);
        arr.push(collectionid);
        
        PlatsR_GUI.assureLoggedOn(PlatsR_GUI.doDeleteRecommendation, null, arr);
    },
    
    /**
     * This function really deletes the recommendation
     */
    doDeleteRecommendation : function (recommendationid, placeid, collectionid) {
        'use strict';
        var deleteRecData = "recommendationid=" + recommendationid + "&placeid=" + placeid + "&collectionid=" + collectionid;
        var posting = $.post(routes.deleteRecommendation(), deleteRecData);
        
        posting.done(function (data) {
            PlatsR_GUI.updateRecommendations(placeid, collectionid);
        })
        .fail(function (xhr, textStatus, thrownError) {
            PlatsR_GUI.ajaxError(xhr, textStatus, thrownError);
        });
    },
    
    /**
     * This function shows/hides
     * recommendation, if there are "too many to show"
     */
    showHideAllRecommendations : function () {
        'use strict';
        if ($(".showRecommendation").css("display") === "none") {
            $(".showRecommendation").css("display","inline");
            $("#showHideAllRecommendations").html(i18n("hide.all.tags.link"));
        } else {
            var numberOf = $("#numberOfRecommendations").val();
            $(".showRecommendation").css("display","none");
            $("#showHideAllRecommendations").html(i18n("show.all.tags.link", numberOf));
        }
    },
    
    /**
     * This function updates the
     * section showing the recommendations
     */
    updateRecommendations : function (placeid, collectionid) {
        'use strict';
        var url = placeid > 0 ? routes.showPlace({id: placeid}) : routes.showCollection({id: collectionid});     
        $('#recommendations').load(url + ' #recommendations > *', function () {
            PlatsR_GUI.initRecommendationHandling();
        });     
    },
    
    /**
     * This function inittializes
     * event listening for the button/links
     * used for handling tags
     */
    initTagsHandling : function(){
        'use strict';
        $('.add-tags').on('click', function (e) {
            e.preventDefault();
            var placeid = $(this).data('placeid');
            var collectionid = $(this).data('collectionid');
            PlatsR_GUI.openTagsForm(placeid, collectionid);
        });
        
        $('.show-hide-all-tags').on('click', function (e) {
            e.preventDefault();
            PlatsR_GUI.showHideAllTags(null);
        });
        
        $('.delete-tag').on('click', function (e) {
            e.preventDefault();
            var tagid = $(this).data('tagid');
            var placeid = $(this).data('placeid');
            var collectionid = $(this).data('collectionid');            
            PlatsR_GUI.deleteTag(tagid, placeid, collectionid);
        });
    },
    
    /**
     * This function performs a check if session has
     * timed out, and thus enforces a login
     */
    openTagsForm : function (placeid, collectionid) {
        'use strict';
        var arr = [];
        arr.push(placeid);
        arr.push(collectionid);
        
        PlatsR_GUI.assureLoggedOn(PlatsR_GUI.doOpenTagsForm, null, arr);
    },
    
    /**
     * This function really opens the
     * form for adding tags
     */
    doOpenTagsForm : function (placeid, collectionid, callback) {
        'use strict';
        if (typeof callback != 'undefined') {
        	location.href=location.href+"#tags";
        	callback();
        }
        $('#tags').unbind('.tagEvents');
        PlatsR_GUI.showHideAllTags("insert");
        $('.showTagForm').addClass('hidden');
        $('.show-hide-all-tags').addClass('hidden');
        $('#newTagForm').show();
        
        $("#newTag").val("");   
        $.getJSON(routes.getTags(), function (data) {
            var allTags = [];
            $.each(data, function (key, val) {
                allTags.push(val);
            });
            $("#newTag").autocomplete({
                source: allTags,
                minLength: 2});
        });
        
        $('#newTagForm').change(function () {
        	$('#newTagForm').dirtyForms('setDirty');
        });
        
        $('#cancelNewTag').on('click.tagEvents', function (e) {
            e.preventDefault();
            PlatsR_GUI.showHideAllTags(null);
            $('.showTagForm').removeClass('hidden');
            var listlimit = parseInt(i18n('taglist.limit'));
            var numtags = $('.show-hide-all-tags').data('numtags');
            if(numtags > listlimit){
                $('.show-hide-all-tags').removeClass('hidden'); 
            }
            $('#newTagForm').hide();
            $('#tags').unbind('.tagEvents');
            $('#newTagForm').dirtyForms('setClean');
            //setConfirmUnload(false);
        });
        
        $('#tags').one('submit.tagEvents', '#newTagForm', function(e){
            e.preventDefault();
            
            var tagData = $('#newTagForm').serializeArray();
            var placeid;
            var collectionid;
            var tag ;
            $.each(tagData, function(i, fd){
                if(fd.name === "placeid"){
                    placeid = fd.value;
                }else if(fd.name === "collectionid"){
                    collectionid = fd.value;
                }else if(fd.name === "tag"){
                    tag = PlatsR_GUI.tidyInput(fd.value);
                }
            });
            var posting = $.post(routes.addTag(), tagData);
            
            posting.done(function (data) {
            	PlatsR_GUI.updateTags(placeid, collectionid);
                PlatsR_GUI.openTagsForm();
                $('#newTagForm').dirtyForms('setClean');
            })
            .fail(function (xhr, textStatus, thrownError) {
                PlatsR_GUI.ajaxError(xhr, textStatus, thrownError);
            });
        });
    },
    
    /**
     * This function show or hides
     * tags
     */
    showHideAllTags : function(state){
        'use strict';
        var listHidden = false;
        var listlimit = parseInt(i18n('taglist.limit'));
        var numtags = $('.show-hide-all-tags').data('numtags');
        $('div.tagListLimiter').each(function(){
            if($(this).hasClass('hidden')){
                listHidden = true;
            }
        });
        
        switch (state) {
        case "delete":
            listHidden = true;
            break;
            
        case "insert":
            listHidden = true;
            break;
            
        case null:
            break;
        }

        if (listHidden && (numtags > listlimit)) {
            $('div.tagListLimiter').each(function () {
                $(this).removeClass('hidden');
            });
            $('.show-hide-all-tags').text(i18n('hide.all.tags.link'));
        } else if (!listHidden && (numtags > listlimit)) {
            $('div.tagListLimiter').slice(listlimit).addClass('hidden');
            $('.show-hide-all-tags').text(i18n('show.all.tags.link', numtags));
        }
    },
    
    /**
     * This function performs a check if session has
     * timed out, and thus enforces a login
     */
    deleteTag : function (id, placeid, collectionid) {
        'use strict';
        var arr = [];
        arr.push(id);
        arr.push(placeid);
        arr.push(collectionid);
        
        PlatsR_GUI.assureLoggedOn(PlatsR_GUI.doDeleteTag, null, arr);
    },
    
    /**
     * This function really performs
     * the deletion of a tag
     */
    doDeleteTag : function (id, placeid, collectionid) {
        'use strict';
        var deleteTagData = "tagid=" + id + "&placeid=" + placeid + "&collectionid=" + collectionid;
        var posting = $.post(routes.deleteTags(), deleteTagData);
        
        posting.done(function (data) {
            PlatsR_GUI.updateTags(placeid, collectionid);
            $('#tags').unbind('.tagEvents');
            PlatsR_GUI.showHideAllTags("delete");
        })
        .fail(function (xhr, textStatus, thrownError) {
            PlatsR_GUI.ajaxError(xhr, textStatus, thrownError);
        });
    },
    
    /**
     * This function updates the
     * section showing the tags
     * and also sections of the
     * page depending on changes in tags.
     */
    updateTags : function (placeid, collectionid) { 
        'use strict';
        var url = placeid > 0 ? routes.showPlace({id: placeid}) : routes.showCollection({id: collectionid});
        
        var elementsArray = [];
        elementsArray.push('tags');
        elementsArray.push('commonTags');
        
        var functionsArray = [];
        functionsArray.push(PlatsR_GUI.initTagsHandling);
        functionsArray.push(PlatsR_GUI.initCommonsHandling);
        
        PlatsR_GUI.contentRefresh(url, elementsArray, functionsArray);
    },
    
    /**
     * This function handles 
     * actions for places/collections
     * with common tags
     */
    initCommonsHandling : function () {
        'use strict';
        $('.show-hide-commons').on('click', function (e) {
            e.preventDefault();
            PlatsR_GUI.showHideCommons();
        });
    },
    
    /**
     * This function performs the hiding/show 
     * of the places/collections having similar
     * tags with the current place/collection
     */
    showHideCommons : function () {
        'use strict';
        var listHidden = false;
        var listlimit = parseInt(i18n('commontaglist.limit'));
        var numcommons = $('.show-hide-commons').data('numcommons');
        
        $('section.objectCommonTag').each(function () {
            if($(this).hasClass('hidden')){
                listHidden = true;
            }
        });
        
        if(listHidden && (numcommons > listlimit)){
            $('section.objectCommonTag').each(function () {
                $(this).removeClass('hidden');
            });
            $('.show-hide-commons').text(i18n('hide.all.tags.link'));
        }else if(!listHidden && (numcommons > listlimit)){
            $('section.objectCommonTag').slice(listlimit).addClass('hidden');
            $('.show-hide-commons').text(i18n('show.more.commons', numcommons));
            PlatsR_GUI.scrollTo('#commonTags');
        }
    },
    
    /**
     * This function intializes JQuery UI Tabs,
     * and preloads the content for all remaining tabs,
     * in the background.
     */
    initTabsHandling : function () {
        'use strict';
        var total;
        var selectedTab=parseInt($("#tabs").data("selectedtab"),10);
        var afterTab;
        var beforeTab=0;
        var currentLoadingTab = 1;
        var tabs = $("#tabs").tabs({    
            beforeLoad: function( event, ui ) {
                ui.jqXHR.error(function () {
                    ui.panel.html(i18n("tab.load.error.msg"));
                });
            },
            load:	function(event, ui){
            	afterTab=afterTab+1;
            	if(afterTab<total){
            		tabs.tabs('load',afterTab);
            	} else {
            		beforeTab=beforeTab+1;
            		if(beforeTab<selectedTab){
            			tabs.tabs('load',beforeTab);
            		}
            	}
            },
            select: function(event, ui){
            	
            },
            activate: function(event, ui){
            	
            },
            cache: true
        }).removeClass('hidden');
        total = tabs.find('.ui-tabs-nav li').length;
        if(selectedTab===0){
        	afterTab=1;
        	tabs.tabs('load',afterTab);
        } else {
        	afterTab=selectedTab;
        	tabs.tabs('select',selectedTab);
        }
    },
    
    /**
     * This function inittializes
     * event listening for the button/links
     * used for handling sources
     */
    initSourcesHandling : function () {
        'use strict';
        $('.add-place-sources').on('click', function (e) {
            e.preventDefault();
            PlatsR_GUI.openAddSources();
        });
        
        $('#cancelPlaceSourceEdit').on('click', function (e) {
            e.preventDefault();
            PlatsR_GUI.closeAddSourcesForm();
        });
        
        $('#editPlaceSourceForm').change(function () {
        	$('#editPlaceSourceForm').dirtyForms('setDirty');
//        	console.log("Place source has changed");
        });
        
        $('#savePlaceSourceEdit').one('click', function (e) {
            e.preventDefault();
            var sourcetxt = encodeURIComponent(PlatsR_GUI.tidyInput($("#placeSourceTxt").val()));
            var placeid = $('form#editPlaceSourceForm').find('[name="placeid"]').val();
            var collectionid = $('form#editPlaceSourceForm').find('[name="collectionid"]').val();

            PlatsR_GUI.saveSource(sourcetxt, placeid, collectionid);
        });
    },
    
    /**
     * This function performs a check if session has
     * timed out, and thus enforces a login
     */
    openAddSources : function () {
        'use strict';
        var arr = [];
        PlatsR_GUI.assureLoggedOn(PlatsR_GUI.doOpenAddSources, null, arr);
    },
    
    /**
     * This function really opens
     * the form for adding a source
     */
    doOpenAddSources : function () {
        'use strict';
        $("#editPlaceSourceTxt").hide();
        $("#editPlaceSourceForm").show();
    },
    
    /**
     * This function performs a check if session has
     * timed out, and thus enforces a login
     */
    closeAddSourcesForm : function () {
        'use strict';
        var arr = [];
        PlatsR_GUI.assureLoggedOn(PlatsR_GUI.doCloseAddSourcesForm, null, arr);
    },
    
    /**
     * This function really closes
     * the form for adding a source
     */
    doCloseAddSourcesForm : function () {
        'use strict';
        $("#editPlaceSourceForm").hide();
        $("#editPlaceSourceTxt").show();
        $("#editPlaceSourceForm").dirtyForms('setClean');
        //setConfirmUnload(false);
    },
    
    /**
     * This function performs a check if session has
     * timed out, and thus enforces a login
     */
    saveSource : function (sourcetxt, placeid, collectionid) {
        'use strict';
        var arr = [];
        arr.push(sourcetxt);
        arr.push(placeid);
        arr.push(collectionid);
        PlatsR_GUI.assureLoggedOn(PlatsR_GUI.doSaveSource, null, arr);
    },
    
    /**
     * This function really saves
     * a source
     */
    doSaveSource : function (sourcetxt, placeid, collectionid) {
        'use strict';
        var saveSourceData = "sourcetxt=" + sourcetxt + "&placeid=" + placeid + "&collectionid=" + collectionid;
        var posting = $.post(routes.updateSources(), saveSourceData);
        
        posting.done(function (data) {
            PlatsR_GUI.updateSources(placeid, collectionid);
        })
        .fail(function (xhr, textStatus, thrownError) {
            PlatsR_GUI.ajaxError(xhr, textStatus, thrownError);
        });
    },
    
    /**
     * This function updates the
     * section showing the tags
     */
    updateSources : function (placeid, collectionid) {
        'use strict';
        var url = placeid > 0 ? routes.showPlace({id: placeid}) : routes.showCollection({id: collectionid});     
        $('#placeSource').load(url + ' #placeSource > *', function () {
            PlatsR_GUI.initSourcesHandling();
        });     
    },
    
    /**
     * This function performs logging in js
     */
    log: function(msg, isError) {
        // If not in dev mode, disable clientside logging
        if (!PlatsR_GUI.DEV_MODE) { 
            return;
        }
        
        PlatsR_GUI.ERRORS += "\n\n";
        PlatsR_GUI.ERRORS += msg;
        
        try {
            //alert(msg);
//            console.log(msg);           
        } catch(e) {
            //alert(msg);
        }
    },
    
    /**
     * TODO!! handle submit button coupling to the tinyMCE !!
     * hanterar felmeddelande diven vid textareorna anvÃ¤nder vi nu Ã¤ven i play
     * TinyMCE anvÃ¤nder denna fÃ¶r validering
     */
    editorEventCallback: function (event) {
        'use strict';
        //PlatsR_GUI.log(event.type);
        
        var editor = tinyMCE.selectedInstance;
        // gor att markoren forsvinner i IE
        //var bm = editor.selection.getBookmark();
        var contentWithMarkup = editor.getContent();
        var rawContent = contentWithMarkup;
        var rawLength = rawContent.length;
        var feedbackSelector = "#" + editor.settings.feedbackId;
        var submitSelector = $('#submit');//(editor.settings.submitId === undefined) ? null : "." + editor.settings.submitId;
       
            $(feedbackSelector).addClass("hidden");
            if (submitSelector !== null) {
                $(submitSelector).removeClass("invalid");
                $(submitSelector).attr("disabled", false);
            }
        
        // funkar inte i IE. Har man tva textfalt pÃ¥ en sida sÃ¥ fokusar den pÃ¥
        // den man INTE klickade pÃ¥ om man hade den markerad innan
        //editor.focus();
        //editor.selection.moveToBookmark(bm);
        
        return true;
    },
    
    //TODO!! skall denna funktion anvÃ¤ndas fÃ¶r koll om cookies tillÃ¥ts ?! navigator.cookieEnabled does not work in chrome
    isCookiesEnabled : function(){
        var cookie_set = false;
        var cookieName = 'platsrTestCookie';
        document.cookie = cookieName + '=';
        if ( document.cookie.indexOf(cookieName) != -1 ){
            cookie_set = true;
            // delete cookie
            var cookie_date = new Date ( );  // current date & time
            cookie_date.setTime ( cookie_date.getTime() - 1 );
            document.cookie = cookieName += "=; expires=" + cookie_date.toGMTString();
        }
        return cookie_set;
    },
    
    //image upload prylarna bÃ¶rjar hÃ¤r
    /**
     * Opens a JQuery UI Dialog for handling
     * images, upload, editing, deleting, 
     * connecting/disconnecting with a story
     * connecting/disconnecting with a collection
     */
    showImageUploadDialog : function (placeid, storyid, callback) {
        'use strict';
        var titleText = storyid > 0 ? i18n("couple.image.to.story") : i18n("add.image.to.place");
        var url = routes.showUpploadForm({placeid: placeid, storyid: storyid});
        
        var imageUploadDialog = $('#imageUploadDiv').load(url,function(response, status, xhr) {
        	if (status === "success") {
		        // Set the unload message whenever any input element get changed.
		        $(':input').on('change', function() {
		        	PlatsR_GUI.IMAGE_META_DATA_SUBMIT=false;
		        });
		        // Turn off the unload message whenever a form get submitted properly.
		        $('form').on('submit', function() {
		        	PlatsR_GUI.IMAGE_META_DATA_SUBMIT=true;
		        });
		        //IMPORTANT, this is commented out, since IE does not understand console.log, thus causing upload error.
		        //console.log($('#imageUploadDiv').offset().top);
        		var ua = navigator.userAgent.toLowerCase(); 
        		 if (ua.indexOf('safari')!=-1){ 
        		   if(ua.indexOf('chrome')  > -1){
        		   }else{
        		    $('[name="uploadFile"]').removeAttr("multiple");
        		   }
        		  }
        		PlatsR_GUI.updateImageMetaData(placeid);
        		PlatsR_GUI.updateImageUploadForm(placeid);
        		if (typeof callback !== 'undefined') {
            		callback();
        		}
        	} else {
        		PlatsR_GUI.ajaxError(xhr,status,null)
        	}
        	});
        imageUploadDialog.dialog({
            autoOpen:false,
            title: titleText,
            draggable: false,
            height: 'auto',
            width: 800,
            dialogClass: 'customDialog',
            modal: true,
            position: 'center',
            resizable: false,
            open: function (e, ui) {
            	PlatsR_GUI.IMAGE_META_DATA_SUBMIT=true;
            },
            close: function(event, ui){
            	if ($.browser.msie && parseInt($.browser.version,10)){
            		location.reload(true);
		        	PlatsR_GUI.IMAGE_META_DATA_SUBMIT=true;
            	}
            },
            beforeClose: function (event, ui) {
            	if($.DirtyForms.isDirty()){
            		return confirm("Du har data som inte har sparats, Ã¤r du sÃ¤ker pÃ¥ att du vill lÃ¤mna denna dialog?");
    			}
            }
        });
        
        var arr = [];
        arr.push(placeid);
        arr.push(storyid);
        PlatsR_GUI.assureLoggedOn(PlatsR_GUI.showImageUploadDialog, imageUploadDialog, arr);
    },
    
    /**
     * show or hide imageinfo div (on imageupload.html)
     */
    imageContentToggler : function (imageid) {
        'use strict';
        if ($("#meta" + imageid).hasClass('hidden')){
            if (!$("#edit" + imageid).hasClass('hidden')){
                $("#edit" + imageid).addClass('hidden');
            }   
        }
        $("#meta" + imageid).toggleClass('hidden');
    },
    
    /**
     * //show or hide image edit form
     */
    imageEditToggler : function (imageid) {
        'use strict';
        if ($("#edit" + imageid).hasClass('hidden')){
            if (!$("#meta" + imageid).hasClass('hidden')){
                $("#meta" + imageid).addClass('hidden');
            }
        }
        $("#edit" + imageid).toggleClass('hidden');
        $(".image-upload-incomplete-edit-message" + imageid).toggleClass('hidden');
        $(".image-upload-incomplete-message" + imageid).toggleClass('hidden');
        $("#edit" + imageid +" > *").find(":input").focus();
        $("#edit" + imageid +" > *").find(":input[name=upphovsman]").focus();
    },
    
    /**
     * radera bild postningen  
     * - sÃ¤tter metadatat till expired 
     * @param imageid
     */
    deleteImage : function (imageid, placeid, storyid) {    
        'use strict';
        var posting = $.post(routes.deleteImage(), {placeid: placeid, imageid: imageid, storyid: storyid});
        
        posting.done(function (data) {
            $('#imageUploadDiv').html(data);
            PlatsR_GUI.refrechImagePartOfPlace(placeid,function(){
            	$(".imgeditform").addClass("hidden");
                $(".image-upload-incomplete-message").addClass('hidden');
                $(".image-upload-incomplete-edit-message").removeClass('hidden');
            });
        })
            .fail(function (xhr, textStatus, thrownError) {
                $('#imageUploadDiv').dialog('close');
                PlatsR_GUI.ajaxError(xhr, textStatus, thrownError);
            });
     },
    
    /**
     * kopplar en bild till en story
     */
    connectImageToStory : function (imageid, storyid, placeid) {    
        'use strict';
        var posting = $.post(routes.connectImageToStory(),
                {placeid:placeid,imageid:imageid,storyid:storyid});
        
        posting.done(function (data) {
            $("#storyImageImg").removeAttr("src").attr("src", "/platsrimg/" + imageid + "/5");
            $("#imageUploadLink").text(i18n("change.image"));
            if ($("#imageStoreRemoveLink").hasClass('hidden')) {
                $("#imageStoreRemoveLink").removeClass('hidden');
            }   
            $('#imageUploadDiv').dialog('close');
        })
        .fail(function (xhr, textStatus, thrownError) {
            $('#imageUploadDiv').dialog('close');
            PlatsR_GUI.ajaxError(xhr, textStatus, thrownError);
        });
    },
    
    /**
     * uppdaterar en liten del av place sidan dÃ¥ vi Ã¤ndrat pÃ¥ bilden 
     * dvs vi uppdaterar bakgrundssidan under popuppen
     */
    refrechImagePartOfPlace : function (placeid, callback) {
        'use strict';
        var url = routes.showPlace({id: placeid});
        
        if (jQuery.browser.msie) {
            PlatsR_GUI.showImageUploadDialog(placeid,0,callback);
        } else { 
            $('#imagesection').load(url + ' #imagesection', function () {
                //has to be in callback, otherwise events reinstitution does not get fired when page update is done
                PlatsR_GUI.initImageBrowser();
                PlatsR_GUI.updateImageMetaData(placeid);
            	PlatsR_GUI.updateImageUploadForm(placeid);
        		if (typeof callback !== 'undefined') {
            		callback();
        		}
            });
        }
    },
    
    /**
     * disconnect a image from being the storyimage
     */
    disConnectImageFromStory : function (placeid, storyid) {    
        'use strict';
        var posting = $.post(routes.connectImageToStory(), {placeid: placeid, imageid: 0, storyid: storyid});
        
        posting.done(function (data) {
            if (!$("#imageStoreRemoveLink").hasClass('hidden')) {
                $("#imageStoreRemoveLink").addClass('hidden');
            }
            $("#imageUploadLink").html(i18n("views.Stories.story.addimage"));
            $("#storyImageImg").removeAttr("src").attr("src", "/platsrimg/-1/5");
        })
        .fail(function (xhr, textStatus, thrownError) {
            PlatsR_GUI.ajaxError(xhr, textStatus, thrownError);
        });
    },
    
    /**
     * marks an image as collection image
     */
    connectImageToCollection : function (collectionid, imageid) {
        'use strict';
        var posting = $.post(routes.connectImageToCollection(), {imageid: imageid, collectionid: collectionid});
        
        posting.done(function (data) {
            $("#placeOrCollectionImage").removeAttr("href").attr("href", "/platsrimg/" + imageid + "/1");
            $("#placeOrCollectionImage").removeAttr("title").attr("title", "");
            $("#placeOrCollectionImage").replaceWith("<img class=\"placeImage\" id=\"placeOrCollectionImage\" src=\"/platsrimg/" + imageid + "/3\"/>");
            
            if ($("#placeOrCollectionImage").hasClass('hidden')) {
                $("#placeOrCollectionImage").removeClass('hidden');
            }
            if ($("#placeOrCollectionImageRemoveLink").hasClass('hidden')) {
                $("#placeOrCollectionImageRemoveLink").removeClass('hidden');
            }
            if ($(".showLargeImageLink").hasClass('hidden')) {
                $(".showLargeImageLink").removeClass('hidden');
            }
        })
        .fail(function (xhr, textStatus, thrownError) {
            PlatsR_GUI.ajaxError(xhr, textStatus, thrownError);
        });
    },
    
    /**
     * disconects an image from collection 
     */
    disConnectImageFromCollection : function (collectionid){
        'use strict';
        var posting = $.post(routes.connectImageToCollection(), {imageid: 0, collectionid: collectionid});
        
        posting.done(function (data) {
            $("#placeOrCollectionImage").removeAttr("src").attr("src", "");
            $("#placeOrCollectionImage").removeAttr("href").attr("href", "");
            $("#placeOrCollectionImage").removeAttr("title").attr("title", "");
            
            if ($("#placeOrCollectionImage").hasClass('hidden')) {
                //do nothing
            } else {
                $("#placeOrCollectionImage").addClass('hidden');
            }
            if ($("#placeOrCollectionImageRemoveLink").hasClass('hidden')) {
                //do nothing
            } else {
                $("#placeOrCollectionImageRemoveLink").addClass('hidden');
            }
            if ($(".showLargeImageLink").hasClass('hidden')) {
                //do nothing
            } else {
                $(".showLargeImageLink").addClass('hidden');
            }       
        })
        .fail(function (xhr, textStatus, thrownError) {
            PlatsR_GUI.ajaxError(xhr, textStatus, thrownError);
        });
    },
    
    /**
     * Performs updating of image meta data
     */
    updateImageMetaData : function (placeid) {
    	'use strict';
    	var options = { 
    		    target:     '#imageUploadDiv', 
    		    url:        routes.updateImageMetadata(),
    		    success: function(data){
    		    	PlatsR_GUI.IMAGE_META_DATA_SUBMIT = true; 
    		    	PlatsR_GUI.refrechImagePartOfPlace(placeid,function(){
    			    	$(".imgeditform").addClass("hidden");
    	                $(".image-upload-incomplete-message").addClass('hidden');
    	                $(".image-upload-incomplete-edit-message").removeClass('hidden');
    	                $('html, body').animate({ scrollTop: $('#imageUploadDiv').offset().top}, 5);
    		    	});
                },
                error:  function (XMLHttpRequest, textStatus, errorThrown) {
                	if(errorThrown=='Unauthorized'){
                		alert(i18n('image.upload.missing.auth'));
                	}else{
                		alert(i18n('image.upload.error'));	
                	}
                },
                beforeSubmit: function (formData, form, options) { 
                	var name, upphovsman;
                	$.each(formData, function(i, fd) {
                		if (fd.name === 'name') {
                			 name = PlatsR_GUI.tidyInput(fd.value);
                			 fd.value = name;
                		} else if (fd.name === 'description') {
                			fd.value = PlatsR_GUI.tidyInput(fd.value);
                		} else if (fd.name === 'upphovsman') {
                			upphovsman = PlatsR_GUI.tidyInput(fd.value);
                			fd.value = upphovsman; 
                		}
                	});
                	
                	if (name === '' || upphovsman === '') {
                		alert("Du mÃ¥ste skriva in giltiga vÃ¤rden.");
                		return false;
                	}
                }
    		}; 
    	//obs needed to bind to class instead of id to make it work
        $('.pictureEditForm').ajaxForm(options);
     },
    
    /**
     * Performs the image upload
     */
    updateImageUploadForm : function (placeid) {    	
    	'use strict';
    	var options = { 
    		    target:     '#imageUploadDiv', 
    		    url:        routes.editImageForm(),
    		    uploadProgress: function(event, position, total, percentComplete) {
    		    	$('#progressBar').removeClass('hidden')
    		    }, 
    		    success: function(data){
    		    	$('[type="submit"]').removeAttr("disabled");
    		    	PlatsR_GUI.refrechImagePartOfPlace(placeid);
                },
                error:  function (XMLHttpRequest, textStatus, errorThrown) {
                	$('[type="submit"]').removeAttr("disabled");
                	PlatsR_GUI.ajaxError(XMLHttpRequest, textStatus, errorThrown)
                 },
                 beforeSubmit: function (arr, form, options) {
                	 if ($("#fileuploadform input:checked").length>0){
                		 $('[type="submit"]').attr("disabled","disabled");
                	 } else {
                		 return false;
                	 }
                	 
                 }
    		};
    	//bind ajaxform stuff to the upload form
        $('#fileuploadform').ajaxForm(options); 
    },
    
    //image upload prylarna slutar hÃ¤r
    
    //wikipedia startar hÃ¤r 
    /**
     *  Init of wikipedia dialog
     */
    initWikipediaHandling : function () {
    	'use strict';
        var wikipediaDialog = $("<div/>", {id: 'wikipediaDialog'})
        .dialog({
            autoOpen:false,
            title: i18n("title.add.wikipedia.article"),
            draggable: false,
            height: 500,
            width: 500,
            modal: true,
            dialogClass: 'customDialog',
            position: "center",
            resizable: false,
            open: function (e, ui) {
            },
            close: function (e, ui) {
            	$('form#addWikipediaLinkForm').dirtyForms('setClean');
            },
            buttons: [
                      {
                          text: i18n('global.save'),
                          open: function () { $(this).addClass('wikipedia-dialog-button-blue') },
                          click: function () {
                        	  if ($("#selectedIngress").val()>0){
                        		  var placeid=$("form#addWikipediaLinkForm").find("[name='placeid']").val();
                            	  var collectionid=$("form#addWikipediaLinkForm").find("[name='collectionid']").val();
                            	  var pageid=$("[name='pageid']").val();
                            	  var posting = $.post(routes.addWikipediaArticle(), 
                            			  {ingressid: $("#selectedIngress").val(), placeid: placeid, collectionid: collectionid, pageid: pageid});
                            	  
                                  posting.done(function (data) {
                                	  	$("#wikipediaArticleLinks").replaceWith(data);
                                	  	$("#wikipediaUrl").val("");
                                	  	$("#wikipediaDialog").empty();
                                        $("#wikipediaDialog").dialog("close");
                                    })
                                    .fail(function (xhr, textStatus, thrownError) {
                                        PlatsR_GUI.ajaxError(xhr, textStatus, thrownError);
                                    });  
                        	  }
                          }
                      },
                      {
                          text: i18n("global.abort"),
                          open: function () { 
                        	  $(this).addClass('cancelLink'); 
                        	  },
                          click: function() {
                                $("#wikipediaUrl").val("");
                                $("#wikipediaInfo").html("");
                                $(this).dialog("close");
                              }
                      }
                    ]
        });
    },

    /**
     * Show add wikipedia link form
     */
    showAddWikipediaLinkForm : function () {
    	'use strict';
        var arr = [];
        PlatsR_GUI.assureLoggedOn(PlatsR_GUI.doShowAddWikipediaLinkForm, null, arr);
    },
    
    /**
     * Function for deleting wikipedia articles
     */
    deleteWikipediaArticle : function (id, placeid, collectionid) {
    	'use strict';
    	var url,
    	    deleteData,
    	    posting;
        $("#wikipediaArticleId" + id).hide();
        url = routes.deleteWikipediaArticle();
        deleteData = placeid > 0 ? {articleid: id, collectionid: "", placeid: placeid} 
            : {articleid: id, collectionid: collectionid, placeid: ""};
            
        posting = $.post(routes.deleteWikipediaArticle(), deleteData);
        
        posting.done(function (data) {
        	$("#wikipediaArticleLinks").replaceWith(data);
        })
        .fail(function (xhr, textStatus, thrownError) {
            PlatsR_GUI.ajaxError(xhr, textStatus, thrownError);
        });
    },
    
    /**
     * This function really opens the form for 
     * adding a wikipedia-link
     */
    doShowAddWikipediaLinkForm : function () {
    	'use strict';
        $("#url").val("");
        $("#showWikipediaLinkForm").html(i18n("paste.link.to.wikipedia.article"));
        $("#addWikipediaLinkForm").removeClass("hidden");
    },

    /**
     * Hide add wikipedia link form
     */
    hideAddWikipediaLinkForm : function () {
    	'use strict';
        $("#addWikipediaLinkForm").addClass("hidden");
        $("#showWikipediaLinkForm").html(i18n("add.wikipedia.article"));
    	$('form#addWikipediaLinkForm').dirtyForms('setClean');
    },
    
    /**
     * The save button in the wikipedia form, opens the dialog
     */
    showWikipediaIngressSelectionDialog : function () {
    	'use strict';
        PlatsR_GUI.hideAddWikipediaLinkForm();
    	$('form#addWikipediaLinkForm').dirtyForms('setDirty');
        var placeid=$("form#addWikipediaLinkForm").find("[name='placeid']").val();
        var collectionid=$("form#addWikipediaLinkForm").find("[name='collectionid']").val();
        var url;
        $("#wikipediaDialog").dialog("open");
        $("#wikipediaDialog").append('<div id="wikipediaInfo"></div>');
        $("#wikipediaInfo").html(i18n("getting.data.from.wikipedia"));
        url = $("#url").val();
//        console.log(url);
        url = PlatsR_GUI.tidyInput(url);
        if (url.match("^http")){
        	url=escape(url);
        } else {
        	url=url;
        }
        $("#wikipediaInfo").load(routes.getWikipediaArticle({url: url, oldid: null, title: null, placeid: placeid, collectionid: collectionid}), function(response, status, xhr) {
        	if (status === "success" || status === "notmodified"){
        		if ($(".wikipediaArticleLink").length>1){
        			$(".wikipediaArticleLink").on("click", function(){
            			$(".wikipediaArticleLink").removeClass("wikipediaArticleLinkSelected");
            			$(this).addClass("wikipediaArticleLinkSelected");
            			$("#selectedIngress").val($(this).data("ingressid"));
            		});
            	} else if ($("#wikipediaIngressList").length===0 ){
            		$("#wikipediaDialog").dialog('close');
            		$("#wikipediaArticleLinks").replaceWith(response);
            	}
        	} else {
        		$("#wikipediaInfo").empty();
        		if (response.length > 0){
        			$("#wikipediaInfo").append(response);
        		} else {
        			$("#wikipediaInfo").append("<h4>Det blev visst fel...</h4>");
        			$("#wikipediaInfo").append("<p>Felaktiga parametrar, url: "+url+", placeid: "+placeid+", collectionid: "+collectionid+"</p>");
        		}
        		
        	}
        });
    }, 
    
    //Likes section starts here
    /**
     * This function add a like
     */
    addLike : function (placeId, collectionId) {
    	'use strict';
    	var posting = $.post(routes.setLike(), {placeid: placeId, collectionid: collectionId});
    	
        posting.done(function (data) {
            $("#numberOfLikes").html(data);
            $("#likeThisPlaceLink").hide();
        })
        .fail(function (xhr, textStatus, thrownError) {
            PlatsR_GUI.ajaxError(xhr, textStatus, thrownError);
        });
    },
    /**
     * This method stores a cookie
     * name - The name of the cookie
     * value - The value of the cookie
     * expires - When it should expires (number of days). If null then the cookie is a session cookie
     */
    setCookie : function (name, value, expires){
    	'use strict';
    	var expDate = new Date();
    	var cookieValue;
    	expDate.setDate(expDate.getDate() + expires);
    	cookieValue = escape(value) + ((expires===null) ? "" : "; expires=" + expDate.toUTCString());
    	document.cookie=name + "=" + cookieValue + "; path=/";
    },
    
    /**
     * This method returns the value of a cookie if it found otherwise null
     * name - the name of the cookie
     */
    getCookie : function (name){
    	'use strict';
    	var i, cookie, cookieName;
    	var documentCookies=document.cookie.split(";");
    	for(i=0;i<documentCookies.length;i++){
    		cookie=documentCookies[i].split("=");
    		cookieName=cookie[0].replace(/^\s+|\s+$/g,"");
    		if(cookieName===name){
    			return unescape(cookie[1]);
    		}
    	}
    	return null;
    },
    
    /**
     * This methods deletes a cookie. I.e it sets the cookies expires date to yesterday
     */
    deleteCookie : function (name){
    	'use strict';
    	PlatsR_GUI.setCookie(name,"",-1);
    },
    
    /**
     * This method restore the scroll position after a login reload, but only
     * if no # is in the href
     */
    restoreScrollPos : function (){
    	'use strict';
    	var scrollPos = PlatsR_GUI.getCookie("scrollPosition");
    	var xy;
    	if (scrollPos!=null){
    		xy=scrollPos.split("_");
    		if (location.href.indexOf("#")===-1){
    			window.scrollTo(parseInt(xy[0]),parseInt(xy[1]));
    		}
    		PlatsR_GUI.deleteCookie("scrollPosition");
    	}
    }, 
    
    /**
     * Scrolls back the given element to
     * page top, at a given speed (800ms).
     */
    scrollTo : function (scrollToElement) {
    	$('html, body').animate({
            scrollTop: $(scrollToElement).offset().top
        }, 800);
    },
    
    /**
     * Cleans out script tags from incoming
     * text.
     */
    tidyInput : function(input) {
    	var SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
    	input = input.replace(SCRIPT_REGEX, '');
    	
    	return input;
    },
    
    /**
     * This function clears the form, so that 
     * we do not commit multiple times due to
     * multiple clicks.
     */
    clearForm : function (formname) {
    	$(formname)[0].reset();	
    }
};//PlatsR_GUI namespace ends here


/**
 * TODO!! kan eventuellt anvÃ¤ndas fÃ¶r hantering av "border" mellan huvudinnehÃ¥ll och hÃ¶gerspalten, sÃ¥ att bordern fÃ¶ljer "lÃ¤ngsta" innehÃ¥llet 
 * vjustify - justify heights of elements in given JQuery selector
 * by: Michael Futreal, see: http://michael.futreal.com/jquery/vjustify
 */
jQuery.fn.vjustify = function() {
    PlatsR_GUI.log("VJustify invoked");
    var maxHeight=0;
    this.each(function(){
        if (this.offsetHeight>maxHeight) {maxHeight=this.offsetHeight;}
    });
    PlatsR_GUI.log("Max height found: " + maxHeight);
    this.each(function(){
        PlatsR_GUI.log("Setting max height for element");
        $(this).height(maxHeight + "px");
        if (this.offsetHeight>maxHeight) {
            $(this).height((maxHeight-(this.offsetHeight-maxHeight))+"px");
        }
    });
};


// Init GUI
$(document).ready(function() {
    PlatsR_GUI.init();
});



var Relations_GUI = {
		/*global $, jQuery, PlatsR_GUI, Modernizr, routes, document, window, setTimeout */
        /**
         * This function removes the facebookid,
		 * coupled with facebook-login
         */
        removeFacebookId: function () {
        	'use strict';
        	var posting = $.post(routes.removeFacebookId());
        	
            posting.done(function (data) {
                $("#facebookId").html(data);
            })
            .fail(function (xhr, textStatus, thrownError) {
                PlatsR_GUI.ajaxError(xhr, textStatus, thrownError);
            });
        },
        
        /**
         * This function calls the JQuery UI Dialog
         * used for creating a new place
         */
        addPlace : function (placeName, placeId) {
        	'use strict';
            Relations_GUI.newPlaceDialog(placeName, placeId);
        },
        
        /**
         * This function handles the dialog for adding the
         * first initial data, name and position, for a place
         */
        newPlaceDialog : function (placeName, placeId) {
        	'use strict';
            var url = routes.newPlaceMap(),
                newPlaceDialog = $('<div/>').addClass('newPlaceDialog');
            
            newPlaceDialog.dialog({
        		autoOpen:false,
        		title: i18n("title.create.new.place"),
        		draggable: false,
        		height: 'auto',
        		width: 800,
        		modal: true,
        		position: ['center', 'top'],
        		dialogClass: 'customDialog',
        		resizable: false,
        		closeOnEscape: false,
        		open: function (event, ui) {
        			//setConfirmUnload(true);
        			$('.ui-widget-content').css('overflow', 'hidden');
        			newPlaceDialog.load(url,function(response, status, xhr){
        				if (status==="success"){
        					PlatsR_map.mapInit('NEW_PAGE_MAP', 0, null, null, null);
        					if (typeof placeName !== 'undefined' && placeName !== '') {
        						$("#newPlaceName").removeAttr("disabled");
        					    $("#newPlaceName").attr("value", placeName);	
        					    $("#placeId").val(placeId);
        					} else {
        						$("#newPlaceName").removeAttr("disabled");	
        					}
        				} else {
        					PlatsR_GUI.ajaxError(xhr, status, null);
        				}

        			});

        		},          
        		close: function () {
        			$("body").empty();
        			window.history.back();
        			//delete place if the place has been created from an Archiveobject      			
        			if (typeof placeName !== 'undefined' && placeName !== '') {
        				window.location.href = routes.deletePlace() + '?id=' + placeId;
        			}
        		}
        	});
            var arr = [];
            
            PlatsR_GUI.assureLoggedOn(Relations_GUI.newPlaceDialog, newPlaceDialog, arr);
            
            $('.newPlaceDialog').on('click', '.cancel-link', function (e) {
                e.preventDefault();
                PlatsR_GUI.closeDialog($('.newPlaceDialog'));
            });
            
            $('.newPlaceDialog').on('submit', '#newPlaceForm', function (e) {
                e.preventDefault();
                var newPlaceData,
                	placeid,
                	newPlaceName,
                	centerX,
                	centerY,
                    posting;
                
                placeid = $('input[name="placeid"]').val();
                newPlaceName = $('input[name="newPlaceName"]').val();
                console.log(newPlaceName);
                newPlaceName = PlatsR_GUI.tidyInput(newPlaceName);
                centerX = $('input[name="centerX"]').val();
                centerY = $('input[name="centerY"]').val();
                newPlaceData = "placeid=" + placeid + "&newPlaceName=" + newPlaceName + "&centerX=" + centerX + "&centerY=" + centerY; 
                if (typeof placeId === 'undefined' || (placeId === 0 || placeId === -1 )) {
                	posting = $.post(routes.createNewPlace(), newPlaceData);
                } else {
                	posting = $.post(routes.updatePlace(), newPlaceData);
                }
                
                
                posting.done(function (data) {
                	if (typeof placeName !== 'undefined' && placeName !== '') {
                        window.location.href = routes.showPlace({id: placeId});
                	} else {
                		if (data.hasOwnProperty('id')) {
                            var id = parseFloat(data.id);
                            PlatsR_GUI.closeDialog($('.newPlaceDialog'));
                            window.location.href = routes.showPlace({id: id});
                        } else if (!data.hasOwnProperty('id') && !$.isEmptyObject(data)) {
                            $('#errorNewPlace').load(url + ' #errorNewPlace > *');
                        }
                	}
                })
                .fail(function (xhr, textStatus, thrownError) {
                	PlatsR_GUI.closeDialog($('.newPlaceDialog'));
                    PlatsR_GUI.ajaxError(xhr, textStatus, thrownError);
                });
            });
        },
        
//        
        
        /**
         * Gets the users bookmarked places
         * so that they can be displayed, and
         * possibly added to the collection
         */
        getUsersBookmarks : function (collectionid) {
        	'use strict';
        	var posting = $.post(routes.getUserBookmarks({collectionid: collectionid}));
            var offset;
        	posting.done(function (data) {
                $("#usersBookmarkedPlaces").html(data);
                offset=$("#usersBookmarkedPlaces").offset();
                window.scrollTo(offset.left, offset.top);
            })
            .fail(function (xhr, textStatus, thrownError) {
                PlatsR_GUI.ajaxError(xhr, textStatus, thrownError);
            });
        },
        
        /**
         * Adds a place to a collection
         */
        addPlaceToCollection : function (placeId, collectionId) {
        	'use strict';
        	var posting = $.post(routes.addPlaceToCollection({placeid: placeId, collectionid: collectionId}));
            
        	posting.done(function (data) {
                Relations_GUI.getUsersBookmarks(collectionId);
            })
            .fail(function (xhr, textStatus, thrownError) {
                PlatsR_GUI.ajaxError(xhr, textStatus, thrownError);
            });
        },
        
        /**
         * Changes the acl, in order to set whether,
         * only the creator or everybody,
         * can edit the place/collection
         */
        changeAcl : function (mode, placeId, collectionId) {
        	'use strict';
        	var posting = $.post(routes.changeAcl(), 
        			{mode: mode, placeid: placeId, collectionid: collectionId});
        	
            posting.done(function (data) {
                $(data).replaceAll("#aclType");
            })
            .fail(function (xhr, textStatus, thrownError) {
                PlatsR_GUI.ajaxError(xhr, textStatus, thrownError);
            });
        }
        
       

};
