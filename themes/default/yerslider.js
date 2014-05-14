// THUMBS {

	function YerSliderThumbs() {

		var t = this;

		t.param = {
			thumbswrapclass: '.yerslider-thumbs-wrap',
			thumbsmaskclass: '.yerslider-thumbs-mask',
			thumbsitemsclass: '.yerslider-thumbs-items',
			thumbsitemclass: '.yerslider-thumbs-item',
			hasthumbsclass: 'yerslider-has-thumbs',
			moveoffset: 100,
		};

		t.stat = {
			itemspos_x: 0,
			itemswidth: false,
			maskwidth: false,
			maskleft: 0,
			diff: 0,
			mousepos_x: false,
			is_animating: false,
		};

		t.obj = {
			thumbswrap: undefined,
			thumbsitems: undefined,
			thumbsitem: undefined,
		};

		t.init = function ( p ) {

			// GET PARAMETERS {

				if ( p ) {

					t.obj = t.helper.setDefaultParam( {
						p: p.obj,
						d: t.obj,
					} );

				}

			// }

			t.process();
		};

		t.process = function () {

			jQuery( window ).load( function ( ) {

				// DEFINE VARS {

					t.stat.itemspos_x = 0;
					t.stat.maskwidth = t.obj.thumbsmask.innerWidth();
					t.stat.itemswidth = t.obj.thumbsitem.last().position().left + t.obj.thumbsitem.last().outerWidth();
					t.stat.diff = t.stat.itemswidth - t.stat.maskwidth;
					t.stat.maskleft = t.obj.thumbsmask.offset().left

				// }

				// ON MOUSE OVER ANIMATION {

					t.obj.thumbsmask.on( 'mouseenter', function ( e ) {

							t.set_itemspos( e );

							t.stat.is_animating = true;

							t.obj.thumbsitems.animate( {
								'left': '-' + t.stat.itemspos_x + 'px'
							}, 200, function () {

								t.stat.is_animating = false;

							} );
					} );

				// }

				// THUMBS FOLLOW MOUSE {

					jQuery( t.obj.thumbsmask ).mousemove( function( e ) {

						if ( ! t.stat.is_animating ) {

							t.set_itemspos( e );

							t.obj.thumbsitems.css( 'left', '-' + t.stat.itemspos_x + 'px' );
						}

					} ).mouseover();

				// }

			} );
		};

		t.set_itemspos = function ( e ) {

			var mousepos = e.pageX - t.param.moveoffset - t.stat.maskleft;

			if ( mousepos < 0 ) {

				mousepos = 0;
			}

			if ( mousepos > t.stat.maskwidth - ( t.param.moveoffset * 2 ) ) {

				mousepos = t.stat.maskwidth - ( t.param.moveoffset * 2 );
			}

			var rel = ( 100 / ( t.stat.maskwidth - ( t.param.moveoffset * 2 ) ) ) * mousepos;

			t.stat.itemspos_x = ( ( t.stat.diff / 100 ) * rel ); 
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
	};

// }