
//Application Master Functions
;(function() {

	var ds;
	var looped;

	// Page Load Function
	function load() {

		looped = false;

		ds = new DataScroll(document.body);
		ds.resize();

		var intro = $('.introduction');
		ds.addAnimation(intro, $('.introduction__inner'), $('.introduction__inner'), '{transform = 0.5:translateY(-50%), 1:translateY(-100%)},{opacity = 0.5:1, 0.8:0}');

		ds.addAnimation(intro, $('.introduction__inner h1'), $('.introduction__inner h1'), '{letter-spacing = 0.5:0.1em, 1:0.5em}');
		ds.addAnimation(intro, $('.introduction__inner h3'), $('.introduction__inner h3'), '{letter-spacing = 0.5:0em, 1:0.5em}');

		var quote = $('.quote');
		ds.addAnimation(quote, $('.quote__inner'), $('.quote__inner'), '{opacity = 0.1:0, 0.3:1, 0.7:1, 0.9:0}');
		ds.addAnimation(quote, $('.quote__inner span'), $('.quote__inner span'), '{transform = 0:translateY(10%), 1:translateY(-10%)}', {ease:'linear'});

		var portfolioOpen = $('.portfolio__backdropOpen'),
				portfolioOpenTrigger = $('.portfolio__backdropOpen div');
		ds.addAnimation(portfolioOpen, portfolioOpenTrigger, $('.portfolio__backdrop'), '{transform = 0.2:translateY(-50%) scaleY(0), 0.5:translateY(-50%) scaleY(1)}');
		ds.addAnimation(portfolioOpen, portfolioOpenTrigger, $('.portfolio__backdropText'), '{opacity = 0.2:0, 0.3:1, 0.5:1, 0.7:0},{letter-spacing = 0:0.2em, 0.7:0.5em}');

		$('.portfolioEntry').loop(function(p) {
			ds.addAnimation($('.portfolioEntry__image', p), $('.portfolioEntry__image div', p), $('.portfolioEntry__image div', p), '{transform = 0:translateY(-70%), 1:translateY(-30%)}', {ease:'linear'});
		});

		ds.addAnimation($('.portfolio__backdropClose'), $('.portfolio__backdropClose div'), $('.portfolio__backdrop'), '{opacity = 0.5:1, 1:0}');

		var aboutOpen = $('.about__backdropOpen'),
				aboutOpenTrigger = $('.about__backdropOpen div');
		ds.addAnimation(aboutOpen, aboutOpenTrigger, $('.about__backdrop'), '{transform = 0.2:translateY(-50%) scaleY(0), 0.5:translateY(-50%) scaleY(1)}');
		ds.addAnimation(aboutOpen, aboutOpenTrigger, $('.about__backdropText'), '{opacity = 0.2:0, 0.3:1, 0.5:1, 0.7:0},{letter-spacing = 0:0.2em, 0.7:0.5em}');

		ds.addAnimation($('.aboutPicture'), $('.aboutPicture img'), $('.aboutPicture img'), '{opacity = 0.2:0, 0.4:1}');

		ds.addAnimation($('.about__backdropClose'), $('.about__backdropClose div'), $('.about__backdrop'), '{opacity = 0.5:1, 1:0}');

		var contactOpen = $('.contact__backdropOpen'),
				contactOpenTrigger = $('.contact__backdropOpen div');
		ds.addAnimation(contactOpen, contactOpenTrigger, $('.contact__backdrop'), '{transform = 0.2:translateY(-50%) scaleY(0), 0.5:translateY(-50%) scaleY(1)}');
		ds.addAnimation(contactOpen, contactOpenTrigger, $('.contact__backdropText'), '{opacity = 0.2:0, 0.3:1, 0.5:1, 0.7:0},{letter-spacing = 0:0.2em, 0.7:0.5em}');

		ds.addAnimation($('.contactCards__open'),
										$('.contactCards__open div'),
										$('.contactCards'),
										'{transform = 0:translate(-50%, -40%),  1.0:translate(-50%, -60%)}, {opacity = 0:0, 0.3:1, 0.7:1, 1.0:0}',
										{},
										{
											onBefore: function(t) {
												t.target.style.pointerEvents = 'none';
											},
											onDuring: function(t) {
												t.target.style.pointerEvents = 'all';
											},
											onAfter: function(t) {
												t.target.style.pointerEvents = 'none';
											}
										});

	}
	window.addEventListener('load', load, false);


	// Page Resize Function
	function resize() {
		ds.resize();
	}
	window.addEventListener('resize', resize, false);


})();
