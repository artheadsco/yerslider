/*
 * yerSlider
 * A javascript object for slided content
 *
 * Copyright (c) 2013 Johann Heyne
 *
 * Version 1
 * Update 2013-05-17
 *
 * Minimum requirements: jQuery v1.6+
 *
 * Terms of use:
 * yerslider is licensed under the MIT License.
 *
 */

var yerSlider = {
    
    param: {
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
        nextclass: '.yerslider-next',
        prevclass: '.yerslider-prev',
        nextinactiveclass: '.yerslider-next-inactive',
        previnactiveclass: '.yerslider-prev-inactive',
        animationspeed: 1000,
        bullets: false,
        loop: 'none', /* appending, rollback, from-first */
        swipe: false,
        youtubeparam: '?rel=1&autoplay=0&showinfo=0'
    },
    
    stat: {
        slidegroupmax: 1,
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
        isresizing: false
    },
    
    obj: {
        sliderid: undefined,
        sliderwrap: undefined,
        slider: undefined,
        slide: undefined,
        bulletswrap: undefined,
        bullets: undefined,
        prevbtn: undefined,
        nextbtn: undefined
    },
    
    init: function ( p ) {
        
        this.init_getdefaultparam( p );
        
        this.init_animation();
        
        this.init_touch();
        
        this.init_isios();
        
        this.init_ojects();
        
        this.init_css();
        
        this.set_slidermaskwidth();
        this.set_slidecount();
        this.set_slidegroup();
        this.set_slidegroupmax();
        this.clon_slides();
        this.set_slidewidth();
        this.set_slideheight();
        this.set_prevnext();
        
        this.bullets();
        
        this.init_touchswipe();
        
        this.init_iosresizeclickbug();
        
        this.init_video();
    },
    
    init_getdefaultparam: function ( p ) {
        
        /* get default parameters */
        
        this.param = this.helper.setDefaultParam({
            p: p,
            d: this.param
        });
    },
    
    init_animation: function () {

        /* css animation */
        
        if ( jQuery('html').hasClass('csstransforms3d csstransitions') ) {
        
            this.stat.cssanimation = true;
        };
    },
    
    init_touch: function () {

        /* css animation */
        
        if ( jQuery('html').hasClass('touch') ) {
        
            this.stat.touch = true;
            this.stat.clicktype = 'touchend';
        };
    },
    
    init_isios: function () {
        
        /* is iOS */
        
        if ( navigator.userAgent.match(/(iPod|iPhone|iPad)/) ) {
            
            this.stat.isios = true;
        }
    },
    
    init_ojects: function () {
        
        /* define slider objects */
        
        this.obj.sliderid = jQuery( this.param.sliderid );
        this.obj.sliderwrap = jQuery( this.param.sliderwrapclass );
        this.obj.slidermask = jQuery( this.param.slidermaskclass );
        this.obj.slider = jQuery( this.param.sliderclass );
        this.obj.slide = jQuery( this.param.slideclass );
    },
    
    init_css: function () {
        
        /* layout slider */
        
        this.obj.sliderwrap.css({
            position: 'relative',
            width: '100%'
        });
        
        this.obj.slidermask.css({
            position: 'relative',
            width: '100%',
            overflow: 'hidden'
        });
        
        /* remember font-size and line-height for the slides because
        the font-size and line-height of the slider needs to be zero */
        
        var obj_slide_css = [];
            
            obj_slide_css.fontsize = this.obj.slide.css('font-size');
            obj_slide_css.lineheight = this.obj.slide.css('line-height');
        
        this.obj.slider.css({
            'white-space': 'nowrap',
            position: 'relative',
            'list-style-type': 'none',
            padding: 0,
            margin: 0,
            'line-height': 0,
            'font-size': 0
        });
        
        this.obj.slide.css({
            display: 'inline-block',
            'vertical-align': 'top',
            'white-space': 'normal',
            'font-size': obj_slide_css.fontsize,
            'line-height': obj_slide_css.lineheight
        });
    },
    
    init_touchswipe: function () {
         
         /* touch swipe */

         if ( this.param.swipe ) {

             this.touch_swipe();
         }
    },
    
    init_iosresizeclickbug: function () {
         
         /* Resize Click Bug iOS: http://boagworld.com/dev/ios-safari-resizing-issues/ */

         this.obj.sliderwrap.on( this.stat.clicktype, function () {

             yerSlider.stat.isevent  = true;

             window.setTimeout(function(){

                 yerSlider.stat.isevent= false;
             }, 200);
         });

         jQuery(window).bind('resize', function() {
            
            window.setTimeout(function(){

                if ( !yerSlider.stat.isresizing && !yerSlider.stat.isevent ) {

                    yerSlider.resize();
                }
         }, 100);
         }); 
    },
    
    init_video: function () {
         
         /* remove videos on ios */

 		window.setTimeout( function () {

             jQuery('.yerslider-video *').remove();
         }, 111);

         this.videos_in_viewport(); 
    },
    
    
    /* setup */
    
    set_slidermaskwidth: function () {
        
        if ( this.param.insidetablecellfix ) {
            this.obj.slider.hide();
            this.obj.slidermask.css('width','100%');
        }
        
        this.stat.slidermaskwidth = this.obj.slidermask.innerWidth();
        
        if ( this.param.insidetablecellfix ) {
            this.obj.slidermask.css('width',this.obj.slidermask.width() + 'px');
            this.obj.slider.show();
        }
    },
    
    set_slidecount: function () {
        
        this.stat.slidecount = this.obj.slide.size();
    },
    
    set_slidegroup: function () {
        
        var slidermaskwidth = this.obj.slidermask.innerWidth();
        
        var temp = this.param.slidegroup;
        
        if ( this.helper.getLength( this.param.slidegroupresp ) > 0 ) {
            
            for ( var i in this.param.slidegroupresp ) {
        
                if ( i <= this.stat.slidermaskwidth ) {
            
                    temp = this.param.slidegroupresp[ i ];
                }
            }
        }
        
        if ( temp >= this.stat.slidecount ) {
        
            temp = this.stat.slidecount;
            this.stat.currentslideindex = 0;
            this.move_slider_to_current_index();
        }
        
        this.param.slidegroup = temp;
    },
    
    set_slidegroupmax: function () {
        
        for ( var i in this.param.slidegroupresp ) {
            if ( this.stat.slidegroupmax < this.param.slidegroupresp[ i ] ) {
                this.stat.slidegroupmax = this.param.slidegroupresp[ i ];
            }
        }
    },
    
    set_slidewidth: function () {
        
        /** Not dodo. This commented code calculating the slidewidth including slide padding (border should added).
            But i think it is saver to left the styles of the slide element untouched because the calculation 
            is allways save and correct. Use a inner div and margin to simmulate slide-padding.
            
            var slidepadding = {};
            slidepadding.left = parseInt( this.obj.slide.css('padding-left'), 10 );
            slidepadding.right = parseInt( this.obj.slide.css('padding-right'), 10 );
            this.stat.slidewidth = Math.floor( ( this.stat.slidermaskwidth - ( ( this.param.slidegap * ( this.param.slidegroup - 1 ) ) + ( ( slidepadding.left + slidepadding.left )  * this.param.slidegroup ) ) ) / this.param.slidegroup  );
        */
        
        this.stat.slidewidth = Math.floor( ( this.stat.slidermaskwidth - ( this.param.slidegap * ( this.param.slidegroup - 1 ) ) ) / this.param.slidegroup );
        
        var diff = this.stat.slidermaskwidth - ( ( this.stat.slidewidth * this.param.slidegroup ) + ( this.param.slidegap * ( this.param.slidegroup - 1 ) ) );
        
        this.obj.slide
            .width( this.stat.slidewidth )
            .css( 'margin-right', this.param.slidegap + 'px' )
            .last().css( 'margin-right', '0' );
        
        
        /* streching the width of some slides by 1 pixel to fit the sliderwrapwidth */
        
        if ( diff > 0 ) {
            
            for ( var i = 0; i < diff; i++ ) {
                jQuery( this.param.slideclass + ':nth-child(' + ( 1 + i )  + 'n-' + (this.param.slidegroup - 1) + ')' ).css( 'margin-right', ( this.param.slidegap + 1 ) + 'px' );
                
            }
        }
    },
    
    set_slideheight: function () {
        
        /** Fix fitVids and slider height
            If the jQuery('.fitvids').fitVids(); is placed after the yerSlider.init than the 
            timeout is needet to result the fitted video height in the slider height. 
            The jQuery('.fitvids').fitVids(); has to be inside the jQuery(document).ready…
        */
          
        window.setTimeout( function () {
            
            yerSlider.obj.slide.height('auto');
            
            var height = yerSlider.obj.slider.height();
            yerSlider.obj.slide.height( height );
            
        }, 0);
    },
    
    
    /* prev next */
    
    set_prevnext: function () {
        
        
        /* init */
        if ( this.stat.slidecount > this.param.slidegroup ) {
        
            if ( typeof this.obj.nextbtn !== 'object' && this.param.nextbtn ) {
                this.obj.sliderwrap.append('<div class="js-yerslider-next yerslider-prevnext ' + this.param.nextclass.replace( '.', '' ) + '">');
                this.obj.nextbtn = jQuery( this.param.nextclass );
            }
        
            if ( typeof this.obj.prevbtn !== 'object' && this.param.prevbtn ) {
                this.obj.sliderwrap.append('<div class="js-yerslider-prev yerslider-prevnext ' + this.param.prevclass.replace( '.', '' ) + '">');
                this.obj.prevbtn = jQuery( this.param.prevclass );
            }
            
            this.refresh_prevnext();
        }
        
        /* remove */
        else {
        
            if ( typeof this.obj.nextbtn === 'object' ) {
                this.obj.nextbtn.remove();
                this.obj.nextbtn = undefined;
                this.stat.nextbtnclickable = false;
            }
            if ( typeof this.obj.prevbtn === 'object' ) {
                this.obj.prevbtn.remove();
                this.obj.prevbtn = undefined;
                this.stat.prevbtnclickable = false;
            }
        }
        
    },
    
    next_slide: function () {
        
        this.stat.currentslideindex = this.stat.currentslideindex + this.param.slidegroup;
        
        /* loop-none */
        if ( this.param.loop === 'none' && this.stat.currentslideindex >= this.stat.slidecount - this.param.slidegroup ) {
           
            this.stat.currentslideindex = this.stat.slidecount - this.param.slidegroup;
        }
       
        
        /* loop-appending */
        
        if ( this.param.loop === 'appending' && this.stat.currentslideindex > this.stat.slidecount - 1 + this.param.slidegroup ) {
           
           var temp = this.stat.currentslideindex - this.stat.slidecount;
            
            this.stat.currentslideindex = this.stat.currentslideindex - this.stat.slidecount - this.param.slidegroup;
            
            this.animate_slider_to_current_position( 0 );
            
            this.stat.currentslideindex = temp;
        }
        
        
        /* loop-rollback */
        
        
        
        /* loop-from-first */
        
        
        
        /* crurrent class */
        
        this.obj.slide.removeClass('current');
        jQuery( this.obj.slide[ this.stat.currentslideindex ] ).addClass('current');
    },
    
    prev_slide: function () {
        
        this.stat.currentslideindex = this.stat.currentslideindex - this.param.slidegroup;
        
        /* loop-none */
        
        if ( this.param.loop === 'none' && this.stat.currentslideindex <= 0 ) {
           
            this.stat.currentslideindex = 0;
        }
        
        
        /* loop-appending */
        
        if ( this.param.loop === 'appending' && this.stat.currentslideindex < 0 ) {
            
            var temp = this.stat.slidecount + this.stat.currentslideindex;
            
            this.stat.currentslideindex = this.stat.currentslideindex + this.stat.slidecount + this.param.slidegroup;
            
            this.animate_slider_to_current_position( 0 );
            
            this.stat.currentslideindex = temp;
        }
        
        
        /* loop-rollback */
        
        
        
        /* loop-from-first */
        
        
        
        /* crurrent class */
        
        this.obj.slide.removeClass('current');
        jQuery( this.obj.slide[ this.stat.currentslideindex ] ).addClass('current');
    },
    
    nextbtn_click: function () {
        
        if ( !yerSlider.stat.nextbtnclickable ) {
            
            this.obj.nextbtn.on( this.stat.clicktype, function () {
                
                if ( !yerSlider.stat.isanimating ) {
                    
                    yerSlider.stat.isanimating = true;
                    yerSlider.stat.slidingright = true;
                    
                    yerSlider.next_slide();
                    
                    yerSlider.animate_slider_to_current_position( yerSlider.param.animationspeed );
                    
                    yerSlider.refresh_prevnext();
            
                    if ( yerSlider.param.bullets ) {

                        yerSlider.set_bullet_current();
                        yerSlider.set_bullet_current_class();
                    }
                
                    yerSlider.stat.slidingright = false;
                }
            });
        
            yerSlider.stat.nextbtnclickable = true;
        }
    },
    
    prevbtn_click: function () {
        
        if ( !yerSlider.stat.prevbtnclickable ) {
        
            this.obj.prevbtn.on( this.stat.clicktype, function () {
                
                if ( !yerSlider.stat.isanimating ) {
                    
                    yerSlider.stat.isanimating = true;
                    yerSlider.stat.slidingleft = true;
                    
                    yerSlider.prev_slide();
                    yerSlider.animate_slider_to_current_position( yerSlider.param.animationspeed );
            
                    yerSlider.refresh_prevnext();
            
                    if ( yerSlider.param.bullets ) {

                        yerSlider.set_bullet_current();
                        yerSlider.set_bullet_current_class();
                    }
                
                    yerSlider.stat.slidingleft = false;
                }
            });
            
            yerSlider.stat.prevbtnclickable = true;
        }
        
    },
    
    nextbtn_click_unbind: function () {
                
        this.obj.nextbtn.unbind( 'click' )
            .addClass( this.param.nextinactiveclass.replace( '.', '' ) );
        
        this.stat.nextbtnclickable = false;
    },
    
    prevbtn_click_unbind: function () {

        this.obj.prevbtn.unbind( 'click' )
            .addClass( this.param.previnactiveclass.replace( '.', '' ) );
        
        this.stat.prevbtnclickable = false;
    },
    
    refresh_prevnext: function () {
        
        /* bind click events if unbinded in general */
        
        if ( !this.stat.nextbtnclickable ) this.nextbtn_click();
        if ( !this.stat.prevbtnclickable ) this.prevbtn_click();
        
        
        /* remove inactive classes in general */
        
        this.obj.nextbtn.removeClass( this.param.nextinactiveclass.replace( '.', '' ) );
        this.obj.prevbtn.removeClass( this.param.previnactiveclass.replace( '.', '' ) );
        
        
        /* then unbind in some kind of slider situation */
        
        if ( this.param.loop === 'none' ) {
            
            if ( this.stat.currentslideindex >= this.stat.slidecount - this.param.slidegroup ) {
            
                this.nextbtn_click_unbind();
            }
        
            if ( this.stat.currentslideindex <= 0 ) {

                this.prevbtn_click_unbind();
            }
        }
    },
    
    
    /* bullets */
    
    bullets: function () {
          
        if ( this.param.bullets ) {
        
            /* do bullets-wrap html and object */
        
            if ( typeof this.obj.bulletswrap !== 'object' ) {
        
                this.obj.sliderwrap.append('<div class="' + this.param.bulletswrapclass.replace( '.', '' ) + '"></div>');
                this.obj.bulletswrap = this.obj.sliderwrap.find( this.param.bulletswrapclass );
            }
        
        
            /* get amount of bullets */
        
            this.stat.bulletscount = Math.ceil( this.stat.slidecount / this.param.slidegroup );
            
            
            /* current bullet index */
            
            this.set_bullet_current();
            
            
            /* bullet items */
            
            this.bullet_items();
            
            
            /* bullet current class */
            
            this.set_bullet_current_class();
            
            
            /* bullets click */
            
            this.bullet_click();
        }
    },
    
    bullet_items: function () {
          
        /* do bullets html and object */

        if ( this.stat.bulletscountcache !== this.stat.bulletscount ) {
            
            var bullets = '';
        
            for ( var i = 1; i <= this.stat.bulletscount; i++ ) {
            
                bullets += '<div class="' + this.param.bulletclass.replace( '.', '' ) + '" data-index="' + i + '"></div>';
            }
        
            this.obj.bulletswrap.empty();
        
            if ( this.stat.bulletscount > 1 ) {
            
                this.obj.bulletswrap.append( bullets );
            }
        
            this.stat.bulletscountcache = this.stat.bulletscount;
        }
        
        this.obj.bullets = this.obj.bulletswrap.find( this.param.bulletclass );
        
        this.set_bullet_current_class();
    },
    
    set_bullet_current: function () {
        
        var currentslideindex = this.stat.currentslideindex;

        /* translate clone current slide index into original index */

        if ( currentslideindex + 1 > this.stat.slidecount ) {

            currentslideindex = currentslideindex - this.stat.slidecount;
        }


        /* current bullet index */

        if ( this.param.loop === 'none' ) {
            
            this.stat.bulletcurrent = Math.ceil( currentslideindex / this.param.slidegroup ) + 1;
        }
        else {
            
            this.stat.bulletcurrent = Math.round( currentslideindex / this.param.slidegroup ) + 1;
            
            if ( this.stat.bulletcurrent > this.stat.bulletscount ) {
                
                this.stat.bulletcurrent = this.stat.bulletscount;
            }
        }
    },
    
    set_bullet_current_class: function () {
        
        /* current bullet class */
        
        this.obj.bullets.removeClass( this.param.bulletcurrentclass.replace( '.', '' ) );
        
        this.obj.bulletswrap.find('[data-index="' + this.stat.bulletcurrent + '"]').addClass( this.param.bulletcurrentclass.replace( '.', '' ) );
    },
    
    bullet_click: function () {
    
        this.obj.bullets.on( 'click', function () {
            
            
            if ( !yerSlider.stat.isanimating ) {
                
                yerSlider.stat.isanimating = true;
                
                var currentbullet = jQuery(this).data('index');
                
                yerSlider.stat.currentslideindex = ( currentbullet - 1 ) * yerSlider.param.slidegroup;
                
                yerSlider.proof_slider_current_index();
                
                yerSlider.animate_slider_to_current_position( yerSlider.param.animationspeed );
                
                if ( !yerSlider.stat.prevbtnclickable ) {
                    
                    yerSlider.prevbtn_click();
                }
            }
            
            
            /* bullets */
            
            if ( yerSlider.param.bullets ) {
            
                yerSlider.set_bullet_current();
                yerSlider.set_bullet_current_class();
            }
            
            
            /* prev next buttons */
            
            yerSlider.refresh_prevnext();
        });
    },
    
    
    /* animation */
    
    move_slider_to_current_index: function () {
        yerSlider.obj.slider.css({
            'margin-left': '-' + yerSlider.get_sliderposition() + 'px'
        });
    },
    
    animate_slider_to_current_position: function ( duration) {
        
        if ( this.stat.cssanimation ) {
        
            yerSlider.animate_slider_to_current_position_css( duration );
        }
        else {
        
            yerSlider.animate_slider_to_current_position_js( duration );
        }
    },
    
    animate_slider_to_current_position_js: function ( duration ) {
        
        yerSlider.obj.slider.animate({
            'margin-left': '-' + yerSlider.get_sliderposition() + 'px'
        }, duration, function () {
           yerSlider.stat.isanimating = false;
        });
        
    },
    
    animate_slider_to_current_position_css: function( duration ) {
        
        
        var sliderposition = yerSlider.get_sliderposition() * -1,
            transform = 'translate3d(' + sliderposition.toString() + 'px,0px,0px)';
            
        yerSlider.css_transitionduration( yerSlider.obj.slider, duration );
        
        yerSlider.obj.slider.css({
            '-webkit-transform': transform,
            '-ms-transform': transform,
            '-o-transform': transform,
            '-moz-transform': transform,
            'transform': transform
        });
        
        window.setTimeout( function () {
            
            yerSlider.stat.isanimating = false;
            yerSlider.animation_finshed();
            yerSlider.videos_in_viewport();
            
        }, yerSlider.param.animationspeed );
        
    },
    
    animation_finshed: function () {
        
        
    },
    
    videos_in_viewport: function () {
        
        /* get slides of viewport */
        
        jQuery('.yerslider-video *').addClass('remove-me');
        
        window.setTimeout( function () {

            jQuery('.remove-me').remove();
        }, yerSlider.param.animationspeed );
        
        
        window.setTimeout( function () {
        
            var selector = false;

            for ( i = yerSlider.stat.currentslideindex + 1; i <= yerSlider.stat.currentslideindex + yerSlider.param.slidegroup; i++ ) {
    
                selector = jQuery( yerSlider.param.slideclass + ':nth-child(' + i + ') .yerslider-video' );
        
                if ( selector.length > 0 ) {
            
                    var type = selector.data('video-type'),
                        code = selector.data('video-code'),
                        width = selector.data('video-width'),
                        height = selector.data('video-height')
                        param = '';
            
                    if ( type === 'youtube' ) {
                        
                        if ( !yerSlider.stat.isios ) {
                            param = yerSlider.param.youtubeparam;
                        }

                        selector.append( '<iframe width="' + width +  '" height="' + height +  '" src="http://www.youtube.com/embed/' + code + param + '" frameborder="no"></iframe>');
                        
                        //.find('iframe').css('-webkit-transform-style','preserve-3d').css('z-index','0');
                    }
            
                    window.setTimeout( function () {

                        
                    }, 111);
                }
            }
        }, 0);
    },
    
    
    /* misc */
    
    clon_slides: function () {
        
        var index = 0;
        
        for (var i = 0; i < this.stat.slidegroupmax * 2; i++) {
            
            if ( index > this.stat.slidecount ) {
                index = 0;
            }
            
            this.obj.slider.append( jQuery( this.obj.slide[ index ] ).clone() );
            
            index++;
        }
        
        this.obj.slide = jQuery( this.param.slideclass );
    },
    
    get_sliderposition: function () {

        //var pos = ( parseInt( yerSlider.stat.currentslideindex * yerSlider.stat.slidewidth, 10 ) + parseInt( yerSlider.param.slidegap * yerSlider.stat.currentslideindex, 10 ) );
        var pos = jQuery( this.obj.slide[ yerSlider.stat.currentslideindex ] ).position().left;
        return pos;
    },
    
    proof_slider_current_index: function () {
        
        if ( this.stat.slidecount - this.param.slidegroup > 0 && this.stat.currentslideindex >= this.stat.slidecount - this.param.slidegroup ) {
           
            this.stat.currentslideindex = this.stat.slidecount - this.param.slidegroup;
            
            this.nextbtn_click_unbind();
        }
    },
    
    resize: function () {
              
        yerSlider.stat.resizing = true;
            
             if ( yerSlider.stat.isios ) {
             
                yerSlider.stat.isresizing = true;
                yerSlider.obj.slider.fadeOut();
            }
            
            yerSlider.set_slidermaskwidth();
            yerSlider.set_slidegroup();
            yerSlider.set_slidewidth();
            yerSlider.set_slideheight();
            yerSlider.proof_slider_current_index();
            yerSlider.animate_slider_to_current_position( 0 );
            
            yerSlider.set_prevnext();
        
            if ( yerSlider.param.bullets ) {
        
                yerSlider.bullets();
            }
            
            
        yerSlider.stat.resizing = false;
        
        if ( yerSlider.stat.isios ) {
        
            yerSlider.obj.slider.fadeIn( 'fast', function () {
             
                 yerSlider.stat.isresizing = false;
            });
        }
    },
    
    touch_swipe: function () {

        var slide_with_default = ( this.stat.slidewidth + this.param.slidegap ) * this.param.slidegroup,
    		slide_with = slide_with_default,
    		current_slide = 0,
    		max_slides = Math.ceil( this.stat.slidecount / this.param.slidegroup ),
    		speed = this.param.animationspeed,
    		slides = this.obj.slide;
        

		// init touch swipe
		slides.swipe( {
			triggerOnTouchEnd: true,
			swipeStatus: swipeStatus,
			allowPageScroll: 'vertical'
		});

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
				if ( direction == 'right' ) {
				
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
			
            yerSlider.prev_slide();
            yerSlider.refresh_prevnext();
            
            if ( yerSlider.param.bullets ) {

                yerSlider.set_bullet_current();
                yerSlider.set_bullet_current_class();
            }
		}

		function nextImage() {
		
			current_slide = Math.min( current_slide + 1, max_slides - 1 );
			scrollImages( slide_with * current_slide, speed );
			
            yerSlider.next_slide();
            yerSlider.refresh_prevnext();
            
            if ( yerSlider.param.bullets ) {

                yerSlider.set_bullet_current();
                yerSlider.set_bullet_current_class();
            }
		}

		/**
		 * Manually update the position of the slides on drag
		 */
		function scrollImages( distance, duration ) {
		
			slides.css('-webkit-transition-duration', ( duration / 1000 ).toFixed(1) + 's' );

			//inverse the number we set in the css
			var value = ( distance < 0 ? '' : '-' ) + Math.abs(distance).toString();

			slides.css( '-webkit-transform', 'translate3d('+value +'px,0px,0px)' );
		}
    },
    
    
    /* helper */
    
    css_transitionduration: function ( obj, duration ) {
        
        duration = ( ( duration / 1000 ).toFixed(1) + 's' );
        
        obj.css({
            '-webkit-transition-duration': duration,
            '-ms-transition-duration': duration,
            '-o-transition-duration': duration,
            '-moz-transition-duration': duration,
            'transition-duration': duration
        });
    },
    
    helper: {
        
        getLength:  function( o ) {

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
                
                    if ( typeof p.d[ i ] !== 'undefined' && yerSlider.helper.getLength( r[ i ] ) !== yerSlider.helper.getLength( p.d[ i ] ) ) {
                        r[ i ] = yerSlider.helper.setDefaultParam({ p: r[ i ], d: p.d[ i ] });
                    }
                }
            }

            return r;
        }
    }
};