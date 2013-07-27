/*
 * yerSlider
 * A javascript object for slided content
 *
 * Copyright (c) 2013 Johann Heyne
 *
 * Version 1
 * Update 2013-07-26
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

function yerSlider() {
    
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
        autoplay: false, /* true */
        autoplayinterval: 3000, /* integer sec, 0 */
        autoplaystoponhover: true,
        showslidestype: 'fade',
        showslidestime: 500,
        swipe: false,
        swipeanimationspeed: 300,
        sublimevideo: false,
        autoloadyoutubeiframeapi: true
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
        videoidindex: 0,
        videoplayerindex: 0,
        lastplayedvideo: false
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
    
    t.init = function ( p ) {

        t.init_getdefaultparam( p );
        
        if ( jQuery( t.param.sliderid ).length > 0 ) {
            
            t.init_loadyoutubeiframeapi();
            
            if ( t.param.sublimevideo ) {
                
                
            }
            
            t.init_animation();
        
            t.init_touch();
        
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
        
        if ( t.stat.touch && t.param.swipe ) {

             t.param.nextbtn = false;
             t.param.prevbtn = false;
         }
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
            width: '100%',
            overflow: 'hidden'
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
        
        /* t.obj.videoplayers */
        
        var slideindex = 0;
        
        t.obj.slide.each( function () {
            
            slideindex++;
            
            var slide = jQuery( this );
            
            slide.data('slideindex', slideindex );
            
            slide.find('[data-videotype]').each( function () {
                
                var videoobj = jQuery( this ),
                    param = videoobj.data(),
                    id = videoobj.attr('id');
                
                
                if ( param.videotype === 'youtube' ) {
                    
                    var count = 0,
                    timer = setInterval( function() {

                        if ( yerslider.youtubeready ) {
                            
                            /* youtubeready body begin */

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

                            /* youtubeready body end */

                            clearInterval( timer );
                        }

                        if ( ++count > 600 ) {

                            clearInterval( timer );
                        }
                    }, 100 );
                    
                    t.stat.videoidindex++;
                }
            
                else if ( param.videotype === 'vimeo' ) {
                
                    //console.log( 'vimeo' );
                }
            
                else if ( param.videotype === 'sublimevideo' ) {
                    
                    sublime.ready(function(){
                        
                        /* t.obj.videoplayers */
                        
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
                        
                        /* t.obj.slides_videoplayers */
                        
                        if ( typeof t.obj.slides_videoplayers[ slide.data('slideindex') ] === 'undefined' ) {
                        
                            t.obj.slides_videoplayers[ slide.data('slideindex') ] = {};
                        }
                        
                        t.obj.slides_videoplayers[ slide.data('slideindex') ][ id ] = true; 
                    });
                }
            });
            
        });
    };
    
    t.init_showslides = function () {
        
        t.obj.slider.show( );
        
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
    
    
    
    /* setup */
    
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
                .css( 'margin-right', t.param.slidegap + 'px' )
                .last().css( 'margin-right', '0' );
        
        
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
    
    
    
    /* prev next */
    
    t.set_prevnext = function () {
        
        
        /* init */
        if ( t.stat.slidecount > t.stat.slidegroup ) {
            
            var nextclassadd = '',
                prevclassadd = '';
                
            if ( typeof t.obj.nextbtn !== 'object' && t.param.nextbtn ) {
                
                if ( t.param.nextclassadd !== '' ) {
                    
                    nextclassadd = ' ' + t.param.nextclassadd.replace( '.', '' );
                }
                
                t.obj.sliderwrap.append('<div class="js-yerslider-next yerslider-prevnext ' + t.param.nextclass.replace( '.', '' ) + nextclassadd + '">');
                t.obj.nextbtn = jQuery( t.param.sliderid + ' ' + t.param.nextclass );
            }
        
            if ( typeof t.obj.prevbtn !== 'object' && t.param.prevbtn ) {
                
                if ( t.param.prevclassadd !== '' ) {
                    
                    prevclassadd = ' ' + t.param.prevclassadd.replace( '.', '' );
                }
                
                t.obj.sliderwrap.append('<div class="js-yerslider-prev yerslider-prevnext ' + t.param.prevclass.replace( '.', '' ) + prevclassadd + '">');
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
            
            t.pausevideosofcurrentslide();
            
            t.next_slide();
            
            t.playlastplayedvideoofcurrentslide();
            
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
            
            t.pausevideosofcurrentslide();
            
            t.prev_slide();
            
            t.playlastplayedvideoofcurrentslide();
            
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
                
                t.next_job();
            });
        
            t.stat.nextbtnclickable = true;
        }
    };
    
    t.prevbtn_click = function () {
        
        if ( t.obj.prevbtn && !t.stat.prevbtnclickable ) {
        
            t.obj.prevbtn.on( t.stat.clicktype, function () {
                
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
        
        if ( t.param.loop === 'none' ) {

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
    
    t.pausevideosofcurrentslide = function () {
    
        for ( var i in t.obj.videoplayers ) {

            if ( jQuery.inArray( t.obj.videoplayers[ i ].slide, t.stat.slidesinviewportindexes ) !== -1 ) {

                //if (  t.obj.videoplayers[ i ].status === 'started' ) {
                    
                    if ( t.obj.videoplayers[ i ].type === 'sublimevideo' ) {
                        
                        t.obj.videoplayers[ i ].api.pause();
                    }
                //}
            }
        }
    };
    
    t.playlastplayedvideoofcurrentslide = function () {
    
        for ( var i in t.obj.videoplayers ) {
            
            if ( jQuery.inArray( t.obj.videoplayers[ i ].slide, t.stat.slidesinviewportindexes ) !== -1 && i === t.stat.lastplayedvideo ) {
                
                if ( t.obj.videoplayers[ i ].type === 'sublimevideo' ) {
                
                    t.obj.videoplayers[ i ].api.play();
                }
            }
        }
        
        t.stat.lastplayedvideo = false;
    };
    
    
    /* autoplay */
    
    t.autoplayinit = function () {

        if ( t.param.autoplay ) {
            
            t.autoplayset();

            if ( t.param.autoplaystoponhover ) {

                t.autoplayhover();
            }
        }

    };
    
    t.autoplayset = function () {
       
        t.stat.autoplayinterval = window.setInterval( function () {

            if ( !t.stat.isanimating ) {

                t.stat.isanimating = true;
                t.stat.slidingright = true;

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
       
    };
    
    t.autoplayclear = function () {
       
        t.stat.autoplayinterval = clearInterval( t.stat.autoplayinterval );
       
    };
    
    t.autoplayhover = function () {
       
        jQuery( t.param.slidermaskclass + ',' + t.param.nextclass + ',' + t.param.prevclass + ',' + t.param.bulletclass ).mouseenter(function() {
            t.autoplayclear();
        });
       
       jQuery( t.param.slidermaskclass + ',' + t.param.nextclass + ',' + t.param.prevclass + ',' + t.param.bulletclass ).mouseleave(function() {
           
           t.autoplayset();
       });
       
    };
    
    
    
    /* bullets */
    
    t.bullets = function () {
          
        if ( t.param.bullets ) {
            
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

        if ( t.param.loop === 'none' ) {
            
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
                
                t.pausevideosofcurrentslide();
                
                t.stat.currentslideindex = ( currentbullet - 1 ) * t.stat.slidegroup;
                
                
                /* check currentslideindex */

                t.check_slider_current_index();
                
                t.set_slidesinviewport();
                
                t.playlastplayedvideoofcurrentslide();
                
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
    
    
    
    /* animation */
    
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
    
    
    
    /* misc */
    
    t.clon_slides = function () {
        
        var index = 0,
            i = 0;
            
        if ( t.stat.slidegroup > 0 && t.param.loop !== 'none' ) {
        
            
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
        
        if ( t.param.loop === 'appending' ) {

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
            if ( t.param.loop === 'none' && t.stat.currentslideindex >= t.stat.slidecount - t.stat.slidegroup ) {
           
                t.stat.currentslideindex = t.stat.slidecount - t.stat.slidegroup;
            }
       
            /* appending */
            
            if ( t.param.loop === 'appending' && t.stat.currentslideindex > t.stat.slidecount - 1 + t.stat.slidegroup ) {
           
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

            if ( t.param.loop === 'none' && t.stat.currentslideindex <= 0 ) {

                t.stat.currentslideindex = 0;
            }


            /* loop-appending */

            if ( t.param.loop === 'appending' && t.stat.currentslideindex < 0 ) {

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
			}


			//Else, cancel means snap back to the begining
			
			else if ( phase === 'cancel' ) {
			
				t.animate_slider_to_current_position( t.get_animationspeed() );
			}


			//Else end means the swipe was completed, so move to the next image
			
			else if ( phase === 'end' ) {
			
				if ( direction === 'right' ) {
                    
                    t.prev_job();
                    
				}
				else if ( direction === 'left' ) {
                    
                    t.next_job();
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
    
    
    
    /* css */
    
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
    
    
    
    /* helper */
    
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
}
