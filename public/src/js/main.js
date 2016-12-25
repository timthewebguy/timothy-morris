
//requestAnimationFrame shim/polyfill
window.requestAnimationFrame = ( function() {
 return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function( callback ) {
     window.setTimeout( callback, 1000 / 60 );
    };
})();

//Selector Functions
function $$(selector, context) {
	context = context || document;
	var elements = context.querySelectorAll(selector);
	return Array.prototype.slice.call(elements);
}

function $(selector, context) {
	context = context || document;
	return context.querySelector(selector);
}

//Element Prototypes
Element.prototype.hasClass = function(c) {
	return this.className.indexOf(c) !== -1;
}

//Application Master Functions
;(function() {

	// Page Load Function
	function load() {
		initAnimations();
		initScrollSnap();
		//initCanvas();

		requestAnimationFrame(update);
	}
	window.addEventListener('load', load, false);


	var fps = 0, now, lastUpdate = (new Date)*1;



	// Page Update Function 
	function update() {
		updateAnimations();
		updateScrollSnap();
		//updateCanvas();

		 var thisFrameFPS = 1000 / ((now=new Date) - lastUpdate);
	  if (now!=lastUpdate){
	    fps += (thisFrameFPS - fps) / 50;
	    lastUpdate = now;
	  }

	  //$('#text').innerHTML = fps;

		requestAnimationFrame(update);
	}

	// Page Resize Function 
	function resize() {
		resizeAnimations();
		resizeScrollSnap();
		//resizeCanvas();
	}
	window.addEventListener('resize', resize, false);

	//Page Scroll Function
	function scroll() {
		scrollScrollSnap();
	}
	window.addEventListener('scroll', scroll, false);


})();
