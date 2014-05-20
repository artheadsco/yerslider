<!DOCTYPE html>
<html class="no-js">
	<head>
		<title>YerSlider Demo</title>
		<meta charset="utf-8"/>
		<meta name="viewport" content="width=device-width, initial-scale=1.0"/>

		<script src="../../dependencies/modernizr.js" type="text/javascript"></script>
		<script src="http://code.jquery.com/jquery-latest.min.js"></script>
		<script src="https://www.youtube.com/iframe_api" type="text/javascript"></script>
		<script src="../../dependencies/jquery.touchSwipe.js" type="text/javascript"></script>
		<script src="../../themes/default/yerslider.js?v=201306122200" type="text/javascript"></script>
		<script src="../../core/yerslider.js" type="text/javascript"></script>

		<link href="http://fonts.googleapis.com/css?family=Raleway:200,700" rel="stylesheet" type="text/css"/>
		<link href="../../themes/default/yerslider-styles.css?v=201306122200" rel="stylesheet" type="text/css"/>
		<link href="../../demo/demo-styles.css?v=201306122200" rel="stylesheet" type="text/css"/>

	</head>
	<body>

		<!-- header begin -->

		<div class="page-typo">

			<h1>YerSlider</h1>
            <p>This is a demopage of the YerSlider-Script hostet on <a href="https://github.com/johannheyne/yerslider" target="_blank">GitHub</a> by Johann Heyne.</p>
			
		</div>

		<!-- end -->

		<!-- body begin -->

		<div class="page-typo">
			<h2 id="autoplay">Images</h2>
		</div>

		<div class="yerslider-wrap mysliderclass1" style="width: 400px;">
			<div class="yerslider-viewport">
    			<div class="yerslider-mask">
				    <ul class="yerslider-slider">
<?php
	
	$path = array( 'landscape', 'portrait' );
	
	for ( $i = 1; $i <= 18; $i++ ) {
	    
		shuffle( $path );
?>
    					<li class="yerslider-slide" data-thumb-template-key="1" data-thumb-img-src="../images/landscape/<?php echo str_pad( $i, 2, '0', STR_PAD_LEFT ); ?>-thumb.jpg">

    						<div class="yerslider-slide-inner demo-typo">
    							<img src="../images/<?php echo $path[0]; ?>/<?php echo str_pad( $i, 2, '0', STR_PAD_LEFT ); ?>-large.jpg">
    						</div>
    					</li>
<?php

	}

?>
    				</ul>
    			</div>
			</div>
		</div>

		<script type="text/javascript">

		  jQuery.noConflict();
		  jQuery( document ).ready( function ( $ ) {

				var myslider4 = new YerSlider();
				myslider4.init({
					sliderid: '.mysliderclass1',
					slidegap: 10,
					slidegroupresp: {
						0: 1,
					},
					loop: 'rollback',
					animationspeed: 500,
					bullets: false,
                    autoplay: false,
					autoplayinterval: 2000,
					autoplaydelaystart: 0,
					autoplaystoponhover: true,
                    thumbs: true,
					thumbstemplates: {
						'1': {
							'html': '<img src="{{thumb-img-src}}">',
							'class': 'thumb-template-1'
						}
					},
					thumbsclickable: true,
					thumbsready: function( p ) {

        				var yersliderthumbs = new YerSliderThumbs();
        				yersliderthumbs.init({
        					obj: p.obj,
        					param: p.param
        				});
        			},
        			swipe: true,
					swipeanimationspeed: 300
				});
			});

		</script>

		<!-- end -->

	</body>
</html>
