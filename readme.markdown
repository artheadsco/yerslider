YerSlider
==========================================

YerSlider is designed for frontend-developpers, suitable for responsive design and potentially can slide anything.
There are [Demos and Documentation](http://demo.johannheyne.de/yerslider/demo/) and you can play around with a demo on [codepen.io](http://codepen.io/johannheyne/pen/sekGb)

The script was started to personel understand all the limitations and problems I had with other slider-scripts.

This documentation is still incomplete!

Latest Version History
------------------------------------------

* **1.4.1** *2014-05-26*
	- Autoload dependencies
* **1.4.0** *2014-05-21*
	- Basic support for images (images loaded?)
	- Image Demo
* **1.3.1** *2014-05-16*
	- Viewport – there is a new html element, that wraps the slidermask element. The navigation elements were previously located physicaly below the slider. Now it is possible to position navigation elements inside and outside the slider viewport.
* **1.2.0** *2014-05-15*
	- Thumbs

Properties
------------------------------------------

* fluid slider
* grouping slides depending on breackpoints
* bullets
* thumbs
* touch ready
* css-transition for smooth sliding and javascript fallback

Roadmap
------------------------------------------

You can look at the [enhancement issues](https://github.com/johannheyne/yerslider/issues?labels=enhancement&milestone=&page=1&state=open) for uppcomming features.

Just ask me for your needs at mail@johannheyne.de or create a new issue.

Dependencies
------------------------------------------

There are some libraries, YerSlider depends on. Some are permanently required, others depends on individual functionalities.

permanetly required:

* [modernizr.js](http://modernizr.com/)
* [jQuery](http://jquery.com/)
* [imagesLoaded.js](http://imagesloaded.desandro.com/)

depend on individual functionalities:

* [jquery.touchSwipe.js](https://github.com/mattbryson/TouchSwipe-Jquery-Plugin)
* [YouTube iframe API](https://www.youtube.com/iframe_api)

### Explaination #############################

The "modernizr.js" must be loaded very early in the head section. It detects browser features. YerSlider needs feature detection for js, touch, csstransforms3d, csstransitions and cssanimations.

jQuery can be in latest version of 1.x or 2.x. The YerSlider script was built to use jQuery in the scope of the jQuery variable. 
```javascript
jQuery.noConflict();
jQuery(document).ready(function(){

	// use YerSlider scripts in here

});
```

jquery.touchSwipe.js is required, when the swipe functionality is enabled in a slider.

The YouTube iframe API is required, when youtube videos are used in a slide.

### Autoload #############################

The YerSlider folder comes with an subfolder /dependencies/ that holds all nessesary libraries. All of these libraries exept jQuery and modernizr.js are registered in YerSlider and will be autoloaded as required. So you can, but do not need to manualy embed them in your html. For information, the autoloded libraries are predefined in the option variable array "dependencies_autoload".

```javascript
var myslider = new YerSlider();
myslider.init({
	dependencies_autoload: [ 'youtube_iframe_api', 'imagesloaded', 'touchswipe' ], // to dissable autoload, provide an empty array []
});
```

Setup
------------------------------------------

### Basic HTML ###########################

The basic html of the slider is what you should provide in your code, to make the YerSlider script working.

```html
<div class="yerslider yerslider-wrap mysliderclass">
	<div class="yerslider-viewport">
		<div class="yerslider-mask">
			<ul class="yerslider-slider">
				<li class="yerslider-slide">
					<!-- slide content -->
				</li>
				<li class="yerslider-slide">
					<!-- slide content -->
				</li>
			</ul>
		<div>
		<!-- buttons, bullets, thumbs appears here by …location: 'inside' -->
	</div>
	<!-- buttons, bullets, thumbs  appears here by …location: 'outside' -->
</div>
```

### Loading The Script ###################

Load the yerslider.js from the core folder. The best way is to load the script on dependecy of a slider on the page. The following script does this.

```javascript
if ( jQuery('.yerslider').length > 0 ) {

	jQuery.ajax({
		url: '/assets/yerslider/core/yerslider.min.js',
		dataType: 'script',
		cache: true,
		async: true,
		success: function () {

			/* define a slider here */
		}
	});
}
```

### Define A Slider ######################

```javascript
var myslider = new YerSlider();
myslider.init({
	sliderid: '.mysliderclass'
});
```

### Load the Slider Stylesheet ###########

There is a themefolder with an default theme. Inside there is the stylesheet with basic styles. Just copy the theme and make your additions to the styles. Then load the styles in the head of your html or use a preprozessor to add this to your existing basic stylesheet.

Options
-----------------------------------------

### Slider ID ###########################

```javascript
sliderid: '.mysliderclass',
```

### CSS Classes #########################

YerSlider uses some css classes you may could change.

```javascript
// basic slider
sliderclass: '.yerslider',
sliderwrapclass: '.yerslider-wrap',
sliderwrapclasshasbullets: '.yerslider-has-bullets',
sliderviewportclass: '.yerslider-viewport',
slidermaskclass: '.yerslider-mask',
sliderclass: '.yerslider-slider',
slideclass: '.yerslider-slide',

// previous and next buttons
prevnextclass: '.yerslider-prevnext',
nextclass: '.yerslider-next',
prevclass: '.yerslider-prev',
nextinactiveclass: '.yerslider-next-inactive',
previnactiveclass: '.yerslider-prev-inactive',

// bullets
sliderwrapclasshasbullets: '.yerslider-has-bullets',
bulletswrapclass: '.yerslider-bullets-wrap',
bulletclass: '.yerslider-bullet',
bulletcurrentclass: '.yerslider-bullet-current',

// thumbs
sliderwrapclasshasthumbs: '.yerslider-has-thumbs',
thumbswrapclass: '.yerslider-thumbs-wrap',
thumbsmaskclass: '.yerslider-thumbs-mask',
thumbsitemsclass: '.yerslider-thumbs-items',
thumbsitemclass: '.yerslider-thumbs-item',
```

### Group Slides #########################

```javascript
slidegroup: 1,
slidegroupresp: {
	0: 1,
	400: 2,
	800: 3
},
```

### Slidegap #############################

```javascript
slidegap: 0,
```

### Previous & Next Button ###############

```javascript
nextbtn: true,
prevbtn: true,
prevnextlocation: 'inside', // inside, outside
nextclassadd: '',
prevclassadd: '',
```

### Bullets

```javascript
bullets: true,
bulletclickable: true,
bulletslocation: 'inside', // inside or outside the sliderviewport

```

### Thumbs ###############################

```html
<li class="yerslider-slide" data-thumb-template-key="1" data-thumb-text="Hello World!">
	<!-- slide content -->
</li>
```

```javascript
thumbs: true,
thumbslocation: 'inside', // inside or outside the sliderviewport
thumbshideiflessthan: 2,
thumbstemplates: {
	'1': {
		'html': '<p>{{thumb-text}}</p>',
		'class': 'my-thumb-template-class'
	}
},
thumbsclickable: true,
thumbsready: function( p ) {

	/** Fires, after thumbs are ready.
		The variable p provides all slider objects
		an some parameters.

		p {
			obj {
				sliderwrap: undefined,
				sliderviewport: undefined,
				slider: undefined,
				slide: undefined,
				bulletswrap: undefined,
				bullets: undefined,
				prevbtn: undefined,
				nextbtn: undefined,
				videoplayers: {},
				slides_videoplayers: {},
				thumbswrap: undefined,
				thumbsitems: undefined,
				thumbsitem: undefined,
			},
			param {
				touch: false,
			}
		}
	*/
	
	/** An example from the default theme, 
		that makes the thumbs scrolling 
		by following the mouse */
	
	var yersliderthumbs = new YerSliderThumbs();
	yersliderthumbs.init({
		obj: p.obj,
		param: p.param
	});
}
```

### Animation ############################

```javascript
animationtype: 'ease', // ease, ease-in-out, ease-in, ease-out, linear
animationspeed: 1000,
```

### Loop #################################

```javascript
loop: 'none', // infinite, rollback
```

### Autoplay ##############################

```javascript
autoplay: false,
autoplayinterval: 3000,
autoplaystoponhover: true,
```

Continuosly scrolling like a ticker:

```javascript
autoplaycontinuously: false,
autoplaycontinuouslyspeed: 10000,
autoplaycontinuouslystoponhover: true,
```

### Swipe #################################

```javascript
swipe: false,
swipeandprevnextbtn: false,
swipeanimationspeed: 300,
```

### Scroll Top ############################

Scrolls the page to the given distance from top <code>scrolltopval:</code> with the speed of <code>scrolltopspeed:</code>

```javascript
scrolltop: false,
scrolltopval: 0,
scrolltopspeed: 500,
```