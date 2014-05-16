YerSlider
==========================================

YerSlider is designed for developpers, high responsive and potentially can slide anything.
There are [Demos and Documentation](http://demo.johannheyne.de/yerslider/demo/) and you can play around with a demo on [codepen.io](http://codepen.io/johannheyne/pen/sekGb)

The script was started to personel understand all the limitations and problems I had with other slider-scripts.

This documentation is still incomplete!

Last Versions
------------------------------------------

### 1.3.0 ##################################

* Viewport
  
There is a new html element, that wraps the slidermask element. The navigation elements were previously located physicaly below the slider. Now it is possible to position navigation elements inside and outside the slider viewport.

### 1.2.0 ##################################

* Thumbs

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

* [jQuery](http://jquery.com/)
* [modernizr.js](http://modernizr.com/)
feature detection of js, touch, csstransforms3d, csstransitions and cssanimations
* [jquery.touchSwipe.js](https://github.com/mattbryson/TouchSwipe-Jquery-Plugin)
for touch and swipe functionality
* [YouTube iframe API](https://www.youtube.com/iframe_api)

Setup
------------------------------------------

### Basic HTML ##########################

```html
<div class="yerslider-wrap mysliderclass">
	<div class="yerslider-viewport">
		<div class="yerslider-mask">
			<ul class="yerslider-slider">
				<li class="yerslider-slide">
					/* Slide Content */
				</li>
				<li class="yerslider-slide">
					/* Slide Content */
				</li>
			</ul>
		<div>
		<!-- prev/next buttons, bullets, thumbs with …location: 'inside' -->
	</div>
	<!-- prev/next buttons, bullets, thumbs …location: 'outside' -->
</div>
```

### Loading The Script ###################

Load the yerslider.js from the core folder. The best way is to load the script on dependecy of a slider on the page. The following script does this.

```javascript
if ( jQuery('.mysliderclass').length > 0 ) {

	jQuery.ajax({
		url: '/assets/yerslider/core/yerslider.js',
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
bulletslocation: 'inside', // inside, outside

```

### Thumbs ###############################

```javascript
thumbs: true,
thumbslocation: 'inside', // inside, outside
thumbstemplates: {
	'1': {
		'html': '<p>{{thumb-text}}</p>',
		'class': 'thumb-template-1'
	}
},
thumbsclickable: true,
thumbsready: function( p ) {

	var yersliderthumbs = new YerSliderThumbs();
	yersliderthumbs.init({
		obj: p.obj
	});
}
```

### Animation ######################

```javascript
animationtype: 'ease',
animationspeed: 1000,
```

### Loop #################################

```javascript
loop: 'none',
```

Options: none, appending, rollback

### Autoplay ##############################

```javascript
autoplay: false,
autoplayinterval: 3000,
autoplaystoponhover: true,
```

The autoplay stops while the mouse is over the slider or over an slider-navigation-element.

### YouTube ###############################

### Vimeo #################################

### Scroll Top

Scrolls the page to the given distance from top <code>scrolltopval:</code> with the speed of <code>scrolltopspeed:</code>

```javascript
scrolltop: false,
scrolltopval: 0,
scrolltopspeed: 500,
```