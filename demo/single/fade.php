<!DOCTYPE html>
<html class="no-js">
	<head>
		<title>YerSlider Demo</title>
		<meta charset="utf-8"/>
		<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<?php
	
	$path = '../';
	include( '../includes/styles.php' );
	include( '../includes/scripts.php' );

?>
	</head>
	<body>

		<!-- header begin -->

		<div class="page-typo">

			<h1><a href="../">YerSlider</a></h1>

		</div>

		<!-- end -->

		<!-- Fade -->

		<div class="page-typo">
			<h2 id="autoplay">Fade</h2>
		</div>

		<div class="yerslider-wrap mysliderclass">
			<div class="yerslider-viewport">
		    	<div class="yerslider-mask">
    				<ul class="yerslider-slider">
    					<li class="yerslider-slide">
    						<div class="yerslider-slide-inner demo-typo">
    							<p>1</p>
    						</div>
    					</li>
    					<li class="yerslider-slide">
    						<div class="yerslider-slide-inner demo-typo">
    							<p>2<br>Adjust Slider Height</p>
    						</div>
    					</li>
    					<li class="yerslider-slide">
    						<div class="yerslider-slide-inner demo-typo">
    							<p>3</p>
    						</div>
    					</li>
    					<li class="yerslider-slide">
    						<div class="yerslider-slide-inner demo-typo">
    							<p>4</p>
    						</div>
    					</li>
    					<li class="yerslider-slide">
    						<div class="yerslider-slide-inner demo-typo">
    							<p>5</p>
    						</div>
    					</li>
    					<li class="yerslider-slide">
    						<div class="yerslider-slide-inner demo-typo">
    							<p>6</p>
    						</div>
    					</li>
    					<li class="yerslider-slide">
    						<div class="yerslider-slide-inner demo-typo">
    							<p>7</p>
    						</div>
    					</li>
    				</ul>
    			</div>
    		</div>
		</div>

		<code>
<pre>var myslider = new YerSlider();
myslider.init({
	sliderid: '.mysliderclass',
	loop: 'infinite',
	<div class="code-focus">transitionstyle: 'fade',</div> // slide, fade
	animationspeed: 1000,
	bullets: true,
	autoplay: true,
	autoplayinterval: 1000,
	autoplaydelaystart: 0,
	autoplaystoponhover: true,
});</pre>
		</code>

		<script type="text/javascript">

		  jQuery.noConflict();
		  jQuery(document).ready(function(){

				var myslider4 = new YerSlider();
				myslider4.init({
					sliderid: '.mysliderclass',
					loop: 'rollback',
					transitionstyle: 'fade',
					animationspeed: 1000,
					bullets: true,
					autoplay: false,
					autoplayinterval: 2000,
					autoplaydelaystart: 0,
				    autoplaystoponhover: true,
				});
			});

		</script>

		<!-- end -->

	</body>
</html>
