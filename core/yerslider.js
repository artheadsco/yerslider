/*
 * yerSlider
 * A javascript object for slided content
 *
 * Copyright (c) 2012 Johann Heyne
 *
 * Version 1
 * Update 2012-10-23
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
        nextbtn: true,
        prevbtn: true,
        nextclass: '.yerslider-next',
        prevclass: '.yerslider-prev'
    },
    
    status: {
        slidegroupmax: 1,
        currentslideindex: 0,
        slidecount: 0,
        slidermaskwidth: 0,
        slidewidth: 0,
        isanimating: false
    },
    
    obj: {
        sliderid: undefined,
        sliderwrap: undefined,
        slider: undefined,
        slide: undefined
    },
    
    init: function ( p ) {
        
        /* get default parameters */
        
        this.param = this.helper.setDefaultParam({
            p: p,
            d: this.param
        });
        
        
        /* define slider objects */
        
        this.obj.sliderid = jQuery( this.param.sliderid );
        this.obj.sliderwrap = jQuery( this.param.sliderwrapclass );
        this.obj.slidermask = jQuery( this.param.slidermaskclass );
        this.obj.slider = jQuery( this.param.sliderclass );
        this.obj.slide = jQuery( this.param.slideclass );
        
        /* layout slider */
        
        this.obj.sliderwrap.css({
        });
        
        this.obj.slider.css({
            overflow: 'hidden',
            'white-space': 'nowrap',
            position: 'relative'
        });
        
        this.obj.slide.css({
            display: 'inline-block',
            'vertical-align': 'top',
            'white-space': 'normal'
        });
        
        this.set_slidermaskwidth();
        this.set_slidecount();
        this.set_slidegroup();
        this.set_slidegroupmax();
        this.clon_slides();
        this.set_slidewidth();
        this.set_prevnext();
        
        
        window.onresize = function(event) {
            yerSlider.set_slidermaskwidth();
            yerSlider.set_slidegroup();
            yerSlider.set_slidewidth();
            yerSlider.move_slider_to_current_index();
            yerSlider.set_prevnext();
        };
        
    },
    
    set_slidermaskwidth: function () {
        
        this.status.slidermaskwidth = this.obj.slidermask.innerWidth();
    },
    
    set_slidecount: function () {
        
        this.status.slidecount = this.obj.slide.size();
    },
    
    set_slidegroup: function () {
        
        var slidermaskwidth = this.obj.slidermask.innerWidth();
        var temp = 0;
        for ( var i in this.param.slidegroupresp ) {
            if ( i <= this.status.slidermaskwidth ) {
                temp = this.param.slidegroupresp[ i ];
            }
        }
        this.param.slidegroup = temp;
    },
    
    set_slidegroupmax: function () {
        
        for ( var i in this.param.slidegroupresp ) {
            if ( this.status.slidegroupmax < this.param.slidegroupresp[ i ] ) {
                this.status.slidegroupmax = this.param.slidegroupresp[ i ];
            }
        }
    },
    
    clon_slides: function () {
        
        var index = 0;
        
        for (var i = 0; i < this.status.slidegroupmax * 2; i++) {
            
            if ( index > this.status.slidecount ) {
                index = 0;
            }
            
            this.obj.slider.append( jQuery( this.obj.slide[ index ] ).clone() );
            
            index++;
        }
        
        this.obj.slide = jQuery( this.param.slideclass );
    },
    
    set_slidewidth: function () {
        
        /*
            the slide width should be
            sliderwrap.width - ( slidegap * ( slidegroup - 1 ) / slidegroup ) %
        */
        
        this.status.slidewidth = Math.floor( ( this.status.slidermaskwidth - ( this.param.slidegap * ( this.param.slidegroup - 1 ) ) ) / this.param.slidegroup );
        
        var diff = this.status.slidermaskwidth - ( ( this.status.slidewidth * this.param.slidegroup ) + ( this.param.slidegap * ( this.param.slidegroup - 1 ) ) );
        
        this.obj.slide
            .width( this.status.slidewidth )
            .css( 'margin-right', this.param.slidegap + 'px' )
            .last().css( 'margin-right', '0' );
        
        
        /* streching the width of some slides by 1 pixel to fit the sliderwrapwidth */
        
        if ( diff > 0 ) {
            
            for ( var i = 0; i < diff; i++ ) {
                jQuery( this.param.slideclass + ':nth-child(' + ( 1 + i )  + 'n-' + (this.param.slidegroup - 1) + ')' ).css( 'margin-right', ( this.param.slidegap + 1 ) + 'px' );
                
            }
        }
    },
    
    set_prevnext: function () {
    
        if ( this.status.slidecount > this.param.slidegroup ) {
        
            if ( typeof this.obj.nextbtn !== 'object' && this.param.nextbtn ) {
                this.obj.sliderwrap.append('<div class="js-yerslider-next ' + this.param.nextclass.replace( '.', '' ) + '">');
                this.obj.nextbtn = jQuery( this.param.nextclass );
                this.nextbtn_click();
            }
        
            if ( typeof this.obj.prevbtn !== 'object' && this.param.prevbtn ) {
                this.obj.sliderwrap.append('<div class="js-yerslider-prev ' + this.param.prevclass.replace( '.', '' ) + '">');
                this.obj.prevbtn = jQuery( this.param.prevclass );
                this.prevbtn_click();
            }
        }
        else {
        
            if ( typeof this.obj.nextbtn === 'object' ) {
                this.obj.nextbtn.remove();
                this.obj.nextbtn = undefined;
            }
            if ( typeof this.obj.prevbtn === 'object' ) {
                this.obj.prevbtn.remove();
                this.obj.prevbtn = undefined;
            }
        }
    },
    
    next_slide: function () {
        
        this.status.currentslideindex = this.status.currentslideindex + this.param.slidegroup;
        
        if ( this.status.currentslideindex > this.status.slidecount - 1 + this.param.slidegroup ) {
        
            var temp = this.status.currentslideindex - this.status.slidecount;
            
            this.status.currentslideindex = this.status.currentslideindex - this.status.slidecount - this.param.slidegroup;
            
            this.move_slider_to_current_index();
            
            this.status.currentslideindex = temp;
        }
        
        this.obj.slide.removeClass('current');
        jQuery( this.obj.slide[ this.status.currentslideindex ] ).addClass('current');
    },
    
    prev_slide: function () {
        
        this.status.currentslideindex = this.status.currentslideindex - this.param.slidegroup;
        
        if ( this.status.currentslideindex < 0 ) {
            
            var temp = this.status.slidecount + this.status.currentslideindex;
            
            this.status.currentslideindex = this.status.currentslideindex + this.status.slidecount + this.param.slidegroup;
            
            this.move_slider_to_current_index();
            
            this.status.currentslideindex = temp;
        }
        
        this.obj.slide.removeClass('current');
        jQuery( this.obj.slide[ this.status.currentslideindex ] ).addClass('current');
    },
    
    nextbtn_click: function () {
        
        this.obj.nextbtn.on( 'click', function () {
            
            if ( !yerSlider.status.isanimating ) {
            
                yerSlider.status.isanimating = true;
                
                yerSlider.next_slide();
                yerSlider.animate_slider_to_current_position();
            }
        });
    },
    
    prevbtn_click: function () {
        
        this.obj.prevbtn.on( 'click', function () {
            
            if ( !yerSlider.status.isanimating ) {
            
                yerSlider.status.isanimating = true;
                
                yerSlider.prev_slide();
                yerSlider.animate_slider_to_current_position();
            }
        });
    },
    
    get_sliderposition: function () {

        //var pos = ( parseInt( yerSlider.status.currentslideindex * yerSlider.status.slidewidth, 10 ) + parseInt( yerSlider.param.slidegap * yerSlider.status.currentslideindex, 10 ) );
        var pos = jQuery( this.obj.slide[ yerSlider.status.currentslideindex ] ).position().left;
        return pos;
    },
    
    move_slider_to_current_index: function () {
        yerSlider.obj.slider.css({
            'margin-left': '-' + yerSlider.get_sliderposition() + 'px'
        });
    },
    
    animate_slider_to_current_position: function () {
        
        yerSlider.obj.slider.animate({
            'margin-left': '-' + yerSlider.get_sliderposition() + 'px'
        }, 1000, function () {
           yerSlider.status.isanimating = false;
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
                
                    if ( typeof p.d[ i ] !== 'undefined' && getLength( r[ i ] ) !== getLength( p.d[ i ] ) ) {
                        r[ i ] = setDefaultParam({ p: r[ i ], d: p.d[ i ] });
                    }
                }
            }

            return r;
        }
    }
};