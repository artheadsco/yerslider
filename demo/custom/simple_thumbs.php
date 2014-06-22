<!DOCTYPE html>
<html class="no-js">
	<head>
		<title>YerSlider Demo</title>
		<meta charset="utf-8"/>
		<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<?php

	include( '../includes/styles.php' );
	include( '../includes/scripts.php' );

?>
	</head>
	<body>

		<!-- header begin -->

		<div class="page-typo">

			<h1><a href="../">YerSlider</a></h1>
            <p>This is a demopage of the YerSlider-Script hostet on <a href="https://github.com/johannheyne/yerslider" target="_blank">GitHub</a> by Johann Heyne.</p>
			
		</div>

		<!-- end -->

		<!-- body begin -->

		<div class="page-typo">
			<h2 id="autoplay">Single Slide with Thumbs</h2>
		</div>

		<div class="yerslider-wrap mysliderclass1">
			<div class="yerslider-viewport">
    			<div class="yerslider-mask">
				    <ul class="yerslider-slider">
    					<li class="yerslider-slide" data-thumb-template-key="1" data-thumb-text="1">
    						<div class="yerslider-slide-inner demo-typo">
    							<p>1</p>
    						</div>
    					</li>
    					<li class="yerslider-slide" data-thumb-template-key="1" data-thumb-text="2">
    						<div class="yerslider-slide-inner demo-typo">
    							<p>2</p>
    						</div>
    					</li>
    					<li class="yerslider-slide" data-thumb-template-key="1" data-thumb-text="3">
    						<div class="yerslider-slide-inner demo-typo">
    							<p>3</p>
    						</div>
    					</li>
    					<li class="yerslider-slide" data-thumb-template-key="1" data-thumb-text="4">
    						<div class="yerslider-slide-inner demo-typo">
    							<p>4</p>
    						</div>
    					</li>
    					<li class="yerslider-slide" data-thumb-template-key="1" data-thumb-text="5">
    						<div class="yerslider-slide-inner demo-typo">
    							<p>5</p>
    						</div>
    					</li>
    					<li class="yerslider-slide" data-thumb-template-key="1" data-thumb-text="6">
    						<div class="yerslider-slide-inner demo-typo">
    							<p>6</p>
    						</div>
    					</li>
    					<li class="yerslider-slide" data-thumb-template-key="1" data-thumb-text="7">
    						<div class="yerslider-slide-inner demo-typo">
    							<p>7</p>
    						</div>
    					</li>
    					<li class="yerslider-slide" data-thumb-template-key="1" data-thumb-text="8">
    						<div class="yerslider-slide-inner demo-typo">
    							<p>8</p>
    						</div>
    					</li>
    					<li class="yerslider-slide" data-thumb-template-key="1" data-thumb-text="9">
    						<div class="yerslider-slide-inner demo-typo">
    							<p>9</p>
    						</div>
    					</li>
    					<li class="yerslider-slide" data-thumb-template-key="1" data-thumb-text="10">
    						<div class="yerslider-slide-inner demo-typo">
    							<p>10</p>
    						</div>
    					</li>
    					<li class="yerslider-slide" data-thumb-template-key="1" data-thumb-text="11">
    						<div class="yerslider-slide-inner demo-typo">
    							<p>11</p>
    						</div>
    					</li>
    					<li class="yerslider-slide" data-thumb-template-key="1" data-thumb-text="12">
    						<div class="yerslider-slide-inner demo-typo">
    							<p>12</p>
    						</div>
    					</li>
    					<li class="yerslider-slide" data-thumb-template-key="1" data-thumb-text="13">
    						<div class="yerslider-slide-inner demo-typo">
    							<p>13</p>
    						</div>
    					</li>
    					<li class="yerslider-slide" data-thumb-template-key="1" data-thumb-text="14">
    						<div class="yerslider-slide-inner demo-typo">
    							<p>14</p>
    						</div>
    					</li>
    					<li class="yerslider-slide" data-thumb-template-key="1" data-thumb-text="15">
    						<div class="yerslider-slide-inner demo-typo">
    							<p>15</p>
    						</div>
    					</li>
    					<li class="yerslider-slide" data-thumb-template-key="1" data-thumb-text="16">
    						<div class="yerslider-slide-inner demo-typo">
    							<p>16</p>
    						</div>
    					</li>
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
							'html': '<p>{{thumb-text}}</p>',
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
