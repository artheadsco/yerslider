/*
 * yerSlider
 * A javascript object for slided content
 *
 * Copyright (c) 2013 Johann Heyne
 *
 * Version 1
 * Update 2013-05-27
 *
 * Minimum requirements: jQuery v1.6+
 *
 * Terms of use:
 * yerslider is licensed under the MIT License.
 *
 */

function yerSlider() {
    
    var t = this;
    
    t.param = {
        slidegap: 0,
        slidegroupresp: {},
        slidegroup: 1,
        sliderid: '.yerslider',
        sliderwrapclass: '.yerslider-wrap',
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
        autoplayinterval: 3, /* integer sec, 0 */
        showslidestype: 'fade',
        showslidestime: 1000,
        swipe: false,
        videoembed: 'onload', /* viewport */
        videoembedgroupsbefore: 0, /* viewport */
        youtubeparam: '?rel=1&autoplay=0&showinfo=0',
        youtubeurl: 'http://www.youtube.com/embed/{code}{param}',
        youtubehtml: '<iframe width="{width}" height="{height}" src="{url}" frameborder="no"></iframe>',
        vimeoparam: '?byline=0&amp;portrait=0&amp;autoplay=0',
        vimeourl: 'http://player.vimeo.com/video/{code}{param}',
        vimeohtml: '<iframe width="{width}" height="{height}" src="{url}" frameborder="no" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>'
    };
    
    t.stat = {
        slidegroupmax: 1,
        slidegroup: 1,
        currentslideindex: 0,
        slidecount: 0,
        slidermaskwidth: 0,
        slidewidth: 0,
        isanimating: false,
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
        videoembedindexbegin: false,
        videoembedindexend: false,
        videoembedindexes: false
    };
    
    t.obj = {
        sliderid: undefined,
        sliderwrap: undefined,
        slider: undefined,
        slide: undefined,
        bulletswrap: undefined,
        bullets: undefined,
        prevbtn: undefined,
        nextbtn: undefined
    };
    
    t.init = function ( p ) {

        t.init_getdefaultparam( p );
        
        if ( jQuery( t.param.sliderid ).length > 0 ) {
        
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
            t.set_groupindex();
            t.set_slidewidth();
            t.set_slideheight();
            t.clon_slides();
            t.set_prevnext();
        
            t.bullets();
        
            t.init_touchswipe();
        
            t.init_iosresizeclickbug();
            
            t.init_showslides();
            
            if ( t.param.autoplay ) {
            
                t.autoplay();
            }
            //t.init_video();
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

         if ( t.param.swipe ) {

             t.touch_swipe();
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
         
        window.setTimeout( function () {

            jQuery('.yerslider-video iframe').remove();
        }, 100);
        
        t.videos_in_viewport();
    };
    
    t.init_showslides = function () {
        
        t.stat.isanimating = true;
        
        window.setTimeout(function(){
            
            if ( t.stat.cssanimation ) {
            
                t.obj.slider.css({
                    '-webkit-transition-duration': ( t.param.showslidestime / 1000 ).toFixed(1) + 's',
                    '-moz-transition-duration': ( t.param.showslidestime / 1000 ).toFixed(1) + 's',
                    '-o-transition-duration': ( t.param.showslidestime / 1000 ).toFixed(1) + 's',
                    '-ms-transition-duration': ( t.param.showslidestime / 1000 ).toFixed(1) + 's',
                    'transition-duration': ( t.param.showslidestime / 1000 ).toFixed(1) + 's'
                });
                t.obj.slider.fadeIn(10);
            }
        
            else {
            
                t.obj.slider.fadeIn(t.param.showslidestime);
            }
            
        }, 500);
        
         window.setTimeout(function(){
         
            t.stat.isanimating = false;
            
         }, t.param.showslidestime + 100);
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
                    jQuery( t.param.slideclass + ':nth-child(' + ( 1 + i )  + 'n-' + (t.stat.slidegroup - 1) + ')' ).css( 'margin-right', ( t.param.slidegap + 1 ) + 'px' );
                
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
    
    t.set_groupindex = function () {
         
        t.stat.videoembedindexbegin = t.stat.currentslideindex + 1 - ( t.stat.slidegroup * t.param.videoembedgroupsbefore );
        t.stat.videoembedindexend = t.stat.currentslideindex + t.stat.slidegroup + ( t.stat.slidegroup * t.param.videoembedgroupsbefore );
        
        t.stat.videoembedindexes = [];
        
        for ( i = 1; i <= t.stat.slidecount; i++ ) {

            if ( i >= t.stat.videoembedindexbegin && i <= t.stat.videoembedindexend ) {
                t.stat.videoembedindexes.push(i);
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
        
        if ( t.stat.slidegroup === 0 ) {
            
            t.stat.currentslideindex = t.stat.currentslideindex + 1;
        }
        
        /* loop-none */
        if ( t.param.loop === 'none' && t.stat.currentslideindex >= t.stat.slidecount - t.stat.slidegroup ) {
           
            t.stat.currentslideindex = t.stat.slidecount - t.stat.slidegroup;
        }
       
        
        /* loop-appending */
        
        var shift_break = 1,
            shift_jump = 0;
        
        if ( t.param.autoplay === true ) {
        
            shift_break = 0;
            shift_jump = 1;
        }
        
        if ( t.param.loop === 'appending' && t.stat.currentslideindex > t.stat.slidecount - shift_break + t.stat.slidegroup ) {
           
           var temp = t.stat.currentslideindex - t.stat.slidecount;
            
            t.stat.currentslideindex = t.stat.currentslideindex - t.stat.slidecount - t.stat.slidegroup - shift_jump;
            
            t.animate_slider_to_current_position( 0 );
            
            t.stat.currentslideindex = temp;
        }
        
        /* loop-rollback */
        
        
        
        /* loop-from-first */
        
        
        
        /* current class */
        
        t.obj.slide.removeClass('current');
        jQuery( t.obj.slide[ t.stat.currentslideindex ] ).addClass('current');
        
        
        /* group indexes */
        
        t.set_groupindex();
        
    };
    
    t.prev_slide = function () {
        
        t.stat.currentslideindex = t.stat.currentslideindex - t.stat.slidegroup;
        
        /* loop-none */
        
        if ( t.param.loop === 'none' && t.stat.currentslideindex <= 0 ) {
           
            t.stat.currentslideindex = 0;
        }
        
        
        /* loop-appending */
        
        if ( t.param.loop === 'appending' && t.stat.currentslideindex < 0 ) {
            
            var temp = t.stat.slidecount + t.stat.currentslideindex;
            
            t.stat.currentslideindex = t.stat.currentslideindex + t.stat.slidecount + t.stat.slidegroup;
            
            t.animate_slider_to_current_position( 0 );
            
            t.stat.currentslideindex = temp;
        }
        
        
        /* loop-rollback */
        
        
        
        /* loop-from-first */
        
        
        
        /* crurrent class */
        
        t.obj.slide.removeClass('current');
        jQuery( t.obj.slide[ t.stat.currentslideindex ] ).addClass('current');
        
        
        /* group indexes */
        
        t.set_groupindex();
    };
    
    t.nextbtn_click = function () {
        
        if ( t.obj.nextbtn && !t.stat.nextbtnclickable ) {
            
            t.obj.nextbtn.on( t.stat.clicktype, function () {
                
                if ( !t.stat.isanimating ) {
                    
                    t.stat.isanimating = true;
                    t.stat.slidingright = true;
                    
                    t.next_slide();
                    
                    if ( t.param.scrolltop ) {
                    
                        jQuery('body').animate({
                        
                            scrollTop: t.param.scrolltopval
                        }, t.param.scrolltopspeed );
                    }
                    
                    t.animate_slider_to_current_position( t.param.animationspeed );
                    
                    t.refresh_prevnext();
            
                    if ( t.param.bullets ) {

                        t.set_bullet_current();
                        t.set_bullet_current_class();
                    }
                
                    t.stat.slidingright = false;
                }
            });
        
            t.stat.nextbtnclickable = true;
        }
    };
    
    t.prevbtn_click = function () {
        
        if ( t.obj.prevbtn && !t.stat.prevbtnclickable ) {
        
            t.obj.prevbtn.on( t.stat.clicktype, function () {
                
                if ( !t.stat.isanimating ) {
                    
                    t.stat.isanimating = true;
                    t.stat.slidingleft = true;
                    
                    t.prev_slide();
                    
                    if ( t.param.scrolltop ) {
                    
                        jQuery('body').animate({
                        
                            scrollTop: t.param.scrolltopval
                        }, t.param.scrolltopspeed );
                    }
                    
                    t.animate_slider_to_current_position( t.param.animationspeed );
                    
                    t.refresh_prevnext();
            
                    if ( t.param.bullets ) {

                        t.set_bullet_current();
                        t.set_bullet_current_class();
                    }
                
                    t.stat.slidingleft = false;
                }
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
    
    t.autoplay = function () {
       
        window.setInterval( function () {

            if ( !t.stat.isanimating ) {

                t.stat.isanimating = true;
                t.stat.slidingright = true;

                t.next_slide();
                
                t.animate_slider_to_current_position( t.param.animationspeed );

                t.refresh_prevnext();

                if ( t.param.bullets ) {

                    t.set_bullet_current();
                    t.set_bullet_current_class();
                }

                t.stat.slidingright = false;
                
            }  
        }, t.param.autoplayinterval );
       
    };
    
    
    /* bullets */
    
    t.bullets = function () {
          
        if ( t.param.bullets ) {
        
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
                
                var currentbullet = jQuery(this).data('index');
                
                t.stat.currentslideindex = ( currentbullet - 1 ) * t.stat.slidegroup;
                
                t.proof_slider_current_index();
                
                t.animate_slider_to_current_position( t.param.animationspeed );
                
                if ( !t.stat.prevbtnclickable ) {
                    
                    t.prevbtn_click();
                }
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
        t.obj.slider.css({
            'margin-left': '-' + t.get_sliderposition() + 'px'
        });
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
           t.stat.isanimating = false;
        });
        
    };
    
    t.animate_slider_to_current_position_css = function( duration ) {
        
        
        var sliderposition = t.get_sliderposition() * -1,
            transform = 'translate3d(' + sliderposition.toString() + 'px,0px,0px)';
            
        t.css_transitionduration( t.obj.slider, duration );
        
        t.obj.slider.css({
            '-webkit-transform': transform,
            '-ms-transform': transform,
            '-o-transform': transform,
            '-moz-transform': transform,
            'transform': transform,
            '-webkit-transition-timing-function': t.param.animationtype,
            '-moz-transition-timing-function': t.param.animationtype,
            '-o-transition-timing-function': t.param.animationtype,
            '-ms-transition-timing-function': t.param.animationtype,
            'transition-timing-function': t.param.animationtype
        });
        
        
        window.setTimeout( function () {
            
            t.stat.isanimating = false;
            t.animation_finshed();
            t.videos_in_viewport();
            
        }, t.param.animationspeed );
        
    };
    
    t.animation_finshed = function () {
        
        
    };
    
    t.videos_in_viewport = function () {
        
        /* get slides of viewport */

        jQuery( t.param.sliderid + ' .yerslider-video iframe').addClass('remove-me');
        
        window.setTimeout( function () {
        
            jQuery( t.param.sliderid + ' .remove-me').remove();
        }, t.param.animationspeed );


        window.setTimeout( function () {
        
            var selector = false;
            
            for ( i = t.stat.currentslideindex + 1 - ( t.stat.slidegroup * t.param.videoembedgroupsbefore ); i <= t.stat.currentslideindex + t.stat.slidegroup + ( t.stat.slidegroup * t.param.videoembedgroupsbefore ); i++ ) {
    
                selector = jQuery( t.param.sliderid + ' ' + t.param.slideclass + ':nth-child(' + i + ') .yerslider-video' );
                
                if ( selector.length > 0 && selector.find('iframe').length === 0 ) {
            
                    var type = selector.data('video-type'),
                        code = selector.data('video-code'),
                        width = selector.data('video-width'),
                        height = selector.data('video-height'),
                        param = '';
            
                    if ( type === 'youtube' ) {
                        
                        if ( !t.stat.isios ) {
                            param = t.param.youtubeparam;
                        }
                        
                        url = t.param.youtubeurl;
                        html = t.param.youtubehtml;
                        
                        url = url
                            .replace( '{code}', code )
                            .replace( '{param}', param );
                            
                        html = html
                            .replace( '{width}', width )
                            .replace( '{height}', height )
                            .replace( '{url}', url );
                        
                        selector.append( html );
                        
                        //.find('iframe').css('-webkit-transform-style','preserve-3d').css('z-index','0');
                    }
                    
                    if ( type === 'vimeo' ) {
                        
                        if ( !t.stat.isios ) {
                            param = t.param.vimeoparam;
                        }
                        
                        url = t.param.vimeourl;
                        html = t.param.vimeohtml;
                        
                        url = url
                            .replace( '{code}', code )
                            .replace( '{param}', param );
                            
                        html = html
                            .replace( '{width}', width )
                            .replace( '{height}', height )
                            .replace( '{url}', url );
                        
                        selector.append( html );
                        
                        //.find('iframe').css('-webkit-transform-style','preserve-3d').css('z-index','0');
                    }
                }
            }
        }, 0);
    };
    
    t.video_load = function () {
          
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
        return pos;
    };
    
    t.proof_slider_current_index = function () {
        
        if ( t.stat.slidecount - t.stat.slidegroup > 0 && t.stat.currentslideindex >= t.stat.slidecount - t.stat.slidegroup ) {
           
            t.stat.currentslideindex = t.stat.slidecount - t.stat.slidegroup;
            
            t.nextbtn_click_unbind();
        }
    };
    
    t.resize = function () {
              
        t.stat.resizing = true;
            
            if ( t.stat.isios ) {
             
                t.stat.isresizing = true;
                //t.obj.slider.fadeOut();
            }
            
            t.set_slidermaskwidth();
            t.set_slidegroup();
            t.set_groupindex();
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
    
    t.touch_swipe = function () {
        
        
        var slide_with_default = ( t.stat.slidewidth + t.param.slidegap ) * t.stat.slidegroup,
            slide_with = slide_with_default,
            current_slide = 0,
            max_slides = Math.ceil( t.stat.slidecount / t.stat.slidegroup ),
            speed = t.param.animationspeed,
            slides = t.obj.slide;
        
        
        /**
		* Catch each phase of the swipe.
		* move : we drag the div.
		* cancel : we animate back to where we were
		* end : we animate to the next image
		*/
		function swipeStatus(event, phase, direction, distance, fingers) {
		
			//If we are moving before swipe, and we are going L or R, then manually drag the images
			
			if ( phase === 'move' && ( direction === 'left' || direction === 'right' ) ) {
				
				var duration =  0;

				if ( direction === 'left' ) {
				
					scrollImages( ( slide_with * current_slide ) + distance, duration );
                }
				else if ( direction === 'right' ) {
				
					scrollImages( ( slide_with * current_slide ) - distance, duration );
				}
			}


			//Else, cancel means snap back to the begining
			
			else if ( phase === 'cancel' ) {
			
				scrollImages( slide_with * current_slide, speed);
			}


			//Else end means the swipe was completed, so move to the next image
			
			else if ( phase === 'end' )
			{
				if ( direction === 'right' ) {
				
					previousImage();
				}
				else if ( direction === 'left' ) {
				
					nextImage();
				}
			}
		}

		function previousImage() {
		
			current_slide = Math.max( current_slide - 1, 0 );
			scrollImages( slide_with * current_slide, speed );
			
            t.prev_slide();
            t.refresh_prevnext();
            
            if ( t.param.bullets ) {

                t.set_bullet_current();
                t.set_bullet_current_class();
            }
		}

		function nextImage() {
		
			current_slide = Math.min( current_slide + 1, max_slides - 1 );
			scrollImages( slide_with * current_slide, speed );
			
            t.next_slide();
            t.refresh_prevnext();
            
            if ( t.param.bullets ) {

                t.set_bullet_current();
                t.set_bullet_current_class();
            }
		}

		/**
		 * Manually update the position of the slides on drag
		 */
		function scrollImages( distance, duration ) {
		
			slides.css({
                '-webkit-transition-duration': ( duration / 1000 ).toFixed(1) + 's',
                '-moz-transition-duration': ( duration / 1000 ).toFixed(1) + 's',
                '-o-transition-duration': ( duration / 1000 ).toFixed(1) + 's',
                '-ms-transition-duration': ( duration / 1000 ).toFixed(1) + 's',
                'transition-duration': ( duration / 1000 ).toFixed(1) + 's',
                '-webkit-transition-timing-function': t.param.animationtype,
                '-moz-transition-timing-function': t.param.animationtype,
                '-o-transition-timing-function': t.param.animationtype,
                '-ms-transition-timing-function': t.param.animationtype,
                'transition-timing-function': t.param.animationtype
			});
            
			//inverse the number we set in the css
			var value = ( distance < 0 ? '' : '-' ) + Math.abs(distance).toString();

			slides.css({
                '-webkit-transform': 'translate3d('+value +'px,0px,0px)',
                '-moz-transform': 'translate3d('+value +'px,0px,0px)',
                '-o-transform': 'translate3d('+value +'px,0px,0px)',
                '-ms-transform': 'translate3d('+value +'px,0px,0px)',
                'transform': 'translate3d('+value +'px,0px,0px)' 
			});
		}
        
        
		// init touch swipe
		slides.swipe( {
			triggerOnTouchEnd: true,
			swipeStatus: swipeStatus,
			allowPageScroll: 'vertical'
		});

	};
    
    
    /* helper */
    
    t.css_transitionduration = function ( obj, duration ) {
        
        duration = ( ( duration / 1000 ).toFixed(1) + 's' );
        obj.css({
            '-webkit-transition-duration': duration,
            '-ms-transition-duration': duration,
            '-o-transition-duration': duration,
            '-moz-transition-duration': duration,
            'transition-duration': duration
        });
    };
    
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