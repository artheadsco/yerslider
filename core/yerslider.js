/*
 * yerSlider
 * A javascript object for slided content
 *
 * Copyright (c) 2013 Johann Heyne
 *
 * Version 1
 * Update 2013-28-00
 *
 * Minimum requirements: jQuery v1.6+
 *
 * Terms of use:
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 */
var yerslider = {};
    yerslider.youtubeready = false;
    yerslider.youtubeloaded = false;

function onYouTubeIframeAPIReady() {

	yerslider.youtubeready = true;
}

function YerSlider() {
    
    var t = this;
    
    t.param = {
        slidegap: 0,
        slidegroupresp: {},
        slidegroup: 1,
        sliderid: '.yerslider',
        sliderwrapclass: '.yerslider-wrap',
        sliderwrapclasshasbullets: '.yerslider-has-bullets',
        slidermaskclass: '.yerslider-mask',
        sliderclass: '.yerslider-slider',
        slideclass: '.yerslider-slide',
        bulletswrapclass: '.yerslider-bullets-wrap',
        bulletclass: '.yerslider-bullet',
        bulletcurrentclass: '.yerslider-bullet-current',
        bulletclickable: true,
        nextbtn: true,
        prevbtn: true,
        scrolltop: false,
        scrolltopval: 0,
        scrolltopspeed: 500,
        prevnextclass: '.yerslider-prevnext',
        nextclass: '.yerslider-next',
        prevclass: '.yerslider-prev',
        nextclassadd: '',
        prevclassadd: '',
        nextinactiveclass: '.yerslider-next-inactive',
        previnactiveclass: '.yerslider-prev-inactive',
        animationspeed: 1000,
        animationtype: 'ease', /* ease, ease-in-out, ease-in, ease-out, linear */
        bullets: false,
        loop: 'none', /* appending, rollback, from-first */
        loopswipe: 'none',
        autoplay: false, /* true */
        autoplayinterval: 3000, /* integer sec, 0 */
        autoplaystoponhover: true,
        showslidestype: 'fade',
        showslidestime: 500,
        swipe: false,
        swipeandprevnextbtn: false,
        swipeanimationspeed: 300,
        sublimevideo: false,
        autoloadyoutubeiframeapi: true,
        videoplayercloseafterend: true
    };

    t.stat = {
        slidegroupmax: 1,
        slidegroup: 1,
        currentslideindex: 0,
        currentslideposition: 0,
        slidecount: 0,
        slidermaskwidth: 0,
        slidewidth: 0,
        isanimating: false,
        isswiping: false,
        lasteventtype: false,
        nextbtnclickable: false,
        prevbtnclickable: false,
        bulletscount: 0,
        bulletscountcache: 0,
        bulletcurrent: 0,
        bulletschanged: false,
        slidingleft: false,
        slidingright: false,
        resizing: false,
        cssanimation: false,
        isevent: false,
        touch: false,
        clicktype: 'click',
        isios: false,
        isresizing: false,
        slidesinviewportindexbegin: false,
        slidesinviewportindexend: false,
        slidesinviewportindexes: false,
        autoplayinterval: false,
        autoplayison: false,
        videoidindex: 0,
        videoplayerindex: 0,
        lastplayedvideo: false,
        videoisplaying: false,
        loop: false
    };
    
    t.obj = {
        sliderid: undefined,
        sliderwrap: undefined,
        slider: undefined,
        slide: undefined,
        bulletswrap: undefined,
        bullets: undefined,
        prevbtn: undefined,
        nextbtn: undefined,
        videoplayers: {},
        slides_videoplayers: {}
    };
    
    // init {
    
    t.init = function ( p ) {

        t.init_getdefaultparam( p );
        
        if ( jQuery( t.param.sliderid ).length > 0 ) {
            
            t.init_loadyoutubeiframeapi();
            
            if ( t.param.sublimevideo ) {
                
                
            }
            
            t.init_animation();
        
            t.init_touch();
            
            t.init_param_changin();
            
            t.init_isios();
        
            t.init_ojects();
            
            t.obj.slider.hide();
            
            t.init_css();
        
            t.set_slidermaskwidth();
            t.set_slidecount();
            t.set_slidegroup();
            t.set_slidegroupmax();
            t.set_slidesinviewport();
            t.set_slidewidth();
            t.set_slideheight();
            t.clon_slides();
            t.set_prevnext();
            
            t.bullets();
        
            t.init_touchswipe();
        
            t.init_iosresizeclickbug();
            
            t.init_showslides();
            
            t.check_slider_current_index_at_start();
            
            t.autoplayinit();
            
            t.init_video();
            
            window.setTimeout(function(){

                t.slides_equal_height();

            }, 150);
            
            // slider opening delay plus effect {
            
                t.obj.sliderwrap.css('opacity','0');
            
                window.setTimeout(function(){
            
                    t.obj.sliderwrap.css('opacity','1').hide().fadeIn('fast');
                }, 250);
            
            // }
        }
    };
    
    t.init_loadyoutubeiframeapi = function () {

        if ( t.param.autoloadyoutubeiframeapi && !yerslider.youtubeloaded ) {

            jQuery.getScript("http://www.youtube.com/iframe_api", function( data, textStatus, jqxhr ) {

                yerslider.youtubeloaded = true;
            });
        }
    };
    
    t.init_getdefaultparam = function ( p ) {
        
        /* get default parameters */
        
        t.param = t.helper.setDefaultParam({
            p: p,
            d: t.param
        });
        
    };
    
    t.init_animation = function () {

        /* css animation */
        
        if ( jQuery('html').hasClass('csstransforms3d csstransitions') && t.param.slidegroup > 0 ) {
        
            t.stat.cssanimation = true;
        }
        
    };
    
    t.init_touch = function () {

        /* touch */
        
        if ( jQuery('html').hasClass('touch') ) {
        
            t.stat.touch = true;
            t.stat.clicktype = 'touchend';
        }
        
        if ( t.stat.touch && t.param.swipe && !t.param.swipeandprevnextbtn ) {

             t.param.nextbtn = false;
             t.param.prevbtn = false;
         }
    };
    
    t.init_param_changin = function () {
    
        // set t.stat.loop {
        
            t.stat.loop = t.param.loop;
        
            if ( t.stat.touch && t.param.swipe ) {
            
                t.stat.loop = t.param.loopswipe;
            }
        
        // }
    };
    
    t.init_isios = function () {
        
        /* is iOS */
        
        if ( navigator.userAgent.match(/(iPod|iPhone|iPad)/) ) {
            
            t.stat.isios = true;
        }
    };
    
    t.init_ojects = function () {
        
        /* define slider objects */
        
        t.obj.sliderid = jQuery( t.param.sliderid );
        t.obj.sliderwrap = jQuery( t.param.sliderid );
        t.obj.slidermask = jQuery( t.param.sliderid + ' ' + t.param.slidermaskclass );
        t.obj.slider = jQuery( t.param.sliderid + ' ' + t.param.sliderclass );
        t.obj.slide = jQuery( t.param.sliderid + ' ' + t.param.slideclass );
    };
    
    t.init_css = function () {
        
        /* layout slider */
        
        t.obj.sliderwrap.css({
            position: 'relative',
            width: '100%'
        });
        
        t.obj.slidermask.css({
            position: 'relative',
            width: '100%'
        });
        
        /* remember font-size and line-height for the slides because
        the font-size and line-height of the slider needs to be zero
        
        var obj_slide_css = [];
            
            obj_slide_css.fontsize = t.obj.slide.css('font-size');
            obj_slide_css.lineheight = t.obj.slide.css('line-height'); */
        
        t.obj.slider.css({
            'white-space': 'nowrap',
            position: 'relative',
            'list-style-type': 'none',
            padding: 0,
            margin: 0,
            'line-height': 0,
            'font-size': 0
        });
        
        t.obj.slide.css({
            display: 'inline-block',
            'white-space': 'normal'/*,
            'font-size': obj_slide_css.fontsize,
            'line-height': obj_slide_css.lineheight*/
        });
    };
    
    t.init_touchswipe = function () {
         
         /* touch swipe */

         if ( t.stat.touch && t.param.swipe ) {

             t.touchswipe();
         }
    };
    
    t.init_iosresizeclickbug = function () {
         
         /* Resize Click Bug iOS: http://boagworld.com/dev/ios-safari-resizing-issues/ */
         
         /*t.obj.sliderwrap.on( t.stat.clicktype, function () {

             t.stat.isevent  = true;

             window.setTimeout(function(){

                 t.stat.isevent= false;
             }, 200);
         });
         */
         jQuery(window).resize( function() {
            
            window.setTimeout(function(){

                if ( !t.stat.isresizing && !t.stat.isevent ) {

                    t.resize();
                }
             }, 100);
         }); 
    };
    
    t.init_video = function () {
        
        // hide play button text {
        
            jQuery('.yerslider-video-play').wrapInner('<div style="visibility: hidden;">');
        
        // }
        
        // set slide index {
        
        var slide,
            slideindex = 0;
        
        t.obj.slide.each( function () {
            
            slide = jQuery( this );
            slide.data('slideindex', ++slideindex );
        });
        
        // }
        
        // each video {
        
            t.obj.slider.find('.yerslider-video').each( function() {
            
                // default video data {
            
                    var obj = {
                            video: {},
                            play: {},
                            player: {},
                            preview: {}
                        },
                        data = {
                            videotype: false,
                            videoid: false,
                            previewimg: false,
                            autoplay: 1,
                            showinfo: 0,
                            rel: 1,
                            ratio: '16:9'
                        };
                
                // }
            
                // extend data from video element {
            
                    obj.video = jQuery( this );
                    jQuery.extend( data, obj.video.data() );
            
                // }
            
                // load auto preview image {
            
                if ( data.previewimg === 'auto' ) {
                
                    if ( data.videotype === 'youtube' ) {
                    
                        if ( data.ratio === '16:9' ) {
                        
                            obj.video.append('<img class="yerslider-video-preview" src="http://img.youtube.com/vi/' + data.videoid + '/mqdefault.jpg"/>');
                        }
                    
                        if ( data.ratio === '4:3' ) {
                        
                            obj.video.append('<img class="yerslider-video-preview" class="" src="http://img.youtube.com/vi/' + data.videoid + '/0.jpg"/>');
                        }
                    }
                
                    obj.preview = obj.video.find( '.yerslider-video-preview' );
                }
            
                // }
            
                // set play event {
            
                    if ( data.videotype === 'youtube' ) {
                
                
                        obj.play = obj.video.find( '.yerslider-video-play' );
                
                        obj.play.on('click', function( event ) {
                    
                            event.preventDefault();
                    
                            // hide preview {
                        
                            obj.preview.hide();
                            obj.play.hide();
                        
                            // }
                        
                            // ini player {
                            
                                // youtubeready {
                            
                                    var count = 0,
                                    timer = setInterval( function() {

                                        if ( yerslider.youtubeready ) {

                                            // body {
                                            
                                                // player html {
                                            
                                                    obj.video.append('<div id="' + data.videoid + '" class="yerslider-video-player">');
                                                    obj.player = obj.video.find('.yerslider-video-player');
                                                
                                                // }
                                            
                                                // player object {
                                                
                                                    t.obj.videoplayers[ data.videoid ] = {
                                                        'type': 'youtube',
                                                        'id': data.videoid,
                                                        'slide': obj.video.parents('.yerslider-slide').data('slideindex'),
                                                        'api': new YT.Player( data.videoid, {
                                                            videoId: data.videoid,
                                                            playerVars: {
                                                                rel: data.rel,
                                                                autoplay: data.autoplay,
                                                                showinfo: data.showinfo,
                                                                wmode: 'opaque',
                                                                events: {
                                                                    'onReady': t.player_fix_ratio( data.videoid )
                                                                }
                                                            }
                                                        }),
                                                        'status': false
                                                    };
                            
                                                    t.obj.videoplayers[ data.videoid ].status = 'started'; 
                                                    t.obj.videoplayers[ data.videoid ].api.addEventListener( 'onStateChange', t.player_youtube_statechange );
                                                // }
                                                
                                                // set stat video is playing if autoplay = 1 {
                                                    
                                                    if ( data.autoplay === 1 ) {
                                                    
                                                        t.stat.videoisplaying = true;
                                                        t.autoplayclear();
                                                    }
                                                
                                                // }
                                                
                                                t.stat.lastplayedvideo = data.videoid;
                                            
                                                // player is in slide {
                                            
                                                    if ( typeof t.obj.slides_videoplayers[ slide.data('slideindex') ] === 'undefined' ) {

                                                        t.obj.slides_videoplayers[ slide.data('slideindex') ] = {};
                                                    }

                                                    t.obj.slides_videoplayers[ slide.data('slideindex') ][ data.videoid ] = true;
                                            
                                                // }
                                            
                                            // }

                                            clearInterval( timer );
                                        }

                                        if ( ++count > 600 ) {

                                            clearInterval( timer );
                                        }
                                    }, 100 );
                            
                                // }
                            
                                t.stat.videoidindex++;
                        
                            // }
                        });
                    }
            
                    else if ( param.videotype === 'vimeo' ) {
            
                    }
            
                    else if ( param.videotype === 'sublimevideo' ) {
            
            
                    }
            
                // }
            });
        
        // }
        
        /* old stuff {
        
        // t.obj.videoplayers
        
      
                if ( param.videotype === 'youtube' ) {
                    
                    var count = 0,
                    timer = setInterval( function() {

                        if ( yerslider.youtubeready ) {
                            
                            // youtubeready body begin

                            var intervalvalue = 1,
                            playerid = 'playerid' + t.stat.videoidindex++;
                            
                            videoobj.attr('id', playerid );
                            
                            t.obj.videoplayers[ id ] = {
                                'type': 'youtube',
                                'id': playerid,
                                'slide': slide.data('slideindex'),
                                'api': new YT.Player( playerid, {
                                    videoId: param.youtubeid,
                                    playerVars: {
                                        height: '100%',
                                        width: '100%',
                                        rel: param.rel,
                                        autoplay: param.autoplay,
                                        showinfo: param.showinfo,
                                        wmode: 'opaque'
                                    }
                                }),
                                'status': false
                            };

                            // youtubeready body end

                            clearInterval( timer );
                        }

                        if ( ++count > 600 ) {

                            clearInterval( timer );
                        }
                    }, 100 );
                    
                    t.stat.videoidindex++;
                }
            
                else if ( param.videotype === 'vimeo' ) {
                
                }
            
                else if ( param.videotype === 'sublimevideo' ) {
                    
                    sublime.ready(function(){
                        
                        // t.obj.videoplayers
                        
                        t.obj.videoplayers[ id ] = {
                            'type': 'sublimevideo',
                            'id': id,
                            'slide': slide.data('slideindex'),
                            'api': sublime.player( id ),
                            'status': false
                        };
                        
                        t.obj.videoplayers[ id ].api.on({
                            start: function(player) {
                                t.obj.videoplayers[ id ].status = 'started'; 
                                t.stat.lastplayedvideo = id;
                            },
                            pause: function(player) {
                                t.obj.videoplayers[ id ].status = 'paused';
                                t.stat.lastplayedvideo = id;
                            },
                            end:   function(player) {
                                t.obj.videoplayers[ id ].status = 'ended';
                                t.stat.lastplayedvideo = id;
                            }
                        });
                        
                        t.stat.videoplayerindex++;
                        
                        // t.obj.slides_videoplayers
                        
                        if ( typeof t.obj.slides_videoplayers[ slide.data('slideindex') ] === 'undefined' ) {
                        
                            t.obj.slides_videoplayers[ slide.data('slideindex') ] = {};
                        }
                        
                        t.obj.slides_videoplayers[ slide.data('slideindex') ][ id ] = true; 
                    });
                }
            
        
        } */
    };
    
    t.init_showslides = function () {
        
        window.setTimeout(function(){

            t.obj.slider.show( );

        }, 200);
         
        
        /*
        t.stat.isanimating = true;
        
        window.setTimeout(function(){

            if ( t.stat.cssanimation ) {

                t.css_transitionduration( t.obj.slider, t.param.showslidestime );

                t.obj.slider.fadeIn( 1000 );

                t.css_transitionduration( t.obj.slider );
            }

            else {

                t.obj.slider.fadeIn(t.param.showslidestime);
            }

        }, 5000);

        window.setTimeout(function(){

            t.stat.isanimating = false;

        }, t.param.showslidestime + 100);
        */
    };
    
    // }
    
    // video players {
    
    t.player_youtube_play = function ( id ) {
        
        t.obj.videoplayers[ id ].api.playVideo();
        t.stat.videoisplaying = true;
    };
    
    t.player_youtube_pause = function ( id ) {
        
        t.obj.videoplayers[ id ].api.pauseVideo();
        t.stat.videoisplaying = false;
    };
    
    t.player_youtube_statechange = function ( event ) {
        
        if ( event.data === 0 ) {
        
            if ( t.param.videoplayercloseafterend ) {
            
                t.player_remove();

                if ( t.param.autoplay && t.stat.touch && t.param.swipe ) {

                    t.autoplayset();
                }
            }
        }
        
        if ( event.data === 1 && event.data === -1 ) {
        
            if ( t.param.autoplay ) {

                t.autoplayclear();
            }
        }
        
        if ( event.data === 2 ) {
            
            t.stat.videoisplaying = false;
            
            if ( t.stat.touch && t.param.autoplay ) {
            
                t.autoplayset();
            }
        }
    };
    
    t.player_fix_ratio = function ( id ) {
         
         if ( typeof id !== 'undefined' ) {
            
            var obj = jQuery( '#' + id );
            
            obj.height( obj.width() / 16 * 9 ); 
         }
         else {
         
             jQuery('.yerslider-video-player').each( function () {
                    
                    var obj = jQuery( this );
                    
                   jQuery( obj ).height( jQuery( obj ).width() / 16 * 9 ); 
             });
         }
    };
    
    t.player_remove = function ( id ) {
         
         t.stat.videoisplaying = false;
         
         if ( typeof id !== 'undefined' ) {
            
            jQuery( '#' + id ).parents('.yerslider-video').find('.yerslider-video-preview, .yerslider-video-play').show().find('#' + id).remove();
         }
         else {
         
             jQuery('.yerslider-video-player').remove();
             jQuery('.yerslider-video-preview, .yerslider-video-play').show();
         }
    };
    
    // }
    
    // set something {
    
    t.set_slidermaskwidth = function () {
        
        if ( t.param.insidetablecellfix ) {
            t.obj.slider.hide();
            t.obj.slidermask.css('width','100%');
        }
        
        t.stat.slidermaskwidth = t.obj.slidermask.innerWidth();
        
        if ( t.param.insidetablecellfix ) {
            t.obj.slidermask.css('width',t.obj.slidermask.width() + 'px');
            t.obj.slider.show();
        }
    };
    
    t.set_slidecount = function () {
        
        t.stat.slidecount = t.obj.slide.size();
    };
    
    t.set_slidegroup = function () {
        
        var slidermaskwidth = t.obj.slidermask.innerWidth();
        
        var temp = t.param.slidegroup;
        
        if ( t.helper.getLength( t.param.slidegroupresp ) > 0 ) {
            
            for ( var i in t.param.slidegroupresp ) {
        
                if ( i <= t.stat.slidermaskwidth ) {
            
                    temp = t.param.slidegroupresp[ i ];
                }
            }
        }
        
        if ( temp >= t.stat.slidecount ) {
        
            temp = t.stat.slidecount;
            t.stat.currentslideindex = 0;
            t.move_slider_to_current_index();
        }
        
        t.stat.slidegroup = temp;
    };
    
    t.set_slidegroupmax = function () {
        
        t.stat.slidegroupmax = t.stat.slidegroup;
        
        for ( var i in t.param.slidegroupresp ) {
            if ( t.stat.slidegroupmax < t.param.slidegroupresp[ i ] ) {
                t.stat.slidegroupmax = t.param.slidegroupresp[ i ];
            }
        }
    };
    
    t.set_slidewidth = function () {
        
        /** Not dodo. This commented code calculating the slidewidth including slide padding (border should added).
            But i think it is saver to left the styles of the slide element untouched because the calculation 
            is allways save and correct. Use a inner div and margin to simmulate slide-padding.
            
            var slidepadding = {};
            slidepadding.left = parseInt( t.obj.slide.css('padding-left'), 10 );
            slidepadding.right = parseInt( t.obj.slide.css('padding-right'), 10 );
            t.stat.slidewidth = Math.floor( ( t.stat.slidermaskwidth - ( ( t.param.slidegap * ( t.stat.slidegroup - 1 ) ) + ( ( slidepadding.left + slidepadding.left )  * t.stat.slidegroup ) ) ) / t.stat.slidegroup  );
        */

        if ( t.stat.slidegroup > 0 ) {
            
            t.stat.slidewidth = Math.floor( ( t.stat.slidermaskwidth - ( t.param.slidegap * ( t.stat.slidegroup - 1 ) ) ) / t.stat.slidegroup );
       
            var diff = t.stat.slidermaskwidth - ( ( t.stat.slidewidth * t.stat.slidegroup ) + ( t.param.slidegap * ( t.stat.slidegroup - 1 ) ) );
        
            t.obj.slide
                .width( t.stat.slidewidth )
                .css( 'margin-right', t.param.slidegap + 'px' );
                //.last().css( 'margin-right', '0' );
        
        
            /* streching the width of some slides by 1 pixel to fit the sliderwrapwidth */
        
            if ( diff > 0 ) {
            
                for ( var i = 0; i < diff; i++ ) {
                    jQuery( t.param.sliderid + ' ' + t.param.slideclass + ':nth-child(' + ( 1 + i )  + 'n-' + (t.stat.slidegroup - 1) + ')' ).css( 'margin-right', ( t.param.slidegap + 1 ) + 'px' );
                
                }
            }
        }
        
        if ( t.stat.slidegroup === 0 ) {

            t.obj.slide.css({
                'width': 'auto',
                'margin-right': t.param.slidegap + 'px'
            });
        }
    };
    
    t.set_slideheight = function () {
        
        /** Fix fitVids and slider height
            If the jQuery('.fitvids').fitVids(); is placed after the t.init than the 
            timeout is needet to result the fitted video height in the slider height. 
            The jQuery('.fitvids').fitVids(); has to be inside the jQuery(document).ready…
            
            window.setTimeout( function () {

                t.obj.slide.height('auto');

                var height = t.obj.slider.height();
                t.obj.slide.height( height );

            }, 0);
        */
    };
    
    t.set_slidesinviewport = function () {
         
        t.stat.slidesinviewportindexbegin = t.stat.currentslideindex;
        t.stat.slidesinviewportindexend = t.stat.currentslideindex + ( t.stat.slidegroup - 1 );
        
        t.stat.slidesinviewportindexes = [];
        
        for ( i = 0; i < t.stat.slidecount; i++ ) {

            if ( i >= t.stat.slidesinviewportindexbegin && i <= t.stat.slidesinviewportindexend ) {
                
                t.stat.slidesinviewportindexes.push(i + 1);
            }
        }
    };
    
    // }
    
    // prev next {
    
    t.set_prevnext = function () {
        
        /* init */
        if ( t.stat.slidecount > t.stat.slidegroup ) {
        
            var nextclassadd = '',
                prevclassadd = '';
            
            if ( typeof t.obj.nextbtn !== 'object' && t.param.nextbtn ) {
            
                if ( t.param.nextclassadd !== '' ) {
                
                    nextclassadd = ' ' + t.param.nextclassadd.replace( '.', '' );
                }
            
                t.obj.sliderwrap.append('<div class="js-yerslider-next ' + t.param.prevnextclass.replace( '.', '' ) + ' ' + t.param.nextclass.replace( '.', '' ) + nextclassadd + '">');
                t.obj.nextbtn = jQuery( t.param.sliderid + ' ' + t.param.nextclass );
            }
    
            if ( typeof t.obj.prevbtn !== 'object' && t.param.prevbtn ) {
            
                if ( t.param.prevclassadd !== '' ) {
                
                    prevclassadd = ' ' + t.param.prevclassadd.replace( '.', '' );
                }
            
                t.obj.sliderwrap.append('<div class="js-yerslider-prev ' + t.param.prevnextclass.replace( '.', '' ) + ' ' + t.param.prevclass.replace( '.', '' ) + prevclassadd + '">');
                t.obj.prevbtn = jQuery( t.param.sliderid + ' ' + t.param.prevclass );
            }
        
            t.refresh_prevnext();
        }
    
        /* remove */
        else {
    
            if ( typeof t.obj.nextbtn === 'object' ) {
                t.obj.nextbtn.remove();
                t.obj.nextbtn = undefined;
                t.stat.nextbtnclickable = false;
            }
            if ( typeof t.obj.prevbtn === 'object' ) {
                t.obj.prevbtn.remove();
                t.obj.prevbtn = undefined;
                t.stat.prevbtnclickable = false;
            }
        }
        
    };
    
    t.next_slide = function () {
        
        t.stat.currentslideindex = t.stat.currentslideindex + t.stat.slidegroup;
        
        
        /* check currentslideindex */
        
        t.check_slider_current_index();
        
        
        /* current class */
        
        t.set_slide_current_class();
        
        
        /* group indexes */
        
        t.set_slidesinviewport();
        
    };
    
    t.prev_slide = function () {
        
        t.stat.currentslideindex = t.stat.currentslideindex - t.stat.slidegroup;
        
        
        /* check currentslideindex */
        
        t.check_slider_current_index();
        
        
        /* current class */
        
        t.set_slide_current_class();
        
        
        /* group indexes */
        
        t.set_slidesinviewport();
    };
    
    t.next_job = function () {
        
        if ( !t.stat.isanimating ) {
            
            t.stat.isanimating = true;
            t.stat.slidingright = true;
            
            t.player_remove();
            
            // t.pausevideosofcurrentslide();
            
            t.next_slide();
            
            // t.playlastplayedvideoofcurrentslide();
            
            if ( t.param.scrolltop ) {
            
                jQuery('body').animate({
                
                    scrollTop: t.param.scrolltopval
                }, t.param.scrolltopspeed );
            }
            
            t.animate_slider_to_current_position( t.get_animationspeed() );
            
            t.refresh_prevnext();
    
            if ( t.param.bullets ) {

                t.set_bullet_current();
                t.set_bullet_current_class();
            }
        
            t.stat.slidingright = false;
        }
    };
    
    t.prev_job = function () {
        
        if ( !t.stat.isanimating ) {
            
            t.stat.isanimating = true;
            t.stat.slidingleft = true;
            
            t.player_remove();
            
            // t.pausevideosofcurrentslide();
            
            t.prev_slide();
            
            // t.playlastplayedvideoofcurrentslide();
            
            if ( t.param.scrolltop ) {
            
                jQuery('body').animate({
                
                    scrollTop: t.param.scrolltopval
                }, t.param.scrolltopspeed );
            }
            
            t.animate_slider_to_current_position( t.get_animationspeed() );
            
            t.refresh_prevnext();
    
            if ( t.param.bullets ) {

                t.set_bullet_current();
                t.set_bullet_current_class();
            }
        
            t.stat.slidingleft = false;
        }
    };
    
    t.nextbtn_click = function () {
        
        if ( t.obj.nextbtn && !t.stat.nextbtnclickable ) {
            
            t.obj.nextbtn.on( t.stat.clicktype, function () {
                
                t.stat.lasteventtype = 'click-next';
                t.next_job();
            });
        
            t.stat.nextbtnclickable = true;
        }
    };
    
    t.prevbtn_click = function () {
        
        if ( t.obj.prevbtn && !t.stat.prevbtnclickable ) {
        
            t.obj.prevbtn.on( t.stat.clicktype, function () {
                
                t.stat.lasteventtype = 'click-prev';
                t.prev_job();
            });
            
            t.stat.prevbtnclickable = true;
        }
        
    };
    
    t.nextbtn_click_unbind = function () {
                
        t.obj.nextbtn.unbind( 'click' )
            .addClass( t.param.nextinactiveclass.replace( '.', '' ) );
        
        t.stat.nextbtnclickable = false;
    };
    
    t.prevbtn_click_unbind = function () {

        t.obj.prevbtn.unbind( 'click' )
            .addClass( t.param.previnactiveclass.replace( '.', '' ) );
        
        t.stat.prevbtnclickable = false;
    };
    
    t.refresh_prevnext = function () {
        
        /* bind click events if unbinded in general */
        
        if ( !t.stat.nextbtnclickable ) {
            
            t.nextbtn_click();
        }
        
        if ( !t.stat.prevbtnclickable ) {
            
            t.prevbtn_click();
        }
        
        
        /* remove inactive classes in general */
        
        if ( t.obj.nextbtn ) {
        
            t.obj.nextbtn.removeClass( t.param.nextinactiveclass.replace( '.', '' ) );
        }
        
        if ( t.obj.prevbtn ) {
        
            t.obj.prevbtn.removeClass( t.param.previnactiveclass.replace( '.', '' ) );
        }
        
        
        /* then unbind in some kind of slider situation */
        
        if ( t.stat.loop === 'none' ) {

            if ( t.obj.nextbtn && t.stat.currentslideindex >= ( t.stat.slidecount - t.stat.slidegroup ) ) {
                
                t.nextbtn_click_unbind();
            }
        
            if ( t.obj.prevbtn && t.stat.currentslideindex <= 0 ) {

                t.prevbtn_click_unbind();
            }
        }
    };
    
    t.set_slide_current_class = function () {
    
        t.obj.slide.removeClass('current');
        jQuery( t.obj.slide[ t.stat.currentslideindex ] ).addClass('current');
    
    };
    
    /*
    t.pausevideosofcurrentslide = function () {
        
        for ( var i in t.obj.videoplayers ) {
            
            if ( jQuery.inArray( t.obj.videoplayers[ i ].slide, t.stat.slidesinviewportindexes ) !== -1 ) {
                
                if ( t.obj.videoplayers[ i ].type === 'youtube' ) {
                    
                    t.player_youtube_pause( i );
                }
                
                if ( t.obj.videoplayers[ i ].type === 'sublimevideo' ) {
                    
                    t.obj.videoplayers[ i ].api.pause();
                }
            }
        }
    };
    
    t.playlastplayedvideoofcurrentslide = function () {
        
        for ( var i in t.obj.videoplayers ) {
            
            //console.log( t.stat.slidesinviewportindexes, t.obj.videoplayers[ i ].slide, t.stat.lastplayedvideo );
            
            if ( jQuery.inArray( t.obj.videoplayers[ i ].slide, t.stat.slidesinviewportindexes ) !== -1 && i === t.stat.lastplayedvideo ) {
                
                
                if ( t.obj.videoplayers[ i ].type === 'youtube' ) {
                    
                    t.player_youtube_play( i );
                }
                
                if ( t.obj.videoplayers[ i ].type === 'sublimevideo' ) {
                
                    t.obj.videoplayers[ i ].api.play();
                }
            }
        }
        
        t.stat.lastplayedvideo = false;
    };
    */

    // }
    
    // autoplay {
    
    t.autoplayinit = function () {

        if ( t.param.autoplay ) {
            
            t.autoplayset();
            
            if ( t.param.autoplaystoponhover ) {

                t.autoplayhover();
            }
        }

    };
    
    t.autoplayset = function () {
        
        if ( t.stat.autoplayison === false ) {
        
            t.stat.autoplayison = true;
        
            t.stat.autoplayinterval = window.setInterval( function () {

                if ( !t.stat.isanimating ) {

                    t.stat.isanimating = true;
                    t.stat.slidingright = true;
                    t.stat.lasteventtype = 'autoplay';
                
                    t.player_remove();
                
                    t.next_slide();
                
                    t.animate_slider_to_current_position( t.get_animationspeed() );

                    t.refresh_prevnext();

                    if ( t.param.bullets ) {

                        t.set_bullet_current();
                        t.set_bullet_current_class();
                    }

                    t.stat.slidingright = false;
                
                }  
            }, t.param.autoplayinterval );
        }
    };
    
    t.autoplayclear = function () {
        
        t.stat.autoplayison = false;
        
        t.stat.autoplayinterval = clearInterval( t.stat.autoplayinterval );
    };
    
    t.autoplayhover = function () {
        
        // slidermask
        
        jQuery( t.obj.slidermask ).mouseenter(function() {
            
            if ( !t.stat.videoisplaying ) {
                
                t.autoplayclear();
            }
            
        }).mouseleave(function() {

            if ( !t.stat.videoisplaying ) {

                t.autoplayset();
            }
        });
        
        // prevnextclass
        
        jQuery( t.obj.sliderwrap.find( t.param.prevnextclass ) ).mouseenter(function() {
            
            if ( !t.stat.videoisplaying ) {
                
                t.autoplayclear();
            }
            
        }).mouseleave(function() {

            if ( !t.stat.videoisplaying ) {

                t.autoplayset();
            }
        });
        
        // bulletclass
        
        jQuery( t.obj.sliderwrap.find( t.param.bulletclass ) ).mouseenter(function() {
            
            if ( !t.stat.videoisplaying ) {
                
                t.autoplayclear();
            }
            
        }).mouseleave(function() {

            if ( !t.stat.videoisplaying ) {

                t.autoplayset();
            }
        });
       
    };
    
    // }
    
    // bullets {
    
    t.bullets = function () {
        
        if ( t.param.bullets ) {
            
            //window.setTimeout(function(){
                
                /* add bullet class to wrap */
            
                t.obj.sliderwrap.addClass( t.param.sliderwrapclasshasbullets.replace( '.', '' ) );
            
            
                /* do bullets-wrap html and object */
        
                if ( typeof t.obj.bulletswrap !== 'object' ) {
        
                    t.obj.sliderwrap.append('<div class="' + t.param.bulletswrapclass.replace( '.', '' ) + '"></div>');
                    t.obj.bulletswrap = t.obj.sliderwrap.find( t.param.bulletswrapclass );
                }
        
        
                /* get amount of bullets */
        
                t.stat.bulletscount = Math.ceil( t.stat.slidecount / t.stat.slidegroup );
            
            
                /* current bullet index */
            
                t.set_bullet_current();
            
            
                /* bullet items */
            
                t.bullet_items();
            
            
                /* bullet current class */
            
                t.set_bullet_current_class();
            
            
                /* bullets click */
            
                t.bullet_click();
            
            //}, 200);
            
        }
    };
    
    t.bullet_items = function () {
          
        /* do bullets html and object */

        if ( t.stat.bulletscountcache !== t.stat.bulletscount ) {
            
            var bullets = '';
        
            for ( var i = 1; i <= t.stat.bulletscount; i++ ) {
            
                bullets += '<div class="' + t.param.bulletclass.replace( '.', '' ) + '" data-index="' + i + '"></div>';
            }
        
            t.obj.bulletswrap.empty();
        
            if ( t.stat.bulletscount > 1 ) {
            
                t.obj.bulletswrap.append( bullets );
            }
        
            t.stat.bulletscountcache = t.stat.bulletscount;
        }
        
        t.obj.bullets = t.obj.bulletswrap.find( t.param.bulletclass );
        
        t.set_bullet_current_class();
    };
    
    t.set_bullet_current = function () {
        
        var currentslideindex = t.stat.currentslideindex;

        /* translate clone current slide index into original index */

        if ( currentslideindex + 1 > t.stat.slidecount ) {

            currentslideindex = currentslideindex - t.stat.slidecount;
        }


        /* current bullet index */

        if ( t.stat.loop === 'none' ) {
            
            t.stat.bulletcurrent = Math.ceil( currentslideindex / t.stat.slidegroup ) + 1;
        }
        else {
            
            t.stat.bulletcurrent = Math.round( currentslideindex / t.stat.slidegroup ) + 1;
            
            if ( t.stat.bulletcurrent > t.stat.bulletscount ) {
                
                t.stat.bulletcurrent = t.stat.bulletscount;
            }
        }
    };
    
    t.set_bullet_current_class = function () {
        
        /* current bullet class */
        
        t.obj.bullets.removeClass( t.param.bulletcurrentclass.replace( '.', '' ) );
        
        t.obj.bulletswrap.find('[data-index="' + t.stat.bulletcurrent + '"]').addClass( t.param.bulletcurrentclass.replace( '.', '' ) );
    };
    
    t.bullet_click = function () {
    
        t.obj.bullets.on( 'click', function () {
            
            if ( !t.stat.isanimating ) {
                
                t.stat.isanimating = true;
                t.stat.slidingright = true;
                
                var currentbullet = jQuery(this).data('index');
                
                t.player_remove();
                
                // t.pausevideosofcurrentslide();
                
                t.stat.currentslideindex = ( currentbullet - 1 ) * t.stat.slidegroup;
                
                
                /* check currentslideindex */

                t.check_slider_current_index();
                
                t.set_slidesinviewport();
                
                // t.playlastplayedvideoofcurrentslide();
                
                //t.proof_slider_current_index();
                
                t.animate_slider_to_current_position( t.get_animationspeed() );
                
                if ( !t.stat.prevbtnclickable ) {
                    
                    t.prevbtn_click();
                }
                
                t.stat.slidingright = false;
            }
            
            
            /* bullets */
            
            if ( t.param.bullets ) {
            
                t.set_bullet_current();
                t.set_bullet_current_class();
            }
            
            
            /* prev next buttons */
            
            t.refresh_prevnext();
        });
    };
    
    // }
    
    // animation {
    
    t.move_slider_to_current_index = function () {
        
        t.css_transitionduration( t.obj.slider, 0 );
        t.css_transform( t.obj.slider, t.get_sliderposition() * -1 );
        
        //t.obj.slider.css({
        //    'margin-left': '-' + t.get_sliderposition() + 'px'
        //});
    };
    
    t.animate_slider_to_current_position = function ( duration) {
        
        if ( t.stat.cssanimation ) {
        
            t.animate_slider_to_current_position_css( duration );
        }
        else {
        
            t.animate_slider_to_current_position_js( duration );
        }
    };
    
    t.animate_slider_to_current_position_js = function ( duration ) {
    
        t.obj.slider.animate({
            'margin-left': '-' + t.get_sliderposition() + 'px'
        }, duration, t.translate_easing( t.param.animationtype, 'jquery'), function () {
           t.get_sliderposition();
           t.stat.isanimating = false;
        });
        
    };
    
    t.animate_slider_to_current_position_css = function( duration ) {
        
        var sliderposition = t.get_sliderposition() * -1;
            
        t.css_transitionduration( t.obj.slider, duration );
        t.css_transform( t.obj.slider, sliderposition );
        t.css_transitiontiming( t.obj.slider, t.param.animationtype );
        //t.css_marginleft( t.obj.slider );
        
        window.setTimeout( function () {
            
            t.get_sliderposition();
            t.stat.isanimating = false;
            t.animation_finshed();
            
            if ( t.stat.isios === false ) {
                
                //t.css_transitionduration( t.obj.slider );
                //t.css_transform( t.obj.slider );
                //t.css_transitiontiming( t.obj.slider );
                //t.css_marginleft( t.obj.slider, '-' + t.stat.currentslideposition + 'px' );
            }
            
        }, duration );
    };
    
    t.animation_finshed = function () {
        
        
    };
    
    t.video_load = function () {
          
    };
    
    t.scroll_slider = function ( distance, direction ) {
        
        var sliderposition = t.stat.currentslideposition * -1,
            gotopos = sliderposition;
        
        if ( direction === 'left' ) {
            
            gotopos = ( sliderposition - Math.abs(distance) );
        }
        
        if ( direction === 'right' ) {
            
            gotopos = ( sliderposition + Math.abs(distance) );
        }
        
        t.css_transitionduration( t.obj.slider );
        
        t.css_transform( t.obj.slider, gotopos );
        
        t.css_transitiontiming( t.obj.slider, t.param.animationtype );
        
    };
    
    // }
    
    // misc {
    
    t.clon_slides = function () {
        
        if ( !t.stat.touch || ( t.stat.touch && t.stat.loop !== 'none' ) ) {
            
            var index = 0,
                i = 0;
            
            if ( t.stat.slidegroup > 0 && t.stat.loop !== 'none' ) {
        
                for ( i = 0; i < t.stat.slidegroupmax * 2; i++ ) {
            
                    if ( index > t.stat.slidecount ) {
                        index = 0;
                    }
            
                    t.obj.slider.append( jQuery( t.obj.slide[ index ] ).clone() );
            
                    index++;
                }
            
                t.obj.slide = jQuery( t.param.sliderid + ' ' + t.param.slideclass );
            }
        
            if ( t.stat.slidegroup === 0 ) {
            
                for ( i = 0; i < t.stat.slidecount; i++ ) {
            
                    if ( index > t.stat.slidecount ) {
                        index = 0;
                    }
            
                    t.obj.slider.append( jQuery( t.obj.slide[ index ] ).clone() );
            
                    index++;
                }
        
                t.obj.slide = jQuery( t.param.sliderid + ' ' + t.param.slideclass );
            }
        }
    };
    
    t.get_sliderposition = function () {

        //var pos = ( parseInt( t.stat.currentslideindex * t.stat.slidewidth, 10 ) + parseInt( t.param.slidegap * t.stat.currentslideindex, 10 ) );
        var pos = jQuery( t.obj.slide[ t.stat.currentslideindex ] ).position().left;
        
        t.stat.currentslideposition = pos;
        
        return pos;
    };
    
    t.get_animationspeed = function () {
        
        var speed = t.param.animationspeed;
        
        if ( t.stat.isswiping ) {
            
            speed = t.param.swipeanimationspeed;
        }
        
        return speed;
    };
    
    t.proof_slider_current_index = function () {
        
        if ( t.stat.slidecount - t.stat.slidegroup > 0 && t.stat.currentslideindex >= t.stat.slidecount - t.stat.slidegroup ) {
           
            t.stat.currentslideindex = t.stat.slidecount - t.stat.slidegroup;
            
            if ( t.param.nextbtnclickable ) {
                
                t.nextbtn_click_unbind();
            }
        }
    };
    
    t.check_slider_current_index_at_start = function () {
        
        if ( t.stat.loop === 'appending' ) {

            if ( t.stat.currentslideindex === 0 ) {

                t.stat.currentslideindex = t.stat.slidecount;

                t.move_slider_to_current_index();
            }
        }
    };
    
    t.check_slider_current_index = function () {
        
        var temp = false;
        
        // next {
        
            if ( t.stat.slidegroup === 0 ) {
            
                t.stat.currentslideindex = t.stat.currentslideindex + 1;
            }
        
            /* loop-none */
            
            if ( !t.param.autoplay ) {
                
                if ( t.stat.loop === 'none' && t.stat.currentslideindex >= t.stat.slidecount - t.stat.slidegroup ) {
           
                    t.stat.currentslideindex = t.stat.slidecount - t.stat.slidegroup;
                }
            }

            if ( t.param.autoplay && t.stat.lasteventtype === 'autoplay' ) {
                
                if ( t.stat.loop === 'none' && t.stat.currentslideindex > t.stat.slidecount - t.stat.slidegroup ) {
           
                    t.stat.currentslideindex = 0;
                }
            }
            
            if ( t.param.autoplay && t.stat.lasteventtype === 'swipe-left' ) {
                
                if ( t.stat.loop === 'none' && t.stat.currentslideindex > t.stat.slidecount - t.stat.slidegroup ) {
           
                    t.stat.currentslideindex =  t.stat.currentslideindex - t.stat.slidegroup;
                }
            }
            
            /* appending */
            
            if ( t.stat.loop === 'appending' && t.stat.currentslideindex > t.stat.slidecount - 1 + t.stat.slidegroup ) {
           
               temp = t.stat.currentslideindex - t.stat.slidecount;
            
                t.stat.currentslideindex = t.stat.currentslideindex - t.stat.slidecount - t.stat.slidegroup;
                
                //t.animate_slider_to_current_position( 0 );
                t.move_slider_to_current_index();
                
                t.stat.currentslideindex = temp;
            }
        
            /* loop-rollback */
        
        
        
            /* loop-from-first */
        
        
        
        // }
        
        
        // prev {
        
            /* loop-none */

            if ( t.stat.loop === 'none' && t.stat.currentslideindex <= 0 ) {

                t.stat.currentslideindex = 0;
            }


            /* loop-appending */

            if ( t.stat.loop === 'appending' && t.stat.currentslideindex < 0 ) {

                temp = t.stat.slidecount + t.stat.currentslideindex;

                t.stat.currentslideindex = t.stat.currentslideindex + t.stat.slidecount + t.stat.slidegroup;

                //t.animate_slider_to_current_position( 0 );
                t.move_slider_to_current_index();

                t.stat.currentslideindex = temp;
            }


            /* loop-rollback */



            /* loop-from-first */


            
        // }
        
    };
    
    t.resize = function () {
              
        t.stat.resizing = true;
            
            if ( t.stat.isios ) {
         
                t.stat.isresizing = true;
                //t.obj.slider.fadeOut();
            }
        
            t.set_slidermaskwidth();
            t.set_slidegroup();
            t.set_slidesinviewport();
            t.set_slidewidth();
            t.set_slideheight();
            t.proof_slider_current_index();
            t.animate_slider_to_current_position( 0 );
        
            t.set_prevnext();
    
            if ( t.param.bullets ) {
    
                t.bullets();
            }
        
            t.player_fix_ratio();
            
            t.slides_equal_height();
			
        t.stat.resizing = false;
        
        if ( t.stat.isios ) {
        
            /*t.obj.slider.fadeIn( 'fast', function () {
             
            });*/
            t.stat.isresizing = false;
        }
    };
    
    t.touchswipe = function () {
        
        
        var slide_with_default = ( t.stat.slidewidth + t.param.slidegap ) * t.stat.slidegroup,
            slide_with = slide_with_default,
            current_slide = 0,
            max_slides = Math.ceil( t.stat.slidecount / t.stat.slidegroup ),
            speed = t.param.swipeanimationspeed,
            slides = t.obj.slide;
        
        
        /**
		* Catch each phase of the swipe.
		* move : we drag the div.
		* cancel : we animate back to where we were
		* end : we animate to the next image
		*/
		function swipeStatus(event, phase, direction, distance, fingers) {
            
            t.stat.isswiping = true;
            
			//If we are moving before swipe, and we are going L or R, then manually drag the images
			
			if ( phase === 'move' && ( direction === 'left' || direction === 'right' ) ) {
				
				var duration =  0;

				if ( direction === 'left' ) {
                    
                    t.scroll_slider( distance, direction );
                }
				else if ( direction === 'right' ) {
				
                    t.scroll_slider( distance, direction );
				}

                if ( t.param.autoplay && t.stat.autoplayison ) {

                    t.autoplayclear();
                }
			}


			//Else, cancel means snap back to the begining
			
			else if ( phase === 'cancel' ) {
			
				t.animate_slider_to_current_position( t.get_animationspeed() );
				
                if ( t.param.autoplay && !t.stat.autoplayison ) {

                    t.autoplayset();
                }
			}


			//Else end means the swipe was completed, so move to the next image
			
			else if ( phase === 'end' ) {
			
				if ( direction === 'right' ) {
                    
                    t.stat.lasteventtype = 'swipe-right';
                    t.prev_job();
				}
				else if ( direction === 'left' ) {
                    
                    t.stat.lasteventtype = 'swipe-left';
                    t.next_job();
                }
				
                if ( t.param.autoplay && !t.stat.autoplayison ) {

                    t.autoplayset();
                }
			}
			
			t.stat.isswiping = false;
		}


		// init touch swipe
		t.obj.slide.swipe( {
			triggerOnTouchEnd: true,
			swipeStatus: swipeStatus,
			allowPageScroll: 'vertical'
		});

	};
    
    t.slides_equal_height = function () {
        
        t.obj.slide.css( 'height', 'auto' );
        t.obj.slide.height( t.obj.slider.height() );
    };
    
    // }
    
    // css {
    
    // disable CSS3 styles: https://github.com/chriscoyier/CSS3-StripTease/blob/master/striptease.js
    
    t.css_transform = function ( obj, value ) {
        
        var transform = 'none';
        
        if ( typeof(value) !== 'undefined' ) {
            
            transform = 'translate3d(' + value.toString() + 'px,0px,0px)';
        }
        
        obj.css({
            '-webkit-transform': transform,
            '-ms-transform': transform,
            '-o-transform': transform,
            '-moz-transform': transform,
            'transform': transform
        });
    };
    
    t.css_transitiontiming = function ( obj, value ) {
        
        if ( typeof(value) === 'undefined' ) {
            
            value = 'none';
        }
        
        obj.css({
            '-webkit-transition-timing-function': value,
            '-ms-transition-timing-function': value,
            '-o-transition-timing-function': value,
            '-moz-transition-timing-function': value,
            'transition-timing-function': value
        });
    };
    
    t.css_transitionduration = function ( obj, value ) {
        
        if ( typeof(value) === 'undefined' ) {
            
            value = 0;
        }
        
        var duration = ( ( value / 1000 ).toFixed(1) + 's' );
        
        obj.css({
            '-webkit-transition-duration': duration,
            '-ms-transition-duration': duration,
            '-o-transition-duration': duration,
            '-moz-transition-duration': duration,
            'transition-duration': duration
        });
    };
    
    t.css_marginleft = function ( obj, value ) {
        
        if ( typeof(value) === 'undefined' ) {
            
            value = 0;
        }
        
        obj.css({
            'margin-left': value
        });
    };
    
    // }
    
    // helper {
    
    t.translate_easing = function ( name, type ) {
        
        var ret = 'linear';
        
        if ( type === 'jquery' ) {
        
            if ( name === 'linear' ) { ret = 'linear'; }
            if ( name === 'ease' ) { ret = 'swing'; }
        }
        
        if ( type === 'css' ) {
        
            ret = name;
        }
        
        return ret;
    };
    
    t.helper = {
        
        getLength: function( o ) {

            var len = o.length ? --o.length : -1;

            for (var k in o) {
                len++;
            }

            return len;
        },
        
        setDefaultParam: function ( p ) {

            if ( typeof p === 'undefined' ) {
                p = {};
            }
            
            if ( typeof p.p === 'undefined' ) {
                p.p = {};
            }
            
            if ( typeof p.d === 'undefined' ) {
                p.d = {};
            }

            var r = p.p;

            for( var i in p.d ) {

                if ( typeof p.d[ i ] !== 'undefined' && typeof r[ i ] !== typeof p.d[ i ] ) {
                    r[ i ] = p.d[ i ];
                }
                else {
                
                    if ( typeof p.d[ i ] !== 'undefined' && t.helper.getLength( r[ i ] ) !== t.helper.getLength( p.d[ i ] ) ) {
                        r[ i ] = t.helper.setDefaultParam({ p: r[ i ], d: p.d[ i ] });
                    }
                }
            }

            return r;
        }
    };

    // }
}
