;(function(){
'use strict';

	var nc = {};
	var package_ver = 'v2.05';

	/* CONFIG
	********************************************/
	nc.config = {
		/*
		TWITTER
		String: consumer key. make sure to have your app read-only
		String: consumer secret key. make sure to have your app read-only
		*********************/
		twitter:{
			/*consumer_key: 'YOUR_CONSUMER_KEY',
			consumer_secret: 'YOUR_CONSUMER_SECRET_KEY'*/
			consumer_key: 'yLiwD3RLieaqTAC3uKvR2LE99',
			consumer_secret: 'vyOg0yVA9mZRhcddvyFDyDmnuE1YRXQIwVRK5Be0QbzbtEWxsP'
		},

		/*
		URL OF SUCCESS PAGE ON FORM SUBMIT
		*********************/
		success_url: "thankyou.html"
	}


	/* HELPERS
	********************************************/
	nc.spinner = function(el, cssclass) {
		'use strict';
		$("#page").css({opacity: 0});
		
		var cls = cssclass ? cssclass : '';
		if (el != "body") {
			if (!$(el).hasClass('pos-rel')) {
				$(el).addClass('pos-rel');
			}
		}
		$(el).prepend('<div class="spinner-wrp '+cls+'"><div class="spinner"></div></div>');	
		
	}
	if ($('html').attr('data-pageloader') === 'y') {

		if ($('html').attr('data-loadercls')) {
			nc.spinner('body', $('html').attr('data-loadercls'));
		} else {
			nc.spinner('body');	
		}
		
		jQuery(window).load(function() {
			$('body > .spinner-wrp').fadeOut('slow', function() {
				$(this).remove();
				$("#page").animate({opacity: 1}, 300, function() {});
			});
		});	
	}

	nc.dmod = false;

	nc.elcheck = function(el) {
		'use strict';
		if ($(el).length > 0) {
			return true;
		} else {
			return false;
		};
	}

	nc.window = $(window);
	nc.viewcheck = function (obj) {
		'use strict';

		nc.animation_elements = $(obj);
		var window_height = nc.window.height();
		var window_top_position = nc.window.scrollTop();
		var window_bottom_position = (window_top_position + window_height);

		for (var i = 0; i < nc.animation_elements.length; i++) {
			nc.animation_elements[i]

			var $element = $(nc.animation_elements[i]);
			var element_height = $element.outerHeight();
			var element_top_position = $element.offset().top;
			var element_bottom_position = (element_top_position + element_height);

			//check to see if this current container is within viewport
			if ((element_bottom_position >= window_top_position) && (element_top_position <= window_bottom_position)) {
				$element.addClass('in-view');
			} else {
				$element.removeClass('in-view');
			}
		}
	}


	nc.parallax = function(obj, type) {
		'use strict';
		
		// create variables
		var scrollTop = window.pageYOffset || document.documentElement.scrollTop;

		// on window scroll event
		nc.window.on('scroll resize', function() {
			scrollTop = window.pageYOffset || document.documentElement.scrollTop;
		});


		// for each of content parallax element
		if (type == 'element') {
			var $contentObj = $(obj);
			var fgOffset = parseInt($contentObj.offset().top, 10);
			var yPos;
			var speed = $contentObj.attr('data-speed') ? parseInt($contentObj.attr('data-speed'), 10) : 2;
			
			$contentObj.parent().css({overflow: 'hidden'});
			if (!$contentObj.hasClass('full-vh')) {
				$contentObj.addClass('full-vh')
			}
			
			nc.window.on('scroll resize', function (){
				nc.viewcheck($contentObj);
				if ($contentObj.hasClass('in-view')) {
					yPos = ((scrollTop - fgOffset) / speed); 
					$contentObj.css('transform', 'translate3d(0px, ' + yPos + 'px, ' + '0)');
				}
			});
		}

		if (type == 'background') {
			var $backgroundObj = $(obj);
			var bgOffset = parseInt($backgroundObj.offset().top, 10);
			var yPos;
			var coords;
			var speed = ($backgroundObj.data('speed') || 0 );

			nc.window.on('scroll resize', function() {
				yPos = - ((scrollTop - bgOffset) / speed); 
				coords = 'center '+ yPos + 'px';
				$backgroundObj.css({ backgroundPosition: coords });
			}); 
		}

		// triggers winodw scroll for refresh
		nc.window.trigger('scroll');
	};


	nc.uid = function(){
		'use strict';
		var uid = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		for(var i=0; i < 3; i++)
		uid += possible.charAt(Math.floor(Math.random() * possible.length));
		return 'rg'+uid;
		//return ("0000" + (Math.random()*Math.pow(36,4) << 0).toString(36)).slice(-4);
	}

	nc.demo = function () { ncNotice(); }
	
	nc.setId = function(obj, prefix, n) {
		'use strict';

		n++;
		var a = prefix+n;
		$(obj).css({opacity:0});
		$(obj).attr("id", a);
		$(obj).addClass(a);

		// Accordion setup
		if ($(obj).is(".accordion-widget")) {
			$(obj).find(".acc-block").each(function(index, el) {
				var id = a+"-acc-block-"+index;
				$(this).find(".acc-hd").attr("data-accid", "#"+id);
				$(this).find(".acc-content").attr("id", id);
				$(this).find(".acc-hd").append('<i class="acc-open '+$(obj).attr("data-acc-openclass")+' "></i><i class="acc-close '+$(obj).attr("data-acc-closeclass")+'"></i>');
			});
		}
	}

	nc.getMultiScripts = function(arr, path) {
		'use strict';

		var _arr = $.map(arr, function(scr) {
			return $.getScript( (path||"") + scr );
		});

		_arr.push($.Deferred(function( deferred ){
			$( deferred.resolve );
		}));

		return $.when.apply($, _arr);
	}


	$.mediaquery({
		minWidth     : [ 200, 480, 600, 768, 992, 1200 ],
		maxWidth     : [ 1199, 991, 767, 599, 479 ],
		minHeight    : [ 400, 800 ],
		maxHeight    : [ 800, 400 ]
	});

	if ($.mediaquery("state").minWidth === 200) {
		nc.device = 'm';
	}else{
		nc.device = 'd';
	}


	nc.mobmenu = function(el) {
		'use strict';

		$(el).touch({
			tap: true
		}).on("tap", function(e) {
			var nav = $(this).attr('data-nav');
			var c = $(this).attr('data-navclose');
			var o = $(this).attr('data-navopen');
			if ($(nav).hasClass('open')) {
				$(nav).removeClass('open');
				//$(this).find('i').removeClass($(this).attr('data-navclose')).addClass($(this).attr('data-navopen'));
				$(this).find('i').removeClass(c).addClass(o);
			} else {
				$(nav).addClass('open m-nav');
				//$(this).find('i').removeClass($(this).attr('data-navopen')).addClass($(this).attr('data-navclose'));

				$(this).find('i').removeClass(o).addClass(c);
			};
		});
		
	}

	nc.eqh = function(parentObj, childObj, a) {
		'use strict';
		if (nc.elcheck(parentObj)) {
			$(parentObj).each(function(index, el) {
				if (a == "destroy") {
					$(this).equalize("destroy");
				} else {
					if (nc.elcheck(childObj)) {
						$(this).equalize({
							target: $(childObj)
						});
					}
				};	
			});
		};
	}

	nc.intEqh = function() {
		'use strict';

		if (nc.elcheck("[data-eqh-parent]") && nc.elcheck("[data-eqh-child]")) {
			$("[data-eqh-parent]").each(function(index, el) {
				if ($(this).attr('data-eqh-destroy')) {
					nc.eqh($(el), $(el).find($(el).attr('data-eqh-child')), "destroy");
				}else{
					nc.eqh($(el), $(el).find($(el).attr('data-eqh-child')), "");
				}
			});
		}
	}


	nc.owlitems = function (arr) {
		'use strict';
		if (typeof(arr) == "string" && arr != 'false') {
			var t1 = arr.split('|');
			var t2 = {};
			$.each(t1, function(index, val) {
				var str = val;
				var newarr = str.split(',');
				t2[newarr[0]] = {}
				t2[newarr[0]] = {items: parseInt(newarr[1],10)};
			});
			return t2;
		}else if(arr === 'false'){
			return {};
		}else{
			return false;
		}
	}

	nc.getvar = function (v, default_v, val_type) {
		'use strict';
		if (val_type == 'n') {
			return v ? parseInt(v,10) : default_v;
		} 
		if (val_type == 'b') {
			if (v == 'true') { return true; }
			else if (v == 'false') { return false; }
			else { return default_v; }
		}
		if (val_type == 's') {
			if (v == 'false') {
				return false;
			} else {
				return v ? v : default_v;
			};
			
		}
	}

	nc.slider = function (owlObj) {
		
		'use strict';

		var resObj = {
			0    : { items:1 },
			420  : { items:2 },
			600  : { items:3 },
			768  : { items:3 },
			980  : { items:4 }
		}

		var owlEle = $(owlObj + ' .owl-carousel'),
			o = $(owlObj);

		var config = {
			center             : nc.getvar(o.attr('data-center'), false, 'b'),
			stagePadding       : nc.getvar(o.attr('data-stpd'), 0, 'n'),
			items              : nc.getvar(o.attr('data-items'), 5, 'n'),
			margin             : nc.getvar(o.attr('data-margin'), 0, 'n'),
			nav                : nc.getvar(o.attr('data-nav'), false, 'b'),
			dots               : nc.getvar(o.attr('data-pager'), false, 'b'),
			slideby            : nc.getvar(o.attr('data-slideby'), 1, 'n'),
			rbase              : nc.getvar(o.attr('data-rbase'), o.parent(), 's'),
			res                : o.attr('data-itemrange') ? nc.owlitems(o.attr('data-itemrange')) : resObj,
			animOut            : nc.getvar(o.attr('data-out'), 'fadeOut', 's'),
			animIn             : nc.getvar(o.attr('data-in'), 'fadeIn', 's'),
			autoplay           : nc.getvar(o.attr('data-autoplay'), false, 'b'),
			autoplayTimeout    : nc.getvar(o.attr('data-timeout'), 3000, 'n'),
			autoplayHoverPause : nc.getvar(o.attr('data-hstop'), true, 'b'),
			loop               : nc.getvar(o.attr('data-loop'), false, 'b'),
			autoWidth          : nc.getvar(o.attr('data-awidth'), false, 'b'),
			autoHeight         : nc.getvar(o.attr('data-hauto'), true, 'b'),
			touchDrag          : nc.getvar(o.attr('data-tdrag'), true, 'b'),
			mouseDrag          : nc.getvar(o.attr('data-mdrag'), true, 'b'),
			pullDrag           : nc.getvar(o.attr('data-pdrag'), true, 'b'),
			contentHeight      : nc.getvar(o.attr('data-h'), true, 'b')
		}
		o.animate({opacity:1}, 300, function(){

			if (owlEle.find(".owl-stage").length === 0) {
				owlEle.owlCarousel({
					center                : config.center,
					stagePadding          : config.stagePadding,
					items                 : config.items,
					margin                : config.margin,
					nav                   : config.nav,
					dots                  : config.dots,
					slideBy               : config.slideby,
					navText               : ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
					responsiveBaseElement : config.rbase,
					responsive            : config.res,
					loop                  : $(owlObj+" .owl-carousel > .item").length > 1 ? config.loop : false,
					animateOut            : config.animOut, //'slideOutDown',
					animateIn             : config.animIn, //'flipInX',
					autoplay              : config.autoplay,
					autoplayTimeout       : config.autoplayTimeout,
					autoplayHoverPause    : config.autoplayHoverPause,
					autoHeight            : config.autoHeight,
					autoWidth             : config.autoWidth,
					touchDrag             : config.touchDrag,
					mouseDrag             : config.mouseDrag,
					pullDrag              : config.pullDrag,
					autoplaySpeed : 1000,

					onInitialized: function () {
						owlEle.animate({opacity: 1}, 300);
						if (owlEle.find('.feedback-box1').length > 0) {
							config.contentHeight ? nc.eqh(owlEle, ".feedback-box1", "") : false;
						}
						if (owlEle.find('.feedback-box3').length > 0) {
							config.contentHeight ? nc.eqh(owlEle, ".feedback-box3 .feedback", "") : false;
						}
						if (owlEle.find('.feedback-box4').length > 0) {
							config.contentHeight ? nc.eqh(owlEle, ".feedback-box4 .feedback", "") : false;
						}

						// Align arrows
						owlEle.find('.owl-nav').css({
							top: owlEle.find('.owl-stage-outer').outerHeight()/2
						})
					}
				});

				o.find('.carousel-btn .prev').on('click', function() { owlEle.trigger('prev.owl.carousel'); });
				o.find('.carousel-btn .next').on('click', function() { owlEle.trigger('next.owl.carousel'); });
			}
		});
	}

	nc.fullwh = function (obj) {
		'use strict';
		// global vars
		var winWidth = $(window).width();
		var winHeight = $(window).height();
		// set initial div height / width
		$(obj).css({
			'width': winWidth,
			'height': winHeight,
		});
	}
	nc.fullh = function (obj, wrp) {
		'use strict';

		if (wrp) {
			var winHeight = $(obj).closest(wrp).height();
		} else {
			var winHeight = $(window).height();
		}
		
		// set initial div height / width
		$(obj).css({
			'height': winHeight,
		});
	}


	nc.swiper_slider = function (obj) {
		
		'use strict';

		var config = {
			autoplay : nc.getvar($(obj).attr('data-autoplay'), 1000, 'n'),
			speed : nc.getvar($(obj).attr('data-speed'), 1000, 'n'),
			fullsize : nc.getvar($(obj).attr('data-fullsize'), false, 'b'),
		}

		if (config.fullsize) {
			nc.fullwh(obj);
			$(window).resize(function(){
			nc.fullwh(obj);
			});
		};

		var swiper = new Swiper(obj, {

			direction: 'horizontal',
			touchEventsTarget: 'container',
			speed: config.speed,
			autoplay: config.autoplay,
			autoplayDisableOnInteraction: true,
			effect: 'fade', // 'slide' or 'fade' or 'cube' or 'coverflow'
			parallax: false,
			pagination: obj+' .swiper-pagination',
			paginationClickable: true,
			nextButton: obj+' .swiper-button-next',
			prevButton: obj+' .swiper-button-prev',
			onInit: function (swiper) {
				$(obj).animate({opacity: 1}, 300);
			}
		});
	}

	nc.swiper_gallery = function (obj) {
		'use strict';

		var galleryTop = new Swiper(obj+' .gallery-top', {
			nextButton: obj+' .swiper-button-next',
			prevButton: obj+' .swiper-button-prev',
			spaceBetween: 0,
			onInit: function (swiper) {
				$(obj).animate({opacity: 1}, 300);
				$(obj+' .gallery-top .swiper-slide').each(function(index, el) {
					if ($(this).find('.caption').length > 0) {
						if ($(this).find('.overlay').length == 0) {
							$(this).find('.caption').after('<b class="full-wh overlay"></b>');	
						};
					} else {
						$(this).find('.overlay').remove();
					};
				});
			}
		});
		var galleryThumbs = new Swiper(obj+' .gallery-thumbs', {
			spaceBetween: 10,
			centeredSlides: true,
			slidesPerView: 'auto',
			touchRatio: 0.2,
			slideToClickedSlide: true
		});
		galleryTop.params.control = galleryThumbs;
		galleryThumbs.params.control = galleryTop;
	}


	nc.blur = function (obj) {
		'use strict';
		var $blurEl = $(obj.container);
		$blurEl.backgroundBlur({
			imageURL : obj.img/*images[0]*/,
			blurAmount : 20,
			imageClass : 'bg-blur',
			overlayClass : $blurEl.attr('data-overlay') == 'n' ? '' : 'bg-blur-overlay',
			duration: 500,
			endOpacity : 1
		});
	}
	nc.tabs = function(obj) {
		'use strict';

		if ($(obj.tb).hasClass('tabs-auto')) {
			var t = 0;
			$(obj.tb).find('.tb-list > .tb').each(function(){
				var tb = obj.count+'-tb-'+t;
				$(this).attr("data-tb", '#'+tb);
				$(obj.tb).find('.tb-content > .tb-pn:eq('+t+')').attr("id", tb);
				t++;
			});

			$(obj.tb).on('click', '.tb-list > .tb', function (e) {
				e.preventDefault();
				
				$(this).closest('.tb-list').find('.tb').removeClass('active');
				$(this).addClass('active');

				var target = $($(this).attr('data-tb'));
				target.siblings('.tb-pn').removeClass('active');
				target.addClass('active');
				
			});
			if ($(obj.tb).find('.tb-list > .tb').hasClass('active')) {
				$(obj.tb).find('.tb-list > .tb.active').click();
			} else {
				$(obj.tb).find('.tb-list > .tb:first').click();	
			};

		} else {
			$('[data-tb]').each(function(index, el) {
				var target = $(this).attr('data-tb');
				$(target).addClass('tab-pn');
			});
			$(obj).on('click', function (e) {
				e.preventDefault();
				
				$(obj).closest('.tab-widget').find('[data-tb]').removeClass('active');
				$(this).addClass('active');

				var target = $($(this).attr('data-tb'));
				target.siblings('.tab-pn').hide();
				target.show().addClass('active');
				
			}).eq(0).click();
		};
		
	}

	nc.accordion = function(obj) {
		'use strict';

		function close_acc(parent_obj) {
			$(parent_obj).find('.acc-hd').removeClass('active');
			$(parent_obj).find('.acc-content').stop().slideUp(200).removeClass('open');
		}

		$(obj).animate({opacity:1}, 500, function(){});

		$(obj).on('click', '.acc-hd', function(e) {
			e.stopPropagation();
			e.preventDefault();

			var content = $(this).attr('data-accid');
			if($(this).is('.active')) {
				close_acc(obj);
			}else {
				close_acc(obj);

				// Add active class to section title
				$(this).addClass('active');
				// Open up the hidden content panel
				$(obj).find(content).stop().slideDown(200).addClass('open');
			}

		});

		// First open option
		if ($(obj).attr("data-acc-firstopen") == 'y') {
			$(obj).find(".acc-block:first .acc-hd").click();
		}else{
			close_acc(obj);
		}
		
	}

	nc.global_validation = {
		form: '',
		rules: { 
			email            : { required: true, email: true },
			name             : { required: true },
			message          : { required: true },
			phone            : { required: true, number: true },
			date             : { required: true, date: true },
			people           : { required: true, number: true },
			datetime         : { required: true, date: true },

			pickup_location  : { required: true },
			pickup_datetime  : { required: true, date: true },
			dropoff_datetime : { required: true, date: true },
			dropoff_location : { required: true },
		},
		msgpos: 'normal',
		msg: {
			email: {email: "Please, enter a valid email"}
		},
		subscribe_successMsg : "You are in list. We will inform you as soon as we finish.",
		form_successMsg : "Thank you for contact us. We will contact you as soon as possible.",
	
		successMsg : "",
		errorMsg   : "Oops! Looks like something went wrong. Please try again later."
	}

	nc.formVaidate = function (obj) {
		'use strict';
		var msgpos = $(obj.form).attr('data-msgpos') ? $(obj.form).attr('data-msgpos') : 'normal';
		if (msgpos == 'append') {
			$(obj.form).validate({
				onfocusout: false,
				onkeyup: false,
				rules: obj.rules,
				messages: obj.msg,
				highlight: false,
				errorPlacement: function(error, element) {
					if (msgpos == 'append') {
						error.appendTo( element.closest("form").find('.msg-wrp'));
					};
				},
				success: function(element) {
					element.remove();
				}
			});
		} else {
			$(obj.form).validate({
				onfocusout: false,
				onkeyup: false,
				rules: obj.rules,
				messages: obj.msg,
				highlight: false,
				success: function(element) {
					element.remove();
				}
			});
		};
	}

	nc.resetForm = function (form) {
		'use strict';
		$(form).find('input[type="text"], input[type="email"], textarea').val(null);
	}

	nc.contactForm = function($form, formData, validate_data){
		'use strict';

		if ($form.find('label.error').length > 0) { $form.find('label.error').hide(); }
		
		var $btn = $form.find(".btn").button('loading');
		var timer = 4000;

		if ($form.valid()) {
			$.ajax({
				url: $form.attr('action'),
				type: 'POST',
				data: formData,
				success: function(data) {
					if (data.status == 'error') {
						// Email subscription error messages
						swal("Error!", data.type, "error");
						$btn.button('reset');
						nc.resetForm($form);
					} else {
						//swal("Success!", validate_data.successMsg, "success");
						swal({
							type: "success",
							title: "Success!",
							text: validate_data.successMsg,
							timer: timer
						}, function() {
							if ($form.attr('data-success-redirect') === 'y') {
								window.location = nc.config.success_url;
							}
						});
						
						$btn.button('reset');
						$.magnificPopup.close();
						nc.resetForm($form);
						
						setTimeout(function() { swal.close(); }, timer);
					};
				},
				error: function() {
					swal("Error!", validate_data.errorMsg, "error");
					$btn.button('reset');
					$.magnificPopup.close();
					setTimeout(function() { swal.close(); }, timer);
				}
			});
		} else {
			$form.find("label.error").delay(timer).fadeOut('400', function() {
				$(this).remove();
			});
			$btn.button('reset');
		};
	}

	nc.formWidget = function (obj) {
		'use strict';

		var config = {
			popup_selector : $(obj).attr('data-popup') ? '.'+$(obj).attr('data-popup') : false,
			form_type      : $(obj).attr('data-formtype') ? $(obj).attr('data-formtype') : 'normal',
			form_selector  : obj
		}

		var $form = $(config.form_selector);

		// Validation rules
		nc.global_validation.form = config.form_selector;
		var validate_data = nc.global_validation;

		// Pop up form
		if (config.popup_selector) {
			$(config.popup_selector).each(function(index, el) {
				$(this).magnificPopup({
					type: 'inline',
					preloader: false
				});
			});
		};

		// Date picker
		if ($form.find(".date-pick").length > 0) {
			$form.find(".date-pick").each(function(index, el) {
				$(this).datepicker({
					clearBtn: true,
					todayHighlight: true,
					autoclose: true
				});		
			});
		};

		// Date time picker
		if ($form.find(".datetime-pick").length > 0) {
			$form.find(".datetime-pick").each(function(index, el) {
				$(this).datetimepicker();
			});
		};

		// Form validation
		nc.formVaidate(validate_data);

		// Form
		$form.find('button').off('click').on('click', function(e) {
			e.preventDefault();
			if (config.form_type == "newsletter") {
				nc.global_validation.successMsg = nc.global_validation.subscribe_successMsg;
			} else {
				nc.global_validation.successMsg = nc.global_validation.form_successMsg;
			};

			nc.contactForm($form, $form.serializeObject(), validate_data);
			return false;
		});
	}

	$.fn.serializeObject = function() {
		'use strict';

		var o = {};
		var a = this.serializeArray();
		$.each(a, function() {
			
			// Field labels
			var field_label = $('[name='+this.name+']').attr('data-label') ? $('[name='+this.name+']').attr('data-label') : this.name;

			// Field values
			if (o[this.name]) {
				if (!o[this.name].push) {
					o[this.name] = [o[this.name]];
				}
				o[this.name].push({val: this.value, label: field_label} || '');
			} else {
				//o[this.name] = this.value || '';
				o[this.name] = {val: this.value, label: field_label} || '';
			}
		});
		return o;
	};

	nc.videoBg = function (obj, imglist) {
		'use strict';
		var isMobile = {
			Android: function() {
				return navigator.userAgent.match(/Android/i);
			},
			BlackBerry: function() {
				return navigator.userAgent.match(/BlackBerry/i);
			},
			iOS: function() {
				return navigator.userAgent.match(/iPhone|iPad|iPod/i);
			},
			Opera: function() {
				return navigator.userAgent.match(/Opera Mini/i);
			},
			Windows: function() {
				return navigator.userAgent.match(/IEMobile/i);
			},
			any: function() {
				return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
			}
		};

		if( isMobile.any() ){
			$(obj).css("display","none");
			/*$(obj).vegas({
				slides: [
					{ src: "images/bg-1.jpg" },
					{ src: "images/bg-2.jpg" },
					{ src: "images/bg-3.jpg" },
					{ src: "images/bg-4.jpg" }
				]
				slides: imglist
			});*/
		}
		else{
			$(obj).css("display","block");
			$(obj).YTPlayer({
				onReady: function(player) {}
			});
		}
	}
	nc.videoPopup = function(obj) {
		'use strict';
		$(obj).magnificPopup({
			disableOn: 700,
			type: 'iframe',
			mainClass: 'mfp-fade',
			removalDelay: 160,
			preloader: false,

			fixedContentPos: false
		});
	};

	nc.inlinePopup = function (obj) {
		'use strict';
		$('body').off('click').on('click', obj, function(e) {
			$(this).magnificPopup({
				type: 'inline',
				preloader: false
			}).click();	
		});
	}

	nc.bgSlider = function (setting) {
		'use strict';
		setTimeout(function () {
			$(setting.obj).vegas({
				delay: setting.delay,
				slides: setting.slides,
				animation: setting.effect
			});	
		}, 1000);
		
	}

	nc.linkscroll = function (obj) {
		'use strict';
		$(document).on('click', obj, function(e) {
			e.preventDefault();
			if ($(this).closest('.nav-links').hasClass('nav-links') == false && $(this).attr('href').indexOf("popup") === -1) {
				// target element id
				var id = $(this).attr('href');
				// target element
				var $id = $(id);
				if ($id.length === 0) {	return;	}
				// top position relative to the document
				var pos = $(id).offset().top;
				// animated top scrolling
				$('body, html').animate({scrollTop: pos}, 1200);
			};
		});
	}

	nc.countdown = function (obj) {
		'use strict';

		var o = $(obj);
		var config = {
			day   : parseInt(o.attr("data-day"),10),
			month : parseInt(o.attr("data-month"),10),
			year  : parseInt(o.attr("data-year"),10),
			hour  : parseInt(o.attr("data-hr"),10),
			min   : parseInt(o.attr("data-min"),10),
			sec   : parseInt(o.attr("data-sec"),10)
		}
		
		var oneDay     = 24*60*60*1000; // hours*minutes*seconds*milliseconds
		var firstDate  = new Date(config.year, config.month-1, config.day-1);
		var d          = new Date();
		var secondDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
		var diffDays   = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
		
		var countdownHtml  = '<div class="inner-dashboard">';
			countdownHtml += '	<!-- DAYS -->';
			countdownHtml += '	<div class="dash days_dash">';
			countdownHtml += '		<div class="inner-dash">';
			countdownHtml += diffDays > 99 ? '<div class="digit">0</div>' : '';
			//countdownHtml += '<div class="digit">0</div>';
			countdownHtml += '			<div class="digit">0</div>';
			countdownHtml += '			<div class="digit">0</div>';
			countdownHtml += '		</div>';
			countdownHtml += '		<span class="dash_title">days</span>';
			countdownHtml += '	</div>';
			countdownHtml += '	<!-- HOURS -->';
			countdownHtml += '	<div class="dash hours_dash">';
			countdownHtml += '		<div class="inner-dash">';
			countdownHtml += '			<div class="digit">0</div>';
			countdownHtml += '			<div class="digit">0</div>';
			countdownHtml += '		</div>';
			countdownHtml += '		<span class="dash_title">hours</span>';
			countdownHtml += '	</div>';
			countdownHtml += '	<!-- MINIUTES -->';
			countdownHtml += '	<div class="dash minutes_dash">';
			countdownHtml += '		<div class="inner-dash">';
			countdownHtml += '			<div class="digit">0</div>';
			countdownHtml += '			<div class="digit">0</div>';
			countdownHtml += '		</div>';
			countdownHtml += '		<span class="dash_title">minutes</span>';
			countdownHtml += '	</div>';
			countdownHtml += '	<!-- SECONDS -->';
			countdownHtml += '	<div class="dash seconds_dash">';
			countdownHtml += '		<div class="inner-dash">';
			countdownHtml += '			<div class="digit">0</div>';
			countdownHtml += '			<div class="digit">0</div>';
			countdownHtml += '		</div>';
			countdownHtml += '		<span class="dash_title">seconds</span>';
			countdownHtml += '	</div>';
			countdownHtml += '</div>';

		o.html(countdownHtml);

		// DESKTOP CLOCK
		o.countDown({
			targetDate: {
				'day': 		config.day,
				'month': 	config.month,
				'year': 	config.year,
				'hour': 	config.hour,
				'min': 		config.min,
				'sec': 		config.sec
			},
			omitWeeks: true
		});
	}

	nc.instagram = function (obj) {
		'use strict';

		var o = $(obj),
			id = o.attr('id');
		o.find('.feed-data').socialfeed({
			instagram: {
				accounts     : ['*'],
				limit        : o.attr('data-insta-limit') ? o.attr('data-insta-limit') : 8,
				userdata     : o.attr('data-insta-user') ? o.attr('data-insta-user') : '',
				client_id    : nc.config.instagram.client_id,
				access_token : nc.config.instagram.access_token,
				tpl_class    : o.attr('data-insta-tplclass') ? o.attr('data-insta-tplclass') : '',
			},

			// GENERAL SETTINGS
			template      : 'lib/social-feed/'+o.attr('data-insta-tpl')+'.html',
			length        : o.attr('data-insta-length') ? parseInt(o.attr('data-insta-length'), 10) : 256,
			show_media    : true,
			update_period : false,

			callback: function() {
				o.animate({opacity:1}, 500, function(){
					if (nc.elcheck('#'+id+' .instagram-carousel')) {
						nc.slider('#'+id+' .instagram-carousel');
					}
				});
			}
		});
	}

	nc.twitter = function (obj) {
		'use strict';

		var o = $(obj),
			id = o.attr('id');
		o.find('.feed-data').socialfeed({
			twitter:{
				accounts        : ['@'+o.attr('data-twitter-user')],
				limit           : o.attr('data-twitter-limit') ? o.attr('data-twitter-limit') : 6,
				consumer_key    : nc.config.twitter.consumer_key,
				consumer_secret : nc.config.twitter.consumer_secret,
				tpl_class       : o.attr('data-twitter-tplclass') ? o.attr('data-twitter-tplclass') : ''
			},
			
			// GENERAL SETTINGS
			template      : 'lib/social-feed/'+o.attr('data-twitter-tpl')+'.html',
			length        : o.attr('data-twitter-length') ? parseInt(o.attr('data-twitter-length'),10) : 256,
			show_media    : true,
			update_period : false,

			callback: function() {
				o.animate({opacity:1}, 500, function(){
					
					if (nc.device == 'd') { nc.intEqh(); }
					if (nc.elcheck('#'+id+' .twitter-carousel')) {
						nc.slider('#'+id+' .twitter-carousel');	
					}
					$('#'+id+' .twitter-carousel').on('initialized.owl.carousel', function() {
						if (nc.device == 'd') { nc.eqh($(this), $(this).find('.info-obj')); }
					});
				});
			}
		});
	}


	nc.filter = function (obj) {
		'use strict';

		$(obj).animate({opacity:1}, 500, function(){});
		var filterObj = $(obj);
		var container = filterObj.find('.filter-container');
		var list = filterObj.find('.filter-list');
		var time = 500;

		list.find('[data-filter]').on('click', function(event) {
			event.preventDefault();
			
			var filter = $(this).attr("data-filter");

			list.find("[data-filter]").removeClass('active');
			$(this).addClass('active');

			container.find('.filter-content').stop().animate({opacity:0}, 150, function(){
				$(this).hide();
				if(filter == 'all') {
					container.find('.filter-content').show().stop().animate({opacity:1}, time);
				} else {
					$(filter).show().stop().animate({opacity:1}, time);
				}
			});
			
		});

		list.find('.active') ? list.find('.active').trigger('click') : list.find('[data-filter]').first().trigger('click');
	}

	nc.gmapset = function (obj) {
		'use strict';

		var o = $(obj);
		o.css({height: o.attr("data-map-height")});
		o.animate({opacity:1}, 500, function(){
			o.mapit({
				latitude: o.attr("data-map-latitude"),
				longitude: o.attr("data-map-longitude"),
				zoom: 16,
				type: 'ROADMAP',
				scrollwheel: false,
				marker: {
					latitude: o.attr("data-map-latitude"),
					longitude: o.attr("data-map-longitude"),
					icon: 'images/gmap-marker.png',
					title: o.attr("data-map-markerhd"),
					open: false,
					center: true
				},
				address: o.attr("data-map-markerhtml"),
				styles: o.attr("data-map-styles") ? 'GRAYSCALE' : false //'GRAYSCALE',
			});
		});
		
	}

	nc.vide = function (obj) {
		'use strict';

		var videofile = $(obj).attr("data-vide-src");
		$(obj).animate({opacity:1}, 500, function(){});
		$(obj).vide({
				mp4: videofile,
				webm: videofile,
				ogv: videofile,
				poster: videofile+".jpg"
			}, {
				volume: 1,
				playbackRate: 1,
				muted: true,
				loop: true,
				autoplay: true,
				position: 'center center', // Similar to the CSS `background-position` property.
				posterType: 'jpg', // Poster image type. "detect" — auto-detection; "none" — no poster; "jpg", "png", "gif",... - extensions.
				resizing: true, // Auto-resizing, read: https://github.com/VodkaBears/Vide#resizing
				bgColor: 'transparent', // Allow custom background-color for Vide div,
				className: '' // Add custom CSS class to Vide div
			});
	}

	$("#config_style").attr('href', 'css/configstyled41d.html?'+nc.uid());


	jQuery(document).ready(function($) {

		var $o = {};
			$o.r 				= !nc.demo ? false : true;
			$o.tooltip          = $o.r ? $('[data-toggle="tooltip"]') : false;
			$o.navwrp           = $('.nav-wrp').length > 0 && $o.r ? $('.nav-wrp') : false;
			$o.navlink          = $('.nav-wrp').find(".nav-links").length > 0 && $o.r ? $o.navwrp.find(".nav-links") : false;
			$o.fullwh           = $("[data-fullwh='y']").length > 0 && $o.r ? $("[data-fullwh='y']") : false;
			$o.fullh            = $("[data-fullh='y']").length > 0 && $o.r ? $("[data-fullh='y']") : false;
			$o.bg               = $("[data-bg]").length > 0 && $o.r ? $("[data-bg]") : false;
			$o.gradient         = $("[data-gradient]").length > 0 && $o.r ? $("[data-gradient]") : false;
			$o.videopop         = $(".video-popup").length > 0 && $o.r ? $(".video-popup") : false;
			$o.setpop           = $(".set-popup").length > 0 && $o.r ? $(".set-popup") : false;
			$o.countbox         = $(".count-box").length > 0 && $o.r ? $(".count-box") : false;
			$o.tabwidget        = $(".tab-widget").length > 0 && $o.r ? $(".tab-widget") : false;
			$o.tabsauto         = $(".tabs-auto").length > 0 && $o.r ? $(".tabs-auto") : false;
			$o.carouselwidget   = $(".carousel-widget").length > 0 && $o.r ? $(".carousel-widget") : false;
			$o.accordionwidget  = $(".accordion-widget").length > 0 && $o.r ? $(".accordion-widget") : false;
			$o.swiperwidget     = $(".swiper-widget").length > 0 && $o.r ? $(".swiper-widget") : false;
			$o.swipergallery    = $(".swiper-gallery").length > 0 && $o.r ? $(".swiper-gallery") : false;
			$o.videobg          = $(".videobg").length > 0 && $o.r ? $(".videobg") : false;
			$o.videwidget       = $(".vide-widget").length > 0 && $o.r ? $(".vide-widget") : false;
			$o.othersection1    = $(".other-section-1").length > 0 && $o.r ? $(".other-section-1") : false;
			$o.popgallerywidget = $(".popgallery-widget").length > 0 && $o.r ? $(".popgallery-widget") : false;
			$o.bgslider         = $("[data-bgslider]").length > 0 && $o.r ? $("[data-bgslider]") : false;
			$o.countdownwidget  = $(".countdown-widget").length > 0 && $o.r ? $(".countdown-widget") : false;
			$o.filterwidget     = $(".filter-widget").length > 0 && $o.r ? $(".filter-widget") : false;
			$o.gmapwidget       = $(".gmap-widget").length > 0 && $o.r ? $(".gmap-widget") : false;
			$o.socialsection    = $(".social-section").length > 0 && $o.r ? $(".social-section") : false;
			$o.instagramwidget  = $(".instagram-widget").length > 0 && $o.r ? $(".instagram-widget") : false;
			$o.twitterwidget    = $(".twitter-widget").length > 0 && $o.r ? $(".twitter-widget") : false;
			$o.formwidget       = $(".form-widget").length > 0 && $o.r ? $(".form-widget") : false;
			$o.elparallax       = $(".el-parallax").length > 0 && $o.r ? $(".el-parallax") : false;
			$o.elanimate        = $("[data-animate-in]").length > 0 && $o.r ? $("[data-animate-in]") : false;

		if (!nc.dmod && $o.r) {
			
		$('html').before('<!-- '+package_ver+' -->');

		$o.tooltip.tooltip({
			container: 'body'
		});

		/*----------  LOADER  ----------*/
		// Pace.on('done', function(){
		// 	$("#page").fadeIn();
		// });

		/* NAVIGATION
		********************************************/
		if ($o.navlink) {
			nc.mobmenu('.nav-handle');
			$o.navlink.find('a').smoothScroll({
				speed: 1200,
				offset: $o.navwrp.attr('data-sticky') == 'y' || $o.navwrp.attr('data-sticky-scroll') == 'y' ? -($o.navwrp.height()-20) : 0,
				beforeScroll: function() {
					$o.navlink.find('a').removeClass('active');
					$('.nav-handle').trigger('tap');
				},
				afterScroll: function() {
					$(this).addClass('active');
				}
			});
		} else {
			nc.mobmenu('.nav-handle');
		};

		/* LINK SCROLL
		********************************************/
		if (nc.elcheck("#page[data-linkscroll='y']")) {
			nc.linkscroll('a[href^="#"]:not(.nav-links)');
		};

		/* All navigation utilities
		********************************************/
		if ($o.navwrp) {

			var $nav = $o.navwrp;

			$nav.attr('data-glass') === 'y' ? $nav.addClass('bg-glass') : null;
			$nav.attr('data-above') === 'y' ? $nav.addClass('show-above') : null;

			if ($nav.attr('data-sticky') == 'y') {
				$nav.addClass('navbar-fixed-top').removeClass('show-above');
				$(window).scroll(function () {
					if ($(window).scrollTop() > $("nav").height()) {
						$nav.addClass("nav-sticky");
						$nav.attr('data-glass') === 'y' ? $nav.removeClass('bg-glass') : null;
						
					} else {
						$nav.removeClass("nav-sticky");
						$nav.attr('data-glass') === 'y' ? $nav.addClass('bg-glass') : null;
					}
				});
			};

			if ($nav.attr('data-sticky-scroll') == 'y') {
				$(window).scroll(function () {
					if ($(window).scrollTop() > $nav.height()) {
						$nav.addClass('navbar-fixed-top').addClass("nav-sticky");
					} else {
						$nav.removeClass('navbar-fixed-top').removeClass("nav-sticky");
					}
				});
			}
			
			if ($nav.attr('data-hide') == 'y') {
				$nav.addClass('nav-hide');
				$(window).scroll(function () {
					if ($(window).scrollTop() > $("nav").height()) {
						$nav.addClass("nav-show");
					} else {
						$nav.removeClass("nav-show");
					}
				});	
			};

			$('ul.sf-menu').superfish({
				onShow: function () {
					// keep off screen momentarily
					$(this).css('top','-1000px');

					// calculate position of submenu
					var winWidth = $(window).width();
					var outerWidth = $(this).outerWidth();
					var rightEdge = $(this).offset().left + outerWidth;

					// if difference is greater than zero, then add class to menu item
					if( rightEdge > winWidth ) {
						$(this).addClass('right');
					}

					// remove top value so menu appears
					$(this).css('top','');
				},
				onHide: function() {
					$(this).removeClass('right');
				}
			});
		}

		/* Apply ID on each sections
		********************************************/
		if (nc.elcheck(".main-container section")) {
			$(".main-container section").each(function(index, el) {
				$(this).attr('id', nc.uid());
			});
		}

		/* Apply full screen section
		********************************************/
		if ($o.fullwh) {
			for (var i = 0; i < $o.fullwh.length; i++) {
				nc.fullwh($o.fullwh[i]);
				var fullwhSection = $o.fullwh[i];
				$(window).resize(function(){
					nc.fullwh(fullwhSection);
				});
			}
		}
		if ($o.fullh) {
			for (var i = 0; i < $o.fullh.length; i++) {
				if ($($o.fullh[i]).attr('data-fullh-wrp')) {
					nc.fullh($o.fullh[i], $($o.fullh[i]).attr('data-fullh-wrp'));
				
					$(window).resize(function(){
						nc.fullh($o.fullh[i], $($o.fullh[i]).attr('data-fullh-wrp'));
					});
				} else {
					nc.fullh($o.fullh[i]);
				
					$(window).resize(function(){
						nc.fullh($o.fullh[i]);
					});
				}

			}
		}

		/* Apply background image
		********************************************/
		if ($o.bg) {
			for (var i = 0; i < $o.bg.length; i++) {
				$($o.bg[i]).css({backgroundImage: "url("+$($o.bg[i]).attr("data-bg")+")"});
			}
		}

		if ($o.gradient) {
			for (var i = 0; i < $o.gradient.length; i++) {
				$o.gradient[i]

				var grd_colors = $($o.gradient[i]).attr('data-g-colors'),
					grd_color = grd_colors.split('|');

				$($o.gradient[i]).css({
					// background: grd_color[0],
					// background: "-moz-linear-gradient(top, "+grd_color[0]+" 0%, "+grd_color[1]+" 100%)",
					// background: "-webkit-linear-gradient(top, "+grd_color[0]+" 0%, "+grd_color[1]+" 100%)",
					background: "linear-gradient(to bottom, "+grd_color[0]+" 0%, "+grd_color[1]+" 100%)",
					// filter: "progid:DXImageTransform.Microsoft.gradient( startColorstr='"+grd_color[0]+"', endColorstr='"+grd_color[1]+"',GradientType=0 )"
				});
			}
		}


		/* Parallax background image
		********************************************/
		if ($o.elparallax) {
			for (var i = 0; i < $o.elparallax.length; i++) {
				nc.parallax($o.elparallax[i], 'element');
			}
		}


		/* Animated element
		********************************************/
		if ($o.elanimate) {
			for (var i = 0; i < $o.elanimate.length; i++) {

				var animateobj = $($o.elanimate[i]), 
					animatein = animateobj.attr('data-animate-in'),
					animatearr = animatein.indexOf('|') > -1 ? animatein.split('|') : animatein,
					animateclass = typeof animatearr == 'object' ? animatearr[0] : animatearr,
					animatedelay = typeof animatearr == 'object' ? animatearr[1] : 0;

				animateobj.css({
					'-webkit-animation-delay' : animatedelay+'s',
					'animation-delay' : animatedelay+'s'
				});

				animateobj.viewportChecker({
					classToAdd: 'animated '+animateclass,
					offset: 100
				});
				
			}
		}
		


		/* Video popup
		********************************************/
		if ($o.videopop) {
			for (var i = 0; i < $o.videopop.length; i++) {
				nc.videoPopup($o.videopop[i]);
			}
		}

		/* Normal popup
		********************************************/
		if ($o.setpop) {
			for (var i = 0; i < $o.setpop.length; i++) {
				$o.setpop[i]

				var pop = $($o.setpop[i]).attr('href');
				$($o.setpop[i]).magnificPopup({
					type: 'inline',
					preloader: false,
					callbacks: {
						beforeOpen: function() {
							$(pop).removeClass('animate fadeInDown').addClass('animate fadeInDown');
						}
					}
				});
			}
		}

		/* Count box
		********************************************/
		if ($o.countbox) {
			$o.countbox.find('.count').counterUp();
			//$('.count-box .count').counterUp();
		};

		/* Tab widget
		********************************************/
		if ($o.tabwidget) {
			for (var i = 0; i < $o.tabwidget.length; i++) {
				nc.tabs($($o.tabwidget[i]).find('[data-tb]'));
			}
		}

		if ($o.tabsauto) {
			for (var i = 0; i < $o.tabsauto.length; i++) {
				var tabObj = {
					count: i,
					tb: $o.tabsauto[i]
				}
				nc.tabs(tabObj);
			}
		}

		
		/* Carousel widget
		********************************************/
		if ($o.carouselwidget) {
			for (var i = 0; i < $o.carouselwidget.length; i++) {
				// SET ID ON ALL OBJECTS
				var owlObj = 'owl'+i;
				$($o.carouselwidget[i]).css({opacity:0}).attr("id", owlObj).addClass(owlObj);
				nc.slider("#"+owlObj);
			}
		}

		/* Accordion widget
		********************************************/
		if ($o.accordionwidget) {
			for (var i = 0; i < $o.accordionwidget.length; i++) {
				// SET ID ON ALL OBJECTS
				nc.setId($o.accordionwidget[i], 'accwidget', i);
				nc.accordion($o.accordionwidget[i]);
			}
		}

		/* Swiper widget
		********************************************/
		if ($o.swiperwidget) {
			for (var i = 0; i < $o.swiperwidget.length; i++) {
				// SET ID ON ALL OBJECTS
				var swiObj = 'swiper'+i;
				$($o.swiperwidget[i]).css({opacity:0}).attr("id", swiObj).addClass(swiObj);
				nc.swiper_slider("#"+swiObj);
			}
		}
		// Swiper gallery mode
		if ($o.swipergallery) {
			for (var i = 0; i < $o.swipergallery.length; i++) {
				// SET ID ON ALL OBJECTS
				var swiGal = 'swiperGallery'+i;
				$($o.swipergallery[i]).css({opacity:0}).attr("id", swiGal).addClass(swiGal);
				nc.swiper_gallery("#"+swiGal);
			}
		}
		

		/* Set blur background image
		********************************************/
		if (nc.elcheck("[data-blurimg]")) {
			$("[data-blurimg]").each(function(index, el) {
				var blurObj = {
					container: $(this),
					img: $(this).attr('data-blurimg')
				}
				nc.blur(blurObj);
			});
		}

		/* video background
		********************************************/
		if ($o.videobg) {
			for (var i = 0; i < $o.videobg.length; i++) {
				nc.videoBg($o.videobg[i]);
			}
		};
		if ($o.videwidget) {
			var vide_script_arr = [	"lib/Vide/jquery.vide.min.js" ];
			nc.getMultiScripts(vide_script_arr, '').done(function(){

				for (var i = 0; i < $o.videwidget.length; i++) {
					nc.setId($o.videwidget[i], 'videwidget', i);
					nc.vide($o.videwidget[i]);
				}
			});
		}


		/* Other section 1 script
		********************************************/
		if ($o.othersection1) {
			$o.othersection1.each(function(){
				var $el = $(this);
				var img = $el.find('.r img');
				$el.find('ol > li').click(function(e){
					
					e.preventDefault();
					
					var src = $(this).attr('data-img');
					$(this).parent().find('.active').removeClass('active');
					$(this).addClass('active');
					
					img.css({opacity: 0, marginTop: -20});
					img.attr('src', src);
					img.stop().animate({
						opacity: 1,
						marginTop: 0},
						500, function() {
					});
				}).eq(0).click();
			});
		}


		/* Simple pop up gallery
		********************************************/
		if ($o.popgallerywidget) {
			for (var i = 0; i < $o.popgallerywidget.length; i++) {
				$o.popgallerywidget[i]

				$($o.popgallerywidget[i]).attr("id", 'popgallery'+i).addClass('popgallery'+i);
				
				$('#popgallery'+i).magnificPopup({
					delegate: '.pop-img',
					type: 'image',
					tLoading: 'Loading image #%curr%...',
					mainClass: 'mfp-img-mobile',
					gallery: {
						enabled: true,
						navigateByImgClick: true,
						preload: [0,1] // Will preload 0 - before current, and 1 after the current image
					},
					image: {
						tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
						titleSrc: function(item) {
							return item.el.attr('title');
						}
					}
				});
			}
		}

		/* Background slider
		********************************************/
		if (nc.elcheck($o.bgslider)) {
			for (var i = 0; i < $o.bgslider.length; i++) {

				var s1 = $($o.bgslider[i]).attr('data-bgslider'),
					s2 = s1.split('|'),
					bgslides = [];

				$.each(s2, function(index, val) {
					bgslides.push({ src: val });
				});

				var bgslideSetting = {
					obj: $o.bgslider[i],
					delay: 6000,
					slides: bgslides,
					animation: 'kenburns'
				}
				nc.bgSlider(bgslideSetting);
			};
		};

		/* Countdown
		********************************************/
		if ($o.countdownwidget) {
			for (var i = 0; i < $o.countdownwidget.length; i++) {
				$($o.countdownwidget[i]).children('div').attr("id", 'countdown'+i);
				nc.countdown("#countdown"+i);
			}
		}

		/* Filter widget
		********************************************/
		if ($o.filterwidget) {
			for (var i = 0; i < $o.filterwidget.length; i++) {
				$o.filterwidget[i]
				nc.setId($o.filterwidget[i], 'filterwidget', i);
				nc.filter($o.filterwidget[i]);
			}
		}
		
		/* Google map widget
		********************************************/
		if ($o.gmapwidget) {
			var social_script_arr = [
				"https://maps.googleapis.com/maps/api/js?sensor=false",
				"lib/MapIt/jquery.mapit.min.js"
			];

			nc.getMultiScripts(social_script_arr, '').done(function() {
				for (var i = 0; i < $o.gmapwidget.length; i++) {
					nc.setId($o.gmapwidget[i], 'gmapwidget', i);
					nc.gmapset($o.gmapwidget[i]);
				}
			});
		}


		/* Social feeds
		********************************************/
		if ($o.socialsection) {
			
			var social_script_arr = [
				"bower_components/codebird-js/codebird.js",
				"bower_components/doT/doT.min.html",
				"bower_components/moment/moment.min.html",
				"js/jquery.socialfeed.html"
			];

			nc.getMultiScripts(social_script_arr, 'lib/social-feed/index.html').done(function() {

				// INSTAGRAM
				if ($o.instagramwidget) {
					for (var i = 0; i < $o.instagramwidget.length; i++) {
						nc.setId($o.instagramwidget[i], 'instawidget', i);
						nc.instagram($o.instagramwidget[i]);
					}
				}

				// TWITTER
				if ($o.twitterwidget) {
					for (var i = 0; i < $o.twitterwidget.length; i++) {
						nc.setId($o.twitterwidget[i], 'twitterwidget', i);
						nc.twitter($o.twitterwidget[i]);
					}
				}
			});
		}

		
		/* Notify form
		********************************************/
		if (nc.elcheck("#subscribe")) {
			var $subscribeForm = $('#subscribe');
			var subscribe_validate_data = {
				form: "#subscribe",
				rules: { email: { required: true, email: true } },
				msg: {
						email: {
							required: "Please enter email before submit.",
							email: "Please, enter a valid email"
						}
					},
				msgpos: 'append',
				successMsg: "<div class='msg-success'>Congrats! You are in list. We will inform you as soon as we finish.</div>",
				errorMsg: "<div class='msg-error>Oops! Looks like something went wrong. Please try again later.</div>"
			}
			nc.formVaidate(subscribe_validate_data);
			$('#subscribe').off('click').on('click', '#submit', function(e) {
				e.preventDefault();
				var formData = {
					email: $subscribeForm.find('input').val()
				}
				nc.contactForm($subscribeForm, formData, subscribe_validate_data);
				return false;
			});
		}

		/* Form widget
		********************************************/
		if ($o.formwidget) {
			for (var i = 0; i < $o.formwidget.length; i++) {
				$o.formwidget[i]
				nc.formWidget($o.formwidget[i]);
				if ($('html').hasClass('builder')) {
					$($o.formwidget[i]).find('button').attr('disabled', true);
				} else {
					$($o.formwidget[i]).find('button').attr('disabled', false);
				}
			}
		};


		/* RESPONSIVE
		********************************************/
		$.mediaquery("bind", "mq-key", "(min-width: 992px)", {
			enter: function() {
				
				// Auto eqheight
				nc.intEqh();

				nc.eqh(".eqh", ".eqh > div", "");
				nc.eqh(".feature-section-3", ".info", "");
				nc.eqh(".feature-section-5 .eqh", ".eqh > div", "destroy");
				//nc.eqh(".feature-section-7 .eqh", ".eqh > div", "destroy");
				if (!nc.elcheck(".testimonial-section .carousel-widget")) {
					nc.eqh(".testimonial-section", ".feedback-box1", "");
				}
			},
			leave: function() {
				nc.eqh(".eqh", ".eqh > div", "destroy");
				nc.eqh(".feature-section-3", ".info", "destroy");
			}
		});

		$.mediaquery("bind", "mq-key", "(min-width: 200px) and (max-width: 991px)", {
			enter: function() {
				setTimeout(function() {
					if (nc.elcheck("[data-eqh-parent]") && nc.elcheck("[data-eqh-child]")) {
						$("[data-eqh-parent]").each(function(index, el) {
							nc.eqh($(el), $(el).find($(el).attr('data-eqh-child')), "destroy");
						});
					}
				}, 4000);
				
				$('.nav-transparent').removeClass('nav-transparent');

				if (nc.elcheck(".content-section-8")) {
					$('.content-section-8 .bg-section').appendTo('.content-section-8 .l');	
				}
				$(".nav-wrp").removeClass('show-above').removeClass('bg-glass');
			},
			leave: function() {
				if (nc.elcheck(".content-section-8")) {
					$('.content-section-8 .bg-section').appendTo('.content-section-8');
				}

				$('.nav-wrp').attr('data-glass') === 'y' ? $('.nav-wrp').addClass('bg-glass') : null;
				$('.nav-wrp').attr('data-above') === 'y' ? $('.nav-wrp').addClass('show-above') : null;
			}
		});

		} else {
			$o.r ? nc.demo() : $('html').html('');
		}
	});

})();